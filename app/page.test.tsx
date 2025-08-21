import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("Home Page", () => {
  describe("rendering", () => {
    it("should render the review form", () => {
      render(<Page />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "ラーメンレビュー",
      );
      expect(screen.getByLabelText("店名")).toBeInTheDocument();
      expect(screen.getByLabelText("場所")).toBeInTheDocument();
      expect(screen.getByLabelText("店舗リンク")).toBeInTheDocument();
      expect(screen.getByLabelText("メニュー名")).toBeInTheDocument();
      expect(screen.getByLabelText("金額（円）")).toBeInTheDocument();
      expect(screen.getByLabelText("レビュー")).toBeInTheDocument();
    });

    it("should render message preview", () => {
      render(<Page />);

      expect(screen.getByText("Slackメッセージプレビュー")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should have proper page structure", () => {
      render(<Page />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });
  });
});
