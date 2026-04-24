require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productsRouter = require('./routes/products');
const productDetailsRouter = require('./routes/productDetails');
const usersRouter = require("./routes/users");
const ordersRouter = require('./routes/orders');
const adminProductsRoute = require("./routes/adminProducts");

const app = express();
const uri = process.env.MONGO_URI;

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://client-gopts.vercel.app",
        "https://goptsbd.netlify.app",
        "https://dbhopegopts.netlify.app"
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connect with caching for serverless
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB connected');
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/product-details", productDetailsRouter);
app.use("/orders", ordersRouter);
app.use("/admin-products", adminProductsRoute);

app.get('/', (req, res) => res.send('Hello From Garments Server!'));

module.exports = app;