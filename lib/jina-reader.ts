export async function fetchJinaReader(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const response = await fetch(jinaUrl);

  if (!response.ok) {
    throw new Error(`Jina Reader API error: ${response.status}`);
  }

  return await response.text();
}
