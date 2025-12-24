import { describe, expect, it } from "vitest";
import { fetchJinaReader } from "@/lib/jina-reader";

describe("fetchJinaReader", () => {
  it("should fetch markdown from Jina Reader API", async () => {
    const url = "https://example.com";

    const result = await fetchJinaReader(url);

    // Jina Reader APIはMarkdown形式のテキストを返す
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
