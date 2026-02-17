interface GutenbergBlock {
  blockName: string;
  attrs: Record<string, unknown>;
  innerHTML: string;
}

export function markdownToGutenberg(markdown: string): string {
  const blocks: GutenbergBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      blocks.push(createHeadingBlock(line.slice(2), 1));
      i++;
      continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      blocks.push(createHeadingBlock(line.slice(3), 2));
      i++;
      continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      blocks.push(createHeadingBlock(line.slice(4), 3));
      i++;
      continue;
    }

    // Heading 4-6
    if (line.startsWith('#### ')) {
      blocks.push(createHeadingBlock(line.slice(5), 4));
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*+]\s/)) {
      const { block, nextIndex } = parseList(lines, i, 'ul');
      blocks.push(block);
      i = nextIndex;
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      const { block, nextIndex } = parseList(lines, i, 'ol');
      blocks.push(block);
      i = nextIndex;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push(createQuoteBlock(line.slice(2)));
      i++;
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const { block, nextIndex } = parseCodeBlock(lines, i);
      blocks.push(block);
      i = nextIndex;
      continue;
    }

    // Image
    if (line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (match) {
        blocks.push(createImageBlock(match[2], match[1]));
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (line.match(/^-{3,}$/) || line.match(/^\*{3,}$/)) {
      blocks.push(createSeparatorBlock());
      i++;
      continue;
    }

    // Regular paragraph
    const { block, nextIndex } = parseParagraph(lines, i);
    blocks.push(block);
    i = nextIndex;
  }

  // Convert blocks to Gutenberg HTML
  return blocks.map(blockToHtml).join('\n\n');
}

function createHeadingBlock(content: string, level: number): GutenbergBlock {
  return {
    blockName: `core/heading`,
    attrs: { level },
    innerHTML: `<h${level}>${escapeHtml(content)}</h${level}>`,
  };
}

function createParagraphBlock(content: string): GutenbergBlock {
  const html = inlineMarkdownToHtml(content);
  return {
    blockName: 'core/paragraph',
    attrs: {},
    innerHTML: `<p>${html}</p>`,
  };
}

function createQuoteBlock(content: string): GutenbergBlock {
  const html = inlineMarkdownToHtml(content);
  return {
    blockName: 'core/quote',
    attrs: {},
    innerHTML: `<blockquote class="wp-block-quote"><p>${html}</p></blockquote>`,
  };
}

function createImageBlock(url: string, alt: string): GutenbergBlock {
  return {
    blockName: 'core/image',
    attrs: { url, alt },
    innerHTML: `<figure class="wp-block-image"><img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"/></figure>`,
  };
}

function createSeparatorBlock(): GutenbergBlock {
  return {
    blockName: 'core/separator',
    attrs: {},
    innerHTML: '<hr class="wp-block-separator"/>',
  };
}

function parseParagraph(lines: string[], startIndex: number): { block: GutenbergBlock; nextIndex: number } {
  const content: string[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    
    // Stop at empty lines, headings, lists, etc.
    if (!line.trim() || 
        line.match(/^#{1,6}\s/) || 
        line.match(/^[-*+]\s/) || 
        line.match(/^\d+\.\s/) ||
        line.startsWith('> ') ||
        line.startsWith('```') ||
        line.match(/^!\[/) ||
        line.match(/^-{3,}$/)) {
      break;
    }

    content.push(line);
    i++;
  }

  return {
    block: createParagraphBlock(content.join(' ')),
    nextIndex: i,
  };
}

function parseList(lines: string[], startIndex: number, type: 'ul' | 'ol'): { block: GutenbergBlock; nextIndex: number } {
  const items: string[] = [];
  let i = startIndex;
  const isOrdered = type === 'ol';

  while (i < lines.length) {
    const line = lines[i];
    const match = isOrdered 
      ? line.match(/^(\d+)\.\s(.+)$/)
      : line.match(/^[-*+]\s(.+)$/);

    if (!match) break;

    const content = isOrdered ? match[2] : match[1];
    items.push(content);
    i++;
  }

  const listItems = items
    .map(item => `<li>${inlineMarkdownToHtml(item)}</li>`)
    .join('');

  const tag = isOrdered ? 'ol' : 'ul';
  const blockName = isOrdered ? 'core/list' : 'core/list';

  return {
    block: {
      blockName,
      attrs: { ordered: isOrdered },
      innerHTML: `<${tag}>${listItems}</${tag}>`,
    },
    nextIndex: i,
  };
}

function parseCodeBlock(lines: string[], startIndex: number): { block: GutenbergBlock; nextIndex: number } {
  const delimiter = lines[startIndex].match(/^```(\w*)/);
  const language = delimiter?.[1] || '';
  const content: string[] = [];
  let i = startIndex + 1;

  while (i < lines.length && !lines[i].startsWith('```')) {
    content.push(lines[i]);
    i++;
  }

  // Skip the closing ```
  i++;

  return {
    block: {
      blockName: 'core/code',
      attrs: language ? { language } : {},
      innerHTML: `<pre class="wp-block-code${language ? ` language-${language}` : ''}"><code>${escapeHtml(content.join('\n'))}</code></pre>`,
    },
    nextIndex: i,
  };
}

function inlineMarkdownToHtml(text: string): string {
  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  text = text.replace(/~~(.+?)~~/g, '<s>$1</s>');

  // Code: `text`
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return text;
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };

  return text.replace(/[&<>"']/g, char => htmlEntities[char] || char);
}

function blockToHtml(block: GutenbergBlock): string {
  const attrs = Object.keys(block.attrs).length > 0 
    ? JSON.stringify(block.attrs).replace(/"/g, '"') 
    : '';
  
  return `<!-- wp:${block.blockName}${attrs ? ` ${attrs}` : ''} -->\n${block.innerHTML}\n<!-- /wp:${block.blockName} -->`;
}

// Helper function to convert Gutenberg HTML back to markdown (for editing)
export function gutenbergToMarkdown(gutenbergHtml: string): string {
  let markdown = gutenbergHtml;

  // Remove block comments
  markdown = markdown.replace(/<!-- wp:[^>]+ -->/g, '');
  markdown = markdown.replace(/<!-- \/wp:[^>]+ -->/g, '');

  // Convert headings
  markdown = markdown.replace(/<h1>(.+?)<\/h1>/g, '# $1');
  markdown = markdown.replace(/<h2>(.+?)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3>(.+?)<\/h3>/g, '### $1');
  markdown = markdown.replace(/<h4>(.+?)<\/h4>/g, '#### $1');

  // Convert paragraphs
  markdown = markdown.replace(/<p>(.+?)<\/p>/g, '$1\n');

  // Convert bold/strong
  markdown = markdown.replace(/<(strong|b)>(.+?)<\/(strong|b)>/g, '**$2**');

  // Convert italic/em
  markdown = markdown.replace(/<(em|i)>(.+?)<\/(em|i)>/g, '*$2*');

  // Convert links
  markdown = markdown.replace(/<a href="([^"]+)">(.+?)<\/a>/g, '[$2]($1)');

  // Convert images
  markdown = markdown.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/g, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"[^>]*\/?>/g, '![$1]($2)');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown.trim();
}
