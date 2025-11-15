import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AddReviewForm from "./AddReviewForm";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  helpful_count: number;
  profiles: {
    full_name: string | null;
    username: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          id,
          rating,
          title,
          comment,
          created_at,
          helpful_count,
          profiles:user_id (
            full_name,
            username
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Avaliações dos Clientes</CardTitle>
          {user && (
            <Button onClick={() => setShowAddReview(!showAddReview)}>
              {showAddReview ? "Cancelar" : "Escrever Avaliação"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {showAddReview && user && (
            <AddReviewForm
              productId={productId}
              onSuccess={() => {
                setShowAddReview(false);
                fetchReviews();
              }}
            />
          )}

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Seja o primeiro a avaliar este produto!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {renderStars(review.rating)}
                        <span className="font-medium">{review.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Por {review.profiles?.full_name || review.profiles?.username} •{" "}
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground mb-2">{review.comment}</p>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Útil ({review.helpful_count})
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
