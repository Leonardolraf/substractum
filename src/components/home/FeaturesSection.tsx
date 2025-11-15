
import { Shield, Truck, BarChart3, CreditCard, Clock, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Dados protegidos com criptografia avançada e conformidade com regulamentações"
    },
    {
      icon: Truck,
      title: "Rastreamento de Entregas",
      description: "Acompanhe seus pedidos em tempo real desde a manipulação até a entrega"
    },
    {
      icon: BarChart3,
      title: "Dashboard Completo",
      description: "Métricas detalhadas e relatórios administrativos para gestão eficiente"
    },
    {
      icon: CreditCard,
      title: "Pagamento Seguro",
      description: "Múltiplas formas de pagamento com sistema seguro e confiável"
    },
    {
      icon: Clock,
      title: "Disponível 24/7",
      description: "Plataforma sempre disponível para suas necessidades farmacêuticas"
    },
    {
      icon: Users,
      title: "Suporte Especializado",
      description: "Equipe dedicada para auxiliar clientes e administradores"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-900 mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma solução completa que atende todas as necessidades da farmácia de manipulação
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
