import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StarRating } from "./star-rating";

describe("StarRating", () => {
  describe("rendering", () => {
    it("should render 5 stars", () => {
      render(<StarRating value={3} onChange={() => {}} />);

      const stars = screen.getAllByRole("button");
      expect(stars).toHaveLength(5);
    });

    it("should display correct filled and empty stars for value 3", () => {
      render(<StarRating value={3} onChange={() => {}} />);

      const stars = screen.getAllByRole("button");

      // First 3 stars should be filled (★)
      expect(stars[0]).toHaveTextContent("★");
      expect(stars[1]).toHaveTextContent("★");
      expect(stars[2]).toHaveTextContent("★");

      // Last 2 stars should be empty (☆)
      expect(stars[3]).toHaveTextContent("☆");
      expect(stars[4]).toHaveTextContent("☆");
    });

    it("should display all empty stars for value 0", () => {
      render(<StarRating value={0} onChange={() => {}} />);

      const stars = screen.getAllByRole("button");
      stars.forEach((star) => {
        expect(star).toHaveTextContent("☆");
      });
    });

    it("should display all filled stars for value 5", () => {
      render(<StarRating value={5} onChange={() => {}} />);

      const stars = screen.getAllByRole("button");
      stars.forEach((star) => {
        expect(star).toHaveTextContent("★");
      });
    });
  });

  describe("interaction", () => {
    it("should call onChange with correct value when star is clicked", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={2} onChange={mockOnChange} />);

      const stars = screen.getAllByRole("button");

      // Click the 4th star (index 3, value 4)
      fireEvent.click(stars[3]);

      expect(mockOnChange).toHaveBeenCalledWith(4);
    });

    it("should call onChange with 1 when first star is clicked", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={0} onChange={mockOnChange} />);

      const stars = screen.getAllByRole("button");

      fireEvent.click(stars[0]);

      expect(mockOnChange).toHaveBeenCalledWith(1);
    });

    it("should call onChange with 5 when last star is clicked", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={0} onChange={mockOnChange} />);

      const stars = screen.getAllByRole("button");

      fireEvent.click(stars[4]);

      expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    it("should toggle star when clicked on already selected rating", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={3} onChange={mockOnChange} />);

      const stars = screen.getAllByRole("button");

      // Click the 3rd star (index 2, value 3) - should deselect to 0
      fireEvent.click(stars[2]);

      expect(mockOnChange).toHaveBeenCalledWith(0);
    });
  });

  describe("accessibility", () => {
    it("should have appropriate aria-label for rating", () => {
      render(<StarRating value={3} onChange={() => {}} />);

      const container = screen.getByRole("group");
      expect(container).toHaveAttribute("aria-label", "評価: 3/5");
    });

    it("should have appropriate aria-label for each star button", () => {
      render(<StarRating value={2} onChange={() => {}} />);

      const stars = screen.getAllByRole("button");

      expect(stars[0]).toHaveAttribute("aria-label", "1つ星");
      expect(stars[1]).toHaveAttribute("aria-label", "2つ星");
      expect(stars[2]).toHaveAttribute("aria-label", "3つ星");
      expect(stars[3]).toHaveAttribute("aria-label", "4つ星");
      expect(stars[4]).toHaveAttribute("aria-label", "5つ星");
    });

    it("should be keyboard accessible", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={1} onChange={mockOnChange} />);

      const star = screen.getAllByRole("button")[2]; // 3rd star
      star.focus();

      fireEvent.keyDown(star, { key: "Enter" });

      expect(mockOnChange).toHaveBeenCalledWith(3);
    });

    it("should handle Space key press", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={1} onChange={mockOnChange} />);

      const star = screen.getAllByRole("button")[1]; // 2nd star
      star.focus();

      fireEvent.keyDown(star, { key: " " });

      expect(mockOnChange).toHaveBeenCalledWith(2);
    });
  });

  describe("disabled state", () => {
    it("should not call onChange when disabled", () => {
      const mockOnChange = vi.fn();
      render(<StarRating value={2} onChange={mockOnChange} disabled />);

      const stars = screen.getAllByRole("button");

      fireEvent.click(stars[3]);

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should have disabled attribute on buttons when disabled", () => {
      render(<StarRating value={2} onChange={() => {}} disabled />);

      const stars = screen.getAllByRole("button");
      stars.forEach((star) => {
        expect(star).toBeDisabled();
      });
    });

    it("should have appropriate styling when disabled", () => {
      render(<StarRating value={2} onChange={() => {}} disabled />);

      const container = screen.getByRole("group");
      expect(container).toHaveClass("opacity-50");
    });
  });
});
