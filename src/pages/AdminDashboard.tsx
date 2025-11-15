
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

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription
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

  const fetchOrders = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as any[]) || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total de Clientes", value: "1,234", icon: Users, color: "bg-green-500", change: "+12%" },
    { title: "Total de Produtos", value: "5,678", icon: Package, color: "bg-green-600", change: "+5%" },
    { title: "Total de Pedidos", value: "2,890", icon: ShoppingCart, color: "bg-green-700", change: "+18%" },
    { title: "Receita Total", value: "R$ 145.320", icon: DollarSign, color: "bg-green-800", change: "+23%" },
  ];

  const mockUsers = [
    { id: 1, name: "João Silva", email: "joao@email.com", type: "Cliente", status: "Ativo", ultimoAcesso: "2024-01-15" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", type: "Cliente", status: "Inativo", ultimoAcesso: "2024-01-10" },
    { id: 3, name: "Carlos Lima", email: "carlos@email.com", type: "Cliente", status: "Ativo", ultimoAcesso: "2024-01-16" },
    { id: 4, name: "Ana Costa", email: "ana@email.com", type: "Vendedor", status: "Ativo", ultimoAcesso: "2024-01-16" },
    { id: 5, name: "Pedro Oliveira", email: "pedro@email.com", type: "Cliente", status: "Ativo", ultimoAcesso: "2024-01-14" },
  ];

  const recentOrders = [
    { id: "#001", cliente: "João Silva", produto: "Paracetamol 500mg", valor: "R$ 25,00", status: "Concluído" },
    { id: "#002", cliente: "Maria Santos", produto: "Ibuprofeno 400mg", valor: "R$ 35,00", status: "Preparando" },
    { id: "#003", cliente: "Carlos Lima", produto: "Dipirona 500mg", valor: "R$ 18,00", status: "Entregue" },
    { id: "#004", cliente: "Ana Costa", produto: "Amoxicilina 875mg", valor: "R$ 42,00", status: "Preparando" },
  ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`${stat.color} p-2 rounded-full`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change} vs mês anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Analgésicos</span>
                      <span className="font-bold">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Antibióticos</span>
                      <span className="font-bold">30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Vitaminas</span>
                      <span className="font-bold">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Novo pedido de João Silva</span>
                      <span className="text-xs text-gray-500 ml-auto">há 5 min</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">Produto entregue para Maria Santos</span>
                      <span className="text-xs text-gray-500 ml-auto">há 1 hora</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">Estoque baixo: Dipirona 500mg</span>
                      <span className="text-xs text-gray-500 ml-auto">há 2 horas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.type === "Vendedor" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>
                          {user.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{user.ultimoAcesso}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.cliente}</TableCell>
                      <TableCell>{order.produto}</TableCell>
                      <TableCell className="font-bold text-green-600">{order.valor}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Concluído" || order.status === "Entregue" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            Ver Detalhes
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
