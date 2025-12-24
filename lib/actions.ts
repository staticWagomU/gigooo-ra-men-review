"use server";

import { extractShopInfo, type ShopInfo } from "./shop-info-extractor";
import { stripMarkdownLinks } from "./utils";

export async function parseUrlAndExtractShopInfo(
  markdown: string,
): Promise<ShopInfo> {
  console.log(
    "[parseUrlAndExtractShopInfo] Original markdown length:",
    markdown.length,
  );

  const cleanedMarkdown = stripMarkdownLinks(markdown);
  console.log(
    "[parseUrlAndExtractShopInfo] Cleaned markdown length:",
    cleanedMarkdown.length,
  );
  console.log(
    "[parseUrlAndExtractShopInfo] Cleaned preview:",
    cleanedMarkdown.slice(0, 500),
  );

  const result = await extractShopInfo(cleanedMarkdown);
  console.log("[parseUrlAndExtractShopInfo] Result:", result);

  return result;
}
