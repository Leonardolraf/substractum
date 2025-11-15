
import { Instagram, MessageCircle, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Substractum</h1>
                <p className="text-sm text-green-300">Farmácia de Manipulação</p>
              </div>
            </div>
            <p className="text-green-200 leading-relaxed max-w-md">
              Conectando o setor farmacêutico através de uma plataforma moderna, segura e eficiente.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-green-200">
              <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Produtos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-green-200 mb-4">
              <li>contato@substractum.com</li>
              <li>+55 61 98347-2867</li>
              <li>Quadra 40 lojas 20/22 - setor central comercial - Gama DF, Gama 72405400</li>
            </ul>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/farmaciasubstractum?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2F5561983472867&e=AT13F6CzmLYDuHIUA-3tk60hs1N4JjY_DBWXnZzBpP_2dFuYWCkLTdQ0SMQRPbzXiEQETQ-lG__UaeRk0MLr4QnsRvpsFfEHJ_bQkZ-YvBvdh6pd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors"
              >
                <MessageCircle size={24} />
              </a>
              <a 
                href="https://www.facebook.com/share/17Q2sDnpvM/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-200 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-300">
          <p>&copy; 2024 Substractum. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
