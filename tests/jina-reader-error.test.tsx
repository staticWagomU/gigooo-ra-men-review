import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "@/components/review-form";

// モック設定
vi.mock("@/lib/jina-reader", () => ({
  fetchJinaReader: vi.fn(),
}));

vi.mock("@/lib/shop-info-extractor", () => ({
  extractShopInfo: vi.fn(),
}));

import { fetchJinaReader } from "@/lib/jina-reader";

describe("Jina Reader APIエラーハンドリング", () => {
  it("should display error message when Jina Reader API fails", async () => {
    const user = userEvent.setup();

    // APIエラーをモック
    vi.mocked(fetchJinaReader).mockRejectedValue(
      new Error("Jina Reader API error: 500"),
    );

    render(<ReviewForm />);

    // URL入力
    const urlInput = screen.getByLabelText("URL解析");
    await user.type(urlInput, "https://tabelog.com/example");

    // 解析ボタンをクリック
    const parseButton = screen.getByRole("button", { name: "解析" });
    await user.click(parseButton);

    // エラーメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText("URLの解析に失敗しました。URLを確認してください。"),
      ).toBeInTheDocument();
    });
  });
});
