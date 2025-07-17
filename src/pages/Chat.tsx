import { useState, useCallback } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message } from "@/components/chat/ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { generateId } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
  messageCount: number;
  messages: Message[];
}

export default function Chat() {
  const { toast } = useToast();
  
  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "React Development Help",
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 8,
      messages: [
        {
          id: "msg1",
          content: "How do I create a todo app in React?",
          role: "user",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: "msg2", 
          content: "I'll help you create a todo app in React! Let me break this down into steps:\n\n1. **Set up the basic structure**\n2. **Create state for todos**\n3. **Add functions to manage todos**\n4. **Build the UI components**\n\nWould you like me to start with a specific part?",
          role: "assistant",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
        }
      ]
    },
    {
      id: "2", 
      title: "API Integration Questions",
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 12,
      messages: []
    }
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>("1");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const handleNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "New Chat",
      updatedAt: new Date(),
      messageCount: 0,
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    
    if (activeConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setActiveConversationId(remaining.length > 0 ? remaining[0].id : null);
    }
    
    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed."
    });
  }, [activeConversationId, conversations, toast]);

  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, title: newTitle } : c)
    );
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) {
      handleNewConversation();
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: "user", 
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => 
      prev.map(c => 
        c.id === activeConversationId 
          ? { 
              ...c, 
              messages: [...c.messages, userMessage],
              messageCount: c.messageCount + 1,
              updatedAt: new Date(),
              title: c.messageCount === 0 ? content.slice(0, 50) + "..." : c.title
            }
          : c
      )
    );

    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        content: "This is a simulated response. To connect real AI, you'll need to integrate with an API service like OpenAI, Claude, or use n8n workflows as mentioned in your requirements.",
        role: "assistant",
        timestamp: new Date()
      };

      setConversations(prev => 
        prev.map(c => 
          c.id === activeConversationId
            ? { 
                ...c, 
                messages: [...c.messages, assistantMessage],
                messageCount: c.messageCount + 1,
                updatedAt: new Date()
              }
            : c
        )
      );
      
      setIsGenerating(false);
    }, 2000);
  }, [activeConversationId, handleNewConversation]);

  const handleStopGeneration = useCallback(() => {
    setIsGenerating(false);
  }, []);

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied."
    });
  }, [toast]);

  const handleRegenerateMessage = useCallback((messageId: string) => {
    // Find and regenerate the assistant message
    toast({
      title: "Regenerating response",
      description: "Creating a new response..."
    });
    // Implementation would regenerate the AI response
  }, [toast]);

  const handleFeedback = useCallback((messageId: string, type: "like" | "dislike") => {
    toast({
      title: `Feedback ${type === "like" ? "👍" : "👎"}`,
      description: "Thank you for your feedback!"
    });
  }, [toast]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-background">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
        
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            conversationTitle={activeConversation?.title || "ChatGPT"}
          />
          
          <ChatContainer
            messages={messages}
            isGenerating={isGenerating}
            onCopyMessage={handleCopyMessage}
            onRegenerateMessage={handleRegenerateMessage}
            onFeedback={handleFeedback}
            className="bg-chat-background"
          />
          
          <ChatInput
            onSendMessage={handleSendMessage}
            onStopGeneration={handleStopGeneration}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}