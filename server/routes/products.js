const express = require('express');
const { sql, poolPromise } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// 1. Lay danh sach san pham (Cong khai)
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT p.ProductID, p.ProductName, p.UnitPrice, p.UnitsInStock,
             p.Discontinued, p.CategoryID, c.CategoryName
      FROM Products p 
      LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
      WHERE p.Discontinued = 0
      ORDER BY p.ProductID DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi lay danh sach san pham' });
  }
});

// 2. Lay chi tiet 1 san pham theo ID (Cong khai)
router.get('/:id', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Products WHERE ProductID = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Khong tim thay san pham' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi lay chi tiet san pham' });
  }
});

// Ham kiem tra tinh hop le cua du lieu (Dung chung cho ca Them va Sua)
function kiemTraDuLieu(body) {
  const { productName, unitPrice, unitsInStock } = body;
  if (!productName || productName.trim() === '') return 'Ten san pham khong duoc de trong';
  if (unitPrice == null || unitPrice < 0) return 'Don gia phai la so khong am';
  if (unitsInStock == null || unitsInStock < 0) return 'Ton kho phai la so khong am';
  return null;
}

// 3. Them san pham moi (Admin & NhanVien)
router.post('/', authenticateToken, authorizeRoles('Admin', 'NhanVien'), async (req, res) => {
  const loi = kiemTraDuLieu(req.body);
  if (loi) return res.status(400).json({ message: loi });

  try {
    const { productName, categoryId, unitPrice, unitsInStock } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input('productName', sql.NVarChar, productName)
      .input('categoryId', sql.Int, categoryId || null)
      .input('unitPrice', sql.Money, unitPrice)
      .input('unitsInStock', sql.SmallInt, unitsInStock)
      .query(`
        INSERT INTO Products (ProductName, CategoryID, UnitPrice, UnitsInStock, Discontinued)
        VALUES (@productName, @categoryId, @unitPrice, @unitsInStock, 0)
      `);
    res.status(201).json({ message: 'Them san pham thanh cong' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi khi them san pham' });
  }
});

// 4. Sua san pham (Admin & NhanVien)
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'NhanVien'), async (req, res) => {
  const loi = kiemTraDuLieu(req.body);
  if (loi) return res.status(400).json({ message: loi });

  try {
    const { productName, categoryId, unitPrice, unitsInStock } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .input('productName', sql.NVarChar, productName)
      .input('categoryId', sql.Int, categoryId || null)
      .input('unitPrice', sql.Money, unitPrice)
      .input('unitsInStock', sql.SmallInt, unitsInStock)
      .query(`
        UPDATE Products
        SET ProductName = @productName,
            CategoryID = @categoryId,
            UnitPrice = @unitPrice,
            UnitsInStock = @unitsInStock
        WHERE ProductID = @id
      `);
    res.json({ message: 'Cap nhat san pham thanh cong' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi khi cap nhat san pham' });
  }
});

// 5. Xoa MEM: Chi Admin (Cap nhat Discontinued = 1 de khong vi pham khoa ngoai)
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('UPDATE Products SET Discontinued = 1 WHERE ProductID = @id');
    res.json({ message: 'Da ngung ban san pham (xoa mem)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi khi xoa san pham' });
  }
});

module.exports = router;
