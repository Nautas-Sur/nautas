// Un mismo campo puede tener dos canales. Display: em() + set:html (produce <em>).
// Metadata/atributos: strip() — texto plano, nunca HTML.
const EMPHASIS_PATTERN = /\*([^*]+)\*/g;

export function em(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(EMPHASIS_PATTERN, '<em>$1</em>');
}

export function strip(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(EMPHASIS_PATTERN, '$1');
}
