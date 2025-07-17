import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Eye, EyeOff, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiConnection {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  apiKey: string;
  isActive: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>([
    {
      id: "1",
      name: "OpenAI GPT-4",
      type: "AI/ML",
      endpoint: "https://api.openai.com/v1",
      apiKey: "sk-proj-...",
      isActive: true
    },
    {
      id: "2", 
      name: "n8n Webhook",
      type: "Automation",
      endpoint: "https://your-n8n.app/webhook/...",
      apiKey: "",
      isActive: false
    }
  ]);

  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "",
    endpoint: "",
    apiKey: ""
  });

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddConnection = () => {
    if (!newConnection.name || !newConnection.endpoint) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au minimum le nom et l'endpoint",
        variant: "destructive"
      });
      return;
    }

    const newApi: ApiConnection = {
      id: Date.now().toString(),
      ...newConnection,
      isActive: false
    };

    setApiConnections(prev => [...prev, newApi]);
    setNewConnection({ name: "", type: "", endpoint: "", apiKey: "" });
    
    toast({
      title: "API ajoutée",
      description: `${newConnection.name} a été ajoutée avec succès`
    });
  };

  const handleDeleteConnection = (id: string) => {
    setApiConnections(prev => prev.filter(api => api.id !== id));
    toast({
      title: "API supprimée",
      description: "La connexion API a été supprimée"
    });
  };

  const handleToggleActive = (id: string) => {
    setApiConnections(prev => 
      prev.map(api => 
        api.id === id ? { ...api, isActive: !api.isActive } : api
      )
    );
  };

  const handleTestConnection = async (api: ApiConnection) => {
    toast({
      title: "Test en cours...",
      description: `Test de connexion à ${api.name}`
    });
    
    // Simulation d'un test
    setTimeout(() => {
      toast({
        title: "Test réussi",
        description: `Connexion à ${api.name} fonctionnelle`
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configuration</h1>
          <p className="text-muted-foreground">Gérez vos connexions API et intégrations</p>
        </div>

        <Tabs defaultValue="apis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
            <TabsTrigger value="general">Général</TabsTrigger>
          </TabsList>

          <TabsContent value="apis" className="space-y-6">
            {/* Add New API */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Ajouter une nouvelle API</CardTitle>
                <CardDescription>
                  Connectez facilement vos services externes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nom</Label>
                    <Input
                      id="name"
                      placeholder="Ex: OpenAI GPT-4"
                      value={newConnection.name}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-background border-border text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-white">Type</Label>
                    <Input
                      id="type"
                      placeholder="Ex: AI/ML, Database, Webhook"
                      value={newConnection.type}
                      onChange={(e) => setNewConnection(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-background border-border text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="endpoint" className="text-white">Endpoint URL</Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.exemple.com/v1"
                    value={newConnection.endpoint}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, endpoint: e.target.value }))}
                    className="bg-background border-border text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="apiKey" className="text-white">Clé API (optionnel)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Votre clé API"
                    value={newConnection.apiKey}
                    onChange={(e) => setNewConnection(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="bg-background border-border text-white"
                  />
                </div>
                
                <Button onClick={handleAddConnection} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter la connexion API
                </Button>
              </CardContent>
            </Card>

            {/* Existing APIs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Connexions existantes</h3>
              
              {apiConnections.map((api) => (
                <Card key={api.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{api.name}</h4>
                          <Badge variant={api.isActive ? "default" : "secondary"}>
                            {api.isActive ? "Actif" : "Inactif"}
                          </Badge>
                          {api.type && (
                            <Badge variant="outline" className="text-xs">
                              {api.type}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{api.endpoint}</p>
                        
                        {api.apiKey && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Clé API: {showApiKey[api.id] ? api.apiKey : "••••••••••••"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleApiKeyVisibility(api.id)}
                            >
                              {showApiKey[api.id] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestConnection(api)}
                        >
                          <TestTube className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                        
                        <Button
                          variant={api.isActive ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleToggleActive(api.id)}
                        >
                          {api.isActive ? "Désactiver" : "Activer"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteConnection(api.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Intégrations disponibles</CardTitle>
                <CardDescription>
                  Connectez vos outils favoris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "n8n", description: "Automatisation des workflows", icon: "🔄" },
                    { name: "Zapier", description: "Intégration d'applications", icon: "⚡" },
                    { name: "Supabase", description: "Base de données et auth", icon: "🗄️" },
                    { name: "Stripe", description: "Paiements en ligne", icon: "💳" }
                  ].map((integration) => (
                    <Card key={integration.name} className="bg-background border-border p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Configurer
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-white">Paramètres généraux</CardTitle>
                <CardDescription>
                  Configuration de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-white">Thème</Label>
                  <p className="text-sm text-muted-foreground">Sombre (par défaut)</p>
                </div>
                
                <div>
                  <Label htmlFor="language" className="text-white">Langue</Label>
                  <p className="text-sm text-muted-foreground">Français</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
