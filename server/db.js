import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/tradehub',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function initDatabase() {

    // initializing users table

  await query(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL
  );
`);



  await query(`
    CREATE TABLE IF NOT EXISTS traders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      trader_id TEXT,
      company TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      metric TEXT NOT NULL,
      units_per_box INTEGER,
      landing_price NUMERIC(10,2) NOT NULL,
      mrp NUMERIC(10,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      shop_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      gst TEXT NOT NULL,
      address TEXT NOT NULL,
      mobile TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      mode TEXT NOT NULL,
      trader_id TEXT,
      customer_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      shop_name TEXT NOT NULL,
      status TEXT NOT NULL,
      items JSONB NOT NULL,
      total NUMERIC(10,2) NOT NULL,
      order_date TEXT NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      order_id TEXT PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      payment_method TEXT,
      amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
      is_credit BOOLEAN DEFAULT FALSE
    );
  `);

  const traderCount = await query('SELECT COUNT(*)::int AS count FROM traders');
  if (traderCount.rows[0].count === 0) {
    await query(`
      INSERT INTO traders (id, name, company) VALUES
      ('t1', 'AP Thangaraj Stores', 'General'),
      ('t2', 'Masi Periyasamy Traders', 'Soaps '),
      ('t3', 'Sri Murugan Traders', 'Home & Personal Care');
    `);
  }

  const productCount = await query('SELECT COUNT(*)::int AS count FROM products');
  if (productCount.rows[0].count === 0) {
    await query(`
      INSERT INTO products (id, trader_id, company, name, sku, category, description, metric, units_per_box, landing_price, mrp, stock) VALUES
      ('p1','t1','Nestlé India','Maggi Noodles 70g','NES-MAG-70','Instant Food','Classic masala flavour instant noodles','packet',NULL,11,14,480),
      ('p2','t1','Nestlé India','KitKat 4 Finger 40g','NES-KIT-40','Chocolates','Crispy wafer chocolate bar','piece',NULL,24,30,240),
      ('p3','t1','Nestlé India','Munch 21g','NES-MUN-21','Chocolates','Crunchy choco bar','piece',NULL,8,10,600),
      ('p4','t1','Nestlé India','Milkmaid 400g','NES-MLK-400','Dairy','Sweetened condensed milk','piece',NULL,78,95,96),
      ('p5','t1','Nestlé India','Nescafé Classic 50g','NES-CAF-50','Beverages','Premium instant coffee','piece',NULL,98,120,72),
      ('p6','t1','Nestlé India','Nestea Iced Tea 1L','NES-TEA-1L','Beverages','Refreshing iced tea','packet',NULL,36,45,144),
      ('p7','t4','Britannia','Good Day Butter 150g','BRI-GDB-150','Biscuits','Rich butter cookies','packet',NULL,24,30,360),
      ('p8','t4','Britannia','Hide & Seek Bourbon 100g','BRI-HSB-100','Biscuits','Chocolate cream sandwich biscuits','packet',NULL,19,25,420),
      ('p9','t3','HUL','Rin Detergent 1kg','HUL-RIN-1K','Laundry','Power whitening detergent powder','kg',NULL,68,85,180),
      ('p10','t3','HUL','Surf Excel Easy Wash 1kg','HUL-SXL-1K','Laundry','Powerful stain removal','kg',NULL,88,110,130),
      ('p11','t3','HUL','Lux Soap 150g','HUL-LUX-150','Personal Care','Skin nourishing beauty soap','piece',NULL,32,40,300),
      ('p12','t3','HUL','Dove Shampoo 180ml','HUL-DOV-180','Personal Care','Moisturising shampoo','piece',NULL,150,185,88),
      ('p13',NULL,'Generic','Tata Salt 1kg','RET-SAL-1K','Grocery','Iodised table salt','kg',NULL,20,24,500),
      ('p14',NULL,'Generic','Fortune Sunflower Oil 1L','RET-OIL-1L','Grocery','Refined sunflower oil','litre',NULL,110,130,200);
    `);
  }

  const customerCount = await query('SELECT COUNT(*)::int AS count FROM customers');
  if (customerCount.rows[0].count === 0) {
    await query(`
      INSERT INTO customers (id, shop_name, customer_name, gst, address, mobile) VALUES
      ('c1','Sri Lakshmi Provisions','Ramesh Kumar','33AABCU9603R1ZX','12, Gandhi St, Chennai - 600001','9876543210'),
      ('c2','Anand General Stores','Anand Patel','24BBBCS0124R2ZX','45, MG Road, Ahmedabad - 380001','9845678901'),
      ('c3','Meenakshi Supermart','Vijay Sharma','29DDDCS0124R3ZX','78, Brigade Rd, Bengaluru - 560001','9823456789'),
      ('c4','Kumar Brothers','Suresh Kumar','06CCCCS0124R4ZX','23, Nehru Nagar, Delhi - 110001','9812345678');
    `);
  }

  const orderCount = await query('SELECT COUNT(*)::int AS count FROM orders');
  if (orderCount.rows[0].count === 0) {
    await query(`
      INSERT INTO orders (id, mode, trader_id, customer_id, customer_name, shop_name, status, items, total, order_date) VALUES
      ('ORD-001','wholesale','t1','c1','Ramesh Kumar','Sri Lakshmi Provisions','delivered','[{"quantity":50,"price":14,"product":{"id":"p1","traderId":"t1","company":"Nestlé India","name":"Maggi Noodles 70g","sku":"NES-MAG-70","category":"Instant Food","description":"Classic masala flavour instant noodles","metric":"packet","landingPrice":11,"mrp":14,"stock":480}} , {"quantity":30,"price":30,"product":{"id":"p7","traderId":"t4","company":"Britannia","name":"Good Day Butter 150g","sku":"BRI-GDB-150","category":"Biscuits","description":"Rich butter cookies","metric":"packet","landingPrice":24,"mrp":30,"stock":360}}]','1600','2024-01-15'),
      ('ORD-002','wholesale','t1','c2','Anand Patel','Anand General Stores','packed','[{"quantity":24,"price":120,"product":{"id":"p5","traderId":"t1","company":"Nestlé India","name":"Nescafé Classic 50g","sku":"NES-CAF-50","category":"Beverages","description":"Premium instant coffee","metric":"piece","landingPrice":98,"mrp":120,"stock":72}} , {"quantity":48,"price":40,"product":{"id":"p11","traderId":"t3","company":"HUL","name":"Lux Soap 150g","sku":"HUL-LUX-150","category":"Personal Care","description":"Skin nourishing beauty soap","metric":"piece","landingPrice":32,"mrp":40,"stock":300}}]','4800','2024-01-18'),
      ('ORD-003','wholesale','t1','c3','Vijay Sharma','Meenakshi Supermart','delivered','[{"quantity":20,"price":85,"product":{"id":"p9","traderId":"t3","company":"HUL","name":"Rin Detergent 1kg","sku":"HUL-RIN-1K","category":"Laundry","description":"Power whitening detergent powder","metric":"kg","landingPrice":68,"mrp":85,"stock":180}} , {"quantity":20,"price":110,"product":{"id":"p10","traderId":"t3","company":"HUL","name":"Surf Excel Easy Wash 1kg","sku":"HUL-SXL-1K","category":"Laundry","description":"Powerful stain removal","metric":"kg","landingPrice":88,"mrp":110,"stock":130}}]','3900','2024-01-20');
    `);
  }

  const paymentCount = await query('SELECT COUNT(*)::int AS count FROM payments');
  if (paymentCount.rows[0].count === 0) {
    await query(`
      INSERT INTO payments (order_id, status, payment_method, amount_paid, is_credit) VALUES
      ('ORD-001','partial',NULL,1000,false),
      ('ORD-003','unpaid',NULL,0,false);
    `);
  }
}
