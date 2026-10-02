const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sql, poolPromise } = require('./db');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

// API Categories phuc vu dropdown danh muc o Lab 9
app.get('/api/categories', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT CategoryID, CategoryName FROM Categories ORDER BY CategoryName');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi lay danh muc' });
  }
});

// Router xac thuc va san pham
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server dang chay tai cong ${PORT}`));
