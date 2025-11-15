
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, MapPin, CreditCard } from "lucide-react";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const [orderData, setOrderData] = useState({
    products: [],
    deliveryAddress: '',
    paymentMethod: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pedido criado com sucesso!",
      description: "Seu pedido foi enviado para processamento",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3" />
            Criar Novo Pedido
          </h1>
          <p className="text-gray-600 mt-2">Preencha os dados para criar um novo pedido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Informações do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações adicionais sobre o pedido..."
                    value={orderData.notes}
                    onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Textarea
                    id="address"
                    placeholder="Rua, número, bairro, cidade, CEP..."
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                <Select value={orderData.paymentMethod} onValueChange={(value) => setOrderData({...orderData, paymentMethod: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit-card">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cash">Dinheiro na Entrega</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Criar Pedido
            </Button>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
