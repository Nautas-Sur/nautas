export function sortCompass<T extends { data: { order: number; name: string } }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => b.data.order - a.data.order || a.data.name.localeCompare(b.data.name, 'es')
  );
}
