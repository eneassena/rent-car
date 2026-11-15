const API_URL = import.meta.env.VITE_API_URL;

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;

  if (path.startsWith("http")) return path;

  return `${SERVER_URL}${path}`;
}
