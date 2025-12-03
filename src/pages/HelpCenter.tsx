import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const HelpCenter = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: "Como adicionar um novo produto?",
      answer:
        "Para adicionar um novo produto, acesse a seção 'Meus Produtos' e clique no botão 'Adicionar Produto'. Preencha todas as informações necessárias como nome, descrição, preço e categoria.",
    },
    {
      question: "Como gerenciar o estoque?",
      answer:
        "O estoque pode ser gerenciado através da página 'Meus Produtos', onde você pode visualizar e editar a disponibilidade de cada item.",
    },
    {
      question: "Como visualizar relatórios de vendas?",
      answer:
        "Acesse a seção 'Relatório de Vendas' no seu painel para visualizar estatísticas detalhadas sobre suas vendas, incluindo receita total, número de pedidos e produtos mais vendidos.",
    },
    {
      question: "Como alterar o status de um pedido?",
      answer:
        "Na página 'Ver Pedidos', você pode clicar em qualquer pedido para visualizar seus detalhes e alterar o status conforme necessário.",
    },
  ];

  const handleChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const whatsappNumber = "5561983472867"; // Número da farmácia

      let message = `*Central de Ajuda - Substractum*\n\n`;
      message += `*Nome:* ${encodeURIComponent(formData.name)}\n`;

      if (formData.email) {
        message += `*Email:* ${encodeURIComponent(formData.email)}\n`;
      }

      if (formData.subject) {
        message += `*Assunto:* ${encodeURIComponent(formData.subject)}\n`;
      }

      if (formData.message) {
        message += `\n*Mensagem:*\n${encodeURIComponent(formData.message)}\n`;
      }

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      toast({
        title: "Mensagem pronta!",
        description:
          "Você será redirecionado para o WhatsApp para enviar sua mensagem.",
      });

      window.open(whatsappUrl, "_blank");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description:
          error?.message || "Não foi possível abrir o WhatsApp. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
            <p className="text-gray-600 mt-2">
              Encontre respostas para suas dúvidas ou entre em contato conosco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ + formulário */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Perguntas Frequentes
                  </CardTitle>
                  <CardDescription>
                    Respostas para as dúvidas mais comuns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enviar uma Mensagem</CardTitle>
                  <CardDescription>
                    Não encontrou a resposta? Envie sua dúvida — vamos te
                    atender pelo WhatsApp.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nome
                        </label>
                        <Input
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={handleChange("name")}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={handleChange("email")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Assunto
                      </label>
                      <Input
                        placeholder="Assunto da sua mensagem"
                        value={formData.subject}
                        onChange={handleChange("subject")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mensagem
                      </label>
                      <Textarea
                        placeholder="Descreva sua dúvida ou problema..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange("message")}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Gerando mensagem..." : "Enviar pelo WhatsApp"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contato direto / horários */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contato Direto</CardTitle>
                  <CardDescription>
                    Entre em contato conosco diretamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-gray-600">
                        (61) 9 8347-2867
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">
                        contato@substractum.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">
                        Atendimento pelo mesmo número do formulário
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horário de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Segunda - Sexta</span>
                      <span>8h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span>8h às 12h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo</span>
                      <span>Fechado</span>
                    </div>
                  </div>
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

export default HelpCenter;
