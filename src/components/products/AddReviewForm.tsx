import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const reviewSchema = z.object({
  rating: z.number().min(1, "Selecione uma avaliação").max(5),
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  comment: z
    .string()
    .trim()
    .min(10, "O comentário deve ter pelo menos 10 caracteres")
    .max(1000, "O comentário deve ter no máximo 1000 caracteres"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface AddReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

const AddReviewForm = ({ productId, onSuccess }: AddReviewFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para avaliar",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Sua avaliação foi publicada",
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível publicar sua avaliação",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-lg bg-muted/50">
        <h3 className="font-semibold">Escreva sua avaliação</h3>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avaliação</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || field.value)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da avaliação</FormLabel>
              <FormControl>
                <Input placeholder="Resumo da sua experiência" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentário</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compartilhe sua experiência com este produto..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Publicando..." : "Publicar Avaliação"}
        </Button>
      </form>
    </Form>
  );
};

export default AddReviewForm;
