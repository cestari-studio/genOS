import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify with a restrictive configuration
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags
    return dirty.replace(/<[^>]*>/g, '');
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'code', 'pre', 'blockquote',
      'span', 'div', 'img',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'id',
      'src', 'alt', 'width', 'height',
      'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus'],
  });
}

/**
 * Render markdown-like content to sanitized HTML
 * Basic markdown renderer with XSS protection
 */
export function renderSafeMarkdown(content: string): string {
  const html = content
    .replace(/## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return `<tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr>`;
    })
    .replace(/- (.*?)(?=<br|$)/g, '<li>$1</li>');

  return sanitizeHTML(html);
}
