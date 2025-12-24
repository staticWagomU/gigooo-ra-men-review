import { describe, expect, it, vi } from "vitest";

// AI SDKをモック
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

import { generateObject } from "ai";
import { extractShopInfoWithAI } from "@/lib/shop-info-extractor";

describe("extractShopInfoWithAI", () => {
  it("should call AI API and extract shop info from markdown", async () => {
    const mockShopInfo = {
      shopName: "博多一風堂",
      address: "東京都渋谷区神宮前6-10-7",
      phoneNumber: "03-3406-6010",
    };

    vi.mocked(generateObject).mockResolvedValue({
      object: mockShopInfo,
    });

    const markdown = `
# 博多一風堂 原宿店

住所: 東京都渋谷区神宮前6-10-7

電話番号: 03-3406-6010

本格博多豚骨ラーメンの名店
    `.trim();

    const result = await extractShopInfoWithAI(markdown);

    expect(generateObject).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockShopInfo);
  });

  it("should return empty ShopInfo when AI API throws an error", async () => {
    vi.mocked(generateObject).mockRejectedValue(new Error("API rate limit exceeded"));

    const markdown = "# Some shop content";

    const result = await extractShopInfoWithAI(markdown);

    expect(result).toEqual({
      shopName: "",
      address: "",
      phoneNumber: "",
    });
  });
});
