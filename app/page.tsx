import { ReviewForm } from "@/components/review-form";

export default function Home() {
  const handleSubmit = (data: any) => {
    console.log("Review submitted:", data);
    // Here you could send data to an API, show a success message, etc.
  };

  return (
    <main className="min-h-screen bg-background">
      <ReviewForm onSubmit={handleSubmit} />
    </main>
  );
}
