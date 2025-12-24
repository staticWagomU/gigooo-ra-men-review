import { describe, expect, it } from "vitest";
import { extractShopInfo } from "@/lib/shop-info-extractor";

describe("extractShopInfo", () => {
  it("should extract shop name, address, and phone number from markdown", async () => {
    const markdown = `
# 麺屋 一燈

東京都新宿区西新宿1-2-3

電話: 03-1234-5678

営業時間: 11:00〜21:00
    `.trim();

    const result = await extractShopInfo(markdown);

    expect(result).toEqual({
      shopName: "麺屋 一燈",
      address: "東京都新宿区西新宿1-2-3",
      phoneNumber: "03-1234-5678",
    });
  });
});
