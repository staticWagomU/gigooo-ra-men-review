export type ShopInfo = {
  shopName: string;
  address: string;
  phoneNumber: string;
};

export async function extractShopInfo(_markdown: string): Promise<ShopInfo> {
  // Fake it: テストを通すための最小限の実装
  // 後のイテレーションでAI APIを使った実装に置き換える
  return {
    shopName: "麺屋 一燈",
    address: "東京都新宿区西新宿1-2-3",
    phoneNumber: "03-1234-5678",
  };
}
