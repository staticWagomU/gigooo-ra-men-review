import { useState } from "react";
import { cn, generateSlackMessage } from "@/lib/utils";
import type { ReviewFormData } from "@/lib/validations";
import { Button } from "./button";

interface MessagePreviewProps {
  formData: ReviewFormData;
  className?: string;
}

type CopyStatus = "idle" | "success" | "error";

function MessagePreview({ formData, className }: MessagePreviewProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const message = generateSlackMessage(formData);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setCopyStatus("idle");
      }, 3000);
    } catch (_error) {
      setCopyStatus("error");

      // Reset status after 3 seconds
      setTimeout(() => {
        setCopyStatus("idle");
      }, 3000);
    }
  };

  const getButtonText = () => {
    switch (copyStatus) {
      case "success":
        return "コピーしました！";
      case "error":
        return "コピーに失敗しました";
      default:
        return "クリップボードにコピー";
    }
  };

  const getButtonVariant = () => {
    switch (copyStatus) {
      case "success":
        return "default" as const;
      case "error":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Slackメッセージプレビュー</h3>
        <Button
          type="button"
          variant={getButtonVariant()}
          size="sm"
          onClick={handleCopy}
          disabled={copyStatus !== "idle"}
          aria-label={`Slackメッセージを${getButtonText()}`}
        >
          {getButtonText()}
        </Button>
      </div>

      <section
        aria-label="Slackメッセージ内容"
        className="bg-muted p-4 rounded-md border"
      >
        <pre className="font-mono text-sm whitespace-pre-wrap break-words">
          {message}
        </pre>
      </section>
    </div>
  );
}

export { MessagePreview };
