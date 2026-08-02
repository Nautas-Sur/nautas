export function em(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
