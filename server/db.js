const sql = require('mssql');
require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true, // dung chung chi tu ky trong container
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Da ket noi SQL Server thanh cong');
    return pool;
  })
  .catch((err) => console.error('Loi ket noi CSDL:', err));

module.exports = { sql, poolPromise };
