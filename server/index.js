const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

// Dang ky cac router
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server dang chay tai cong ${PORT}`));
