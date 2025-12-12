const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Helper: determine category and calorie/diet
// Uses Mifflin-St Jeor Equation for accurate calorie calculation
function analyzeBMI({ heightCm, weightKg, age, gender }) {
  // Calculate BMI: weight (kg) / height (m)²
  const heightM = heightCm / 100;
  const bmi = +(weightKg / (heightM * heightM)).toFixed(1);
  
  // Determine BMI category based on WHO standards
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';

  // Proper calorie estimation using Mifflin-St Jeor Equation
  // BMR (Basal Metabolic Rate) - calories burned at rest
  let bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  
  // TDEE (Total Daily Energy Expenditure) = BMR × Activity Factor
  // Using sedentary activity level (1.2) as baseline
  const tdee = bmr * 1.2;
  
  let calories;
  if (category === 'Underweight') {
    // Add 300-500 calories for healthy weight gain (0.5kg per week)
    calories = Math.round(tdee + 400);
  } else if (category === 'Overweight') {
    // Moderate deficit for weight loss (0.5kg per week = 500 kcal deficit)
    // But not too aggressive
    calories = Math.round(tdee - 400);
  } else if (category === 'Obese') {
    // Conservative deficit for obese individuals
    // Aim for 0.5-1kg per week (500-750 kcal deficit)
    // But ensure safe minimum calories
    const deficit = Math.round(tdee - 600);
    const minCalories = gender === 'male' ? 1800 : 1500;
    calories = Math.max(deficit, minCalories);
  } else {
    // Normal weight - maintenance calories (TDEE)
    calories = Math.round(tdee);
  }

  // Minimal diet plan suggestions
  const dietPlan = {
    breakfast: category === 'Underweight' ? 'Oatmeal with milk, nuts, banana' : 'Greek yogurt, oats, berries',
    lunch: category === 'Underweight' ? 'Rice, chicken, vegetables' : 'Quinoa salad, grilled fish/chicken',
    dinner: category === 'Underweight' ? 'Pasta with veggies and protein' : 'Mixed vegetables & lean protein',
    snacks: category === 'Underweight' ? 'Peanut butter sandwich, smoothies' : 'Fruits, nuts, hummus'
  };
  const include = category === 'Underweight' ? ['Nuts', 'Whole grains', 'Healthy fats'] : ['Lean protein', 'Veggies', 'Fruits'];
  const avoid = category === 'Underweight' ? ['Empty calories'] : ['Sugary drinks', 'Processed snacks'];

  return { bmi, category, caloriesPerDay: calories, dietPlan, include, avoid };
}

// POST /api/bmi/calc -> calculate and store
router.post('/calc', auth, async (req, res) => {
  const { heightCm, weightKg, age, gender } = req.body;
  if (!heightCm || !weightKg) return res.status(400).json({ message: 'Missing height or weight' });
  const result = analyzeBMI({ heightCm, weightKg, age: age || req.user.age || 25, gender: gender || req.user.gender || 'male' });
  try {
    req.user.bmiHistory.push({ bmi: result.bmi, category: result.category, caloriesPerDay: result.caloriesPerDay, dietPlan: result.dietPlan });
    await req.user.save();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET history
router.get('/history', auth, async (req, res) => {
  res.json({ history: req.user.bmiHistory || [] });
});

module.exports = router;
