const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql, poolPromise } = require('../db');

const router = express.Router();

// 1. API Dang ky (Lab 6)
router.post('/register', async (req, res) => {
  const { username, password, fullName, email } = req.body;
  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Thieu thong tin bat buoc' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mat khau phai co it nhat 6 ky tu' });
  }
  try {
    const pool = await poolPromise;
    const existed = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query('SELECT UserId FROM Users WHERE Username = @username');

    if (existed.recordset.length > 0) {
      return res.status(409).json({ message: 'Ten dang nhap da ton tai' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('fullName', sql.NVarChar, fullName)
      .input('email', sql.NVarChar, email || null)
      .query(`
        INSERT INTO Users (Username, PasswordHash, FullName, Email, RoleId)
        VALUES (@username, @passwordHash, @fullName, @email, 3)
      `);

    res.status(201).json({ message: 'Dang ky thanh cong, hay dang nhap' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi may chu khi dang ky' });
  }
});

// 2. API Dang nhap (Lab 7)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Thieu ten dang nhap hoac mat khau' });
  }
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query(`
        SELECT u.UserId, u.Username, u.PasswordHash, u.FullName, r.RoleName
        FROM Users u 
        JOIN Roles r ON u.RoleId = r.RoleId
        WHERE u.Username = @username
      `);

    const user = result.recordset[0];
    // Tra cung mot thong bao loi de tranh do quet tai khoan
    if (!user) {
      return res.status(401).json({ message: 'Sai ten dang nhap hoac mat khau' });
    }

    const hopLe = await bcrypt.compare(password, user.PasswordHash);
    if (!hopLe) {
      return res.status(401).json({ message: 'Sai ten dang nhap hoac mat khau' });
    }

    // Tao JWT token voi payload userId, username, role va han dung 2h
    const token = jwt.sign(
      { userId: user.UserId, username: user.Username, role: user.RoleName },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        username: user.Username,
        fullName: user.FullName,
        role: user.RoleName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Loi may chu khi dang nhap' });
  }
});

module.exports = router;
