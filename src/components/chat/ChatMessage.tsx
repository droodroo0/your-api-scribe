import { useState } from "react";
import { Copy, Check, User, Bot, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onCopy?: (content: string) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

export function ChatMessage({ 
  message, 
  onCopy, 
  onRegenerate, 
  onFeedback 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFeedback = (type: "like" | "dislike") => {
    if (onFeedback) {
      onFeedback(message.id, type);
      setFeedback(type);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "group flex gap-4 p-6 transition-colors duration-200",
      message.role === "user" 
        ? "bg-transparent" 
        : "bg-gradient-message hover:bg-message-hover"
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        message.role === "user" 
          ? "bg-message-user" 
          : "bg-primary"
      )}>
        <AvatarFallback className="text-white">
          {message.role === "user" ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {message.role === "user" ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          {message.isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-foreground">
              {message.content}
            </div>
          )}
        </div>

        {/* Actions */}
        {!message.isTyping && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>

            {message.role === "assistant" && onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRegenerate(message.id)}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}

            {message.role === "assistant" && onFeedback && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback("like")}
                  className={cn(
                    "h-8 w-8 p-0",
                    feedback === "like" && "text-primary"
                  )}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback("dislike")}
                  className={cn(
                    "h-8 w-8 p-0",
                    feedback === "dislike" && "text-destructive"
                  )}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}