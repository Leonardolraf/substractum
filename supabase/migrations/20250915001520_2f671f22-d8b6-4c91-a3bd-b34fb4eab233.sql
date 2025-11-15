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

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;