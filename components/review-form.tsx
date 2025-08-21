"use client";

import { useForm } from "@tanstack/react-form";
import { safeParse } from "valibot";
import { reviewFormSchema, type ReviewFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { MessagePreview } from "@/components/ui/message-preview";

interface ReviewFormProps {
  onSubmit?: (data: ReviewFormData) => void;
}

function ReviewForm({ onSubmit }: ReviewFormProps) {
  const form = useForm({
    defaultValues: {
      storeName: "",
      location: "",
      storeLink: "",
      menuName: "",
      price: 0,
      tasteRating: 0,
      atmosphereRating: 0,
      overallRating: 0,
      reviewText: "",
    } as ReviewFormData,
    onSubmit: async ({ value }) => {
      const result = safeParse(reviewFormSchema, value);
      if (result.success) {
        onSubmit?.(result.output);
      } else {
        // Validation errors are handled by individual field validation
        console.error("Form validation failed:", result.issues);
      }
    },
  });

  const validateField = (value: any, fieldName: keyof ReviewFormData) => {
    const result = safeParse(reviewFormSchema, {
      ...form.state.values,
      [fieldName]: value,
    });
    
    if (!result.success) {
      const fieldError = result.issues.find(
        (issue) => issue.path?.[0]?.key === fieldName
      );
      return fieldError?.message;
    }
    
    return undefined;
  };

  // Get current form values for preview
  const formValues = form.state.values;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">ラーメンレビュー</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>レビュー情報を入力</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              role="form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {/* Store Name */}
              <form.Field
                name="storeName"
                validators={{
                  onChange: ({ value }) => validateField(value, "storeName"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="storeName">店名</Label>
                    <Input
                      id="storeName"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="店名を入力してください"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Location */}
              <form.Field
                name="location"
                validators={{
                  onChange: ({ value }) => validateField(value, "location"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="location">場所</Label>
                    <Input
                      id="location"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="場所を入力してください"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Store Link */}
              <form.Field
                name="storeLink"
                validators={{
                  onChange: ({ value }) => validateField(value, "storeLink"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="storeLink">店舗リンク</Label>
                    <Input
                      id="storeLink"
                      type="url"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Menu Name */}
              <form.Field
                name="menuName"
                validators={{
                  onChange: ({ value }) => validateField(value, "menuName"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="menuName">メニュー名</Label>
                    <Input
                      id="menuName"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="メニュー名を入力してください"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Price */}
              <form.Field
                name="price"
                validators={{
                  onChange: ({ value }) => validateField(value, "price"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="price">金額（円）</Label>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      max="9999"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      placeholder="850"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Taste Rating */}
              <form.Field
                name="tasteRating"
                validators={{
                  onChange: ({ value }) => validateField(value, "tasteRating"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>味の評価</Label>
                    <StarRating
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Atmosphere Rating */}
              <form.Field
                name="atmosphereRating"
                validators={{
                  onChange: ({ value }) => validateField(value, "atmosphereRating"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>雰囲気の評価</Label>
                    <StarRating
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Overall Rating */}
              <form.Field
                name="overallRating"
                validators={{
                  onChange: ({ value }) => validateField(value, "overallRating"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label>総合評価</Label>
                    <StarRating
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Review Text */}
              <form.Field
                name="reviewText"
                validators={{
                  onChange: ({ value }) => validateField(value, "reviewText"),
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="reviewText">レビュー</Label>
                    <Textarea
                      id="reviewText"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="レビューを入力してください"
                      rows={4}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting ? "投稿中..." : "レビューを投稿"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardContent className="pt-6">
            <MessagePreview formData={formValues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { ReviewForm };