
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingBag, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Cart = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCart();
  const [prescription, setPrescription] = useState<File | null>(null);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }
      setPrescription(file);
      toast({
        title: "Receita anexada",
        description: `${file.name} foi anexada com sucesso`,
      });
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    navigate('/payment', {
      state: {
        cartItems: items,
        subtotal: total,
        shipping: 10,
        total: total + 10,
        prescription: prescription?.name
      }
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingBag className="w-8 h-8 mr-3" />
              Meu Carrinho
            </h1>
            <p className="text-gray-600 mt-2">Revise seus itens antes de finalizar a compra</p>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Seu carrinho está vazio</h3>
                <p className="text-gray-600 mb-4">Adicione alguns produtos para começar suas compras</p>
                <Button onClick={handleContinueShopping}>
                  Continuar Comprando
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Itens no Carrinho ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 p-4 border rounded-lg sm:flex-row sm:items-center sm:gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />

                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.supplier}</p>
                          <p className="text-lg font-bold text-blue-600">
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* CONTROLES (botões + input) */}
                        <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-2">
                          {/* Quantidade */}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>

                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value) || 1)
                              }
                              className="h-8 w-12 px-1 py-1 text-xs text-center sm:h-9 sm:w-16 sm:text-sm"
                              min={1}
                            />

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Botão de remover */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              removeFromCart(item.id);
                              toast({
                                title: "Item removido",
                                description: "O item foi removido do seu carrinho",
                              });
                            }}
                            className="h-7 w-7 text-red-600 hover:text-red-700 sm:h-8 sm:w-8"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span>R$ 10,00</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>R$ {(total + 10).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <Label htmlFor="prescription" className="text-sm font-medium mb-2 block">
                        Receita Médica (Opcional)
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="prescription"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handlePrescriptionUpload}
                          className="hidden"
                        />
                        <Label
                          htmlFor="prescription"
                          className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors w-full justify-center"
                        >
                          <Upload className="w-4 h-4" />
                          {prescription ? prescription.name : "Anexar Receita"}
                        </Label>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
                      </p>
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleCheckout}
                    >
                      Finalizar Compra
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleContinueShopping}
                    >
                      Continuar Comprando
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
