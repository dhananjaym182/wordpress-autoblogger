export interface ModerationResult {
  safe: boolean;
  flagged: boolean;
  categories: string[];
  action: 'allow' | 'warn' | 'block';
  reason?: string;
}

// OpenAI Moderation API categories
const MODERATION_CATEGORIES = [
  'sexual',
  'hate',
  'harassment',
  'self-harm',
  'sexual/minors',
  'hate/threatening',
  'violence/graphic',
  'self-harm/intent',
  'self-harm/instructions',
  'harassment/threatening',
  'violence',
];

// Severe categories that should result in immediate blocking
const SEVERE_CATEGORIES = [
  'violence',
  'hate/threatening',
  'sexual/minors',
  'self-harm/intent',
  'self-harm/instructions',
  'harassment/threatening',
  'violence/graphic',
];

interface OpenAIModerationResponse {
  id: string;
  model: string;
  results: Array<{
    flagged: boolean;
    categories: Record<string, boolean>;
    category_scores: Record<string, number>;
  }>;
}

export async function moderateContent(text: string, apiKey?: string): Promise<ModerationResult> {
  // If no API key provided, fall back to basic profanity check
  if (!apiKey) {
    return basicModerationCheck(text);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ input: text }),
    });

    if (!response.ok) {
      console.error('Moderation API error:', response.statusText);
      // Fall back to basic check on API error
      return basicModerationCheck(text);
    }

    const data: OpenAIModerationResponse = await response.json();
    const result = data.results[0];

    if (!result.flagged) {
      return {
        safe: true,
        flagged: false,
        categories: [],
        action: 'allow',
      };
    }

    // Get flagged categories
    const flaggedCategories = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category);

    // Check for severe categories
    const hasSevere = flaggedCategories.some(cat => SEVERE_CATEGORIES.includes(cat));

    return {
      safe: false,
      flagged: true,
      categories: flaggedCategories,
      action: hasSevere ? 'block' : 'warn',
      reason: hasSevere
        ? `Content blocked for: ${flaggedCategories.join(', ')}`
        : `Content flagged for review: ${flaggedCategories.join(', ')}`,
    };
  } catch (error) {
    console.error('Moderation check failed:', error);
    // Fall back to basic check on error
    return basicModerationCheck(text);
  }
}

// Basic profanity filter as fallback
const BASIC_PROFANITY_LIST = [
  'spam', 'scam', 'fake', 'fraud', 'clickbait',
  // Add more basic terms as needed
];

function basicModerationCheck(text: string): ModerationResult {
  const lowerText = text.toLowerCase();
  
  const foundTerms = BASIC_PROFANITY_LIST.filter(term => 
    lowerText.includes(term.toLowerCase())
  );

  if (foundTerms.length > 0) {
    return {
      safe: false,
      flagged: true,
      categories: ['profanity'],
      action: 'warn',
      reason: `Content contains flagged terms: ${foundTerms.join(', ')}`,
    };
  }

  return {
    safe: true,
    flagged: false,
    categories: [],
    action: 'allow',
  };
}

// Check for plagiarism (placeholder - would integrate with Copyscape or similar)
export async function checkPlagiarism(text: string): Promise<{
  unique: boolean;
  similarity: number;
  sources?: string[];
}> {
  // This is a placeholder implementation
  // In production, you would integrate with a plagiarism detection service
  
  // For now, assume content is unique
  return {
    unique: true,
    similarity: 0,
    sources: [],
  };
}

// Content readability analysis
export function analyzeReadability(text: string): {
  score: number;
  grade: string;
  issues: string[];
} {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (words.length === 0 || sentences.length === 0) {
    return { score: 0, grade: 'N/A', issues: ['Insufficient text'] };
  }

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  
  // Count syllables (simplified approximation)
  const syllableCount = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  // Flesch-Kincaid Grade Level
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;
  
  const fkGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
  
  // Flesch Reading Ease
  const fkScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Determine grade level
  let grade: string;
  if (fkGrade <= 6) grade = 'Easy';
  else if (fkGrade <= 9) grade = 'Average';
  else if (fkGrade <= 12) grade = 'Difficult';
  else grade = 'Very Difficult';

  // Identify issues
  const issues: string[] = [];
  
  if (avgWordsPerSentence > 25) {
    issues.push('Sentences are too long. Consider breaking them up.');
  }
  
  if (avgSyllablesPerWord > 2) {
    issues.push('Too many complex words. Use simpler language.');
  }
  
  if (fkScore < 60) {
    issues.push('Text may be difficult for general audiences to read.');
  }

  return {
    score: Math.round(fkScore),
    grade,
    issues,
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// SEO content analysis
export function analyzeSEOContent(
  title: string,
  content: string,
  focusKeyword?: string
): {
  score: number;
  titleScore: number;
  contentScore: number;
  keywordScore: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let titleScore = 0;
  let contentScore = 0;
  let keywordScore = 0;

  // Title analysis
  if (title.length >= 30 && title.length <= 70) {
    titleScore += 50;
  } else if (title.length > 0) {
    titleScore += 25;
    suggestions.push(title.length < 30 
      ? 'Title is too short. Aim for 50-60 characters.'
      : 'Title is too long. Keep it under 70 characters.'
    );
  } else {
    suggestions.push('Title is missing.');
  }

  // Content analysis
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 800) {
    contentScore += 30;
  } else if (wordCount >= 300) {
    contentScore += 20;
    suggestions.push(`Content is ${wordCount} words. Aim for 800+ words.`);
  } else {
    contentScore += 10;
    suggestions.push(`Content is only ${wordCount} words. Minimum recommended is 300 words.`);
  }

  // Check for headings
  const headingCount = (content.match(/^#{1,6}\s/mg) || []).length;
  if (headingCount >= 2) {
    contentScore += 20;
  } else {
    suggestions.push('Add more headings to structure your content.');
  }

  // Keyword analysis
  if (focusKeyword) {
    const lowerContent = content.toLowerCase();
    const lowerKeyword = focusKeyword.toLowerCase();
    const keywordCount = (lowerContent.match(new RegExp(lowerKeyword, 'g')) || []).length;
    const density = (keywordCount / wordCount) * 100;

    if (density >= 1 && density <= 3) {
      keywordScore += 50;
    } else if (density > 0) {
      keywordScore += 25;
      suggestions.push(density < 1 
        ? 'Use your focus keyword more often.'
        : 'Keyword density is too high. Avoid keyword stuffing.'
      );
    } else {
      suggestions.push('Focus keyword not found in content.');
    }

    // Check keyword in title
    if (title.toLowerCase().includes(lowerKeyword)) {
      keywordScore += 50;
    } else {
      suggestions.push('Include your focus keyword in the title.');
    }
  } else {
    suggestions.push('Set a focus keyword for better SEO.');
  }

  const totalScore = Math.round((titleScore + contentScore + keywordScore) / 2);

  return {
    score: Math.min(100, totalScore),
    titleScore,
    contentScore,
    keywordScore,
    suggestions,
  };
}
