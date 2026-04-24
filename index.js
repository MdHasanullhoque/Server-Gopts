
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

// const corsOptions = {
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true
// };


// # MONGO_URI=mongodb+srv://garmentsDB:Hasan1985%21@nodecluster.sjoeqfc.mongodb.net/garmentsDB?retryWrites=true&w=majority
// # PORT=3000




// ================= CORS =================
// const corsOptions = {
//     origin: [
//         "http://localhost:5173",           // local frontend
//         "https://your-frontend.vercel.app" // deployed frontend
//     ],
//     credentials: true,
// };

//akjke 

// ✅ এভাবে fix করো
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://client-gopts.vercel.app" // তোমার actual client URL দাও
    ],
    credentials: true,
};




//ajke ses

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connect
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/users", usersRouter);

// app.use("/products", productsRouter);
// app.use("/products", productDetailsRouter);
app.use("/products", productsRouter);
app.use("/product-details", productDetailsRouter); // new path

app.use("/orders", ordersRouter);



//ajke
// // Get all products
// app.get("/products", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.send(products);
//     } catch (error) {
//         res.status(500).send({ error: "Failed to fetch products" });
//     }
// });

// // Get single product
// app.get("/products/:id", async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     res.send(product);
// });

//ajke ses



// Step 8: Admin products
app.use("/admin-products", adminProductsRoute);

// Test route
app.get('/', (req, res) => res.send('Hello From Garments Server!'));

app.listen(port, () => console.log(`Server running on port ${port}`));
