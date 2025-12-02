import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const prescriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Telefone deve ter pelo menos 10 dígitos" })
    .max(15, { message: "Telefone inválido" }),
  message: z.string().trim().max(500, { message: "Mensagem deve ter no máximo 500 caracteres" }).optional(),
});

const SendPrescription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = prescriptionSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma receita.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let filePath = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const folderPath = user?.id || "anonymous";
        filePath = `${folderPath}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("prescriptions").upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload do arquivo");
        }
      }

      const { error: dbError } = await supabase.from("prescription_requests" as any).insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        message: formData.message || null,
        file_path: filePath,
        status: "pending",
      } as any);

      if (dbError) {
        throw new Error("Erro ao salvar solicitação");
      }

      const whatsappNumber = "5561983472867"; // Número da farmácia
      let message = `*Solicitação de Orçamento*\n\n`;
      message += `*Nome:* ${encodeURIComponent(formData.name)}\n`;
      message += `*Telefone:* ${encodeURIComponent(formData.phone)}\n`;

      if (formData.message) {
        message += `\n*Mensagem:*\n${encodeURIComponent(formData.message)}\n`;
      }

      if (selectedFile) {
        message += `\n_Receita/orçamento anexado (salvo no sistema)_`;
      }

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação foi salva e você será redirecionado para o WhatsApp",
      });

      window.open(whatsappUrl, "_blank");

      setFormData({ name: "", phone: "", message: "" });
      setSelectedFile(null);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Enviar Receita / Orçamento</h1>
            <p className="text-muted-foreground mt-2">
              Envie sua receita médica ou solicite um orçamento através do WhatsApp
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Pedido</CardTitle>
              <CardDescription>Preencha os dados abaixo e você será redirecionado para o WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    required
                    maxLength={100}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    required
                    maxLength={15}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Anexar Receita / Documento (opcional)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Formatos aceitos: JPG, PNG, PDF (máx. 5MB)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem Adicional (opcional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva os produtos que precisa ou deixe uma mensagem..."
                    rows={4}
                    maxLength={500}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  <p className="text-xs text-muted-foreground text-right">{formData.message.length}/500</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Importante:</strong> Ao clicar em enviar, você será redirecionado para o WhatsApp da
                    farmácia. {selectedFile && "Você precisará enviar o arquivo anexado manualmente na conversa."}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Enviando..." : "Enviar via WhatsApp"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SendPrescription;
