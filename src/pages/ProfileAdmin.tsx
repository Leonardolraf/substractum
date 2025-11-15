import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Shield, Database, Activity, Zap, ShoppingCart, Package, TrendingUp, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProfileAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Administrador Sistema",
    email: "admin@farmacia.com",
    phone: "+55 61 98347-2867",
    role: "admin",
    permissions: ["manage_users", "manage_products", "view_analytics", "system_settings"]
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso."
    });
    setIsEditing(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Perfil do Administrador</h1>
                <p className="text-gray-600">Gerencie suas informações e configurações do sistema</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Personal Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informações Pessoais
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">Função</Label>
                        <Input
                          id="role"
                          value="Administrador"
                          disabled
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">
                        Salvar Alterações
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* System Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Estatísticas do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-gray-600">Usuários Ativos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">24</div>
                      <div className="text-sm text-gray-600">Produtos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">89</div>
                      <div className="text-sm text-gray-600">Pedidos Hoje</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Role & Permissions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Permissões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="destructive" className="w-full justify-center py-2">
                      ADMINISTRADOR
                    </Badge>
                    <Separator />
                    <div className="space-y-2">
                      {profileData.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Ativo
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/quick-actions')}>
                    <Zap className="mr-2 h-4 w-4" />
                    Ações Rápidas
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/admin-dashboard')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver Pedidos
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/my-products')}>
                    <Package className="mr-2 h-4 w-4" />
                    Meus Produtos
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/sales-report')}>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Relatório de Vendas
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/help-center')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Central de Ajuda
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileAdmin;