const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sql, poolPromise } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT p.ProductID, p.ProductName, p.UnitPrice, p.UnitsInStock,
             p.Discontinued, c.CategoryName
      FROM Products p
      LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
      ORDER BY p.ProductID
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi may chu khi lay danh sach san pham' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server dang chay tai cong ${PORT}`));
