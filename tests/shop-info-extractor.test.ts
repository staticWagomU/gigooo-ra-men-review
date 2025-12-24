import { describe, expect, it, vi } from "vitest";

// AI SDKをモック
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";
import { emptyShopInfo, extractShopInfo } from "@/lib/shop-info-extractor";

describe("extractShopInfo", () => {
  it("should call AI API and extract shop info from markdown", async () => {
    const mockShopInfo = {
      shopName: "麺屋 一燈",
      address: "東京都新宿区西新宿1-2-3",
      phoneNumber: "03-1234-5678",
    };

    vi.mocked(generateObject).mockResolvedValue({
      object: mockShopInfo,
    } as Awaited<ReturnType<typeof generateObject>>);

    const markdown = `
# 麺屋 一燈

東京都新宿区西新宿1-2-3

電話: 03-1234-5678

営業時間: 11:00〜21:00
    `.trim();

    const result = await extractShopInfo(markdown);

    // AI APIが呼び出されていることを確認
    expect(generateObject).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockShopInfo);
  });

  it("should return empty ShopInfo when AI API throws an error", async () => {
    vi.mocked(generateObject).mockRejectedValue(
      new Error("API rate limit exceeded"),
    );

    const markdown = "# Some shop content";

    const result = await extractShopInfo(markdown);

    expect(result).toEqual(emptyShopInfo);
  });
});
