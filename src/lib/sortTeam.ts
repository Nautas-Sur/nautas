export function sortTeam<T extends { data: { order: number; name: string } }>(team: T[]): T[] {
  return [...team].sort(
    (a, b) => b.data.order - a.data.order || a.data.name.localeCompare(b.data.name, 'es')
  );
}
