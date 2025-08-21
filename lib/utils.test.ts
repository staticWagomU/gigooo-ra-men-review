import { describe, expect, it } from "vitest";
import { formatStars, generateSlackMessage } from "./utils";

describe("formatStars", () => {
  it("should return 1 filled star and 4 empty stars for rating 1", () => {
    expect(formatStars(1)).toBe("★☆☆☆☆");
  });

  it("should return 2 filled stars and 3 empty stars for rating 2", () => {
    expect(formatStars(2)).toBe("★★☆☆☆");
  });

  it("should return 3 filled stars and 2 empty stars for rating 3", () => {
    expect(formatStars(3)).toBe("★★★☆☆");
  });

  it("should return 4 filled stars and 1 empty star for rating 4", () => {
    expect(formatStars(4)).toBe("★★★★☆");
  });

  it("should return 5 filled stars for rating 5", () => {
    expect(formatStars(5)).toBe("★★★★★");
  });
});

describe("generateSlackMessage", () => {
  it("should generate correct Slack message format", () => {
    const formData = {
      storeName: "ラーメン太郎",
      location: "東京都渋谷区",
      storeLink: "https://example.com/ramen-taro",
      menuName: "味噌ラーメン",
      price: 850,
      tasteRating: 4,
      atmosphereRating: 3,
      overallRating: 4,
      reviewText: "とても美味しいラーメンでした。また来たいです。",
    };

    const expected = `■店名：ラーメン太郎
■場所：東京都渋谷区（https://example.com/ramen-taro）
■メニュー名：味噌ラーメン
■金額：￥850
■味：★★★★☆
■お店の雰囲気：★★★☆☆
■総合評価：★★★★☆
とても美味しいラーメンでした。また来たいです。`;

    expect(generateSlackMessage(formData)).toBe(expected);
  });

  it("should handle different ratings correctly", () => {
    const formData = {
      storeName: "らーめん次郎",
      location: "新宿区",
      storeLink: "https://example.com/jiro",
      menuName: "豚骨ラーメン",
      price: 1200,
      tasteRating: 5,
      atmosphereRating: 2,
      overallRating: 3,
      reviewText: "濃厚なスープが特徴的でした。",
    };

    const expected = `■店名：らーめん次郎
■場所：新宿区（https://example.com/jiro）
■メニュー名：豚骨ラーメン
■金額：￥1200
■味：★★★★★
■お店の雰囲気：★★☆☆☆
■総合評価：★★★☆☆
濃厚なスープが特徴的でした。`;

    expect(generateSlackMessage(formData)).toBe(expected);
  });

  it("should handle minimum values", () => {
    const formData = {
      storeName: "A",
      location: "B",
      storeLink: "https://c.com",
      menuName: "D",
      price: 1,
      tasteRating: 1,
      atmosphereRating: 1,
      overallRating: 1,
      reviewText: "E",
    };

    const expected = `■店名：A
■場所：B（https://c.com）
■メニュー名：D
■金額：￥1
■味：★☆☆☆☆
■お店の雰囲気：★☆☆☆☆
■総合評価：★☆☆☆☆
E`;

    expect(generateSlackMessage(formData)).toBe(expected);
  });
});
