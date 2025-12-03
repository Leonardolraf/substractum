import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

type OrderStatus = "delivered" | "shipping" | "processing" | "cancelled" | string;

type TimelineStep = {
  status: string;
  date: string;
  completed: boolean;
};

type ProductItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
};

type OrderDetail = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  supplier: {
    name: string;
    phone?: string | null;
    email?: string | null;
  };
  customer: {
    name: string;
    email?: string | null;
    phone?: string | null;
  };
  deliveryAddress: string;
  paymentMethod: string;
  trackingCode?: string | null;
  products: ProductItem[];
  timeline: TimelineStep[];
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipping":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "Entregue";
    case "shipping":
      return "Em Transporte";
    case "processing":
      return "Processando";
    case "cancelled":
      return "Cancelado";
    default:
      return "Desconhecido";
  }
};

// Gera uma timeline fake com base na data + status
const buildTimeline = (order: { status: OrderStatus; date: string }): TimelineStep[] => {
  const baseDate = new Date(order.date);

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const created = fmt(baseDate);
  const step2 = fmt(new Date(baseDate.getTime() + 5 * 60 * 1000)); // +5min
  const step3 = fmt(new Date(baseDate.getTime() + 2 * 60 * 60 * 1000)); // +2h
  const step4 = fmt(new Date(baseDate.getTime() + 24 * 60 * 60 * 1000)); // +1 dia
  const step5 = fmt(new Date(baseDate.getTime() + 30 * 60 * 60 * 1000)); // +1d6h

  const statusOrder = ["processing", "shipping", "delivered"];

  const isCompleted = (stepStatus: OrderStatus) => {
    if (order.status === "cancelled") return false;
    const currentIndex = statusOrder.indexOf(order.status as any);
    const stepIndex = statusOrder.indexOf(stepStatus as any);
    return stepIndex <= currentIndex;
  };

  return [
    { status: "Pedido Realizado", date: created, completed: true },
    { status: "Pagamento Confirmado", date: step2, completed: isCompleted("processing") },
    { status: "Preparando Pedido", date: step3, completed: isCompleted("processing") },
    { status: "Saiu para Entrega", date: step4, completed: isCompleted("shipping") },
    { status: "Entregue", date: step5, completed: order.status === "delivered" },
  ];
};

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
          id,
          total,
          status,
          payment_method,
          shipping_address,
          created_at,
          order_items (
            id,
            quantity,
            price,
            product:products (
              id,
              name,
              image_url
      )
    )
  `
          )
          .eq("id", orderId)
          .single();


        if (error) {
          console.error("Erro ao buscar pedido:", error);
          throw error;
        }

        if (!data) {
          setOrder(null);
          return;
        }

        const items = (data as any).order_items ?? [];

        let subtotal = 0;
        const products: ProductItem[] = items.map((item: any) => {
          const unitPrice = Number(item.price ?? 0);
          const quantity = Number(item.quantity ?? 0);
          const totalPrice = unitPrice * quantity;
          subtotal += totalPrice;

          const productName = item.product?.name ?? `Produto ${item.product?.id?.slice(0, 8) ?? ""}`;
          const productImage = item.product?.image_url ?? "/placeholder.svg"; // 🔧 ajuste o campo se o nome for outro

          return {
            id: item.id,
            name: productName,
            quantity,
            unitPrice,
            totalPrice,
            image: productImage,
          };
        });


        let shipping = Number(data.total ?? 0) - subtotal;
        if (!Number.isFinite(shipping) || shipping < 0) shipping = 0;

        const mappedOrder: OrderDetail = {
          id: data.id,
          date: data.created_at ?? new Date().toISOString(),
          status: (data.status as OrderStatus) ?? "processing",
          total: Number(data.total ?? 0),
          subtotal,
          shipping,
          supplier: {
            // 👉 placeholders – depois você pode trocar por join com tabela de farmácias
            name: "Farmácia",
            phone: null,
            email: null,
          },
          customer: {
            // 👉 idem, dá pra integrar com profiles/users
            name: "Cliente",
            email: null,
            phone: null,
          },
          deliveryAddress: data.shipping_address ?? "Endereço não informado",
          paymentMethod: data.payment_method ?? "Não informado",
          trackingCode: null,
          products,
          timeline: buildTimeline({
            status: (data.status as OrderStatus) ?? "processing",
            date: data.created_at ?? new Date().toISOString(),
          }),
        };

        setOrder(mappedOrder);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar o pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <p>ID do pedido não informado.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <p>Carregando pedido...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <p>Pedido não encontrado.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3" />
              Detalhes do Pedido {order.id}
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(order.date).toLocaleDateString("pt-BR")} às{" "}
              {new Date(order.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              <Badge className={`ml-4 ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Status do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p
                            className={`font-medium ${step.completed ? "text-green-800" : "text-gray-600"
                              }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.trackingCode && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Código de Rastreamento
                      </p>
                      <p className="text-blue-700 font-mono">{order.trackingCode}</p>
                      <Button size="sm" className="mt-2">
                        Rastrear no Site dos Correios
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            Quantidade: {product.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            R$ {product.unitPrice.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            R$ {product.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>R$ {order.shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      Pago via: {order.paymentMethod}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Fornecedor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{order.supplier.name}</p>
                    {order.supplier.phone && (
                      <p className="text-sm text-gray-600">{order.supplier.phone}</p>
                    )}
                    {order.supplier.email && (
                      <p className="text-sm text-gray-600">{order.supplier.email}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Entrar em Contato
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
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

export default OrderDetailPage;