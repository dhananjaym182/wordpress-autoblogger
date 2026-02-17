import { ScheduledPost } from '@prisma/client';

export interface QualityIssue {
  type: 'error' | 'warning';
  message: string;
  code: string;
}

export interface QualityCheckResult {
  isValid: boolean;
  issues: QualityIssue[];
  score: number;
}

// Profanity list - basic implementation
const PROFANITY_LIST = [
  'spam', 'scam', 'fraud', 'fake', 'clickbait',
  // Add more words as needed
];

export function checkProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some((word) => lowerText.includes(word));
}

export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateReadingTime(wordCount: number): number {
  // Average reading speed: 200 words per minute
  return Math.ceil(wordCount / 200);
}

export function calculateKeywordDensity(text: string, keyword: string): number {
  if (!keyword.trim()) return 0;
  
  const wordCount = calculateWordCount(text);
  if (wordCount === 0) return 0;
  
  const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = text.match(keywordRegex) || [];
  
  return (matches.length / wordCount) * 100;
}

export function countHeadings(markdown: string): { h1: number; h2: number; h3: number; total: number } {
  const h1Matches = markdown.match(/^# /gm) || [];
  const h2Matches = markdown.match(/^## /gm) || [];
  const h3Matches = markdown.match(/^### /gm) || [];
  
  return {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
    total: h1Matches.length + h2Matches.length + h3Matches.length,
  };
}

export function countLinks(markdown: string): { internal: number; external: number; total: number } {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const matches = [...markdown.matchAll(linkRegex)];
  
  let internal = 0;
  let external = 0;
  
  for (const match of matches) {
    const url = match[2];
    if (url.startsWith('http://') || url.startsWith('https://')) {
      external++;
    } else {
      internal++;
    }
  }
  
  return { internal, external, total: matches.length };
}

export function hasImage(markdown: string): boolean {
  return /!\[([^\]]*)\]\(([^)]+)\)/.test(markdown);
}

export interface ContentCheckInput {
  title: string;
  markdown: string;
  excerpt?: string;
  focusKeyword?: string;
  metaTitle?: string;
  metaDescription?: string;
  featuredImageMode?: string;
}

export async function validateContent(
  content: ContentCheckInput
): Promise<QualityCheckResult> {
  const issues: QualityIssue[] = [];
  let score = 100;

  // Required fields check
  if (!content.title || content.title.trim().length === 0) {
    issues.push({
      type: 'error',
      message: 'Title is required',
      code: 'TITLE_MISSING',
    });
    score -= 20;
  }

  if (!content.markdown || content.markdown.trim().length === 0) {
    issues.push({
      type: 'error',
      message: 'Content is required',
      code: 'CONTENT_MISSING',
    });
    score -= 20;
  }

  if (!content.featuredImageMode) {
    issues.push({
      type: 'error',
      message: 'Featured image is required',
      code: 'FEATURED_IMAGE_MISSING',
    });
    score -= 15;
  }

  // Word count check
  const wordCount = calculateWordCount(content.markdown || '');
  if (wordCount < 300) {
    issues.push({
      type: 'error',
      message: `Content is too short (${wordCount} words). Minimum 300 words required.`,
      code: 'CONTENT_TOO_SHORT',
    });
    score -= 15;
  } else if (wordCount < 600) {
    issues.push({
      type: 'warning',
      message: `Consider adding more content. Current: ${wordCount} words. Ideal: 800+ words.`,
      code: 'CONTENT_BRIEF',
    });
    score -= 5;
  }

  // Title length check
  if (content.title && content.title.length > 70) {
    issues.push({
      type: 'warning',
      message: 'Title is too long. Keep it under 70 characters for SEO.',
      code: 'TITLE_TOO_LONG',
    });
    score -= 5;
  }

  // Heading structure check
  const headings = countHeadings(content.markdown || '');
  if (headings.h2 < 2) {
    issues.push({
      type: 'warning',
      message: 'Add at least 2 H2 headings to improve readability.',
      code: 'HEADINGS_INSUFFICIENT',
    });
    score -= 5;
  }

  // Focus keyword check
  if (content.focusKeyword) {
    const density = calculateKeywordDensity(content.markdown || '', content.focusKeyword);
    if (density < 0.5) {
      issues.push({
        type: 'warning',
        message: `Focus keyword "${content.focusKeyword}" appears too infrequently (${density.toFixed(1)}%).`,
        code: 'KEYWORD_DENSITY_LOW',
      });
      score -= 5;
    } else if (density > 3) {
      issues.push({
        type: 'warning',
        message: `Focus keyword density is too high (${density.toFixed(1)}%). May be seen as keyword stuffing.`,
        code: 'KEYWORD_DENSITY_HIGH',
      });
      score -= 5;
    }

    // Check keyword in title
    if (!content.title.toLowerCase().includes(content.focusKeyword.toLowerCase())) {
      issues.push({
        type: 'warning',
        message: 'Consider including the focus keyword in the title.',
        code: 'KEYWORD_NOT_IN_TITLE',
      });
      score -= 5;
    }
  }

  // Meta description check
  if (!content.metaDescription) {
    issues.push({
      type: 'warning',
      message: 'Meta description is missing. This affects SEO.',
      code: 'META_DESCRIPTION_MISSING',
    });
    score -= 5;
  } else if (content.metaDescription.length < 120 || content.metaDescription.length > 160) {
    issues.push({
      type: 'warning',
      message: 'Meta description should be between 120-160 characters.',
      code: 'META_DESCRIPTION_LENGTH',
    });
    score -= 3;
  }

  // Profanity check
  const fullText = `${content.title} ${content.markdown} ${content.excerpt || ''}`;
  if (checkProfanity(fullText)) {
    issues.push({
      type: 'error',
      message: 'Content contains inappropriate language.',
      code: 'PROFANITY_DETECTED',
    });
    score -= 25;
  }

  // Links check
  const links = countLinks(content.markdown || '');
  if (links.total === 0) {
    issues.push({
      type: 'warning',
      message: 'Consider adding relevant links to improve content quality.',
      code: 'NO_LINKS',
    });
    score -= 3;
  }

  return {
    isValid: issues.filter((i) => i.type === 'error').length === 0,
    issues,
    score: Math.max(0, Math.min(100, score)),
  };
}

export function getQualityBadge(score: number): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } {
  if (score >= 90) return { label: 'Excellent', variant: 'default' };
  if (score >= 75) return { label: 'Good', variant: 'secondary' };
  if (score >= 60) return { label: 'Fair', variant: 'outline' };
  return { label: 'Needs Improvement', variant: 'destructive' };
}
