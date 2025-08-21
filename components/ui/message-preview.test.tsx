import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MessagePreview } from "./message-preview";

describe("MessagePreview", () => {
  const mockFormData = {
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

  describe("rendering", () => {
    it("should render formatted Slack message", () => {
      render(<MessagePreview formData={mockFormData} />);

      expect(screen.getByText("Slackメッセージプレビュー")).toBeInTheDocument();

      const messageContent = screen.getByRole("region", {
        name: "Slackメッセージ内容",
      });
      expect(messageContent).toHaveTextContent("■店名：ラーメン太郎");
      expect(messageContent).toHaveTextContent(
        "■場所：東京都渋谷区（https://example.com/ramen-taro）",
      );
      expect(messageContent).toHaveTextContent("■メニュー名：味噌ラーメン");
      expect(messageContent).toHaveTextContent("■金額：￥850");
      expect(messageContent).toHaveTextContent("■味：★★★★☆");
      expect(messageContent).toHaveTextContent("■お店の雰囲気：★★★☆☆");
      expect(messageContent).toHaveTextContent("■総合評価：★★★★☆");
      expect(messageContent).toHaveTextContent(
        "とても美味しいラーメンでした。また来たいです。",
      );
    });

    it("should show copy button", () => {
      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      expect(copyButton).toBeInTheDocument();
    });

    it("should render with empty data", () => {
      const emptyData = {
        storeName: "",
        location: "",
        storeLink: "",
        menuName: "",
        price: 0,
        tasteRating: 0,
        atmosphereRating: 0,
        overallRating: 0,
        reviewText: "",
      };

      render(<MessagePreview formData={emptyData} />);

      const messageContent = screen.getByRole("region", {
        name: "Slackメッセージ内容",
      });
      expect(messageContent).toHaveTextContent("■店名：");
      expect(messageContent).toHaveTextContent("■場所：（）");
      expect(messageContent).toHaveTextContent("■金額：￥0");
    });
  });

  describe("copy functionality", () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(globalThis.navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    });

    it("should copy message to clipboard when copy button is clicked", async () => {
      const mockWriteText = vi.spyOn(
        globalThis.navigator.clipboard,
        "writeText",
      );

      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(
          expect.stringContaining("■店名：ラーメン太郎"),
        );
      });

      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining("■味：★★★★☆"),
      );
    });

    it("should show success message after copying", async () => {
      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("コピーしました！")).toBeInTheDocument();
      });
    });

    it("should handle copy error gracefully", async () => {
      const mockWriteText = vi
        .spyOn(globalThis.navigator.clipboard, "writeText")
        .mockRejectedValue(new Error("Copy failed"));

      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("コピーに失敗しました")).toBeInTheDocument();
      });
    });

    it("should reset copy status after delay", async () => {
      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("コピーしました！")).toBeInTheDocument();
      });

      // Wait for the timeout to reset status (3 seconds + buffer)
      await waitFor(
        () => {
          expect(
            screen.queryByText("コピーしました！"),
          ).not.toBeInTheDocument();
          expect(
            screen.getByText("クリップボードにコピー"),
          ).toBeInTheDocument();
        },
        { timeout: 4000 },
      );
    });
  });

  describe("accessibility", () => {
    it("should have appropriate heading", () => {
      render(<MessagePreview formData={mockFormData} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("Slackメッセージプレビュー");
    });

    it("should have copy button with appropriate aria-label", () => {
      render(<MessagePreview formData={mockFormData} />);

      const copyButton = screen.getByRole("button", { name: /コピー/ });
      expect(copyButton).toHaveAttribute(
        "aria-label",
        expect.stringContaining("コピー"),
      );
    });

    it("should have preformatted text area for better screen reader support", () => {
      render(<MessagePreview formData={mockFormData} />);

      const preElement = screen.getByRole("region");
      expect(preElement).toHaveAttribute("aria-label", "Slackメッセージ内容");
    });
  });

  describe("styling", () => {
    it("should have appropriate CSS classes", () => {
      render(<MessagePreview formData={mockFormData} />);

      const container = screen.getByRole("region");
      expect(container).toHaveClass("bg-muted");
      expect(container).toHaveClass("p-4");
      expect(container).toHaveClass("rounded-md");
    });

    it("should display message with monospace font", () => {
      render(<MessagePreview formData={mockFormData} />);

      const preElement = screen.getByRole("region").querySelector("pre");
      expect(preElement).toHaveClass("font-mono");
    });
  });
});
