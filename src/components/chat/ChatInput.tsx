import { useState, useRef, useEffect } from "react";
import { Send, Square, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopGeneration?: () => void;
  isGenerating?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  isGenerating = false,
  disabled = false,
  placeholder = "Message ChatGPT..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isGenerating) {
      onSendMessage(message.trim());
      setMessage("");
      resetTextareaHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleStop = () => {
    if (onStopGeneration) {
      onStopGeneration();
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 p-3 bg-card rounded-xl border border-border shadow-chat">
            {/* Attachment button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "min-h-[44px] max-h-[200px] resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "bg-transparent placeholder:text-muted-foreground",
                "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              )}
              style={{ height: "44px" }}
            />

            {/* Voice input button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Send/Stop button */}
            {isGenerating ? (
              <Button
                type="button"
                onClick={handleStop}
                size="icon"
                className="h-8 w-8 shrink-0 bg-destructive hover:bg-destructive/90"
              >
                <Square className="h-3 w-3 fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || disabled}
                className={cn(
                  "h-8 w-8 shrink-0 transition-all",
                  message.trim() 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Footer text */}
          <div className="text-xs text-muted-foreground text-center mt-2">
            ChatGPT can make mistakes. Check important info.
          </div>
        </form>
      </div>
    </div>
  );
}