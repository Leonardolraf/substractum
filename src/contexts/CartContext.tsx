import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  product?: any;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isReady: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const GUEST_CART_KEY = "substractum_cart_guest";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ------------------------------------------------------
  // Inicializa: descobre usuário e carrega o carrinho
  // ------------------------------------------------------
  useEffect(() => {
    const initCart = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("[Cart] Erro ao buscar usuário do Supabase:", error);
        }

        const user = data?.user ?? null;
        setUserId(user ? user.id : null);

        console.log("[Cart] Usuário atual:", user?.id ?? "guest");

        if (user) {
          // logado → carrinho vem do Supabase
          await loadCartFromSupabase(user.id);
        } else {
          // guest → carrinho vem do localStorage
          loadCartFromLocalStorage();
        }
      } catch (err) {
        console.error("[Cart] Erro ao inicializar carrinho:", err);
      } finally {
        setIsReady(true);
      }
    };

    initCart();
  }, []);

  const loadCartFromLocalStorage = () => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(GUEST_CART_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        console.log("[Cart] Carrinho guest carregado do localStorage:", parsed);
        setItems(parsed as CartItem[]);
      }
    } catch (err) {
      console.error(
        "[Cart] Erro ao carregar carrinho guest do localStorage:",
        err
      );
    }
  };

  const loadCartFromSupabase = async (uid: string) => {
    try {
      console.log("[Cart] Carregando carrinho do Supabase para user:", uid);

      const { data, error } = await (supabase as any)
        .from("cart_items")
        .select("product_id, quantity, name, price, image_url")
        .eq("user_id", uid);

      if (error) {
        console.error("[Cart] Erro ao buscar cart_items:", error);
        return;
      }

      const mapped: CartItem[] =
        data?.map((row: any) => ({
          productId: String(row.product_id),
          name: row.name ?? "Produto",
          price: Number(row.price ?? 0),
          quantity: Number(row.quantity ?? 1),
          imageUrl: row.image_url ?? "",
        })) ?? [];

      console.log("[Cart] Carrinho carregado do Supabase:", mapped);
      setItems(mapped);
    } catch (err) {
      console.error("[Cart] Erro ao carregar carrinho do Supabase:", err);
    }
  };

  // ------------------------------------------------------
  // Salva carrinho de guest no localStorage
  // (para usuário logado, fonte de verdade é o Supabase)
  // ------------------------------------------------------
  useEffect(() => {
    if (!isReady) return;
    if (userId) return; // logado → não mexe no guest

    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
      console.log("[Cart] Carrinho guest salvo no localStorage:", items);
    } catch (err) {
      console.error("[Cart] Erro ao salvar carrinho guest:", err);
    }
  }, [items, userId, isReady]);

  // ------------------------------------------------------
  // Helpers de sync com Supabase
  // ------------------------------------------------------
  const syncItemToSupabase = async (
    productId: string,
    quantity: number,
    fields: { name: string; price: number; imageUrl?: string }
  ) => {
    if (!userId) return; // só sincroniza se estiver logado

    try {
      console.log("[Cart] syncItemToSupabase", {
        userId,
        productId,
        quantity,
        fields,
      });

      const client = supabase as any;

      if (quantity <= 0) {
        // remove item
        const { error: delError } = await client
          .from("cart_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);

        if (delError) {
          console.error("[Cart] Erro ao deletar item do carrinho:", delError);
        }
        return;
      }

      // estratégia simples: apaga e insere novamente
      const { error: delError } = await client
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (delError) {
        console.warn("[Cart] Aviso ao limpar item antes do insert:", delError);
      }

      const { error: insError } = await client.from("cart_items").insert({
        user_id: userId,
        product_id: productId,
        quantity,
        name: fields.name,
        price: fields.price,
        image_url: fields.imageUrl ?? null,
      });

      if (insError) {
        console.error("[Cart] Erro ao inserir item no cart_items:", insError);
      }
    } catch (err) {
      console.error("[Cart] Erro ao sincronizar item no Supabase:", err);
    }
  };

  const syncClearSupabase = async () => {
    if (!userId) return;
    try {
      console.log("[Cart] Limpando carrinho do usuário no Supabase:", userId);
      const client = supabase as any;

      const { error } = await client
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("[Cart] Erro ao limpar carrinho no Supabase:", error);
      }
    } catch (err) {
      console.error("[Cart] Erro ao limpar carrinho no Supabase:", err);
    }
  };

  // ------------------------------------------------------
  // Ações do carrinho
  // ------------------------------------------------------
  const addToCart = (product: any, quantity: number = 1) => {
    if (!product) return;

    const productId = String(product.id ?? product.productId ?? "");
    if (!productId) return;

    const name =
      product.name ?? product.title ?? product.product_name ?? "Produto";

    const price = Number(
      product.price ?? product.unit_price ?? product.unitPrice ?? 0
    );

    const imageUrl =
      product.image_url ?? product.imageUrl ?? product.image ?? "";

    let newQuantity = quantity;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        newQuantity = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        productId,
        name,
        price,
        quantity,
        imageUrl,
        product,
      };

      return [...prev, newItem];
    });

    // dispara sync async
    syncItemToSupabase(productId, newQuantity, { name, price, imageUrl });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    syncItemToSupabase(productId, 0, {
      name: "",
      price: 0,
      imageUrl: "",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    let nameForSync = "Produto";
    let priceForSync = 0;
    let imageUrlForSync: string | undefined = "";

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          nameForSync = item.name;
          priceForSync = item.price;
          imageUrlForSync = item.imageUrl;
          return { ...item, quantity };
        }
        return item;
      })
    );

    syncItemToSupabase(productId, quantity, {
      name: nameForSync,
      price: priceForSync,
      imageUrl: imageUrlForSync,
    });
  };

  const clearCart = () => {
    setItems([]);
    syncClearSupabase();

    if (!userId && typeof window !== "undefined") {
      window.localStorage.removeItem(GUEST_CART_KEY);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isReady,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return ctx;
};
