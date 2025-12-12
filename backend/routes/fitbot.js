const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/tree', (req, res) => {
  const file = path.join(__dirname, '..', 'data', 'decisionTree.json');
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to load tree' });
    res.json(JSON.parse(data));
  });
});

module.exports = router;
