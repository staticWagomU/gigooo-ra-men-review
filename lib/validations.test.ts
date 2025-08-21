import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { reviewFormSchema } from "./validations";

describe("reviewFormSchema", () => {
  describe("valid data", () => {
    it("should validate complete form data", () => {
      const validData = {
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

      const result = safeParse(reviewFormSchema, validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.output).toEqual(validData);
      }
    });

    it("should validate minimum price", () => {
      const validData = {
        storeName: "ラーメン太郎",
        location: "東京都渋谷区",
        storeLink: "https://example.com/ramen-taro",
        menuName: "味噌ラーメン",
        price: 1,
        tasteRating: 4,
        atmosphereRating: 3,
        overallRating: 4,
        reviewText: "レビューテキスト",
      };

      const result = safeParse(reviewFormSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should validate maximum price", () => {
      const validData = {
        storeName: "ラーメン太郎",
        location: "東京都渋谷区",
        storeLink: "https://example.com/ramen-taro",
        menuName: "味噌ラーメン",
        price: 9999,
        tasteRating: 4,
        atmosphereRating: 3,
        overallRating: 4,
        reviewText: "レビューテキスト",
      };

      const result = safeParse(reviewFormSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should validate all rating values 1-5", () => {
      for (let rating = 1; rating <= 5; rating++) {
        const validData = {
          storeName: "ラーメン太郎",
          location: "東京都渋谷区",
          storeLink: "https://example.com/ramen-taro",
          menuName: "味噌ラーメン",
          price: 850,
          tasteRating: rating,
          atmosphereRating: rating,
          overallRating: rating,
          reviewText: "レビューテキスト",
        };

        const result = safeParse(reviewFormSchema, validData);
        expect(result.success).toBe(true);
      }
    });
  });

  describe("invalid data", () => {
    const baseValidData = {
      storeName: "ラーメン太郎",
      location: "東京都渋谷区",
      storeLink: "https://example.com/ramen-taro",
      menuName: "味噌ラーメン",
      price: 850,
      tasteRating: 4,
      atmosphereRating: 3,
      overallRating: 4,
      reviewText: "レビューテキスト",
    };

    it("should reject empty storeName", () => {
      const invalidData = { ...baseValidData, storeName: "" };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty location", () => {
      const invalidData = { ...baseValidData, location: "" };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid URL", () => {
      const invalidData = { ...baseValidData, storeLink: "invalid-url" };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty menuName", () => {
      const invalidData = { ...baseValidData, menuName: "" };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject price below minimum", () => {
      const invalidData = { ...baseValidData, price: 0 };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject price above maximum", () => {
      const invalidData = { ...baseValidData, price: 10000 };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject rating below 1", () => {
      const invalidData = { ...baseValidData, tasteRating: 0 };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject rating above 5", () => {
      const invalidData = { ...baseValidData, overallRating: 6 };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty reviewText", () => {
      const invalidData = { ...baseValidData, reviewText: "" };
      const result = safeParse(reviewFormSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const incompleteData = {
        storeName: "ラーメン太郎",
      };

      const result = safeParse(reviewFormSchema, incompleteData);
      expect(result.success).toBe(false);
    });
  });
});
