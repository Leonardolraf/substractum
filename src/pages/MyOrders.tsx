
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Calendar, MapPin, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  payment_method: string | null;
  shipping_address: string | null;
  order_items: OrderItem[];
}

const MyOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            product_id,
            quantity,
            price,
            products (
              name
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar seus pedidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "processing": return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "cancelled": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "pending": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Entregue";
      case "shipped": return "Em Transporte";
      case "processing": return "Processando";
      case "cancelled": return "Cancelado";
      case "pending": return "Pendente";
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
              <Package className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3" />
              Meus Pedidos
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Acompanhe todos os seus pedidos</p>
          </div>

          {/* Filters */}
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar por número do pedido..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Em Transporte</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-3 md:space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
                      <div className="flex flex-wrap items-center text-xs md:text-sm text-muted-foreground mt-1 gap-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} border shrink-0`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-4">
                    {/* Products */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2 text-sm md:text-base flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Produtos ({order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'itens'})
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        {order.order_items?.slice(0, 3).map((item, index) => (
                          <li key={index} className="truncate">
                            • {item.products?.name} (x{item.quantity})
                          </li>
                        ))}
                        {(order.order_items?.length || 0) > 3 && (
                          <li className="text-primary font-medium">
                            + {(order.order_items?.length || 0) - 3} outro{(order.order_items?.length || 0) - 3 > 1 ? 's' : ''}
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    {/* Total */}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground text-sm md:text-base">Valor Total</span>
                        <p className="text-xl md:text-2xl font-bold text-primary">
                          R$ {Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Avaliar Pedido
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-8 md:py-12 px-4">
                <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base md:text-lg font-medium text-foreground mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Tente ajustar os filtros de busca"
                    : "Você ainda não fez nenhum pedido"
                  }
                </p>
                <Button onClick={() => navigate("/products")}>Começar a Comprar</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
