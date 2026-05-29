export function getProjectCover(data: {
  heroImage?: string;
  featuredVideoId?: string;
  episodes?: Array<{ videoId?: string }>;
}): string | undefined {
  if (data.heroImage) return data.heroImage;
  const videoId = data.featuredVideoId ?? data.episodes?.[0]?.videoId;
  if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  return undefined;
}
