import {
  type InferOutput,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
  url,
} from "valibot";

export const reviewFormSchema = object({
  storeName: pipe(string(), minLength(1, "店名を入力してください")),
  location: pipe(string(), minLength(1, "場所を入力してください")),
  storeLink: pipe(string(), url("有効なURLを入力してください")),
  menuName: pipe(string(), minLength(1, "メニュー名を入力してください")),
  price: pipe(
    number("金額は数値で入力してください"),
    minValue(1, "金額は1円以上で入力してください"),
    maxValue(9999, "金額は9999円以下で入力してください"),
  ),
  tasteRating: pipe(
    number("味の評価は数値で入力してください"),
    minValue(1, "評価は1以上で入力してください"),
    maxValue(5, "評価は5以下で入力してください"),
  ),
  atmosphereRating: pipe(
    number("雰囲気の評価は数値で入力してください"),
    minValue(1, "評価は1以上で入力してください"),
    maxValue(5, "評価は5以下で入力してください"),
  ),
  overallRating: pipe(
    number("総合評価は数値で入力してください"),
    minValue(1, "評価は1以上で入力してください"),
    maxValue(5, "評価は5以下で入力してください"),
  ),
  reviewText: pipe(string(), minLength(1, "レビューを入力してください")),
});

export type ReviewFormData = InferOutput<typeof reviewFormSchema>;
