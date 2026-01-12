/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - VIDEO_ID (direct ID)
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Direct video ID (11 characters alphanumeric, - or _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  // Standard youtube.com/watch?v=VIDEO_ID
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match1) return match1[1];

  // youtube.com/embed/VIDEO_ID
  const match2 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (match2) return match2[1];

  return null;
};

/**
 * Get YouTube embed URL from video ID
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
};

/**
 * Validate if a string is a valid YouTube URL or video ID
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};
