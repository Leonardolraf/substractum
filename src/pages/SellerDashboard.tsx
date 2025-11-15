import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Users, Truck, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SellerDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ============================================================
     FETCH ORDERS + JOIN WITH ITEMS
  ============================================================ */
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("seller-orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Order change received:", payload);

          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
            toast({
              title: "Novo pedido!",
              description: `Pedido #${payload.new.id.slice(0, 8)} foi atribuído.`,
            });
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ============================================================
     FETCH ORDERS WITH JOIN (REAL ITEMS)
  ============================================================ */
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(
            id,
            product_id,
            quantity,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setOrders(data ?? []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     FILTER ORDERS
  ============================================================ */
  const filteredOrders = (orders ?? []).filter((order) => {
    const name = order.customer_name ?? "";
    const address = order.shipping_address ?? "";
    const id = order.id ?? "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  /* ============================================================
     STATUS HELPERS
  ============================================================ */
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      shipped: "bg-green-100 text-green-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  /* ============================================================
     UPDATE STATUS
  ============================================================ */
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      toast({
        title: "Status atualizado",
        description: `Pedido ${orderId} atualizado para ${newStatus}`,
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">

          {/* ============================================================
             TÍTULO
          ============================================================ */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="w-8 h-8 mr-3" />
              Dashboard do Vendedor
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie pedidos, clientes e entregas
            </p>
          </div>

          {/* ============================================================
             CARDS DE ESTATÍSTICAS
          ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Pendentes */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {(orders ?? []).filter((o) => o.status === "pending").length}
                </p>
              </CardContent>
            </Card>

            {/* Em preparação */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Em Preparação</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(orders ?? []).filter((o) =>
                    ["confirmed", "preparing"].includes(o.status)
                  ).length}
                </p>
              </CardContent>
            </Card>

            {/* Enviados */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-3xl font-bold text-green-600">
                  {(orders ?? []).filter((o) => o.status === "shipped").length}
                </p>
              </CardContent>
            </Card>

            {/* Receita */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Receita do Mês</p>
                <p className="text-3xl font-bold text-emerald-600">
                  R${" "}
                  {Number(
                    (orders ?? []).reduce(
                      (sum, o) => sum + Number(o.total ?? o.total_amount ?? 0),
                      0
                    )
                  ).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ============================================================
             TABS
          ============================================================ */}
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="customers">Clientes</TabsTrigger>
              <TabsTrigger value="delivery">Entregas</TabsTrigger>
            </TabsList>

            {/* ============================================================
               ABA DE PEDIDOS
            ============================================================ */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Gerenciar Pedidos</CardTitle>
                  </div>

                  {/* FILTROS */}
                  <div className="flex gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por cliente, endereço ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="preparing">Preparando</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {(filteredOrders ?? []).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              Cliente: {order.customer_name ?? "Desconhecido"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Data:{" "}
                              {new Date(order.created_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>

                            <p className="font-bold text-lg mt-1">
                              R$
                              {Number(order.total ?? order.total_amount ?? 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* ITENS DO PEDIDO */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Itens:</h4>

                          {(order.items ?? []).map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.product_id} — Qtd: {item.quantity} — R${" "}
                              {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </div>
                          ))}
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Endereço:</strong>{" "}
                            {order.shipping_address ?? "Não informado"}
                          </p>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateOrderStatus(order.id, "confirmed")
                              }
                            >
                              Confirmar
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateOrderStatus(order.id, "preparing")
                              }
                            >
                              Preparar
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateOrderStatus(order.id, "shipped")
                              }
                            >
                              Enviar
                            </Button>
                          )}
                          {order.status === "shipped" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                updateOrderStatus(order.id, "delivered")
                              }
                            >
                              Marcar como Entregue
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateOrderStatus(order.id, "cancelled")
                            }
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============================================================
               TAB CLIENTES (placeholder)
            ============================================================ */}
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Funcionalidade de clientes em desenvolvimento.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ============================================================
               TAB ENTREGAS
            ============================================================ */}
            <TabsContent value="delivery">
              <Card>
                <CardHeader>
                  <CardTitle>Acompanhar Entregas</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {(orders ?? [])
                      .filter((order) =>
                        ["shipped", "delivered"].includes(order.status)
                      )
                      .map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                Pedido #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.customer_name ?? "Desconhecido"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.shipping_address ?? ""}
                              </p>
                            </div>

                            <Badge className={getStatusColor(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SellerDashboard;
