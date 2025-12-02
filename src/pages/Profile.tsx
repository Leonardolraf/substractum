import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, ShoppingCart, Package, Heart, HelpCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    phone: "",
    avatar_url: ""
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: "2024"
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      navigate('/profile-admin');
      return;
    }
    if (user.role === 'seller') {
      navigate('/profile-seller');
      return;
    }

    loadProfileData();
    loadUserStats();
  }, [user, navigate]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          username: data.username || "",
          phone: data.phone || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data: orders, error } = await (supabase as any)
        .from('orders')
        .select('total, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      if (orders) {
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
        const oldestOrder = orders.reduce((oldest: any, order: any) => {
          return !oldest || new Date(order.created_at) < new Date(oldest)
            ? order.created_at
            : oldest;
        }, null as string | null);

        setStats({
          totalOrders,
          totalSpent,
          memberSince: oldestOrder
            ? new Date(oldestOrder).getFullYear().toString()
            : new Date().getFullYear().toString()
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          username: profileData.username,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || user.role !== 'user') {
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-gray-600">Gerencie suas informações e preferências</p>
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
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.username || ""}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Tipo de Conta</Label>
                      <Input
                        id="role"
                        value="Cliente"
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                    {isEditing && (
                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Account Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Atividade da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Total de Pedidos</p>
                        <p className="text-sm text-gray-600">Todos os pedidos</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {stats.totalOrders}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Valor Total</p>
                        <p className="text-sm text-gray-600">Em compras realizadas</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        R$ {stats.totalSpent.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tipo</span>
                      <Badge className="bg-green-600">Cliente</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Membro desde</span>
                      <span className="text-sm font-medium">{stats.memberSince}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/my-orders')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Meus Pedidos
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/products')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ver Produtos
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrinho
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/help-center')}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
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

export default Profile;
