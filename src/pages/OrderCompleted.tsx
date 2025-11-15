import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, MapPin, CreditCard, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  id: string;
  created_at: string;
  total: number;
  status: string;
  shipping_address: string | null;
  payment_method: string | null;
  items: OrderItem[];
}

const OrderCompleted = () => {
  const { orderId } = useParams(); // <- AGORA FUNCIONA SEM ESTADO
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        toast({
          title: "Pedido não encontrado",
          description: "Redirecionando...",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      try {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;

        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            id,
            quantity,
            price,
            products (
              id,
              name
            )
          `)
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        const formattedOrder: OrderData = {
          id: order.id,
          created_at: order.created_at,
          total: order.total,
          status: order.status,
          shipping_address: order.shipping_address,
          payment_method: order.payment_method,
          items: items.map((item: any) => ({
            id: item.id,
            name: item.products.name,
            quantity: item.quantity,
            price: item.price
          }))
        };

        setOrderData(formattedOrder);
      } catch (error: any) {
        console.error('Error fetching order:', error);
        toast({
          title: "Erro ao carregar pedido",
          description: "Não foi possível carregar os detalhes.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, navigate, toast]);

  if (loading) {
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

  if (!orderData) return null;

  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('pt-BR');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Pedido Confirmado!</h1>
            <p className="text-gray-600">Seu pedido foi processado com sucesso.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Informações */}
            <div className="lg:col-span-2">

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" /> Informações do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <h4 className="font-medium">Número do Pedido</h4>
                      <p className="font-mono text-sm">{orderData.id}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Data do Pedido</h4>
                      <p>{new Date(orderData.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Status</h4>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {orderData.status === 'pending' ? 'Pendente' : 'Processando'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium">Previsão de Entrega</h4>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {estimatedDelivery}
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {orderData.items.map(item => (
                    <div key={item.id} className="flex justify-between py-3 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qtd: {item.quantity} × R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-green-600">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{orderData.shipping_address || "Não informado"}</p>
                </CardContent>
              </Card>

            </div>

            {/* Resumo */}
            <div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {(orderData.total - 10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ 10.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        R$ {orderData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="capitalize">{orderData.payment_method}</p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button onClick={() => navigate('/my-orders')} className="w-full">
                  Ver Meus Pedidos
                </Button>
                <Button variant="outline" onClick={() => navigate('/products')} className="w-full">
                  Continuar Comprando
                </Button>
                <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </div>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderCompleted;
