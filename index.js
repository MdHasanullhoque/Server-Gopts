// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();
// const port = process.env.PORT || 3000;
// const uri = process.env.MONGO_URI;

// // MongoDB connect
// mongoose.connect(uri)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

    
// app.get('/', (req, res) => {
//     res.send('Hello From Garments Server!');
// });

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

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
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

app.get('/', (req, res) => {
    res.send('Hello From Garments Server!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
