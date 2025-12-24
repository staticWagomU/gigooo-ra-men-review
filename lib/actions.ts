"use server";

import { extractShopInfo, type ShopInfo } from "./shop-info-extractor";
import { stripMarkdownLinks } from "./utils";

export async function parseUrlAndExtractShopInfo(
  markdown: string,
): Promise<ShopInfo> {
  const cleanedMarkdown = stripMarkdownLinks(markdown);
  return extractShopInfo(cleanedMarkdown);
}
