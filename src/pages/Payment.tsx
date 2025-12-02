import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Building, Check, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Payment = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    cpf: "",
    address: "",
    cep: ""
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para continuar com o pagamento.",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/payment' } });
    }
  }, [user, navigate, toast]);

  const cartData = location.state || {
    cartItems: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        price: 12.50,
        quantity: 2,
        supplier: "Farmácia Central"
      },
      {
        id: 2,
        name: "Ibuprofeno 400mg", 
        price: 18.90,
        quantity: 1,
        supplier: "Farmácia Popular"
      }
    ],
    subtotal: 31.40,
    shipping: 10.00,
    total: 41.40
  };

  const { cartItems, subtotal, shipping, total } = cartData;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    if (paymentMethod === "credit") {
      return formData.cardNumber && formData.cardName && formData.expiryDate && formData.cvv && formData.address && formData.cep;
    } else if (paymentMethod === "boleto") {
      return formData.cpf && formData.address && formData.cep;
    } else {
      return formData.address && formData.cep;
    }
  };

  const handlePayment = async () => {
    if (!isFormValid()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para finalizar o pedido.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar o pedido.",
        variant: "destructive"
      });
      navigate('/cart');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total,
          status: 'pending',
          shipping_address: formData.address,
          payment_method: paymentMethod === "credit" ? "Cartão de Crédito" : paymentMethod === "pix" ? "PIX" : "Boleto"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();

      toast({
        title: "Pedido confirmado!",
        description: "Seu pedido foi processado com sucesso.",
      });

      navigate(`/order-completed/${order.id}`);

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro ao processar pedido",
        description: error.message || "Ocorreu um erro ao criar seu pedido. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 mr-3" />
              Finalizar Compra
            </h1>
            <p className="text-gray-600 mt-2">Complete seu pagamento de forma segura</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center cursor-pointer">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center cursor-pointer">
                        <Smartphone className="w-4 h-4 mr-2" />
                        PIX
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex items-center cursor-pointer">
                        <Building className="w-4 h-4 mr-2" />
                        Boleto
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Form Based on Method */}
              {paymentMethod === "credit" && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Dados do Cartão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          placeholder="Nome como está no cartão"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Validade</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/AA"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="000"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === "pix" && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Pagamento via PIX</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <div className="w-32 h-32 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">QR Code PIX</p>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Escaneie o QR Code com seu app do banco ou copie o código PIX
                    </p>
                    <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono break-all">
                      00020101021126580014BR.GOV.BCB.PIX01364d4e7c8b-1234-5678-9abc-def123456789
                    </div>
                    <Button variant="outline" className="mt-4">
                      Copiar Código PIX
                    </Button>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === "boleto" && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Pagamento via Boleto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Atenção:</strong> O boleto tem vencimento de 3 dias úteis. 
                        Após o pagamento, pode levar até 2 dias úteis para confirmação.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF/CNPJ</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Cobrança</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, bairro"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => handleInputChange("cep", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.supplier}</p>
                          <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-green-600">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete:</span>
                      <span>R$ {shipping.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">R$ {total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handlePayment}
                    disabled={!isFormValid() || isProcessing}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processando..." : "Confirmar Pagamento"}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Pagamento seguro e protegido
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Compra 100% segura</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Seus dados estão protegidos com criptografia SSL
                  </p>
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

export default Payment;