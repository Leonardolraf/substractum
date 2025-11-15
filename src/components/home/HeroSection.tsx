
import { Button } from "@/components/ui/button";
import { ShoppingCart, Users, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-green-50 to-green-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4 md:mb-6 leading-tight">
            Sua Farmácia de Manipulação
            <span className="text-green-600"> Completa</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed px-2">
            Conectamos clientes e administradores em uma plataforma moderna e segura para medicamentos manipulados e produtos farmacêuticos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12 mb-8 md:mb-12 mx-4 md:mx-0">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-green-900 mb-2">Clientes</h3>
              <p className="text-sm md:text-base text-gray-600">Faça pedidos personalizados, acompanhe manipulações e gerencie seu carrinho</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 md:mb-4 mx-auto">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-green-900 mb-2">Manipulação</h3>
              <p className="text-sm md:text-base text-gray-600">Plataforma completa com controle administrativo e gestão centralizada</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
              onClick={() => navigate('/products')}
            >
              Comprar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-green-600 text-green-600 hover:bg-green-50 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base"
              onClick={() => navigate('/about')}
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
