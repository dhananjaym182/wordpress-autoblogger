interface SeoInput {
  title: string;
  metaDescription?: string;
  focusKeyword?: string;
  markdown?: string;
}

interface SeoAnalysis {
  seoScore: number;
  readabilityScore: number;
  wordCount: number;
}

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countWords = (text: string) => {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
};

const calculateReadability = (text: string) => {
  if (!text) return 0;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = countWords(text);
  const wordsPerSentence = words / sentences;
  const score = 100 - Math.max(0, (wordsPerSentence - 16) * 2.5);
  return clampScore(score);
};

const calculateSeo = (input: SeoInput, wordCount: number) => {
  let score = 50;
  const titleLength = input.title.length;
  const metaLength = input.metaDescription?.length ?? 0;

  if (titleLength >= 40 && titleLength <= 70) score += 15;
  if (metaLength >= 120 && metaLength <= 165) score += 15;
  if (wordCount >= 300) score += 10;

  if (input.focusKeyword) {
    const keyword = input.focusKeyword.toLowerCase();
    if (input.title.toLowerCase().includes(keyword)) score += 5;
    if (input.metaDescription?.toLowerCase().includes(keyword)) score += 5;
  }

  return clampScore(score);
};

export const analyzeSeo = (input: SeoInput): SeoAnalysis => {
  const plainText = stripMarkdown(input.markdown ?? '');
  const wordCount = countWords(plainText);

  return {
    seoScore: calculateSeo(input, wordCount),
    readabilityScore: calculateReadability(plainText),
    wordCount,
  };
};
