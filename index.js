


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require("./models/User");
const productsRouter = require('./routes/products');
const productDetailsRouter = require('./routes/productDetails');
const usersRouter = require("./routes/users");
const ordersRouter = require('./routes/orders');
const adminProductsRoute = require("./routes/adminProducts");

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// CORS config for frontend with credentials
// const corsOptions = {
//     origin: "http://localhost:5173",
//      // frontend URL
//     credentials: true,
// };

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connect
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/products", productDetailsRouter);
app.use("/orders", ordersRouter);

// Step 8: Admin products
app.use("/admin-products", adminProductsRoute);

// Test route
app.get('/', (req, res) => res.send('Hello From Garments Server!'));

app.listen(port, () => console.log(`Server running on port ${port}`));
