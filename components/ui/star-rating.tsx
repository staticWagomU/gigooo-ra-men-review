import type * as React from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

function StarRating({
  value,
  onChange,
  disabled = false,
  className,
}: StarRatingProps) {
  const handleStarClick = (starValue: number) => {
    if (disabled) return;

    // Toggle functionality: if clicking on the current rating, reset to 0
    if (starValue === value) {
      onChange(0);
    } else {
      onChange(starValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, starValue: number) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStarClick(starValue);
    }
  };

  return (
    <div
      role="group"
      aria-label={`評価: ${value}/5`}
      className={cn(
        "flex items-center gap-1",
        disabled && "opacity-50",
        className,
      )}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            aria-label={`${starValue}つ星`}
            className={cn(
              "text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
              isFilled ? "text-yellow-500" : "text-gray-300",
              !disabled && "hover:text-yellow-400 cursor-pointer",
              disabled && "cursor-not-allowed",
            )}
            onClick={() => handleStarClick(starValue)}
            onKeyDown={(event) => handleKeyDown(event, starValue)}
          >
            {isFilled ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

export { StarRating };
