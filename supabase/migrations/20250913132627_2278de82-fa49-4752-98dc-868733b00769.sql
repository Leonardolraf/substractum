-- Create products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  supplier text,
  in_stock boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for products - everyone can view products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Only admins and sellers can manage products
CREATE POLICY "Admins and sellers can manage products" 
ON public.products 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.profile_type IN ('admin', 'seller')
  )
);

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, supplier) VALUES
('Paracetamol 500mg', 'Analgésico e antitérmico para dores e febre', 12.50, '/src/assets/paracetamol.jpg', 'Analgésicos', 'Farmácia Central'),
('Ibuprofeno 400mg', 'Anti-inflamatório para dores e inflamações', 18.90, '/src/assets/ibuprofeno.jpg', 'Anti-inflamatórios', 'Farmácia Popular'),
('Amoxicilina 500mg', 'Antibiótico para infecções bacterianas', 25.80, '/src/assets/amoxicilina.jpg', 'Antibióticos', 'Farmácia Vida'),
('Dipirona 500mg', 'Analgésico e antitérmico', 8.75, '/src/assets/dipirona.jpg', 'Analgésicos', 'Farmácia Central'),
('Omeprazol 20mg', 'Protetor gástrico', 15.60, '/src/assets/omeprazol.jpg', 'Digestivos', 'Farmácia Popular'),
('Losartana 50mg', 'Medicamento para hipertensão', 22.30, '/src/assets/losartana.jpg', 'Cardiovasculares', 'Farmácia Vida'),
('Sinvastatina 20mg', 'Medicamento para colesterol', 19.90, '/src/assets/sinvastatina.jpg', 'Cardiovasculares', 'Farmácia Central'),
('Metformina 850mg', 'Medicamento para diabetes', 14.50, '/src/assets/metformina.jpg', 'Diabetes', 'Farmácia Popular'),
('Dorflex', 'Relaxante muscular', 11.20, '/src/assets/dorflex.jpg', 'Relaxantes', 'Farmácia Vida'),
('Buscopan', 'Antiespasmódico', 16.80, '/src/assets/buscopan.jpg', 'Digestivos', 'Farmácia Central'),
('Rivotril 2mg', 'Ansiolítico', 28.90, '/src/assets/rivotril.jpg', 'Psiquiátricos', 'Farmácia Popular'),
('Aspirina 500mg', 'Analgésico e anticoagulante', 9.50, '/src/assets/aspirina.jpg', 'Analgésicos', 'Farmácia Vida'),
('Nexium 40mg', 'Protetor gástrico', 45.30, '/src/assets/nexium.jpg', 'Digestivos', 'Farmácia Central'),
('Captopril 25mg', 'Medicamento para hipertensão', 12.80, '/src/assets/captopril.jpg', 'Cardiovasculares', 'Farmácia Popular'),
('Azitromicina 500mg', 'Antibiótico', 32.70, '/src/assets/azitromicina.jpg', 'Antibióticos', 'Farmácia Vida'),
('Clonazepam 2mg', 'Ansiolítico', 24.60, '/src/assets/clonazepam.jpg', 'Psiquiátricos', 'Farmácia Central'),
('Atorvastatina 20mg', 'Medicamento para colesterol', 21.40, '/src/assets/atorvastatina.jpg', 'Cardiovasculares', 'Farmácia Popular'),
('Insulina NPH', 'Medicamento para diabetes', 67.90, '/src/assets/insulina.jpg', 'Diabetes', 'Farmácia Vida'),
('Fluoxetina 20mg', 'Antidepressivo', 18.30, '/src/assets/fluoxetina.jpg', 'Psiquiátricos', 'Farmácia Central'),
('Anlodipino 5mg', 'Medicamento para hipertensão', 13.70, '/src/assets/anlodipino.jpg', 'Cardiovasculares', 'Farmácia Popular'),
('Cefalexina 500mg', 'Antibiótico', 27.50, '/src/assets/cefalexina.jpg', 'Antibióticos', 'Farmácia Vida'),
('Prednisona 20mg', 'Corticosteroide', 16.20, '/src/assets/prednisona.jpg', 'Corticosteroides', 'Farmácia Central'),
('Levotiroxina 50mcg', 'Hormônio da tireoide', 19.80, '/src/assets/levotiroxina.jpg', 'Hormônios', 'Farmácia Popular'),
('Pantoprazol 40mg', 'Protetor gástrico', 23.60, '/src/assets/pantoprazol.jpg', 'Digestivos', 'Farmácia Vida');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample users into profiles
INSERT INTO public.profiles (user_id, email, full_name, profile_type) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@farmacia.com', 'Administrador Sistema', 'admin'),
('22222222-2222-2222-2222-222222222222', 'vendedor@farmacia.com', 'João Vendedor', 'seller'),
('33333333-3333-3333-3333-333333333333', 'cliente@farmacia.com', 'Maria Cliente', 'customer');