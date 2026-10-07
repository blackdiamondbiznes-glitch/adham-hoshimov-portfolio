/** Google Drive ulashish havolasidan ko'rinadigan rasm manzili. Bo'sh yoki tanilmasa null. */
export function driveImageUrl(input: string, size = "w1200"): string | null {
  const value = input.trim();
  if (!value) return null;

  const file = value.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (file) return thumbnail(file[1], size);

  const query = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (query) return thumbnail(query[1], size);

  if (value.startsWith("/") && !value.startsWith("//")) return value;

  if (/^https?:\/\//i.test(value) && !/drive\.google\.com/i.test(value)) return value;
  return null;
}

function thumbnail(id: string, size: string) {
  return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
}

/** YouTube watch, youtu.be, shorts yoki embed havolasidan video ID. */
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const matched = value.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/,
  );
  if (matched) return matched[1];

  try {
    const url = new URL(value);
    const watch = url.searchParams.get("v");
    if (watch && /^[a-zA-Z0-9_-]{6,}$/.test(watch)) return watch;
  } catch {
    return null;
  }
  return null;
}

export function youtubePoster(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbed(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}
