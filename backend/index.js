import express from 'express';
import cors from 'cors';
import { initDatabase, query } from './db.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'TradeHub backend is healthy' });
});

function generateId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}


function normalizeUsers(user)
{
    return {
        id: user.id,
        username:user.username,
        password:user.password
    };
}

function normalizeProduct(product) {
  return {
    id: product.id,
    traderId: product.trader_id,
    company: product.company,
    name: product.name,
    sku: product.sku,
    category: product.category,
    description: product.description,
    metric: product.metric,
    unitsPerBox: product.units_per_box ?? undefined,
    landingPrice: Number(product.landing_price),
    mrp: Number(product.mrp),
    stock: Number(product.stock),
  };
}

function normalizeCustomer(customer) {
  return {
    id: customer.id,
    shopName: customer.shop_name,
    customerName: customer.customer_name,
    gst: customer.gst,
    address: customer.address,
    mobile: customer.mobile,
  };
}

function normalizeOrder(order) {
  return {
    id: order.id,
    mode: order.mode,
    traderId: order.trader_id,
    customerId: order.customer_id,
    customerName: order.customer_name,
    shopName: order.shop_name,
    status: order.status,
    items: order.items || [],
    total: Number(order.total),
    date: order.order_date,
  };
}

function normalizePayment(payment) {
  return {
    status: payment.status,
    paymentMethod: payment.payment_method ?? undefined,
    amountPaid: Number(payment.amount_paid),
    isCredit: payment.is_credit ?? false,
  };
}


// Register

app.post('/api/register/new-user' , async (req,res) => {

    try{
        const id = generateId('u');
        const { username,password } = req.body;
        console.log(req.body);
        
        const existing = await query('SELECT * from users where user_name = $1',[username]);
        if(existing.rows.length>0)
        {
          res.status(409).json({success:false,message:"User already exists"});
          return;
        }
        const result = await query(`INSERT into users(id,user_name,password)
        values( $1, $2 ,$3) returning *`,[id,username,password]);
        //res.status(201).json(normalizeUsers(result.rows[0]));
        res.status(201).json({success:true,message:'User registered Successfully'});
        }
    catch(error)
    {
        res.status(500).json({error:message});
    }

});

// Log in

app.post('/api/log-in',async (req,res)=>
{
    const {username,password}= req.body;
    try
    {
        const result = await query(`select * from users where user_name = $1`,[username]);
        if(result.rows.length>0)
        {
            if(result.rows[0].password == password)
            {
                res.status(200).json({success:true,message:"LogIn Successful!"});
            }
            else
            {
                res.status(401).json({success:false,message:"Invalid credentials.password mismatch"});
            }
        }
        else
        {
            res.status(401).json({success:false,message:"username does not exist.please SignUp"})
        }
    }
    catch(error)
    {
        res.status(500).json({error:error.message});
    }
});


app.get('/api/traders', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM traders ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY name ASC');
    res.json(rows.map(normalizeProduct));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const id = product.id || generateId('p');
    const result = await query(
      `INSERT INTO products (id, trader_id, company, name, sku, category, description, metric, units_per_box, landing_price, mrp, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        id,
        product.traderId ?? null,
        product.company,
        product.name,
        product.sku,
        product.category,
        product.description,
        product.metric,
        product.unitsPerBox ?? null,
        Number(product.landingPrice),
        Number(product.mrp),
        Number(product.stock || 0),
      ]
    );
    res.status(201).json(normalizeProduct(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id/restock', async (req, res) => {
  try {
    const { qty } = req.body;
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updated = await query(
      'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
      [Number(qty || 0), req.params.id]
    );
    res.json(normalizeProduct(updated.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM customers ORDER BY customer_name ASC');
    res.json(rows.map(normalizeCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = req.body;
    const id = customer.id || generateId('c');
    const result = await query(
      'INSERT INTO customers (id, shop_name, customer_name, gst, address, mobile) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, customer.shopName, customer.customerName, customer.gst, customer.address, customer.mobile]
    );
    res.status(201).json(normalizeCustomer(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = req.body;
    const result = await query(
      'UPDATE customers SET shop_name = $1, customer_name = $2, gst = $3, address = $4, mobile = $5 WHERE id = $6 RETURNING *',
      [customer.shopName, customer.customerName, customer.gst, customer.address, customer.mobile, req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(normalizeCustomer(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await query('DELETE FROM customers WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/orders', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT 
        o.id, o.mode, o.trader_id, o.customer_id, o.customer_name, 
        o.shop_name, o.status AS order_status, o.items, o.total, o.order_date,
        p.status AS payment_status, p.payment_method, p.amount_paid, p.is_credit
      FROM orders o
      LEFT JOIN payments p ON o.id = p.order_id
      ORDER BY o.order_date DESC, o.id DESC
    `);

    res.json(rows.map(row => ({
      ...normalizeOrder({
        ...row,
        status: row.order_status // pass the aliased order status
      }),
      payment: normalizePayment({
        status: row.payment_status,
        payment_method: row.payment_method,
        amount_paid: row.amount_paid,
        is_credit: row.is_credit
      })
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    const id = order.id || `ORD-${String(Date.now()).slice(-6)}`;
    const result = await query(
      'INSERT INTO orders (id, mode, trader_id, customer_id, customer_name, shop_name, status, items, total, order_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [id, order.mode, order.traderId ?? null, order.customerId, order.customerName, order.shopName, order.status, JSON.stringify(order.items || []), Number(order.total || 0), order.date || new Date().toISOString().slice(0, 10)]
    );

    await query('INSERT INTO payments (order_id, status, payment_method, amount_paid, is_credit) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (order_id) DO NOTHING',
      [id, order.payment?.status || 'unpaid', order.payment?.paymentMethod || null, Number(order.payment?.amountPaid || 0), Boolean(order.payment?.isCredit)]);

    res.status(201).json(normalizeOrder(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = req.body;
    const result = await query(
      'UPDATE orders SET mode = $1, trader_id = $2, customer_id = $3, customer_name = $4, shop_name = $5, status = $6, items = $7, total = $8, order_date = $9 WHERE id = $10 RETURNING *',
      [order.mode, order.traderId ?? null, order.customerId, order.customerName, order.shopName, order.status, JSON.stringify(order.items || []), Number(order.total || 0), order.date || new Date().toISOString().slice(0, 10), req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(normalizeOrder(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await query('DELETE FROM payments WHERE order_id = $1', [req.params.id]);
    await query('DELETE FROM orders WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(normalizeOrder(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payments', async (_req, res) => {
  try {
    const { rows } = await query('SELECT * FROM payments ORDER BY order_id ASC');
    const payload = {};
    rows.forEach((payment) => {
      payload[payment.order_id] = normalizePayment(payment);
    });
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/payments/:orderId', async (req, res) => {
  try {
    const payment = req.body;
    const result = await query(
      'INSERT INTO payments (order_id, status, payment_method, amount_paid, is_credit) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (order_id) DO UPDATE SET status = EXCLUDED.status, payment_method = EXCLUDED.payment_method, amount_paid = EXCLUDED.amount_paid, is_credit = EXCLUDED.is_credit RETURNING *',
      [req.params.orderId, payment.status, payment.paymentMethod ?? null, Number(payment.amountPaid || 0), Boolean(payment.isCredit)]
    );
    res.json(normalizePayment(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  try {
    await initDatabase();
    console.log(`TradeHub backend running on http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to initialize database', error);
    process.exit(1);
  }
});
