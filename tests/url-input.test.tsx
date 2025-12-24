import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewForm } from "@/components/review-form";

describe("URL入力フィールド", () => {
  describe("rendering", () => {
    it("should render URL input field for auto-fill", () => {
      render(<ReviewForm />);

      // URL解析用の入力フィールドが存在することを確認
      expect(screen.getByLabelText("URL解析")).toBeInTheDocument();
    });
  });
});
