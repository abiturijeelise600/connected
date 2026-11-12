-- ==============================================================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO POPULATE PRODUCTS & ENABLE CHECKOUT
-- Project: https://thavezngpprxfkshjhpp.supabase.co
-- Compatible with your exact table schema:
--   categories: id, name
--   products:   id, name, description, price, stock, image_url, category_id
--   orders:     id, total, status, created_at
--   order_items: id, order_id, product_id, quantity, price
-- ==============================================================================

-- 1. Enable public read for products & categories (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);

-- 2. Allow anonymous checkout orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);

-- 3. Seed initial products matching your 5 categories (Clothes, Shoes, Electronics, Accessories, Bags)
INSERT INTO public.products (name, description, price, stock, image_url, category_id)
VALUES
    -- Clothes (category_id = 1)
    ('Classic Organic Cotton Hoodie', 'Ultra-soft heavyweight brushed organic cotton hoodie with ribbed trims and relaxed fit.', 64.99, 45, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 1),
    ('Tailored Minimalist Linen Shirt', 'Breathable pure European linen casual button-down shirt ideal for all seasons.', 48.50, 30, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 1),
    ('Vintage Denim Trucker Jacket', 'Durable rugged washed denim jacket featuring brass hardware and adjustable waist tabs.', 89.00, 25, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', 1),

    -- Shoes (category_id = 2)
    ('Urban Edge Leather Sneakers', 'Handcrafted white calfskin leather sneakers with cushioned ergonomic memory foam insoles.', 129.99, 22, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80', 2),
    ('Pro Performance Running Trainers', 'Engineered mesh upper with responsive carbon-plate energy return midsole.', 145.00, 34, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 2),
    ('Chelsea Suede Ankle Boots', 'Water-resistant Italian suede boots with elastic side panels and durable crepe soles.', 158.00, 18, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80', 2),

    -- Electronics (category_id = 3)
    ('Active Noise Cancelling Headphones', 'Flagship 40mm drivers with hybrid ANC, 35-hour battery life, and spatial audio.', 199.99, 40, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 3),
    ('Minimalist Wireless Mechanical Keyboard', 'Gateron brown switches, customizable RGB, Bluetooth 5.2 and USB-C connectivity.', 119.50, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', 3),
    ('True Wireless Studio Earbuds', 'IPX5 water-resistant earbuds with custom acoustic drivers and transparency mode.', 89.99, 60, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 3),

    -- Accessories (category_id = 4)
    ('Full-Grain Leather Bi-Fold Wallet', 'RFID-blocking slim vegetable-tanned leather wallet with 8 card slots and bill fold.', 45.00, 50, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', 4),
    ('Polarized Aviator Sunglasses', 'Titanium lightweight frame with UV400 anti-glare polarized scratch-resistant lenses.', 75.00, 38, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', 4),

    -- Bags (category_id = 5)
    ('Waterproof Commuter Rolltop Backpack', 'Durable Cordura fabric with padded 16-inch laptop sleeve and breathable back panel.', 110.00, 28, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 5),
    ('Vintage Canvas Weekender Duffle Bag', 'Heavy-duty waxed canvas travel duffle with full-grain leather straps and brass hardware.', 98.00, 32, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80', 5)
ON CONFLICT DO NOTHING;
