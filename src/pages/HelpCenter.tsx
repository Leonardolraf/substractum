import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

const HelpCenter = () => {
  const faqs = [
    {
      question: "Como adicionar um novo produto?",
      answer: "Para adicionar um novo produto, acesse a seção 'Meus Produtos' e clique no botão 'Adicionar Produto'. Preencha todas as informações necessárias como nome, descrição, preço e categoria."
    },
    {
      question: "Como gerenciar o estoque?",
      answer: "O estoque pode ser gerenciado através da página 'Meus Produtos', onde você pode visualizar e editar a disponibilidade de cada item."
    },
    {
      question: "Como visualizar relatórios de vendas?",
      answer: "Acesse a seção 'Relatório de Vendas' no seu painel para visualizar estatísticas detalhadas sobre suas vendas, incluindo receita total, número de pedidos e produtos mais vendidos."
    },
    {
      question: "Como alterar o status de um pedido?",
      answer: "Na página 'Ver Pedidos', você pode clicar em qualquer pedido para visualizar seus detalhes e alterar o status conforme necessário."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Central de Ajuda</h1>
        <p className="text-gray-600 mt-2">Encontre respostas para suas dúvidas ou entre em contato conosco</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>Respostas para as dúvidas mais comuns</CardDescription>
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
              <CardDescription>Não encontrou a resposta? Envie sua dúvida</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <Input placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="seu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Assunto</label>
                  <Input placeholder="Assunto da sua mensagem" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensagem</label>
                  <Textarea 
                    placeholder="Descreva sua dúvida ou problema..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contato Direto</CardTitle>
              <CardDescription>Entre em contato conosco diretamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-gray-600">(11) 9999-9999</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">suporte@farmacia.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Chat Online</p>
                  <p className="text-sm text-gray-600">Segunda à Sexta, 8h às 18h</p>
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
  );
};

export default HelpCenter;