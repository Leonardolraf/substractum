import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Adicionar Produto",
      description: "Cadastrar novo produto no sistema",
      icon: Plus,
      onClick: () => navigate("/products")
    },
    {
      title: "Gerenciar Estoque",
      description: "Controlar níveis de estoque",
      icon: Package,
      onClick: () => navigate("/products")
    },
    {
      title: "Gerenciar Usuários",
      description: "Administrar contas de usuários",
      icon: Users,
      onClick: () => navigate("/admin-dashboard")
    },
    {
      title: "Configurações",
      description: "Ajustar configurações do sistema",
      icon: Settings,
      onClick: () => navigate("/profile-admin")
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Ações Rápidas</h1>
            <p className="text-muted-foreground mt-2">Acesso rápido às principais funcionalidades do sistema</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.onClick}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuickActions;