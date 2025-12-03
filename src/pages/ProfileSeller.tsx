import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Store, Package, TrendingUp, Zap, ShoppingCart, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProfileSeller = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "João Vendedor",
    email: "vendedor@farmacia.com",
    phone: "+55 61 98765-4321",
    role: "seller",
    salesTarget: 50000,
    currentSales: 35600
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

  const salesPercentage = (profileData.currentSales / profileData.salesTarget) * 100;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Perfil do Vendedor</h1>
                <p className="text-gray-600">Gerencie suas informações e acompanhe suas vendas</p>
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
                  <form onSubmit={handleSubmit} className="space-y-4">                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        value="Vendedor"
                        disabled
                      />
                    </div>
                  </div>

                    {isEditing && (
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Salvar Alterações
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Sales Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Performance de Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Meta Mensal</span>
                      <span className="text-lg font-bold">R$ {profileData.salesTarget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Vendas Atuais</span>
                      <span className="text-lg font-bold text-green-600">R$ {profileData.currentSales.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(salesPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm text-gray-600">
                        {salesPercentage.toFixed(1)}% da meta alcançada
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Role & Status */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      VENDEDOR ATIVO
                    </Badge>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vendas este mês</span>
                        <Badge variant="outline" className="text-xs">
                          42 pedidos
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avaliação média</span>
                        <Badge variant="outline" className="text-xs">
                          4.8 ⭐
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status da conta</span>
                        <Badge variant="outline" className="text-xs text-green-600">
                          Verificada
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  <Button variant="outline" className="w-full" onClick={() => navigate('/seller-dashboard')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver Pedidos
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/my-products')}>
                    <Package className="mr-2 h-4 w-4" />
                    Gerenciar Estoque
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

export default ProfileSeller;