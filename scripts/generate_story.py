# -*- coding: utf-8 -*-
"""
PlayCYOA 故事树离线生成器
用法:
  set METASO_API_KEY=xxx
  set OPENAI_API_KEY=xxx          # 可选，用于自动展开分支；不配则手工编辑 nodes
  python scripts/generate_story.py --slug midnight-inheritance --genre mystery ^
      --premise "A stranger leaves you a manor; the will requires one night inside" --depth 3

产出:
  data/stories/{slug}.json       故事树
  public/videos/{slug}/{node}.mp4 每节点视频（秘塔 H3 生成）
  data/stories.json              索引追加
"""
import argparse, json, os, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
METASO_BASE = os.environ.get("METASO_BASE_URL", "https://metaso.cn/api/minimax")
METASO_KEY = os.environ.get("METASO_API_KEY", "")
LLM_BASE = os.environ.get("OPENAI_API_BASE_URL", "https://api.deepseek.com")
LLM_KEY = os.environ.get("OPENAI_API_KEY", "")
LLM_MODEL = os.environ.get("OPENAI_API_MODEL", "deepseek-chat")
STYLE = "Cinematic photorealistic shot, film lighting, continuous scene, 16:9."


def http_json(url, payload=None, key="", method=None, timeout=60):
    req = urllib.request.Request(url, method=method or ("POST" if payload is not None else "GET"))
    req.add_header("Content-Type", "application/json")
    if key:
        req.add_header("Authorization", f"Bearer {key}")
    data = json.dumps(payload).encode() if payload is not None else None
    with urllib.request.urlopen(req, data=data, timeout=timeout) as r:
        return json.loads(r.read().decode())


def llm_expand(premise, genre, path_labels, caption=""):
    """让 LLM 为当前节点写 caption + 两个子选项；返回 (caption, [labelA, labelB])"""
    if not LLM_KEY:
        return caption or f"Scene: {' -> '.join(path_labels)}", ["Continue deeper", "Find another way"]
    sys_prompt = (
        "You design branching nodes for an interactive AI video story. "
        "Reply ONLY as JSON: {\"caption\": \"one vivid sentence describing this scene\", "
        "\"choices\": [\"option A (<=10 words)\", \"option B (<=10 words)\"]}. "
        "Choices must lead to visibly different scenes."
    )
    user = f"Genre: {genre}\nPremise: {premise}\nPath taken: {' -> '.join(path_labels) or 'start'}\nDescribe this scene and give two next choices:"
    data = http_json(f"{LLM_BASE}/v1/chat/completions", {
        "model": LLM_MODEL, "temperature": 0.9, "max_tokens": 200,
        "messages": [{"role": "system", "content": sys_prompt}, {"role": "user", "content": user}],
    }, key=LLM_KEY)
    text = data["choices"][0]["message"]["content"].strip().strip("`")
    if text.startswith("json"):
        text = text[4:]
    obj = json.loads(text)
    return obj["caption"], obj["choices"][:2]


def gen_video(prompt, out_file: Path):
    """秘塔 H3：创建任务 -> 轮询 -> 下载 mp4"""
    r = http_json(f"{METASO_BASE}/v2/video_generation", {
        "model": "MiniMax-H3", "resolution": "768P", "duration": 5, "ratio": "16:9",
        "content": [{"type": "text", "text": prompt}],
    }, key=METASO_KEY)
    task_id = r.get("task_id") or r.get("data", {}).get("task_id")
    if not task_id:
        raise RuntimeError(f"create failed: {str(r)[:300]}")
    for _ in range(90):
        time.sleep(4)
        q = http_json(f"{METASO_BASE}/v2/query/video_generation?task_id={task_id}", key=METASO_KEY)
        # 秘塔实测返回 {"items": [{"status": "succeeded", "content": {"url": ...}}]}
        items = q.get("items") or ([q["data"]] if isinstance(q.get("data"), dict) else [q])
        item = items[0] if items else {}
        status = str(item.get("status", "")).lower()
        if status in ("success", "succeeded"):
            url = (item.get("content") or {}).get("url") or item.get("video_url") or (item.get("file") or {}).get("download_url")
            if not url:
                raise RuntimeError(f"no video url: {str(q)[:300]}")
            out_file.parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(url, out_file)
            return
        if status in ("fail", "failed"):
            raise RuntimeError(f"generation failed: {str(q)[:300]}")
    raise RuntimeError("poll timeout")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--genre", default="", choices=["", "horror", "sci-fi", "romance", "fantasy", "mystery"])
    ap.add_argument("--premise", default="")
    ap.add_argument("--title", default="")
    ap.add_argument("--depth", type=int, default=3, help="分支深度，深度d树共 2^d-1 段视频")
    ap.add_argument("--dry-run", action="store_true", help="只生成故事树JSON，不调视频API")
    ap.add_argument("--from-json", action="store_true",
                    help="跳过LLM展开，直接为 data/stories/{slug}.json 里已有的树生成视频")
    args = ap.parse_args()

    if not args.dry_run and not METASO_KEY:
        sys.exit("缺 METASO_API_KEY（或用 --dry-run 只出故事树）")
    if not args.from_json and (not args.genre or not args.premise):
        sys.exit("新建故事需要 --genre 和 --premise")

    if args.from_json:
        existing = ROOT / "data" / "stories" / f"{args.slug}.json"
        story = json.loads(existing.read_text(encoding="utf-8"))
        nodes = story["nodes"]
        args.genre = args.genre or story.get("genre", "mystery")
        args.premise = args.premise or story.get("description", "")
        print(f"[from-json] loaded {len(nodes)} nodes from {existing}")
    else:
        nodes, queue = {}, [(["start"], "n1", 1)]
        counter = [1]
        # BFS 展开树
        while queue:
            path, nid, depth = queue.pop(0)
            caption, choice_labels = llm_expand(args.premise, args.genre, path)
            node = {"video": f"/videos/{args.slug}/{nid}.mp4", "caption": caption, "choices": []}
            nodes[nid] = node
            if depth < args.depth:
                for label in choice_labels:
                    counter[0] += 1
                    child = f"n{counter[0]}"
                    node["choices"].append({"label": label, "next": child})
                    queue.append((path + [label], child, depth + 1))

        story = {
            "slug": args.slug, "title": args.title or args.slug.replace("-", " ").title(),
            "genre": args.genre, "description": args.premise, "start": "n1", "nodes": nodes,
        }
        out_json = ROOT / "data" / "stories" / f"{args.slug}.json"
        out_json.parent.mkdir(parents=True, exist_ok=True)
        out_json.write_text(json.dumps(story, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[ok] story tree -> {out_json} ({len(nodes)} nodes)")

        idx_file = ROOT / "data" / "stories.json"
        idx = json.loads(idx_file.read_text(encoding="utf-8")) if idx_file.exists() else []
        if not any(s["slug"] == args.slug for s in idx):
            idx.append({"slug": args.slug, "title": story["title"], "genre": args.genre,
                        "description": args.premise})
            idx_file.write_text(json.dumps(idx, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.dry_run:
        print("[dry-run] 跳过视频生成")
        return
    for i, (nid, node) in enumerate(nodes.items(), 1):
        out = ROOT / "public" / "videos" / args.slug / f"{nid}.mp4"
        if out.exists():
            print(f"[{i}/{len(nodes)}] {nid} exists, skip")
            continue
        prompt = f"{STYLE} {args.genre} interactive story scene. {node['caption']}"
        print(f"[{i}/{len(nodes)}] {nid} generating…")
        gen_video(prompt, out)
        print(f"  saved -> {out}")
    print("done.")


if __name__ == "__main__":
    main()
