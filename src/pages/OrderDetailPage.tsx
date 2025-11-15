
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { Package, Calendar, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  
  // Mock order data - in real app, fetch based on orderId
  const order = {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 85.40,
    subtotal: 75.40,
    shipping: 10.00,
    supplier: {
      name: "Farmácia Central",
      phone: "(11) 99999-9999",
      email: "contato@farmaciacentral.com"
    },
    customer: {
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 88888-8888"
    },
    deliveryAddress: "Rua das Flores, 123 - Centro - São Paulo/SP - 01234-567",
    paymentMethod: "Cartão de Crédito (**** 1234)",
    trackingCode: "BR123456789",
    products: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        quantity: 2,
        unitPrice: 12.50,
        totalPrice: 25.00,
        image: "/placeholder.svg"
      },
      {
        id: 2,
        name: "Ibuprofeno 400mg",
        quantity: 1,
        unitPrice: 18.90,
        totalPrice: 18.90,
        image: "/placeholder.svg"
      },
      {
        id: 3,
        name: "Vitamina C 1000mg",
        quantity: 1,
        unitPrice: 31.50,
        totalPrice: 31.50,
        image: "/placeholder.svg"
      }
    ],
    timeline: [
      { status: "Pedido Realizado", date: "2024-01-15 14:30", completed: true },
      { status: "Pagamento Confirmado", date: "2024-01-15 14:35", completed: true },
      { status: "Preparando Pedido", date: "2024-01-15 16:00", completed: true },
      { status: "Saiu para Entrega", date: "2024-01-16 09:00", completed: true },
      { status: "Entregue", date: "2024-01-16 15:20", completed: true }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipping": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Entregue";
      case "shipping": return "Em Transporte";
      case "processing": return "Processando";
      case "cancelled": return "Cancelado";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3" />
            Detalhes do Pedido {order.id}
          </h1>
          <div className="flex items-center mt-2 text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date + 'T14:30').toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${step.completed ? 'text-green-800' : 'text-gray-600'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.trackingCode && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Código de Rastreamento</p>
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
                    <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">Quantidade: {product.quantity}</p>
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
                  <p className="text-sm text-gray-600">{order.supplier.phone}</p>
                  <p className="text-sm text-gray-600">{order.supplier.email}</p>
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

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Imprimir Pedido
                </Button>
                <Button variant="outline" className="w-full">
                  Solicitar Nota Fiscal
                </Button>
                {order.status === "delivered" && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Avaliar Pedido
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
