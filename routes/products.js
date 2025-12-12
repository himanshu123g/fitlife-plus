const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all active and approved products (for users)
router.get('/', async (req, res) => {
  try {
    const { category, brand } = req.query;
    const filter = { isActive: true, approved: true }; // Only show approved products
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all brands
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({ brands });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
