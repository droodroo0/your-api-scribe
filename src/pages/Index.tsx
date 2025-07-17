import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, Zap, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-chat">
            <Bot className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            ChatGPT Clone
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI conversations with a modern, responsive interface. 
            Built for seamless integration with your APIs and n8n workflows.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all group">
            <MessageSquare className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Conversation Management</h3>
            <p className="text-sm text-muted-foreground">
              Create, manage, and organize your chat conversations with an intuitive sidebar interface.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all group">
            <Zap className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">API Integration Ready</h3>
            <p className="text-sm text-muted-foreground">
              Easily connect to OpenAI, Claude, or your custom AI APIs. Perfect for n8n workflow integration.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all group">
            <Globe className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Modern Interface</h3>
            <p className="text-sm text-muted-foreground">
              Clean, responsive design inspired by ChatGPT with dark theme and smooth animations.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/chat")}
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-white px-8 py-3 text-lg font-medium shadow-chat"
          >
            Start Chatting
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 text-lg font-medium border-border hover:bg-card"
          >
            View Documentation
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-4 rounded-xl bg-card/50 border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Ready for backend integration:</strong> Connect to Supabase for authentication, 
            database storage, and edge functions. Perfect foundation for your AI-powered applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
