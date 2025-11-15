-- Insert more sample products
INSERT INTO products (name, description, price, category, supplier, image_url, in_stock) VALUES
('Paracetamol 500mg', 'Analgésico e antitérmico', 8.50, 'Analgésicos', 'EMS', '/src/assets/paracetamol.jpg', true),
('Aspirina 100mg', 'Antiagregante plaquetário', 12.30, 'Cardiovascular', 'Bayer', '/src/assets/aspirina.jpg', true),
('Vitamina C 1g', 'Suplemento vitamínico', 15.90, 'Vitaminas', 'Eurofarma', '/src/assets/vitamina-c.jpg', true),
('Soro Fisiológico 500ml', 'Solução salina estéril', 5.20, 'Soluções', 'JP Indústria', '/src/assets/soro.jpg', true),
('Protetor Solar FPS 60', 'Proteção solar facial', 35.90, 'Dermocosméticos', 'ADCOS', '/src/assets/protetor-solar.jpg', true),
('Xarope Expectorante', 'Alívio da tosse', 18.75, 'Respiratório', 'Herbarium', '/src/assets/xarope.jpg', true),
('Termômetro Digital', 'Medição de temperatura', 25.00, 'Equipamentos', 'G-Tech', '/src/assets/termometro.jpg', true),
('Curativo Transparente', 'Proteção de feridas', 8.90, 'Curativos', '3M', '/src/assets/curativo.jpg', true),
('Álcool em Gel 70%', 'Higienização das mãos', 6.50, 'Higiene', 'Darrow', '/src/assets/alcool-gel.jpg', true),
('Sabonete Líquido Neutro', 'Higiene corporal', 12.80, 'Higiene', 'Granado', '/src/assets/sabonete.jpg', true);

-- Insert sample profiles for demonstration
INSERT INTO profiles (user_id, email, full_name, phone, profile_type) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@farmacia.com', 'Administrador Geral', '(11) 99999-9999', 'admin'),
('22222222-2222-2222-2222-222222222222', 'vendedor1@farmacia.com', 'João Silva', '(11) 98888-8888', 'seller'),
('33333333-3333-3333-3333-333333333333', 'vendedor2@farmacia.com', 'Maria Santos', '(11) 97777-7777', 'seller'),
('44444444-4444-4444-4444-444444444444', 'cliente1@email.com', 'Ana Costa', '(11) 96666-6666', 'customer'),
('55555555-5555-5555-5555-555555555555', 'cliente2@email.com', 'Pedro Lima', '(11) 95555-5555', 'customer'),
('66666666-6666-6666-6666-666666666666', 'cliente3@email.com', 'Carla Souza', '(11) 94444-4444', 'customer');

-- Insert sample orders for demonstration
INSERT INTO orders (user_id, seller_id, items, total_amount, status, payment_method, shipping_address) VALUES
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 
 '[{"id": "1", "name": "Dipirona 500mg", "price": 12.50, "quantity": 2}]', 
 25.00, 'pending', 'credit_card', 'Rua das Flores, 123 - São Paulo, SP'),
('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 
 '[{"id": "2", "name": "Ibuprofeno 600mg", "price": 18.90, "quantity": 1}, {"id": "3", "name": "Paracetamol 500mg", "price": 8.50, "quantity": 3}]', 
 44.40, 'processing', 'pix', 'Av. Paulista, 456 - São Paulo, SP'),
('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 
 '[{"id": "4", "name": "Vitamina C 1g", "price": 15.90, "quantity": 2}]', 
 31.80, 'delivered', 'debit_card', 'Rua do Comércio, 789 - Rio de Janeiro, RJ');

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;