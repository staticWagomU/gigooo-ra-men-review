import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";

const shopInfoSchema = z.object({
  shopName: z.string().optional(),
  address: z.string().optional(),
});

export type ShopInfo = z.infer<typeof shopInfoSchema>;

export const emptyShopInfo: ShopInfo = {};

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
