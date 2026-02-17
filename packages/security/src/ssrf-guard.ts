import dns from 'dns/promises';

// Private IP ranges
const PRIVATE_IP_PATTERNS = [
  /^127\./, // Loopback
  /^10\./, // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private Class B
  /^192\.168\./, // Private Class C
  /^169\.254\./, // Link-local
  /^::1$/, // IPv6 loopback
  /^fc00:/i, // IPv6 private
  /^fe80:/i, // IPv6 link-local
];

// Cloud metadata IPs
const CLOUD_METADATA_IPS = [
  '169.254.169.254', // AWS, GCP, Azure metadata
];

interface SSRFValidationResult {
  valid: boolean;
  reason?: string;
}

export async function validateUrl(
  url: string,
  env: string = 'production'
): Promise<SSRFValidationResult> {
  try {
    const parsed = new URL(url);

    // Check protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, reason: 'Invalid protocol. Only HTTP and HTTPS are allowed.' };
    }

    // Dev-only: allow localhost
    if (env !== 'production') {
      if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
        return { valid: true };
      }
    }

    // Production: require HTTPS
    if (env === 'production' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'HTTPS required in production' };
    }

    // Check for cloud metadata IPs by hostname
    if (CLOUD_METADATA_IPS.includes(parsed.hostname)) {
      return { valid: false, reason: 'Cloud metadata IP addresses are not allowed' };
    }

    // Check for private IPs by hostname
    if (isPrivateIp(parsed.hostname)) {
      return { valid: false, reason: 'Private IP addresses are not allowed' };
    }

    // Resolve DNS and check resolved IPs
    try {
      const addresses = await dns.resolve(parsed.hostname);

      for (const ip of addresses) {
        if (isPrivateIp(ip)) {
          return { valid: false, reason: 'URL resolves to private IP address' };
        }

        if (CLOUD_METADATA_IPS.includes(ip)) {
          return { valid: false, reason: 'URL resolves to cloud metadata IP' };
        }
      }
    } catch (dnsError) {
      // If DNS resolution fails, still allow the URL
      // The actual request will fail later if the host is invalid
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, reason: 'Invalid URL format' };
  }
}

function isPrivateIp(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some(pattern => pattern.test(ip));
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const pathname = parsed.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

export async function fetchWithSSRFProtection(
  url: string,
  options: RequestInit = {},
  env: string = 'production'
): Promise<Response> {
  const validation = await validateUrl(url, env);
  
  if (!validation.valid) {
    throw new Error(`SSRF protection blocked request: ${validation.reason}`);
  }

  // Set reasonable timeouts and limits
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: 'manual', // Don't follow redirects automatically
    });

    clearTimeout(timeout);

    // Validate any redirect location
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        const redirectValidation = await validateUrl(location, env);
        if (!redirectValidation.valid) {
          throw new Error(`SSRF protection blocked redirect: ${redirectValidation.reason}`);
        }
      }
    }

    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}
