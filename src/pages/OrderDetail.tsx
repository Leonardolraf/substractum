import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ShoppingBag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  total: number;
  payment_method: string | null;
  shipping_address: string | null;
  order_items: OrderItem[];
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrderDetails();
  }, [user, orderId, navigate]);

  const fetchOrderDetails = async () => {
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
              name,
              image_url
            )
          )
        `)
        .eq("id", orderId)
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Erro ao carregar pedido",
        description: "Não foi possível carregar os detalhes do pedido.",
        variant: "destructive",
      });
      navigate("/my-orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Pedido cancelado",
        description: "Seu pedido foi cancelado com sucesso.",
      });

      setOrder({ ...order, status: "cancelled" });
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Erro ao cancelar pedido",
        description: "Não foi possível cancelar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle2 className="w-5 h-5" />;
      case "shipped": return <Truck className="w-5 h-5" />;
      case "processing": return <Clock className="w-5 h-5" />;
      case "cancelled": return <XCircle className="w-5 h-5" />;
      case "pending": return <Clock className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusTimeline = () => {
    const statuses = [
      { key: "pending", label: "Pendente", icon: Clock },
      { key: "processing", label: "Processando", icon: Package },
      { key: "shipped", label: "Em Transporte", icon: Truck },
      { key: "delivered", label: "Entregue", icon: CheckCircle2 },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(order?.status || "pending");
    
    if (order?.status === "cancelled") {
      return null;
    }

    return (
      <div className="flex justify-between items-center relative mt-6">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        />
        
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isCompleted = index <= currentIndex;
          
          return (
            <div key={status.key} className="flex flex-col items-center z-10 bg-background px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-background border-border text-muted-foreground"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-2 text-center ${
                isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
              }`}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Pedido não encontrado</h3>
              <Button onClick={() => navigate("/my-orders")} className="mt-4">
                Voltar para Meus Pedidos
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/my-orders")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  Pedido #{order.id.slice(0, 8)}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <Badge className={`${getStatusColor(order.status)} border text-sm px-4 py-1.5`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>

          {/* Status Timeline */}
          {order.status !== "cancelled" && (
            <Card className="mb-6">
              <CardContent className="pt-6 pb-8 px-4 md:px-6">
                {getStatusTimeline()}
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Itens do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {item.products?.image_url ? (
                            <img 
                              src={item.products.image_url} 
                              alt={item.products.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.products?.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">R$ {Number(item.price).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            R$ {(Number(item.price) / item.quantity).toFixed(2)} cada
                          </p>
                        </div>
                      </div>
                      {index < order.order_items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {Number(order.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">R$ {Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-5 h-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">
                    {order.shipping_address || "Endereço não informado"}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="w-5 h-5" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">
                    {order.payment_method || "Não informado"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-5 h-5" />
                  Informações do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número do Pedido:</span>
                    <span className="text-foreground font-mono">#{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data do Pedido:</span>
                    <span className="text-foreground">
                      {new Date(order.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última Atualização:</span>
                    <span className="text-foreground">
                      {new Date(order.updated_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {(order.status === "pending" || order.status === "processing") && (
              <Card className="border-destructive/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Cancelar Pedido</h4>
                      <p className="text-sm text-muted-foreground">
                        Você pode cancelar este pedido enquanto ele está sendo processado.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowCancelDialog(true)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar Pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
              Você precisará fazer um novo pedido se mudar de ideia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {cancelling ? "Cancelando..." : "Sim, Cancelar Pedido"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderDetail;
