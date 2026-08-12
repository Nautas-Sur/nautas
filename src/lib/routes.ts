export function productionsPath(locale: string): string {
  return locale === 'en' ? '/en/productions' : '/producciones';
}

export function productionPath(locale: string, id: string): string {
  return `${productionsPath(locale)}/${id}`;
}
