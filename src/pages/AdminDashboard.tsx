import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, ShoppingCart, Search, Edit, Trash2, TrendingUp, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { fetchDashboardUsers, DashboardUser } from "@/services/userService";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "orders">("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [stats, setStats] = useState([
    { title: "Total de Clientes", value: "0", icon: Users, color: "bg-green-500", change: "" },
    { title: "Total de Produtos", value: "0", icon: Package, color: "bg-green-600", change: "" },
    { title: "Total de Pedidos", value: "0", icon: ShoppingCart, color: "bg-green-700", change: "" },
    { title: "Receita Total", value: "R$ 0,00", icon: DollarSign, color: "bg-green-800", change: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchUsers();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change received:', payload);
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
            toast({
              title: "Novo pedido!",
              description: `Pedido #${payload.new.id.slice(0, 8)} foi criado.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order =>
              order.id === payload.new.id ? payload.new : order
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const navigate = useNavigate();

  const handleEditUser = async (user: any) => {
    const currentRole =
      user.type === "Admin"
        ? "admin"
        : user.type === "Vendedor"
          ? "seller"
          : "user";

    const newRole = window.prompt(
      "Informe o novo tipo de usuário (admin, seller, user):",
      currentRole
    );

    if (!newRole) return;

    const normalizedRole = newRole.toLowerCase().trim();

    if (!["admin", "seller", "user"].includes(normalizedRole)) {
      toast({
        title: "Tipo inválido",
        description: "Use apenas: admin, seller ou user.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await (supabase as any)
      .from("user_roles")
      .update({ role: normalizedRole })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Usuário atualizado",
      description: "O tipo de usuário foi atualizado com sucesso.",
    });

    // Recarrega a lista
    fetchUsers();
  };

  /**
   * Remover papel do usuário (linha da tabela user_roles)
   */
  const handleDeleteUser = async (user: any) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja remover o papel desse usuário?\n\n${user.name} (${user.email})`
    );

    if (!confirmDelete) return;

    const { error } = await (supabase as any)
      .from("user_roles")
      .delete()
      .eq("id", user.id);

    if (error) {
      console.error(error);
      toast({
        title: "Erro ao remover usuário",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Usuário removido",
      description: "O usuário foi removido da lista de papéis.",
    });

    fetchUsers();
  };

  const handleEditOrder = async (order: any) => {
    const newStatus = window.prompt(
      'Informe o novo status do pedido (ex: pending, confirmed, canceled, completed):',
      order.status
    );

    if (!newStatus) return;

    const normalizedStatus = newStatus.toLowerCase().trim();

    const { error } = await (supabase as any)
      .from("orders")
      .update({ status: normalizedStatus })
      .eq("id", order.id);

    if (error) {
      console.error(error);
      toast({
        title: "Erro ao atualizar pedido",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pedido atualizado",
      description: "O status do pedido foi atualizado.",
    });

    fetchOrders();
  };

  const handleViewOrderDetails = (order: any) => {
    navigate(`/admin/orders/${order.id}`);
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("orders")
        .select("id, total, status, created_at, user_id, profiles(full_name, username)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as any[]) || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [customersResp, productsResp] = await Promise.all([
        (supabase as any)
          .from("user_roles")
          .select("id", { count: "exact", head: true })
          .eq("role", "user"),       // role "user" = clientes
        (supabase as any)
          .from("products")
          .select("id", { count: "exact", head: true }),
      ]);

      setStats((prev) =>
        prev.map((stat) => {
          if (stat.title === "Total de Clientes") {
            return { ...stat, value: String(customersResp.count ?? 0) };
          }
          if (stat.title === "Total de Produtos") {
            return { ...stat, value: String(productsResp.count ?? 0) };
          }
          return stat;
        })
      );
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  useEffect(() => {
    if (!orders.length) return;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + (order.total || 0),
      0
    );

    setStats((prev) =>
      prev.map((stat) => {
        if (stat.title === "Total de Pedidos") {
          return { ...stat, value: String(totalOrders) };
        }
        if (stat.title === "Receita Total") {
          return {
            ...stat,
            value: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalRevenue),
          };
        }
        return stat;
      })
    );
  }, [orders]);

  const fetchUsers = async () => {
    try {
      const allUsers = await fetchDashboardUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-2">Gerencie usuários e monitore o sistema</p>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === "overview" ? "default" : "outline"}
              onClick={() => setActiveTab("overview")}
              className={activeTab === "overview" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Visão Geral
            </Button>
            <Button
              variant={activeTab === "users" ? "default" : "outline"}
              onClick={() => setActiveTab("users")}
              className={activeTab === "users" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Gerenciar Usuários
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "outline"}
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Pedidos Recentes
            </Button>
          </div>

          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.title}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        {stat.change && (
                          <p className="text-xs text-muted-foreground">
                            {stat.change} em relação ao último período
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>Visualize e gerencie todos os usuários do sistema</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${user.type === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.type === "Vendedor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {user.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${user.status === "Ativo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.ultimoAcesso}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Acompanhe os últimos pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order: any) => {
                      const cliente =
                        order.profiles?.full_name ||
                        order.profiles?.username ||
                        "Cliente sem nome";

                      const dataFormatada = new Date(order.created_at).toLocaleDateString("pt-BR");

                      const valorFormatado = new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.total || 0);

                      const statusClass =
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "canceled"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800";

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>{cliente}</TableCell>
                          <TableCell>{dataFormatada}</TableCell>
                          <TableCell className="font-bold text-green-600">
                            {valorFormatado}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                Ver Detalhes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
