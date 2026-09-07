export function normalizeQuestion(question) {
  return String(question || "")
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ");
}

export function isValidQuestion(question) {
  const normalized = normalizeQuestion(question);

  return (
    normalized.length >= 2 &&
    normalized.length <= 1000
  );
}

export function getQuestionTerms(question) {
  const normalized = normalizeQuestion(question);

  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "about",
    "can",
    "could",
    "did",
    "do",
    "does",
    "for",
    "from",
    "has",
    "have",
    "how",
    "i",
    "in",
    "is",
    "it",
    "me",
    "my",
    "of",
    "on",
    "or",
    "please",
    "tell",
    "the",
    "to",
    "what",
    "when",
    "where",
    "which",
    "who",
    "why",
    "with",
    "would",
    "you",
    "your",
    "santosh",
  ]);

  return normalized
    .split(/[^a-z0-9@.+#-]+/i)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => !stopWords.has(term));
}