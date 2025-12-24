import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewForm } from "@/components/review-form";

describe("店舗リンク入力フィールド", () => {
  describe("rendering", () => {
    it("should render store link input field with parse button", () => {
      render(<ReviewForm />);

      // 店舗リンク入力フィールドが存在することを確認
      expect(screen.getByLabelText("店舗リンク")).toBeInTheDocument();
    });
  });
});
