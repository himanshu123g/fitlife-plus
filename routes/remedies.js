const express = require('express');
const router = express.Router();

const remedies = [
  { key: 'cold', title: 'Cold', remedies: ['Warm honey-lemon drink', 'Steam inhalation with eucalyptus', 'Ginger tea'], tips: 'Rest and stay hydrated' },
  { key: 'cough', title: 'Cough', remedies: ['Honey + warm water', 'Saltwater gargle', 'Thyme tea'], tips: 'Avoid smoke and allergens' },
  { key: 'headache', title: 'Headache', remedies: ['Peppermint oil on temples', 'Cold compress', 'Ginger tea'], tips: 'Hydrate and rest' },
  { key: 'stomach', title: 'Stomach Pain', remedies: ['Ginger, fennel tea', 'BRAT diet', 'Warm compress'], tips: 'Eat bland foods' },
  { key: 'fever', title: 'Fever', remedies: ['Stay hydrated', 'Lukewarm sponge bath', 'Tulsi (holy basil) tea'], tips: 'Monitor temperature' },
  { key: 'sorethroat', title: 'Sore Throat', remedies: ['Saltwater gargle', 'Warm honey tea', 'Steam inhalation'], tips: 'Avoid irritants' }
];

router.get('/', (req, res) => res.json({ remedies }));
router.get('/:key', (req, res) => {
  const item = remedies.find(r => r.key === req.params.key);
  if (!item) return res.status(404).json({ message: 'Remedy not found' });
  res.json(item);
});

module.exports = router;
