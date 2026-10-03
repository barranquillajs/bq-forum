export const globalController = async (
  url: string,
  method: string,
  body?: Record<string, any>,
  options?: { cached?: boolean },
) => {
  const key = url;

  if (options?.cached) {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
  });

  if (!response.ok) throw new Error("Failed to fetch");

  const data = await response.json();
  if (options?.cached) sessionStorage.setItem(key, JSON.stringify(data));

  return data;
};
