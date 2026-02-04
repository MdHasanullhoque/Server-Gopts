

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require("./models/User");       // User model
const productsRouter = require('./routes/products');
const productDetailsRouter = require('./routes/productDetails');
const usersRouter = require("./routes/users");
const ordersRouter = require('./routes/orders');

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// Enable CORS & JSON
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// ================= Routes =================
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/products", productDetailsRouter);
app.use('/orders', ordersRouter);

// ================= Sync user for any login =================
// This route is called from frontend after Google login or normal register/login
app.post("/users/sync", async (req, res) => {
    const { uid, name, email, photoURL, role, status } = req.body;

    try {
        // Check if user already exists by email
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            // Optional: update name/photoURL if changed
            existingUser.name = name || existingUser.name;
            existingUser.photoURL = photoURL || existingUser.photoURL;
            await existingUser.save();

            return res.json({ message: "User already exists, updated info" });
        }

        // If not exists → create new
        const newUser = new User({
            uid,
            name,
            email,
            photoURL: photoURL || "",
            role: role || "buyer",
            status: status || "approved"
        });
        
        await newUser.save();

        res.json({ message: "User synced successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/', (req, res) => {
    res.send('Hello From Garments Server!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
