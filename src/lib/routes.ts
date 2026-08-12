export function productionsPath(locale: string): string {
  return locale === 'en' ? '/en/productions/' : '/producciones/';
}

export function productionPath(locale: string, id: string): string {
  return `${productionsPath(locale)}${id}/`;
}

const SEGMENTS_ES_TO_EN: Record<string, string> = {
  producciones: 'productions',
};

const SEGMENTS_EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(SEGMENTS_ES_TO_EN).map(([es, en]) => [en, es])
);

export function alternatePath(currentPath: string, target: 'es' | 'en'): string {
  const stripped = currentPath.replace(/^\/en(?=\/|$)/, '');
  const segments = stripped.split('/').filter(Boolean);

  if (segments.length > 0) {
    let first = SEGMENTS_EN_TO_ES[segments[0]] ?? segments[0];
    if (target === 'en') first = SEGMENTS_ES_TO_EN[first] ?? first;
    segments[0] = first;
  }

  if (segments.length === 0) return target === 'en' ? '/en/' : '/';
  const path = '/' + segments.join('/') + '/';
  return target === 'en' ? '/en' + path : path;
}
