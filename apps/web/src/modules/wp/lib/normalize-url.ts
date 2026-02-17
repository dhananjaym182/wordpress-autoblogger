export const normalizeSiteUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return null;
  }
};
