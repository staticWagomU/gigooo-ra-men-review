"use client";

import { ReviewForm } from "@/components/review-form";
import type { ReviewFormData } from "@/lib/validations";

export default function Home() {
  const handleSubmit = (data: ReviewFormData) => {
    console.log("Review submitted:", data);
    // Here you could send data to an API, show a success message, etc.
  };

  return (
    <main className="min-h-screen bg-background">
      <ReviewForm onSubmit={handleSubmit} />
    </main>
  );
}
