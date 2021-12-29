export const interests = [
  "Future",
  "Privacy",
  "Technology",
  "Design",
  "Computer games",
] as const;

export type Interest = typeof interests[number];
