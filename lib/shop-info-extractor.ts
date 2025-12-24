import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";

const shopInfoSchema = z.object({
  shopName: z.string().nullable(),
  address: z.string().nullable(),
});

export type ShopInfo = z.infer<typeof shopInfoSchema>;

export const emptyShopInfo: ShopInfo = {
  shopName: null,
  address: null,
};

export async function extractShopInfo(markdown: string): Promise<ShopInfo> {
  try {
    console.log("[extractShopInfo] Input markdown length:", markdown.length);
    console.log("[extractShopInfo] Input markdown preview:", markdown);

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({ schema: shopInfoSchema }),
      prompt: `以下のMarkdownから店舗情報を抽出してください。

${markdown}`,
    });

    console.log("[extractShopInfo] result.output:", result.output);
    console.log("[extractShopInfo] result.text:", result.text);

    return result.output ?? emptyShopInfo;
  } catch (error) {
    console.error("[extractShopInfo] Error:", error);
    return emptyShopInfo;
  }
}
