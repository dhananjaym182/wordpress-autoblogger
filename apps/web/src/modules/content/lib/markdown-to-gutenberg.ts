import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

export const markdownToGutenberg = (markdown: string) => {
  if (!markdown) return '';
  return marked.parse(markdown);
};
