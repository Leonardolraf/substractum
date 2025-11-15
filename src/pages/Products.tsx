import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, ShoppingCart, Heart, Grid, List } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import amoxicilinaImg from "@/assets/amoxicilina.jpg";
import dipronaImg from "@/assets/dipirona.jpg";
import ibuprofenoImg from "@/assets/ibuprofeno.jpg";

// Produtos manipulados
import compostoAnteQuedaImg from "@/assets/products/composto-ante-queda.jpg";
import compostoAnteGotaImg from "@/assets/products/composto-ante-gota.jpg";
import compostoImunidadeImg from "@/assets/products/composto-imunidade.jpg";
import compostoMenopausaImg from "@/assets/products/composto-menopausa.jpg";
import baseFortalecedoraImg from "@/assets/products/base-fortalecedora.jpg";
import xaropeGuacoImg from "@/assets/products/xarope-guaco.jpg";

// Suplementos
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

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "Todos os Produtos" },
    { id: "manipulados", name: "Manipulados" },
    { id: "suplementos", name: "Suplementos" },
    { id: "medicines", name: "Medicamentos" },
    { id: "cosmetics", name: "Cosméticos" },
    { id: "wellness", name: "Bem-estar" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await (supabase as any).from("products").select("*").order("name");

      if (error) throw error;

      const formattedProducts = (data as any[])?.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        originalPrice: null,
        rating: product.average_rating || 0,
        reviewsCount: product.review_count || 0,
        supplier: product.supplier,
        image: getImageForProduct(product.name),
        category: getCategoryForProduct(product.category),
        inStock: product.in_stock,
        stockQuantity: product.stock,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
      amoxicilina: amoxicilinaImg,
      dipirona: dipronaImg,
      ibuprofeno: ibuprofenoImg,
    };

    return productImages[name] || "/placeholder.svg";
  };

  const getCategoryForProduct = (category: string | null) => {
    if (!category) return "medicines";

    const categoryMap: { [key: string]: string } = {
      Manipulados: "manipulados",
      Suplementos: "suplementos",
      Analgésicos: "medicines",
      "Anti-inflamatórios": "medicines",
      Antibióticos: "medicines",
      Digestivos: "medicines",
      Cardiovasculares: "medicines",
      Diabetes: "medicines",
      Cosméticos: "cosmetics",
      "Bem-estar": "wellness",
    };
    return categoryMap[category] || "medicines";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "0-20" && product.price <= 20) ||
      (priceRange === "20-50" && product.price > 20 && product.price <= 50) ||
      (priceRange === "50+" && product.price > 50);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Todos os Produtos</h1>
            <p className="text-muted-foreground mt-2">Encontre os melhores produtos farmacêuticos</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-4">
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os preços</SelectItem>
                    <SelectItem value="0-20">Até R$ 20</SelectItem>
                    <SelectItem value="20-50">R$ 20 - R$ 50</SelectItem>
                    <SelectItem value="50+">Acima de R$ 50</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="price-low">Menor preço</SelectItem>
                    <SelectItem value="price-high">Maior preço</SelectItem>
                    <SelectItem value="rating">Melhor avaliado</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex space-x-2 col-span-1 sm:col-span-2 lg:col-span-1 justify-center lg:justify-start">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Mostrando {sortedProducts.length} de {products.length} produtos
                </p>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-36 md:h-48 object-cover rounded-t-lg"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      {product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-xs">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="secondary">Fora de Estoque</Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-medium text-sm md:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 truncate">{product.supplier}</p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-xs md:text-sm text-muted-foreground">
                          {product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground hidden sm:inline">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-lg md:text-2xl font-bold text-primary">
                          R$ {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-xs md:text-sm text-muted-foreground line-through block sm:inline">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        disabled={!product.inStock}
                        className="w-full sm:w-auto text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          toast({
                            title: "Adicionado ao carrinho",
                            description: `${product.name} foi adicionado ao seu carrinho`,
                          });
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        {product.inStock ? "Adicionar" : "Indisponível"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      <div className="relative flex-shrink-0 mx-auto md:mx-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Badge variant="secondary" className="text-xs">
                              Fora de Estoque
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg md:text-xl font-medium mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">{product.supplier}</p>
                        <div className="flex items-center justify-center md:justify-start mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm text-muted-foreground">
                            {product.rating > 0 ? product.rating.toFixed(1) : "0.0"}
                          </span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({product.reviewsCount} avaliações)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {product.inStock
                            ? `${product.stockQuantity} unidades disponíveis`
                            : "Produto fora de estoque"}
                        </p>
                      </div>

                      <div className="text-center md:text-right flex-shrink-0">
                        <div className="mb-4">
                          <span className="text-xl md:text-2xl font-bold text-primary">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-muted-foreground line-through block md:inline">
                              R$ {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                          <Button variant="outline" size="sm" className="md:w-auto">
                            <Heart className="w-4 h-4" />
                            <span className="ml-2 md:hidden">Favoritar</span>
                          </Button>
                          <Button
                            size="sm"
                            disabled={!product.inStock}
                            onClick={() => {
                              addToCart(product);
                              toast({
                                title: "Adicionado ao carrinho",
                                description: `${product.name} foi adicionado ao seu carrinho`,
                              });
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {sortedProducts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros de busca ou remover alguns critérios
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
