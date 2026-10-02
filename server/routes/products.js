const express = require('express');
const { sql, poolPromise } = require('../db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Xem danh sach: Cong khai, khong can dang nhap
router.get('/', async (req, res) => {
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

// Them san pham: Yeu cau quyen Admin hoac NhanVien
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'NhanVien'),
  async (req, res) => {
    res.json({ message: 'Xac thuc hop le de them san pham' });
  }
);

// Sua san pham: Yeu cau quyen Admin hoac NhanVien
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'NhanVien'),
  async (req, res) => {
    res.json({ message: `Xac thuc hop le de sua san pham ${req.params.id}` });
  }
);

// Xoa san pham: CHI Admin duoc phep
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  async (req, res) => {
    res.json({ message: `Xac thuc hop le de xoa san pham ${req.params.id}` });
  }
);

module.exports = router;
