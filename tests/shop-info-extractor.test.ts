import { describe, expect, it, vi } from "vitest";

// AI SDKをモック
vi.mock("ai", () => ({
  Output: { object: vi.fn() },
  generateText: vi.fn(),
}));

import { generateText } from "ai";
import { emptyShopInfo, extractShopInfo } from "@/lib/shop-info-extractor";

describe("extractShopInfo", () => {
  it("should call AI API and extract shop info from markdown", async () => {
    const mockShopInfo = {
      shopName: "麺屋 一燈",
      address: "東京都新宿区西新宿1-2-3",
    };

    vi.mocked(generateText).mockResolvedValue({
      output: mockShopInfo,
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    const markdown = `
# 麺屋 一燈

東京都新宿区西新宿1-2-3

営業時間: 11:00〜21:00
    `.trim();

    const result = await extractShopInfo(markdown);

    // AI APIが呼び出されていることを確認
    expect(generateText).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockShopInfo);
  });

  it("should handle partial extraction (only shopName)", async () => {
    const mockShopInfo = {
      shopName: "ラーメン太郎",
    };

    vi.mocked(generateText).mockResolvedValue({
      output: mockShopInfo,
    } as unknown as Awaited<ReturnType<typeof generateText>>);

    const result = await extractShopInfo("# ラーメン太郎");

    expect(result.shopName).toBe("ラーメン太郎");
    expect(result.address).toBeUndefined();
  });

  it("should return empty ShopInfo when AI API throws an error", async () => {
    vi.mocked(generateText).mockRejectedValue(
      new Error("API rate limit exceeded"),
    );

    const markdown = "# Some shop content";

    const result = await extractShopInfo(markdown);

    expect(result).toEqual(emptyShopInfo);
  });
});
