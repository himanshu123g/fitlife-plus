const express = require('express');
const router = express.Router();
const Supplement = require('../models/Supplement');

// Seed sample (idempotent)
const sample = [
  {
    name: 'Whey Protein',
    brand: 'FitBrand',
    image: 'https://via.placeholder.com/150',
    usage: 'Post-workout: 1 scoop with water/milk',
    benefits: 'High-quality protein for muscle recovery',
    affiliateLink: 'https://example.com/product/whey'
  },
  {
    name: 'Creatine Monohydrate',
    brand: 'MuscleLab',
    image: 'https://via.placeholder.com/150',
    usage: '5g daily, any time',
    benefits: 'Improves strength and power',
    affiliateLink: 'https://example.com/product/creatine'
  }
];

router.get('/', async (req, res) => {
  let list = await Supplement.find().lean();
  if (!list.length) {
    await Supplement.insertMany(sample);
    list = await Supplement.find().lean();
  }
  res.json(list);
});

module.exports = router;
