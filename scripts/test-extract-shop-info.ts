/**
 * extractShopInfo の動作確認スクリプト
 *
 * 使い方:
 *   1. .env.example をコピーして .env.local を作成
 *   2. OPENAI_API_KEY を設定
 *   3. pnpm tsx scripts/test-extract-shop-info.ts [URL]
 *
 * 例:
 *   pnpm tsx scripts/test-extract-shop-info.ts https://tabelog.com/tokyo/A1312/A131201/13001234/
 */

import { fetchJinaReader } from "../lib/jina-reader";
import { extractShopInfo } from "../lib/shop-info-extractor";

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.log("使い方: pnpm tsx scripts/test-extract-shop-info.ts <URL>");
    console.log("");
    console.log("例:");
    console.log(
      "  pnpm tsx scripts/test-extract-shop-info.ts https://tabelog.com/tokyo/...",
    );
    process.exit(1);
  }

  // 環境変数チェック
  if (!process.env.OPENAI_API_KEY) {
    console.error("エラー: OPENAI_API_KEY が設定されていません");
    console.error("");
    console.error("以下のいずれかの方法で設定してください:");
    console.error("  1. .env.local ファイルに OPENAI_API_KEY=sk-xxx を追加");
    console.error("  2. 環境変数として直接設定: export OPENAI_API_KEY=sk-xxx");
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log("extractShopInfo テスト");
  console.log("=".repeat(60));
  console.log("");
  console.log(`URL: ${url}`);
  console.log("");

  try {
    // Step 1: Jina Reader でMarkdownを取得
    console.log("[1/2] Jina Reader でページを取得中...");
    const markdown = await fetchJinaReader(url);
    console.log(`  ✓ 取得完了 (${markdown.length} 文字)`);
    console.log("");

    // Markdownの一部を表示
    console.log("-".repeat(40));
    console.log("取得したMarkdown (先頭500文字):");
    console.log("-".repeat(40));
    console.log(markdown.slice(0, 500));
    console.log("...");
    console.log("");

    // Step 2: AIで店舗情報を抽出
    console.log("[2/2] OpenAI で店舗情報を抽出中...");
    const shopInfo = await extractShopInfo(markdown);
    console.log("  ✓ 抽出完了");
    console.log("");

    // 結果を表示
    console.log("=".repeat(40));
    console.log("抽出結果:");
    console.log("=".repeat(40));
    console.log(`店名: ${shopInfo.shopName ?? "(なし)"}`);
    console.log(`住所: ${shopInfo.address ?? "(なし)"}`);
    console.log("");
    console.log("JSON:");
    console.log(JSON.stringify(shopInfo, null, 2));
  } catch (error) {
    console.error("エラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
