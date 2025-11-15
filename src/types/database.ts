export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  in_stock: boolean | null;
  supplier: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_method: string | null;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
