import { useState } from "react";
import { MessageSquare, Plus, Trash2, Edit3, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar 
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation
}: ChatSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditTitle("");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Now";
  };

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Button 
            onClick={onNewConversation}
            className="w-full justify-start gap-3 bg-gradient-primary hover:opacity-90 transition-all"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
        {collapsed && (
          <Button 
            onClick={onNewConversation}
            size="icon"
            className="mx-auto bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <ScrollArea className="flex-1">
              <SidebarMenu className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <div className={`
                      group relative flex items-center w-full p-2 rounded-lg transition-all duration-200
                      ${activeConversationId === conversation.id 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-message-hover"
                      }
                    `}>
                      <SidebarMenuButton 
                        asChild
                        className="flex-1 justify-start p-0 h-auto"
                      >
                        <button
                          onClick={() => onSelectConversation(conversation.id)}
                          className="flex items-center gap-3 w-full text-left"
                        >
                          <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              {editingId === conversation.id ? (
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  onBlur={handleSaveRename}
                                  onKeyDown={handleKeyPress}
                                  className="w-full bg-transparent border-none outline-none text-sm font-medium"
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <div className="font-medium text-sm truncate">
                                    {conversation.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {conversation.messageCount} messages • {formatTimeAgo(conversation.updatedAt)}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </button>
                      </SidebarMenuButton>

                      {!collapsed && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleRename(conversation)}>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteConversation(conversation.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}