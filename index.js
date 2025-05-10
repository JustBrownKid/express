const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

require('dotenv').config();


app.use(express.json());

const Product = require('./models/productModel');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err);
    });

// Home route
app.get('/', (req, res) => {
    res.send('Hello my friend, welcome to my MERN stack app');
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new product const product = await Product.create(req.body);

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a product by ID
app.get('/product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a product by ID
app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
