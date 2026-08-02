export function em(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
