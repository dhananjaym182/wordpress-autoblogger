/**
 * Sanitization utilities for user input
 */

// HTML entity encoding
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => htmlEntities[char] || char);
}

// Remove HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Sanitize for use in URLs
export function sanitizeUrl(url: string): string {
  // Only allow http and https protocols
  const allowedProtocols = ['http:', 'https:'];
  
  try {
    const parsed = new URL(url);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts and invalid characters
  return filename
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[<>:"|?*]/g, '') // Remove invalid Windows chars
    .trim();
}

// Profanity filter
const PROFANITY_LIST = [
  'spam', 'scam', 'fake', 'fraud', // Add more as needed
];

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => lowerText.includes(word));
}

// Input length limits
export const INPUT_LIMITS = {
  title: 200,
  description: 500,
  slug: 100,
  content: 100000, // 100KB
  metaTitle: 70,
  metaDescription: 160,
  keyword: 100,
} as const;

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// JSON sanitization (prevent prototype pollution)
export function sanitizeJson<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeJson) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    sanitized[key] = sanitizeJson(value);
  }

  return sanitized as T;
}
