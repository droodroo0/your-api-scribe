import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, Message } from "./ChatMessage";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  messages: Message[];
  isGenerating?: boolean;
  onCopyMessage?: (content: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
  className?: string;
}

export function ChatContainer({
  messages,
  isGenerating = false,
  onCopyMessage,
  onRegenerateMessage,
  onFeedback,
  className
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={cn("flex-1 flex items-center justify-center", className)}>
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-2xl font-semibold">How can I help you today?</h2>
          <p className="text-muted-foreground">
            Start a conversation by typing a message below. I'm here to assist you with any questions or tasks you have.
          </p>
          
          {/* Example prompts */}
          <div className="grid grid-cols-1 gap-2 mt-6">
            {[
              "Explain quantum computing in simple terms",
              "Write a creative story about space exploration", 
              "Help me plan a healthy meal for the week",
              "Create a todo app in React"
            ].map((prompt, index) => (
              <button
                key={index}
                className="p-3 text-left text-sm bg-card hover:bg-card/80 rounded-lg border border-border transition-colors"
                onClick={() => {
                  // This would be handled by the parent component
                  console.log("Selected prompt:", prompt);
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1", className)} ref={scrollAreaRef}>
      <div className="space-y-0">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onCopy={onCopyMessage}
            onRegenerate={onRegenerateMessage}
            onFeedback={onFeedback}
          />
        ))}
        
        {/* Typing indicator */}
        {isGenerating && (
          <ChatMessage
            message={{
              id: "typing",
              content: "",
              role: "assistant",
              timestamp: new Date(),
              isTyping: true
            }}
          />
        )}
        
        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-4" />
      </div>
    </ScrollArea>
  );
}