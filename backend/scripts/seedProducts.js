const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  // MUSCLE BLAZE (5 products)
  {
    name: 'MuscleBlaze BCAA',
    brand: 'MuscleBlaze',
    category: 'BCAA',
    description: 'Premium BCAA supplement with 2:1:1 ratio for muscle recovery and growth. Helps reduce muscle fatigue and supports lean muscle development.',
    price: 1499,
    originalPrice: 1999,
    imageUrl: '/images/products/BCAA.jpg',
    stock: 50,
    rating: 4.5,
    features: [
      '2:1:1 BCAA Ratio',
      'Supports Muscle Recovery',
      'Reduces Fatigue',
      'Enhances Endurance',
      'Zero Sugar'
    ],
    isActive: true
  },
  {
    name: 'MuscleBlaze Creatine Creapure Monohydrate',
    brand: 'MuscleBlaze',
    category: 'Creatine',
    description: 'Pure Creapure creatine monohydrate for enhanced strength, power, and muscle mass. Clinically tested and proven formula.',
    price: 1299,
    originalPrice: 1699,
    imageUrl: '/images/products/CREATINE CREAPURE MONOHYDRATE.jpg',
    stock: 45,
    rating: 4.7,
    features: [
      'Pure Creapure Quality',
      'Increases Strength',
      'Boosts Power Output',
      'Supports Muscle Growth',
      'Micronized Formula'
    ],
    isActive: true
  },
  {
    name: 'MuscleBlaze Fish Oil Capsules',
    brand: 'MuscleBlaze',
    category: 'Omega-3',
    description: 'High-quality fish oil capsules rich in Omega-3 fatty acids. Supports heart health, joint mobility, and overall wellness.',
    price: 899,
    originalPrice: 1199,
    imageUrl: '/images/products/FISH OIL CAPSULES.jpg',
    stock: 60,
    rating: 4.4,
    features: [
      'Rich in Omega-3',
      'Supports Heart Health',
      'Improves Joint Mobility',
      'Brain Function Support',
      'Easy to Swallow'
    ],
    isActive: true
  },
  {
    name: 'MuscleBlaze Biozyme Performance Whey Protein',
    brand: 'MuscleBlaze',
    category: 'Protein',
    description: 'Advanced whey protein with Enhanced Absorption Formula (EAF). 25g protein per serving with superior digestibility.',
    price: 3499,
    originalPrice: 4499,
    imageUrl: '/images/products/PROTEIN BIOZYME PERFORMANCE.jpg',
    stock: 40,
    rating: 4.8,
    features: [
      '25g Protein per Serving',
      'Enhanced Absorption',
      'Digestive Enzymes Added',
      '5.5g BCAAs',
      'Great Taste'
    ],
    isActive: true
  },
  {
    name: 'MuscleBlaze Whey Gold',
    brand: 'MuscleBlaze',
    category: 'Protein',
    description: 'Premium whey protein isolate blend for lean muscle building. Ultra-filtered for maximum purity and absorption.',
    price: 2999,
    originalPrice: 3999,
    imageUrl: '/images/products/WHEY GOLD.jpg',
    stock: 55,
    rating: 4.6,
    features: [
      '24g Protein per Serving',
      'Whey Isolate Blend',
      'Low Fat & Carbs',
      'Fast Absorption',
      'Multiple Flavors'
    ],
    isActive: true
  },

  // MUSCLE-TECH (5 products)
  {
    name: 'MuscleTech Hydroxycut',
    brand: 'MuscleTech',
    category: 'Fat Burner',
    description: 'America\'s #1 selling weight loss supplement. Scientifically researched formula for effective fat burning and energy boost.',
    price: 2499,
    originalPrice: 3299,
    imageUrl: '/images/products/HYDROXYCUT.jpg',
    stock: 35,
    rating: 4.3,
    features: [
      'Scientifically Researched',
      'Boosts Metabolism',
      'Increases Energy',
      'Supports Weight Loss',
      'Caffeine Enhanced'
    ],
    isActive: true
  },
  {
    name: 'MuscleTech Mass-Tech Mass Gainer',
    brand: 'MuscleTech',
    category: 'Mass Gainer',
    description: 'Advanced muscle mass gainer with 80g protein and 1000+ calories per serving. Perfect for hard gainers.',
    price: 4999,
    originalPrice: 6499,
    imageUrl: '/images/products/MASS GAINER – MASS TECH.jpg',
    stock: 30,
    rating: 4.7,
    features: [
      '80g Protein per Serving',
      '1000+ Calories',
      'Multi-Phase Carbs',
      'Creatine Enhanced',
      'Great for Bulking'
    ],
    isActive: true
  },
  {
    name: 'MuscleTech Platinum Multivitamin',
    brand: 'MuscleTech',
    category: 'Vitamins',
    description: 'Complete multivitamin formula designed for active individuals. 18 vitamins and minerals for optimal health.',
    price: 1199,
    originalPrice: 1599,
    imageUrl: '/images/products/MULTI-VITAMIN.jpg',
    stock: 50,
    rating: 4.5,
    features: [
      '18 Vitamins & Minerals',
      'Supports Immunity',
      'Energy Production',
      'Antioxidant Support',
      'Daily Wellness'
    ],
    isActive: true
  },
  {
    name: 'MuscleTech Vapor X5 Pre-Workout',
    brand: 'MuscleTech',
    category: 'Pre-Workout',
    description: 'Explosive pre-workout formula with advanced ingredients. Delivers intense energy, focus, and muscle pumps.',
    price: 2299,
    originalPrice: 2999,
    imageUrl: '/images/products/Preworkout – Vapor X5.jpg',
    stock: 40,
    rating: 4.6,
    features: [
      'Explosive Energy',
      'Enhanced Focus',
      'Massive Pumps',
      'Beta-Alanine',
      'Creatine Complex'
    ],
    isActive: true
  },
  {
    name: 'MuscleTech Nitro-Tech Whey Protein',
    brand: 'MuscleTech',
    category: 'Protein',
    description: 'Superior whey protein formula with 30g protein per serving. Enhanced with creatine and amino acids.',
    price: 3999,
    originalPrice: 5299,
    imageUrl: '/images/products/WHEY – PROTEIN – NITROTECH.jpg',
    stock: 45,
    rating: 4.8,
    features: [
      '30g Protein per Serving',
      'Creatine Enhanced',
      'BCAAs & Glutamine',
      'Builds Lean Muscle',
      'Award Winning Taste'
    ],
    isActive: true
  },

  // MY PROTEIN (5 products)
  {
    name: 'MyProtein BCAA 2:1:1',
    brand: 'MyProtein',
    category: 'BCAA',
    description: 'Essential amino acids in optimal 2:1:1 ratio. Supports muscle recovery and reduces exercise fatigue.',
    price: 1399,
    originalPrice: 1899,
    imageUrl: '/images/products/BCAA.jpg',
    stock: 55,
    rating: 4.4,
    features: [
      '2:1:1 Ratio',
      'Muscle Recovery',
      'Reduces Fatigue',
      'Vegan Friendly',
      'Multiple Flavors'
    ],
    isActive: true
  },
  {
    name: 'MyProtein Creatine Monohydrate',
    brand: 'MyProtein',
    category: 'Creatine',
    description: 'Pure creatine monohydrate powder. Increases physical performance in successive bursts of short-term, high intensity exercise.',
    price: 999,
    originalPrice: 1399,
    imageUrl: '/images/products/CREATINE.jpg',
    stock: 60,
    rating: 4.6,
    features: [
      '100% Pure Creatine',
      'Increases Performance',
      'Boosts Strength',
      'Unflavored',
      'Easy to Mix'
    ],
    isActive: true
  },
  {
    name: 'MyProtein Clear Whey Isolate with Electrolytes',
    brand: 'MyProtein',
    category: 'Protein',
    description: 'Revolutionary clear protein drink with 20g protein and added electrolytes. Light and refreshing alternative to milky shakes.',
    price: 2799,
    originalPrice: 3699,
    imageUrl: '/images/products/PROTEIN WITH ELECTROLYTES.jpg',
    stock: 40,
    rating: 4.7,
    features: [
      '20g Protein per Serving',
      'Added Electrolytes',
      'Light & Refreshing',
      'Hydration Support',
      'Fruity Flavors'
    ],
    isActive: true
  },
  {
    name: 'MyProtein Thermopure',
    brand: 'MyProtein',
    category: 'Fat Burner',
    description: 'Advanced thermogenic formula with green tea extract, caffeine, and L-carnitine. Supports metabolism and energy.',
    price: 1799,
    originalPrice: 2399,
    imageUrl: '/images/products/THERMOPURE.jpg',
    stock: 45,
    rating: 4.3,
    features: [
      'Thermogenic Formula',
      'Green Tea Extract',
      'Caffeine Boost',
      'L-Carnitine',
      'Metabolism Support'
    ],
    isActive: true
  },
  {
    name: 'MyProtein Impact Whey Isolate',
    brand: 'MyProtein',
    category: 'Protein',
    description: 'Premium whey protein isolate with 90% protein content. Ultra-low fat and carbs for lean muscle building.',
    price: 3299,
    originalPrice: 4299,
    imageUrl: '/images/products/WHEY ISOLATE.jpg',
    stock: 50,
    rating: 4.8,
    features: [
      '23g Protein per Serving',
      '90% Protein Content',
      'Ultra Low Fat',
      'Fast Absorption',
      'Great Mixability'
    ],
    isActive: true
  },

  // NUTRABAY (5 products)
  {
    name: 'Nutrabay Pure Creatine Monohydrate',
    brand: 'Nutrabay',
    category: 'Creatine',
    description: 'Micronized creatine monohydrate for better absorption. Enhances strength, power, and muscle mass.',
    price: 899,
    originalPrice: 1299,
    imageUrl: '/images/products/CREATINE MONOHYDRATE.jpg',
    stock: 65,
    rating: 4.5,
    features: [
      'Micronized Formula',
      'Better Absorption',
      'Increases Strength',
      'Supports Muscle Growth',
      'Unflavored'
    ],
    isActive: true
  },
  {
    name: 'Nutrabay Pure L-Glutamine',
    brand: 'Nutrabay',
    category: 'Amino Acids',
    description: 'Pure L-Glutamine powder for muscle recovery and immune support. Essential for intense training.',
    price: 1099,
    originalPrice: 1499,
    imageUrl: '/images/products/L -GLUTAMINE.jpg',
    stock: 55,
    rating: 4.4,
    features: [
      '100% Pure L-Glutamine',
      'Muscle Recovery',
      'Immune Support',
      'Gut Health',
      'Unflavored'
    ],
    isActive: true
  },
  {
    name: 'Nutrabay Pure 100% Plant Protein',
    brand: 'Nutrabay',
    category: 'Protein',
    description: 'Complete plant-based protein from pea and brown rice. Perfect for vegans and vegetarians.',
    price: 1999,
    originalPrice: 2699,
    imageUrl: '/images/products/PLANT PROTEIN.jpg',
    stock: 45,
    rating: 4.6,
    features: [
      '25g Plant Protein',
      'Vegan & Vegetarian',
      'Complete Amino Profile',
      'Easy Digestion',
      'No Dairy'
    ],
    isActive: true
  },
  {
    name: 'Nutrabay Spark Pre-Workout',
    brand: 'Nutrabay',
    category: 'Pre-Workout',
    description: 'Advanced pre-workout formula with caffeine, beta-alanine, and citrulline. Delivers energy, focus, and endurance.',
    price: 1799,
    originalPrice: 2399,
    imageUrl: '/images/products/PREWORKOUT - SPARK.jpg',
    stock: 50,
    rating: 4.5,
    features: [
      'Energy & Focus',
      'Beta-Alanine',
      'Citrulline Malate',
      'Caffeine Boost',
      'Great Taste'
    ],
    isActive: true
  },
  {
    name: 'Nutrabay Gold 100% Whey Protein Concentrate',
    brand: 'Nutrabay',
    category: 'Protein',
    description: 'Premium whey protein concentrate with 24g protein per serving. Ideal for muscle building and recovery.',
    price: 2499,
    originalPrice: 3299,
    imageUrl: '/images/products/WHEY GOLD CONCENTRATE.jpg',
    stock: 60,
    rating: 4.7,
    features: [
      '24g Protein per Serving',
      '5.5g BCAAs',
      '4g Glutamine',
      'Great Mixability',
      'Multiple Flavors'
    ],
    isActive: true
  },

  // OPTIMUM NUTRITION (5 products)
  {
    name: 'Optimum Nutrition Opti-Men Multivitamin',
    brand: 'Optimum Nutrition',
    category: 'Vitamins',
    description: 'Complete nutrient optimization system for men. 75+ active ingredients including vitamins, minerals, and amino acids.',
    price: 1899,
    originalPrice: 2499,
    imageUrl: '/images/products/MULTI VITAMIN.jpg',
    stock: 45,
    rating: 4.8,
    features: [
      '75+ Active Ingredients',
      'Amino Acid Blend',
      'Antioxidant Support',
      'Energy & Focus',
      'Daily Wellness'
    ],
    isActive: true
  },
  {
    name: 'Optimum Nutrition Opti-Women Multivitamin',
    brand: 'Optimum Nutrition',
    category: 'Vitamins',
    description: 'Complete multivitamin designed specifically for active women. 40+ active ingredients for optimal health.',
    price: 1899,
    originalPrice: 2499,
    imageUrl: '/images/products/MULTIVITAMIN WOMEN.jpg',
    stock: 40,
    rating: 4.7,
    features: [
      '40+ Active Ingredients',
      'Women\'s Health Support',
      'Calcium & Iron',
      'Beauty Blend',
      'Energy Support'
    ],
    isActive: true
  },
  {
    name: 'Optimum Nutrition Gold Standard 100% Plant Protein',
    brand: 'Optimum Nutrition',
    category: 'Protein',
    description: 'Premium plant-based protein from multiple sources. 24g protein with complete amino acid profile.',
    price: 3499,
    originalPrice: 4499,
    imageUrl: '/images/products/Plant Based Protein.jpg',
    stock: 35,
    rating: 4.6,
    features: [
      '24g Plant Protein',
      'Multi-Source Blend',
      'Complete Amino Profile',
      'Vegan Friendly',
      'Great Taste'
    ],
    isActive: true
  },
  {
    name: 'Optimum Nutrition Gold Standard Pre-Workout',
    brand: 'Optimum Nutrition',
    category: 'Pre-Workout',
    description: 'Legendary pre-workout formula with caffeine, creatine, and beta-alanine. Delivers explosive energy and focus.',
    price: 2799,
    originalPrice: 3699,
    imageUrl: '/images/products/Pre Workout.jpg',
    stock: 50,
    rating: 4.8,
    features: [
      'Explosive Energy',
      'Enhanced Focus',
      'Creatine Monohydrate',
      'Beta-Alanine',
      'Trusted Quality'
    ],
    isActive: true
  },
  {
    name: 'Optimum Nutrition Gold Standard 100% Whey Protein',
    brand: 'Optimum Nutrition',
    category: 'Protein',
    description: 'The world\'s best-selling whey protein. 24g protein per serving with 5.5g naturally occurring BCAAs.',
    price: 4999,
    originalPrice: 5999,
    imageUrl: '/images/products/Whey Gold Standard.jpg',
    stock: 70,
    rating: 4.9,
    features: [
      '24g Protein per Serving',
      '5.5g BCAAs',
      '4g Glutamine',
      'Banned Substance Tested',
      'Award Winning Taste'
    ],
    isActive: true
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert all products
    await Product.insertMany(products);
    console.log(`✓ Successfully added ${products.length} products!`);
    
    // Show summary by brand
    const brands = [...new Set(products.map(p => p.brand))];
    console.log('\n📦 Products by Brand:');
    brands.forEach(brand => {
      const count = products.filter(p => p.brand === brand).length;
      console.log(`  - ${brand}: ${count} products`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
