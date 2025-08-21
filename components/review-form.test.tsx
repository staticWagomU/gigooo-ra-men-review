import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewForm } from "./review-form";

describe("ReviewForm", () => {
  describe("rendering", () => {
    it("should render all form fields", () => {
      render(<ReviewForm />);

      expect(screen.getByLabelText("店名")).toBeInTheDocument();
      expect(screen.getByLabelText("場所")).toBeInTheDocument();
      expect(screen.getByLabelText("店舗リンク")).toBeInTheDocument();
      expect(screen.getByLabelText("メニュー名")).toBeInTheDocument();
      expect(screen.getByLabelText("金額（円）")).toBeInTheDocument();
      expect(screen.getByText("味の評価")).toBeInTheDocument();
      expect(screen.getByText("雰囲気の評価")).toBeInTheDocument();
      expect(screen.getByText("総合評価")).toBeInTheDocument();
      expect(screen.getByLabelText("レビュー")).toBeInTheDocument();
    });

    it("should render form title", () => {
      render(<ReviewForm />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "ラーメンレビュー",
      );
    });

    it("should render message preview section", () => {
      render(<ReviewForm />);

      expect(screen.getByText("Slackメッセージプレビュー")).toBeInTheDocument();
    });

    it("should render star rating components", () => {
      render(<ReviewForm />);

      // Each rating component should have 5 star buttons
      const starButtons = screen
        .getAllByRole("button")
        .filter(
          (button) => button.textContent === "★" || button.textContent === "☆",
        );

      // 3 rating components × 5 stars each = 15 star buttons
      expect(starButtons).toHaveLength(15);
    });
  });

  describe("basic functionality", () => {
    it("should update input values when user types", async () => {
      render(<ReviewForm />);

      const storeNameInput = screen.getByLabelText("店名");

      await act(async () => {
        fireEvent.change(storeNameInput, { target: { value: "ラーメン太郎" } });
      });

      expect(storeNameInput).toHaveValue("ラーメン太郎");
    });

    it("should display message preview", () => {
      render(<ReviewForm />);

      const preview = screen.getByRole("region", {
        name: "Slackメッセージ内容",
      });
      expect(preview).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper form structure", () => {
      render(<ReviewForm />);

      // HTML form element has implicit form role
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("should have proper labels for all inputs", () => {
      render(<ReviewForm />);

      expect(screen.getByLabelText("店名")).toBeInTheDocument();
      expect(screen.getByLabelText("場所")).toBeInTheDocument();
      expect(screen.getByLabelText("店舗リンク")).toBeInTheDocument();
      expect(screen.getByLabelText("メニュー名")).toBeInTheDocument();
      expect(screen.getByLabelText("金額（円）")).toBeInTheDocument();
      expect(screen.getByLabelText("レビュー")).toBeInTheDocument();
    });

    it("should have proper headings hierarchy", () => {
      render(<ReviewForm />);

      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("ラーメンレビュー");

      const subHeading = screen.getByRole("heading", { level: 3 });
      expect(subHeading).toHaveTextContent("Slackメッセージプレビュー");
    });
  });
});
