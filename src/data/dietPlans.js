// Diet plans based on BMI category and dietary preference

export const dietPlans = {
  underweight: {
    vegetarian: [
      { meal: 'Breakfast', items: ['Oatmeal with nuts and banana', 'Whole grain toast with peanut butter', 'Fresh fruit smoothie'] },
      { meal: 'Mid-Morning', items: ['Mixed nuts and dried fruits', 'Protein shake'] },
      { meal: 'Lunch', items: ['Brown rice with dal', 'Paneer curry', 'Mixed vegetable salad', 'Yogurt'] },
      { meal: 'Evening Snack', items: ['Whole grain crackers with hummus', 'Fresh fruit'] },
      { meal: 'Dinner', items: ['Quinoa with chickpea curry', 'Sautéed vegetables', 'Lentil soup'] }
    ],
    'non-vegetarian': [
      { meal: 'Breakfast', items: ['Scrambled eggs with whole grain toast', 'Oatmeal with nuts', 'Fresh fruit smoothie'] },
      { meal: 'Mid-Morning', items: ['Greek yogurt with granola', 'Mixed nuts'] },
      { meal: 'Lunch', items: ['Grilled chicken breast', 'Brown rice', 'Mixed vegetables', 'Salad'] },
      { meal: 'Evening Snack', items: ['Tuna sandwich', 'Fresh fruit'] },
      { meal: 'Dinner', items: ['Baked salmon', 'Quinoa', 'Steamed broccoli', 'Lentil soup'] }
    ]
  },
  normal: {
    vegetarian: [
      { meal: 'Breakfast', items: ['Whole grain cereal with milk', 'Fresh fruit', 'Green tea'] },
      { meal: 'Mid-Morning', items: ['Apple with almond butter', 'Herbal tea'] },
      { meal: 'Lunch', items: ['Brown rice with dal', 'Mixed vegetable curry', 'Salad', 'Buttermilk'] },
      { meal: 'Evening Snack', items: ['Roasted chickpeas', 'Fresh vegetables'] },
      { meal: 'Dinner', items: ['Vegetable soup', 'Whole wheat roti', 'Paneer tikka', 'Cucumber salad'] }
    ],
    'non-vegetarian': [
      { meal: 'Breakfast', items: ['Boiled eggs', 'Whole grain toast', 'Fresh fruit', 'Green tea'] },
      { meal: 'Mid-Morning', items: ['Greek yogurt', 'Mixed berries'] },
      { meal: 'Lunch', items: ['Grilled chicken', 'Brown rice', 'Steamed vegetables', 'Salad'] },
      { meal: 'Evening Snack', items: ['Protein shake', 'Handful of nuts'] },
      { meal: 'Dinner', items: ['Baked fish', 'Quinoa', 'Roasted vegetables', 'Clear soup'] }
    ]
  },
  overweight: {
    vegetarian: [
      { meal: 'Breakfast', items: ['Oatmeal with berries', 'Green tea', 'Handful of almonds'] },
      { meal: 'Mid-Morning', items: ['Fresh fruit salad', 'Herbal tea'] },
      { meal: 'Lunch', items: ['Quinoa salad', 'Grilled vegetables', 'Lentil soup', 'Cucumber raita'] },
      { meal: 'Evening Snack', items: ['Carrot and celery sticks', 'Hummus'] },
      { meal: 'Dinner', items: ['Vegetable soup', 'Steamed broccoli', 'Tofu stir-fry', 'Green salad'] }
    ],
    'non-vegetarian': [
      { meal: 'Breakfast', items: ['Egg white omelet', 'Whole grain toast', 'Green tea'] },
      { meal: 'Mid-Morning', items: ['Low-fat Greek yogurt', 'Berries'] },
      { meal: 'Lunch', items: ['Grilled chicken breast', 'Quinoa', 'Steamed vegetables', 'Green salad'] },
      { meal: 'Evening Snack', items: ['Protein shake', 'Cucumber slices'] },
      { meal: 'Dinner', items: ['Baked fish', 'Steamed broccoli', 'Mixed greens salad', 'Clear soup'] }
    ]
  },
  obese: {
    vegetarian: [
      { meal: 'Breakfast', items: ['Steel-cut oats with cinnamon', 'Green tea', 'Small apple'] },
      { meal: 'Mid-Morning', items: ['Cucumber and tomato salad', 'Herbal tea'] },
      { meal: 'Lunch', items: ['Large mixed salad', 'Lentil soup', 'Steamed vegetables', 'Buttermilk'] },
      { meal: 'Evening Snack', items: ['Carrot sticks', 'Celery', 'Green tea'] },
      { meal: 'Dinner', items: ['Clear vegetable soup', 'Steamed broccoli', 'Grilled tofu', 'Cucumber salad'] }
    ],
    'non-vegetarian': [
      { meal: 'Breakfast', items: ['Egg white omelet with spinach', 'Green tea', 'Small orange'] },
      { meal: 'Mid-Morning', items: ['Low-fat yogurt', 'Cucumber slices'] },
      { meal: 'Lunch', items: ['Grilled chicken breast', 'Large green salad', 'Steamed vegetables', 'Clear soup'] },
      { meal: 'Evening Snack', items: ['Protein shake', 'Celery sticks'] },
      { meal: 'Dinner', items: ['Baked white fish', 'Steamed broccoli', 'Mixed greens', 'Clear broth'] }
    ]
  }
};

export function getDietPlan(bmiCategory, dietPreference = 'non-vegetarian') {
  const category = bmiCategory?.toLowerCase() || 'normal';
  const preference = dietPreference || 'non-vegetarian';
  
  if (dietPlans[category] && dietPlans[category][preference]) {
    return dietPlans[category][preference];
  }
  
  // Default to normal non-vegetarian if category not found
  return dietPlans.normal['non-vegetarian'];
}
