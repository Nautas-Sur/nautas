export function sortProjects<T extends { data: { order: number; title: string } }>(projects: T[]): T[] {
  return [...projects].sort(
    (a, b) => b.data.order - a.data.order || a.data.title.localeCompare(b.data.title, 'es')
  );
}
