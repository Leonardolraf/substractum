import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  User,
  Shield,
  Database,
  Activity,
  Zap,
  ShoppingCart,
  Package,
  TrendingUp,
  HelpCircle,
  Plus,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  id: string | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
};

type SystemStats = {
  totalUsers: number;
  totalProducts: number;
  ordersToday: number;
};

const ProfileAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: null,
    name: "",
    email: "",
    phone: "",
    role: "admin",
    permissions: ["manage_users", "manage_products", "view_analytics", "system_settings"],
  });

  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalProducts: 0,
    ordersToday: 0,
  });

  const [loading, setLoading] = useState(true);

  const quickActions = [
    {
      title: "Gerenciar Estoque",
      description: "Controlar níveis de estoque",
      icon: Package,
      onClick: () => navigate("/my-products"),
    },
    {
      title: "Gerenciar Usuários",
      description: "Administrar contas de usuários",
      icon: Users,
      onClick: () => navigate("/admin"),
    },
    {
      title: "Configurações",
      description: "Ajustar configurações do sistema",
      icon: Settings,
      onClick: () => navigate("/profile-admin"),
    },
  ];


  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!profileData.id) {
        throw new Error("Usuário não encontrado.");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
        })
        .eq("id", profileData.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro ao atualizar perfil",
        description: err.message ?? "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Usuário logado
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) return;

        // Perfil + roles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            `
            id,
            full_name,
            username,
            email,
            phone,
            user_roles ( role )
          `
          )
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const roles = profile?.user_roles ?? [];
        const mainRole = roles[0]?.role ?? "admin";

        const resolvedRoleLabel =
          mainRole === "admin" ? "Administrador" : mainRole === "seller" ? "Vendedor" : "Usuário";

        const resolvedPermissions =
          mainRole === "admin"
            ? ["manage_users", "manage_products", "view_analytics", "system_settings"]
            : mainRole === "seller"
              ? ["manage_products", "view_analytics"]
              : ["view_analytics"];

        setProfileData({
          id: profile.id,
          name:
            profile.full_name ||
            profile.username ||
            user.email ||
            "Administrador Sistema",
          email: profile.email || user.email || "",
          phone: profile.phone || "",
          role: resolvedRoleLabel,
          permissions: resolvedPermissions,
        });

        // -------- Estatísticas do sistema --------

        // Total de usuários
        const { count: totalUsers, error: usersError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        if (usersError) throw usersError;

        // Total de produtos (ajuste o nome da tabela se for diferente)
        const { count: totalProducts, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        if (productsError) throw productsError;

        // Pedidos de hoje
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const { count: ordersToday, error: ordersError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .gte("created_at", startOfToday.toISOString());

        if (ordersError) throw ordersError;

        setStats({
          totalUsers: totalUsers ?? 0,
          totalProducts: totalProducts ?? 0,
          ordersToday: ordersToday ?? 0,
        });
      } catch (err) {
        console.error("Erro ao carregar dados do perfil admin:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
              {/* Informações pessoais */}
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
                      disabled={loading}
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
                          disabled={!isEditing || loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          disabled={!isEditing || loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!isEditing || loading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">Função</Label>
                        <Input id="role" value={profileData.role} disabled />
                      </div>
                    </div>

                    {isEditing && (
                      <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={loading}
                      >
                        Salvar Alterações
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Estatísticas do Sistema */}
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
                      <div className="text-2xl font-bold text-blue-600">
                        {stats.totalUsers}
                      </div>
                      <div className="text-sm text-gray-600">Usuários Ativos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.totalProducts}
                      </div>
                      <div className="text-sm text-gray-600">Produtos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.ordersToday}
                      </div>
                      <div className="text-sm text-gray-600">Pedidos Hoje</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              {/* Permissões */}
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
                      {profileData.role.toUpperCase()}
                    </Badge>
                    <Separator />
                    <div className="space-y-2">
                      {profileData.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm capitalize">
                            {permission.replace("_", " ")}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Card
                          key={index}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={action.onClick}
                        >
                          <CardHeader className="py-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-sm">
                                  {action.title}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pb-3">
                            <p className="text-xs text-muted-foreground">
                              {action.description}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
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
