require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .catch(err => {
    process.exit(1);
  });

app.use('/api', require('./routes/api'));

app.listen(PORT, () => {
});
