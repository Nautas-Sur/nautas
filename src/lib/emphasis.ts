// Un mismo campo puede tener dos canales. Display: em() + set:html (produce <em>).
// Metadata/atributos: strip() — texto plano, nunca HTML.
//
// em() escapa HTML antes de transformar asteriscos porque su salida va a
// set:html, que apaga el escapado automático de Astro sobre nodos de texto.
// strip() no necesita escapar: su salida va siempre a una expresión de
// atributo plana ({expr}), que Astro ya escapa por su cuenta — escapar acá
// también dejaría entidades dobles (&amp; -> &#38;amp;).
const HTML_ESCAPE_PATTERN = /[&<>'"]/g;
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
};

function escapeHtml(text: string): string {
  return text.replace(HTML_ESCAPE_PATTERN, (char) => HTML_ESCAPE_MAP[char]);
}

const EMPHASIS_PATTERN = /\*([^*]+)\*/g;

export function em(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return escapeHtml(text).replace(EMPHASIS_PATTERN, '<em>$1</em>');
}

export function strip(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.replace(EMPHASIS_PATTERN, '$1');
}
