const WORDS_PER_MINUTE = 200;

export function estimateReadTime(content = "") {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} Min. Read`;
}
