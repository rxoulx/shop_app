const express = require('express');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../db');

const router = express.Router();

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

    // Kiem tra trung lap username
    const existed = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query('SELECT UserId FROM Users WHERE Username = @username');

    if (existed.recordset.length > 0) {
      return res.status(409).json({ message: 'Ten dang nhap da ton tai' });
    }

    // Bam mat khau bang bcrypt voi salt rounds = 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Luu vao bang Users voi RoleId = 3 (KhachHang mac dinh)
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

module.exports = router;
