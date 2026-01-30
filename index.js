
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Enable CORS
app.use(cors());

// JSON support
app.use(express.json());

// MongoDB connect
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const productsRouter = require('./routes/products'); //only 6 data
const productDetailsRouter = require('./routes/productDetails');   // Single product details 

// const usersRouter = require("./routes/users"); // correct path
// app.use("./routes/users.js", usersRouter);
const usersRouter = require("./routes/users");


//30-01-2026


const ordersRouter = require('./routes/orders');  // add this
app.use('/orders', ordersRouter);                 // add this



app.use("/users", usersRouter);  // lowercase


app.use('/products', productsRouter);           // /products → list of 6
app.use('/products', productDetailsRouter);      // /product/:id → single product




app.get('/', (req, res) => {
    res.send('Hello From Garments Server!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



