import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";

export type ShopInfo = {
  shopName: string;
  address: string;
  phoneNumber: string;
};

export const emptyShopInfo: ShopInfo = {
  shopName: "",
  address: "",
  phoneNumber: "",
};

const shopInfoSchema = z.object({
  shopName: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
});

export async function extractShopInfo(markdown: string): Promise<ShopInfo> {
  try {
    const result = await generateText({
      model: openai("gpt-5-mini"),
      output: Output.object({ schema: shopInfoSchema }),
      prompt: `以下のMarkdownから店舗情報を抽出してください。

${markdown}`,
    });

    return result.output ?? emptyShopInfo;
  } catch {
    return emptyShopInfo;
  }
}
