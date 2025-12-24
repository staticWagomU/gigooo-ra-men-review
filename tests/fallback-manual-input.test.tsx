import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReviewForm } from "@/components/review-form";

// モック設定
vi.mock("@/lib/jina-reader", () => ({
  fetchJinaReader: vi.fn(),
}));

vi.mock("@/lib/actions", () => ({
  parseUrlAndExtractShopInfo: vi.fn(),
}));

import { parseUrlAndExtractShopInfo } from "@/lib/actions";
import { fetchJinaReader } from "@/lib/jina-reader";

describe("AI抽出失敗時の手動入力フォールバック", () => {
  it("should show manual input message when AI fails to extract shop info", async () => {
    const user = userEvent.setup();

    // Jina ReaderはMarkdownを正常に取得
    vi.mocked(fetchJinaReader).mockResolvedValue("# Some page content");
    // AIは店舗情報を抽出できない（空のオブジェクトを返す）
    vi.mocked(parseUrlAndExtractShopInfo).mockResolvedValue({});

    render(<ReviewForm />);

    // URL入力
    const urlInput = screen.getByLabelText("URL解析");
    await user.type(urlInput, "https://example.com/unknown-page");

    // 解析ボタンをクリック
    const parseButton = screen.getByRole("button", { name: "解析" });
    await user.click(parseButton);

    // 手動入力を促すメッセージが表示されることを確認
    await waitFor(() => {
      expect(
        screen.getByText(
          "店舗情報を自動取得できませんでした。手動で入力してください。",
        ),
      ).toBeInTheDocument();
    });
  });
});
