export interface GenreMeta {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

export const GENRES: GenreMeta[] = [
  {
    slug: "horror",
    name: "Horror",
    title: "AI Horror Choose Your Own Adventure — Interactive Scary Stories",
    description:
      "Play AI horror choose your own adventure stories. Every choice generates the next cinematic scene — haunted houses, dark forests, and endings you create.",
    h1: "AI Horror Choose Your Own Adventure",
    intro:
      "The lights just went out. In these AI horror adventures, every decision you make is rendered as a real video scene — no two playthroughs end the same way. Open the wrong door, trust the wrong stranger, and watch the consequence unfold.",
  },
  {
    slug: "sci-fi",
    name: "Sci-Fi",
    title: "AI Sci-Fi Choose Your Own Adventure — Interactive Space Stories",
    description:
      "Play AI sci-fi choose your own adventure stories with generated video scenes. Command a ship, contact an alien signal, and steer the plot yourself.",
    h1: "AI Sci-Fi Choose Your Own Adventure",
    intro:
      "A distress signal. A mutiny brewing on deck. A jump drive that should not exist. Pick a sci-fi adventure and every choice becomes a generated cinematic scene — you are not reading space opera, you are flying it.",
  },
  {
    slug: "romance",
    name: "Romance",
    title: "AI Romance Choose Your Own Adventure — Interactive Love Stories",
    description:
      "Play AI romance choose your own adventure stories. Your choices shape who you meet, what you say, and how the story ends — in generated video.",
    h1: "AI Romance Choose Your Own Adventure",
    intro:
      "The message arrives at midnight. Do you answer it? These AI romance adventures turn every choice into a living scene — slow burns, wrong turns, and endings that belong to you.",
  },
  {
    slug: "fantasy",
    name: "Fantasy",
    title: "AI Fantasy Choose Your Own Adventure — Interactive Quests",
    description:
      "Play AI fantasy choose your own adventure stories. Take the sword or the spellbook, trust the dragon or the knight — each choice generates the next scene.",
    h1: "AI Fantasy Choose Your Own Adventure",
    intro:
      "A crown nobody should wear. A dungeon that rebuilds itself. Choose a fantasy adventure and the world renders around your decisions — one generated scene at a time.",
  },
  {
    slug: "thriller",
    name: "Thriller",
    title: "AI Thriller Choose Your Own Adventure — Interactive Suspense Stories",
    description:
      "Play AI thriller choose your own adventure stories. Wrong suitcases, ticking clocks, strangers who know your name — every choice generates the next scene.",
    h1: "AI Thriller Choose Your Own Adventure",
    intro:
      "Twelve hours on the clock and a suitcase that isn't yours. In these AI thriller adventures, every choice is rendered as a cinematic scene — run, hide, or pick up the phone, and watch what your nerve gets you.",
  },
  {
    slug: "survival",
    name: "Survival",
    title: "AI Survival Choose Your Own Adventure — Interactive Survival Stories",
    description:
      "Play AI survival choose your own adventure stories. Crash-landed, stranded, hunted — every choice generates the next cinematic scene of your escape.",
    h1: "AI Survival Choose Your Own Adventure",
    intro:
      "The beach is quiet and the manifest doesn't add up. In these AI survival adventures, every choice becomes a generated cinematic scene — forage, follow, or burn the evidence, and see how long you last.",
  },
  {
    slug: "mystery",
    name: "Mystery",
    title: "AI Mystery Choose Your Own Adventure — Interactive Detective Stories",
    description:
      "Play AI mystery choose your own adventure stories. Follow the clue or the suspect — every choice generates the next cinematic scene of your case.",
    h1: "AI Mystery Choose Your Own Adventure",
    intro:
      "The body was found at dawn; the last train left at midnight. In these AI mystery adventures, you decide which lead to chase — and watch the story render your hunch into video.",
  },
];

export function getGenre(slug: string) {
  return GENRES.find((g) => g.slug === slug);
}
