# PlayCYOA — AI Choose Your Own Adventure

互动视频故事站：预生成故事树免费玩（边际成本≈0），自定义剧情按次生成（日限额熔断）。

## 本地跑通

```powershell
cd D:\bookxiyue\playcyoa\site
copy .env.example .env.local   # 填 METASO_API_KEY（秘塔API面板）+ 可选 OPENAI_API_KEY
npm install
npm run dev                    # http://localhost:3000
```

## 生产故事内容（离线，你的 Python 主场）

```powershell
# 先看故事树不花钱：
python scripts/generate_story.py --slug canal-heist --genre mystery --premise "A heist in a city of canals, at dawn" --depth 3 --dry-run
# 满意后生成真视频（深度3=7段×¥0.45≈¥3.2）：
python scripts/generate_story.py --slug canal-heist --genre mystery --premise "..." --depth 3
```

每个题材先铺 1-2 个故事即可上线。

## 部署（Vercel）

1. `git init && git add . && git commit -m init`，推到 GitHub
2. Vercel → Import → 环境变量照抄 `.env.local`（SITE_URL 改 `https://playcyoa.com`）
3. 腾讯云 DNSPod：`A @ → 76.76.21.21`，`CNAME www → cname.vercel-dns.com`
4. GSC 验证 + 提交 sitemap.xml；Bing Webmaster + IndexNow
5. Reddit r/SideProject / HN Show 发首链

## 成本结构

- 预生成树：一次 ¥3-5/故事，无限人玩
- 自定义生成：DAILY_GENERATION_LIMIT=30（每天最多烧 ~¥68，可改）
- 秘塔预付费：余额烧完自动停 = 天然熔断

## 后续待办

- 变现：从 `../StickerShow-main` 搬 Stripe/登录模块（.env 开关已留）
- 配额改 Vercel KV（serverless 内存计数是近似值）
- 多语言页（hreflang）吃非英语长尾
- 秘塔 API 端点路径以其面板为准，若有出入改 `src/lib/provider.ts` 顶部常量
