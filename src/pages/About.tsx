import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, Shield, Clock, Users, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const About = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
                Sobre a Substractum
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Sua farmácia de manipulação de confiança, dedicada à saúde e bem-estar 
                com mais de 20 anos de experiência no mercado farmacêutico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Heart className="w-6 h-6 mr-3 text-green-600" />
                    Nossa Missão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Proporcionar saúde e qualidade de vida através de medicamentos 
                    manipulados personalizados, seguindo os mais altos padrões de 
                    qualidade e segurança farmacêutica.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Shield className="w-6 h-6 mr-3 text-green-600" />
                    Nossos Valores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Ética, transparência, qualidade e compromisso com a saúde dos 
                    nossos clientes. Cada fórmula é preparada com máximo cuidado 
                    e atenção aos detalhes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Clock className="w-6 h-6 mr-3 text-green-600" />
                    Nossa História
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Desde 2010 manipulando com o Certificado de Licença de Funcionamento, 
                    a Substractum é referência em medicamentos manipulados de alta qualidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Users className="w-6 h-6 mr-3 text-green-600" />
                    Nossa Equipe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Contamos com farmacêuticos especializados, técnicos qualificados 
                    e uma equipe dedicada que trabalha para garantir a melhor 
                    experiência aos nossos clientes.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm mb-12">
              <CardHeader>
                <CardTitle className="text-2xl text-green-900 text-center">
                  Medicamentos a Pronta Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Composto Ante-Queda</p>
                    <p className="text-gray-600 text-sm">Fortalece os fios e combate a queda capilar.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Composto Ante-Gota</p>
                    <p className="text-gray-600 text-sm">Auxilia no controle do ácido úrico e prevenção de crises.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Composto Imunidade</p>
                    <p className="text-gray-600 text-sm">Reforça as defesas naturais do organismo.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Composto Menopausa</p>
                    <p className="text-gray-600 text-sm">Alivia sintomas e desconfortos do período.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Base Fortalecedora</p>
                    <p className="text-gray-600 text-sm">Promove força e vitalidade ao organismo.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Xarope Guaco</p>
                    <p className="text-gray-600 text-sm">Alivia tosse e auxilia na saúde respiratória.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-green-900 text-center">
                  Diferenciais da Substractum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-900 mb-2">Qualidade Garantida</h3>
                    <p className="text-gray-700 text-sm">
                      Laboratório certificado pela ANVISA com controle rigoroso de qualidade
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-900 mb-2">Entrega Rápida</h3>
                    <p className="text-gray-700 text-sm">
                      Preparação e entrega ágil para atender suas necessidades urgentes
                    </p>
                  </div>
                  
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-900 mb-2">Atendimento Personalizado</h3>
                    <p className="text-gray-700 text-sm">
                      Cada cliente é único e merece um atendimento especializado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm mt-12">
              <CardHeader>
                <CardTitle className="text-2xl text-green-900 text-center">
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      O que são medicamentos manipulados?
                    </AccordionTrigger>
                    <AccordionContent>
                      Medicamentos manipulados são preparações farmacêuticas personalizadas, feitas sob medida para atender às necessidades específicas de cada paciente. Eles são produzidos em farmácias de manipulação a partir de uma prescrição médica, utilizando matérias-primas de alta qualidade.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Preciso de receita médica para comprar medicamentos manipulados?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sim, a maioria dos medicamentos manipulados requer receita médica. No entanto, alguns suplementos e produtos para uso tópico podem ser adquiridos sem prescrição. Nossa equipe de farmacêuticos está disponível para orientá-lo sobre quais produtos necessitam de receita.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      Quanto tempo leva para preparar um medicamento manipulado?
                    </AccordionTrigger>
                    <AccordionContent>
                      O prazo de manipulação varia de acordo com a complexidade da fórmula, mas geralmente leva de 24 a 48 horas. Para fórmulas mais complexas ou em casos de alta demanda, o prazo pode ser estendido. Oferecemos também serviço de entrega para sua comodidade.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Os medicamentos manipulados têm a mesma eficácia que os industrializados?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sim! Quando preparados seguindo as boas práticas de manipulação e utilizando matérias-primas de qualidade certificada, os medicamentos manipulados têm a mesma eficácia dos industrializados. A vantagem é que eles podem ser personalizados em dosagem, forma farmacêutica e combinações específicas para cada paciente.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      Como devo armazenar os medicamentos manipulados?
                    </AccordionTrigger>
                    <AccordionContent>
                      As condições de armazenamento variam conforme o tipo de medicamento. Geralmente, devem ser mantidos em local fresco, seco e protegido da luz. Alguns produtos podem necessitar refrigeração. Todas as orientações específicas de armazenamento estarão descritas na etiqueta do produto ou serão fornecidas pelo nosso farmacêutico.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-left">
                      A farmácia oferece serviço de entrega?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sim, oferecemos serviço de entrega para sua comodidade. Entre em contato conosco para verificar a disponibilidade de entrega na sua região e os prazos estimados.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm mt-12">
              <CardHeader>
                <CardTitle className="text-2xl text-green-900 text-center">
                  Entre em Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">Telefone</h3>
                      <a 
                        href="tel:+556198347286"
                        className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                      >
                        (61) 98347-2867
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/556198347286" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                      >
                        (61) 98347-2867
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">E-mail</h3>
                      <a 
                        href="mailto:contato@substractum.com"
                        className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                      >
                        contato@substractum.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">Endereço</h3>
                      <p className="text-gray-700">
                        Quadra 40 lojas 20/22<br />
                        Setor Central Comercial<br />
                        Gama - DF<br />
                        CEP: 72405-400
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 text-center">Horário de Atendimento</h3>
                  <div className="text-center text-gray-700">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 13h</p>
                    <p className="text-gray-500 mt-2">Fechado aos Domingos e Feriados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;