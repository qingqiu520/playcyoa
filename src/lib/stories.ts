import fs from "fs";
import path from "path";

export interface StoryNode {
  video: string; // /videos/{story}/{node}.mp4 或外部 CDN URL
  caption: string; // 画面下方显示的一行剧情描述
  choices: { label: string; next: string }[]; // 空数组 = 结局
}
export interface Story {
  slug: string;
  title: string;
  genre: string;
  description: string;
  poster?: string;
  start: string;
  nodes: Record<string, StoryNode>;
}
export interface StoryIndexItem {
  slug: string;
  title: string;
  genre: string;
  description: string;
  poster?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORIES_DIR = path.join(DATA_DIR, "stories");

export function listStories(): StoryIndexItem[] {
  const file = path.join(DATA_DIR, "stories.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as StoryIndexItem[];
}

export function getStory(slug: string): Story | null {
  const file = path.join(STORIES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as Story;
}

export function storiesByGenre(genre: string): StoryIndexItem[] {
  return listStories().filter((s) => s.genre === genre);
}
