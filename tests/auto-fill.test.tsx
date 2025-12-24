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
import { extractShopInfo } from "@/lib/shop-info-extractor";

describe("URL解析による自動入力", () => {
  it("should auto-fill store name and location after URL parsing", async () => {
    const user = userEvent.setup();

    // モックの戻り値を設定
    vi.mocked(fetchJinaReader).mockResolvedValue("# 麺屋 一燈\n東京都新宿区");
    vi.mocked(extractShopInfo).mockResolvedValue({
      shopName: "麺屋 一燈",
      address: "東京都新宿区西新宿1-2-3",
      phoneNumber: "03-1234-5678",
    });

    render(<ReviewForm />);

    // URL入力
    const urlInput = screen.getByLabelText("URL解析");
    await user.type(urlInput, "https://tabelog.com/example");

    // 解析ボタンをクリック
    const parseButton = screen.getByRole("button", { name: "解析" });
    await user.click(parseButton);

    // 店名と場所が自動入力されることを確認
    await waitFor(() => {
      expect(screen.getByLabelText("店名")).toHaveValue("麺屋 一燈");
      expect(screen.getByLabelText("場所")).toHaveValue(
        "東京都新宿区西新宿1-2-3",
      );
    });
  });
});
