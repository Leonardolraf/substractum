import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  MapPin,
  Truck,
  Shield,
  ArrowLeft,
  Package,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductReviews from "@/components/products/ProductReviews";
import compostoAnteQuedaImg from "@/assets/products/composto-ante-queda.jpg";
import compostoAnteGotaImg from "@/assets/products/composto-ante-gota.jpg";
import compostoImunidadeImg from "@/assets/products/composto-imunidade.jpg";
import compostoMenopausaImg from "@/assets/products/composto-menopausa.jpg";
import baseFortalecedoraImg from "@/assets/products/base-fortalecedora.jpg";
import xaropeGuacoImg from "@/assets/products/xarope-guaco.jpg";
import vitaminaD3Img from "@/assets/products/vitamina-d3.jpg";
import magnesioImg from "@/assets/products/magnesio.jpg";
import colagenoImg from "@/assets/products/colageno.jpg";
import omega3Img from "@/assets/products/omega-3.jpg";
import oleoPrimulaImg from "@/assets/products/oleo-primula.jpg";
import multivitaminicoImg from "@/assets/products/multivitaminico.jpg";
import xaropeInfantilImg from "@/assets/products/xarope-infantil.jpg";
import minoxidilImg from "@/assets/products/minoxidil.jpg";
import reguladorIntestinalImg from "@/assets/products/regulador-intestinal.jpg";
import morosilImg from "@/assets/products/morosil.jpg";
import oliOlaImg from "@/assets/products/oli-ola.jpg";
import curcumaImg from "@/assets/products/curcuma.jpg";
import nutriMentImg from "@/assets/products/nutri-ment.jpg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  const getImageForProduct = (name: string) => {
    const productImages: { [key: string]: string } = {
      "Composto Anti-Queda 100ml": compostoAnteQuedaImg,
      "Anti-Gota": compostoAnteGotaImg,
      "Composto Imunidade 60 Cápsulas": compostoImunidadeImg,
      "Composto Menopausa 60 Cápsulas": compostoMenopausaImg,
      "Base Fortalecedora de Unha 8ml": baseFortalecedoraImg,
      "Xarope Guaco": xaropeGuacoImg,
      "Vitamina D3 10.000UI": vitaminaD3Img,
      "Blend de Magnésios 30 Cápsulas": magnesioImg,
      "Colágeno Hidrolisado + Vitamina C": colagenoImg,
      "Ômega 3 60 Cápsulas": omega3Img,
      "Óleo de Prímula 60 Cápsulas": oleoPrimulaImg,
      "Multivitamínico Completo": multivitaminicoImg,
      "Xarope Infantil 100ml": xaropeInfantilImg,
      "Minoxidil 100ml": minoxidilImg,
      "Regulador Intestinal 60 Cápsulas": reguladorIntestinalImg,
      "Morosil 60 Cápsulas": morosilImg,
      "Oli-Ola 30 Cápsulas": oliOlaImg,
      "Cúrcuma 60 Cápsulas": curcumaImg,
      "Nutri Ment 30 Cápsulas": nutriMentImg,
    };
    return productImages[name] || "/placeholder.svg";
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o produto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("category")
        .eq("id", id)
        .single();

      if (currentProduct) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", currentProduct.category)
          .neq("id", id)
          .limit(4);

        if (error) throw error;
        setRelatedProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      supplier: product.supplier,
      image: getImageForProduct(product.name),
      inStock: product.in_stock,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct);
    }

    toast({
      title: "Adicionado ao carrinho",
      description: `${quantity}x ${product.name}`,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <Button onClick={() => navigate("/products")}>Ver Produtos</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => navigate("/products")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Produtos
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <img
                    src={getImageForProduct(product.name)}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(product.average_rating || 0)}
                  <span className="text-sm text-muted-foreground">
                    ({product.review_count || 0} avaliações)
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-primary">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4">
                  {product.description || "Produto de alta qualidade da " + product.supplier}
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-primary" />
                  <span>
                    {product.in_stock ? (
                      <span className="text-green-600 font-medium">Em estoque ({product.stock} unidades)</span>
                    ) : (
                      <span className="text-red-600 font-medium">Fora de estoque</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Entrega em até 7 dias úteis</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Produto original com garantia</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{product.supplier}</span>
                </div>
              </div>

              <Separator />

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantidade:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Descrição do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Sobre este produto</h3>
                  <p className="text-muted-foreground">
                    {product.description ||
                      `${product.name} é um produto de alta qualidade oferecido pela ${product.supplier}. 
                      Desenvolvido com os mais altos padrões de qualidade e segurança.`}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Instruções de Uso</h3>
                  <p className="text-muted-foreground">
                    Siga as orientações do seu médico ou farmacêutico. Em caso de dúvidas, consulte um profissional de saúde.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Informações Importantes</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Mantenha fora do alcance de crianças</li>
                    <li>Armazene em local fresco e seco</li>
                    <li>Verifique a data de validade antes do uso</li>
                    <li>Em caso de reações adversas, procure orientação médica</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Especificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Categoria</span>
                  <p className="font-medium">{product.category}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Fornecedor</span>
                  <p className="font-medium">{product.supplier}</p>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Estoque</span>
                  <p className="font-medium">{product.stock} unidades</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <CardContent className="p-4">
                      <img
                        src={getImageForProduct(relatedProduct.name)}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-medium mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(relatedProduct.average_rating || 0)}
                        <span className="text-xs text-muted-foreground">
                          ({relatedProduct.review_count || 0})
                        </span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        R$ {parseFloat(relatedProduct.price).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
