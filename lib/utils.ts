import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ReviewFormData } from "./validations";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStars(rating: number): string {
  const filledStars = "★".repeat(rating);
  const emptyStars = "☆".repeat(5 - rating);
  return filledStars + emptyStars;
}

export function stripMarkdownLinks(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // Remove image links ![alt](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links [text](url) -> text
    .replace(/https?:\/\/[^\s)]+/g, ""); // Remove plain URLs
}

export function generateSlackMessage(data: ReviewFormData): string {
  return `■店名：${data.storeName}
■場所：${data.location}
■リンク：${data.storeLink}
■メニュー名：${data.menuName}
■金額：￥${data.price}
■味：${formatStars(data.tasteRating)}
■お店の雰囲気：${formatStars(data.atmosphereRating)}
■総合評価：${formatStars(data.overallRating)}
${data.reviewText}`;
}
