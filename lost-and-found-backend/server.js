require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const claimsRouter = require('./routes/claims');

const app = express();

app.use(cors());
app.use(express.json());

const { MONGO_URI, PORT = 3000 } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.use('/api/items', itemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/claims', claimsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
