// Home Remedies Data - Comprehensive and Professional
// Categories: Common Illness, Digestion, Seasonal, Fitness Recovery, Immunity

import { newRemedies } from './newRemedies';

export const remediesData = [
  // COMMON ILLNESS
  {
    id: 1,
    title: "Common Cold",
    category: "Common Illness",
    shortDescription: "Natural relief for cold symptoms and congestion",
    icon: "cold",
    symptoms: [
      "Runny or stuffy nose",
      "Sneezing and coughing",
      "Sore throat",
      "Mild headache",
      "Low-grade fever"
    ],
    causes: [
      "Viral infection (rhinovirus)",
      "Weakened immune system",
      "Exposure to cold weather",
      "Contact with infected persons"
    ],
    treatments: [
      "Drink warm water with honey and lemon",
      "Gargle with salt water 2-3 times daily",
      "Steam inhalation with eucalyptus oil",
      "Consume ginger tea with tulsi leaves",
      "Get adequate rest (7-8 hours)",
      "Stay hydrated with warm fluids"
    ],
    avoid: [
      "Cold beverages and ice cream",
      "Dairy products (may increase mucus)",
      "Fried and oily foods",
      "Going out in cold weather",
      "Smoking and alcohol"
    ],
    whenToConsult: "If symptoms persist beyond 10 days, high fever develops, or breathing becomes difficult"
  },
  {
    id: 2,
    title: "Cough",
    category: "Common Illness",
    shortDescription: "Soothing remedies for dry and wet cough",
    icon: "cough",
    symptoms: [
      "Persistent throat irritation",
      "Dry or productive cough",
      "Chest discomfort",
      "Difficulty sleeping",
      "Throat pain"
    ],
    causes: [
      "Viral or bacterial infection",
      "Allergies and irritants",
      "Post-nasal drip",
      "Acid reflux",
      "Environmental pollutants"
    ],
    treatments: [
      "Mix 1 tsp honey with warm water, drink before bed",
      "Ginger and tulsi tea 2-3 times daily",
      "Turmeric milk (haldi doodh) at night",
      "Gargle with warm salt water",
      "Inhale steam with a few drops of eucalyptus oil",
      "Chew on cloves or drink clove tea"
    ],
    avoid: [
      "Cold drinks and ice",
      "Spicy and fried foods",
      "Smoking and secondhand smoke",
      "Dusty environments",
      "Excessive talking"
    ],
    whenToConsult: "If cough lasts more than 3 weeks, blood in mucus, or severe chest pain"
  },
  {
    id: 3,
    title: "Headache",
    category: "Common Illness",
    shortDescription: "Quick relief for tension and mild headaches",
    icon: "headache",
    symptoms: [
      "Dull, aching head pain",
      "Tightness across forehead",
      "Tenderness on scalp",
      "Neck and shoulder tension",
      "Sensitivity to light"
    ],
    causes: [
      "Stress and tension",
      "Dehydration",
      "Poor posture",
      "Lack of sleep",
      "Eye strain from screens"
    ],
    treatments: [
      "Apply cold compress on forehead for 15 minutes",
      "Massage temples with peppermint oil",
      "Drink plenty of water (8-10 glasses)",
      "Practice deep breathing exercises",
      "Rest in a dark, quiet room",
      "Drink ginger tea or coffee (caffeine helps)"
    ],
    avoid: [
      "Loud noises and bright lights",
      "Skipping meals",
      "Excessive screen time",
      "Alcohol and smoking",
      "Strong perfumes"
    ],
    whenToConsult: "If headache is sudden and severe, accompanied by vision changes, or occurs after head injury"
  },
  {
    id: 4,
    title: "Fever",
    category: "Common Illness",
    shortDescription: "Natural ways to manage mild fever at home",
    icon: "fever",
    symptoms: [
      "Body temperature above 100.4°F (38°C)",
      "Chills and sweating",
      "Body aches",
      "Weakness and fatigue",
      "Loss of appetite"
    ],
    causes: [
      "Viral or bacterial infection",
      "Inflammation",
      "Heat exhaustion",
      "Certain medications",
      "Immune response"
    ],
    treatments: [
      "Stay hydrated with water, coconut water, ORS",
      "Take lukewarm sponge bath",
      "Drink tulsi (holy basil) tea",
      "Consume light, easily digestible foods",
      "Rest in a cool, comfortable room",
      "Apply cool compress on forehead"
    ],
    avoid: [
      "Heavy, oily foods",
      "Excessive blankets (allow body to cool)",
      "Cold water baths",
      "Strenuous activities",
      "Dehydration"
    ],
    whenToConsult: "If fever exceeds 103°F (39.4°C), lasts more than 3 days, or accompanied by severe symptoms"
  },
  {
    id: 5,
    title: "Sore Throat",
    category: "Common Illness",
    shortDescription: "Soothing relief for throat pain and irritation",
    icon: "throat",
    symptoms: [
      "Pain when swallowing",
      "Scratchy throat sensation",
      "Swollen glands in neck",
      "Hoarse voice",
      "Redness in throat"
    ],
    causes: [
      "Viral infection (cold, flu)",
      "Bacterial infection (strep throat)",
      "Allergies",
      "Dry air",
      "Excessive shouting or talking"
    ],
    treatments: [
      "Gargle with warm salt water every 2-3 hours",
      "Drink warm water with honey and lemon",
      "Consume turmeric milk before bed",
      "Suck on lozenges or hard candy",
      "Use a humidifier in your room",
      "Drink herbal teas (chamomile, ginger)"
    ],
    avoid: [
      "Cold beverages",
      "Spicy and acidic foods",
      "Smoking and alcohol",
      "Shouting or excessive talking",
      "Dry, dusty environments"
    ],
    whenToConsult: "If severe pain, difficulty breathing, high fever, or symptoms last more than a week"
  },

  // DIGESTION
  {
    id: 6,
    title: "Acidity & Heartburn",
    category: "Digestion",
    shortDescription: "Natural remedies for acid reflux and indigestion",
    icon: "acidity",
    symptoms: [
      "Burning sensation in chest",
      "Sour taste in mouth",
      "Bloating and gas",
      "Nausea",
      "Difficulty swallowing"
    ],
    causes: [
      "Spicy and oily foods",
      "Overeating",
      "Lying down after meals",
      "Stress and anxiety",
      "Certain medications"
    ],
    treatments: [
      "Drink cold milk or buttermilk",
      "Chew fennel seeds (saunf) after meals",
      "Consume banana or papaya",
      "Drink coconut water",
      "Take 1 tsp of baking soda in water (occasional use)",
      "Eat small, frequent meals"
    ],
    avoid: [
      "Spicy, fried, and fatty foods",
      "Citrus fruits and tomatoes",
      "Chocolate and caffeine",
      "Carbonated drinks",
      "Lying down immediately after eating"
    ],
    whenToConsult: "If symptoms occur frequently, severe chest pain, or difficulty swallowing"
  },
  {
    id: 7,
    title: "Stomach Pain",
    category: "Digestion",
    shortDescription: "Relief for common stomach discomfort",
    icon: "stomach",
    symptoms: [
      "Abdominal cramping",
      "Bloating",
      "Nausea",
      "Loss of appetite",
      "Discomfort after eating"
    ],
    causes: [
      "Indigestion",
      "Gas and bloating",
      "Food intolerance",
      "Stress",
      "Overeating"
    ],
    treatments: [
      "Drink warm ginger tea",
      "Apply warm compress on abdomen",
      "Consume ajwain (carom seeds) water",
      "Drink peppermint tea",
      "Eat light, bland foods (rice, banana)",
      "Practice gentle abdominal massage"
    ],
    avoid: [
      "Heavy, greasy foods",
      "Dairy products (if lactose intolerant)",
      "Carbonated beverages",
      "Alcohol and caffeine",
      "Eating too quickly"
    ],
    whenToConsult: "If severe pain, blood in stool, persistent vomiting, or pain lasts more than 24 hours"
  },
  {
    id: 8,
    title: "Constipation",
    category: "Digestion",
    shortDescription: "Natural ways to improve bowel movements",
    icon: "constipation",
    symptoms: [
      "Infrequent bowel movements",
      "Hard, dry stools",
      "Straining during bowel movements",
      "Abdominal discomfort",
      "Feeling of incomplete evacuation"
    ],
    causes: [
      "Low fiber diet",
      "Dehydration",
      "Lack of physical activity",
      "Ignoring urge to go",
      "Certain medications"
    ],
    treatments: [
      "Drink warm water with lemon in the morning",
      "Consume fiber-rich foods (fruits, vegetables, whole grains)",
      "Drink plenty of water (8-10 glasses daily)",
      "Eat prunes or drink prune juice",
      "Take 1-2 tsp of isabgol (psyllium husk) with water",
      "Exercise regularly (walking, yoga)"
    ],
    avoid: [
      "Processed and junk foods",
      "Excessive dairy products",
      "Red meat",
      "Refined flour products",
      "Ignoring the urge to defecate"
    ],
    whenToConsult: "If constipation lasts more than 2 weeks, severe pain, or blood in stool"
  },

  // SEASONAL
  {
    id: 9,
    title: "Seasonal Allergies",
    category: "Seasonal",
    shortDescription: "Managing pollen and seasonal allergy symptoms",
    icon: "allergy",
    symptoms: [
      "Sneezing and runny nose",
      "Itchy, watery eyes",
      "Nasal congestion",
      "Scratchy throat",
      "Fatigue"
    ],
    causes: [
      "Pollen from trees, grass, weeds",
      "Mold spores",
      "Dust mites",
      "Pet dander",
      "Weather changes"
    ],
    treatments: [
      "Drink nettle tea (natural antihistamine)",
      "Consume local honey daily",
      "Use saline nasal rinse",
      "Drink turmeric milk",
      "Keep windows closed during high pollen days",
      "Shower after being outdoors"
    ],
    avoid: [
      "Going outdoors during peak pollen times",
      "Drying clothes outside",
      "Rubbing eyes",
      "Dairy products (may increase mucus)",
      "Alcohol (can worsen symptoms)"
    ],
    whenToConsult: "If symptoms interfere with daily life, difficulty breathing, or over-the-counter remedies don't help"
  },
  {
    id: 10,
    title: "Dry Skin (Winter)",
    category: "Seasonal",
    shortDescription: "Moisturizing remedies for dry, flaky skin",
    icon: "skin",
    symptoms: [
      "Rough, flaky skin",
      "Itching and irritation",
      "Redness",
      "Cracked skin",
      "Tightness"
    ],
    causes: [
      "Cold, dry weather",
      "Low humidity",
      "Hot showers",
      "Harsh soaps",
      "Dehydration"
    ],
    treatments: [
      "Apply coconut oil or almond oil after bathing",
      "Use aloe vera gel on affected areas",
      "Make a honey and milk face mask",
      "Drink plenty of water",
      "Use a humidifier indoors",
      "Apply petroleum jelly on extremely dry areas"
    ],
    avoid: [
      "Hot, long showers",
      "Harsh soaps and detergents",
      "Scratching dry skin",
      "Alcohol-based products",
      "Excessive exfoliation"
    ],
    whenToConsult: "If skin cracks and bleeds, signs of infection, or severe itching"
  },

  // FITNESS RECOVERY
  {
    id: 11,
    title: "Muscle Soreness",
    category: "Fitness Recovery",
    shortDescription: "Recovery remedies for post-workout muscle pain",
    icon: "muscle",
    symptoms: [
      "Muscle stiffness",
      "Tenderness when touched",
      "Reduced range of motion",
      "Mild swelling",
      "Fatigue"
    ],
    causes: [
      "Intense or new exercise",
      "Microscopic muscle tears",
      "Lactic acid buildup",
      "Inadequate warm-up",
      "Dehydration"
    ],
    treatments: [
      "Apply ice pack for first 24 hours, then heat",
      "Gentle stretching and light activity",
      "Massage with coconut or olive oil",
      "Drink cherry juice (anti-inflammatory)",
      "Take Epsom salt bath",
      "Stay hydrated and get adequate sleep"
    ],
    avoid: [
      "Intense exercise on sore muscles",
      "Sitting or lying down for too long",
      "Dehydration",
      "Skipping warm-up and cool-down",
      "Ignoring severe pain"
    ],
    whenToConsult: "If pain is severe, swelling increases, or symptoms last more than a week"
  },
  {
    id: 12,
    title: "Joint Pain",
    category: "Fitness Recovery",
    shortDescription: "Natural relief for joint stiffness and discomfort",
    icon: "joint",
    symptoms: [
      "Stiffness in joints",
      "Swelling",
      "Reduced mobility",
      "Tenderness",
      "Warmth around joint"
    ],
    causes: [
      "Overuse or injury",
      "Arthritis",
      "Inflammation",
      "Age-related wear",
      "Poor posture"
    ],
    treatments: [
      "Apply warm compress for 15-20 minutes",
      "Massage with warm mustard oil",
      "Consume turmeric milk daily",
      "Drink ginger tea",
      "Gentle exercises and stretching",
      "Maintain healthy weight"
    ],
    avoid: [
      "High-impact activities",
      "Prolonged sitting or standing",
      "Excessive weight bearing",
      "Cold exposure",
      "Inflammatory foods (sugar, processed foods)"
    ],
    whenToConsult: "If joint is hot and swollen, severe pain, or inability to move joint"
  },

  // IMMUNITY
  {
    id: 13,
    title: "Immunity Booster",
    category: "Immunity",
    shortDescription: "Natural ways to strengthen your immune system",
    icon: "immunity",
    symptoms: [
      "Frequent infections",
      "Slow wound healing",
      "Fatigue",
      "Digestive issues",
      "Frequent colds"
    ],
    causes: [
      "Poor nutrition",
      "Lack of sleep",
      "Chronic stress",
      "Sedentary lifestyle",
      "Vitamin deficiencies"
    ],
    treatments: [
      "Drink warm water with honey, lemon, and ginger daily",
      "Consume turmeric milk before bed",
      "Eat citrus fruits (oranges, lemons)",
      "Take tulsi (holy basil) tea",
      "Consume garlic and ginger regularly",
      "Get 7-8 hours of quality sleep",
      "Exercise regularly (30 minutes daily)",
      "Practice stress management (yoga, meditation)"
    ],
    avoid: [
      "Processed and junk foods",
      "Excessive sugar",
      "Smoking and alcohol",
      "Chronic stress",
      "Sleep deprivation"
    ],
    whenToConsult: "If you have frequent infections, unexplained weight loss, or persistent fatigue"
  },
  {
    id: 14,
    title: "Fatigue & Low Energy",
    category: "Immunity",
    shortDescription: "Natural energy boosters for daily vitality",
    icon: "energy",
    symptoms: [
      "Persistent tiredness",
      "Lack of motivation",
      "Difficulty concentrating",
      "Muscle weakness",
      "Irritability"
    ],
    causes: [
      "Poor sleep quality",
      "Nutritional deficiencies",
      "Dehydration",
      "Stress and anxiety",
      "Sedentary lifestyle"
    ],
    treatments: [
      "Drink plenty of water throughout the day",
      "Eat iron-rich foods (spinach, dates, raisins)",
      "Consume almonds and walnuts",
      "Drink green tea or ginger tea",
      "Get morning sunlight (15-20 minutes)",
      "Practice deep breathing exercises",
      "Maintain regular sleep schedule"
    ],
    avoid: [
      "Excessive caffeine",
      "Skipping meals",
      "Processed foods and sugar",
      "Late-night screen time",
      "Overworking without breaks"
    ],
    whenToConsult: "If fatigue is severe, persistent, or accompanied by other concerning symptoms"
  },
  {
    id: 15,
    title: "Insomnia",
    category: "Common Illness",
    shortDescription: "Natural remedies for better sleep quality",
    icon: "sleep",
    symptoms: [
      "Difficulty falling asleep",
      "Waking up frequently",
      "Waking up too early",
      "Daytime fatigue",
      "Irritability"
    ],
    causes: [
      "Stress and anxiety",
      "Poor sleep habits",
      "Caffeine or alcohol",
      "Screen time before bed",
      "Irregular sleep schedule"
    ],
    treatments: [
      "Drink warm milk with a pinch of nutmeg",
      "Practice relaxation techniques before bed",
      "Maintain consistent sleep schedule",
      "Create dark, cool sleeping environment",
      "Avoid screens 1 hour before bed",
      "Try chamomile or lavender tea",
      "Practice gentle yoga or meditation"
    ],
    avoid: [
      "Caffeine after 2 PM",
      "Heavy meals before bedtime",
      "Intense exercise close to bedtime",
      "Daytime napping (if it affects night sleep)",
      "Bright lights and screens before bed"
    ],
    whenToConsult: "If insomnia persists for more than a month or significantly affects daily life",
    recommendedFoods: ["Warm milk", "Chamomile tea", "Bananas", "Almonds", "Honey", "Tart cherry juice"],
    preventionTips: [
      "Maintain consistent sleep-wake schedule",
      "Create relaxing bedtime routine",
      "Keep bedroom cool and dark",
      "Limit daytime naps",
      "Exercise regularly but not before bed"
    ]
  }
];

// Combine existing and new remedies
export const allRemedies = [...remediesData, ...newRemedies];

// Category definitions (updated with new categories)
export const categories = [
  { id: "all", name: "All", count: allRemedies.length },
  { id: "common-illness", name: "Common Illness", count: allRemedies.filter(r => r.category === "Common Illness").length },
  { id: "digestion", name: "Digestion", count: allRemedies.filter(r => r.category === "Digestion").length },
  { id: "seasonal", name: "Seasonal", count: allRemedies.filter(r => r.category === "Seasonal").length },
  { id: "fitness-recovery", name: "Fitness Recovery", count: allRemedies.filter(r => r.category === "Fitness Recovery").length },
  { id: "immunity", name: "Immunity", count: allRemedies.filter(r => r.category === "Immunity").length },
  { id: "skin-hair", name: "Skin & Hair Care", count: allRemedies.filter(r => r.category === "Skin & Hair Care").length },
  { id: "womens-wellness", name: "Women's Wellness", count: allRemedies.filter(r => r.category === "Women's Wellness").length },
  { id: "mens-wellness", name: "Men's Wellness", count: allRemedies.filter(r => r.category === "Men's Wellness").length },
  { id: "sleep-stress", name: "Sleep & Stress Relief", count: allRemedies.filter(r => r.category === "Sleep & Stress Relief").length }
];

// Most common remedies for quick access
export const mostCommonRemedies = [1, 2, 4, 6, 11];

// Quick filter chips
export const quickFilters = [
  { id: "fever", label: "Fever", remedyIds: [4] },
  { id: "digestion", label: "Digestion", category: "Digestion" },
  { id: "immunity", label: "Immunity", category: "Immunity" },
  { id: "relaxation", label: "Relaxation", category: "Sleep & Stress Relief" },
  { id: "skincare", label: "Skin Care", remedyIds: [16, 19, 20] },
  { id: "haircare", label: "Hair Care", remedyIds: [17, 18] },
  { id: "painrelief", label: "Pain Relief", remedyIds: [11, 12, 27] }
];

// Helper function to get icon component
export const getRemedyIcon = (iconName) => {
  const icons = {
    cold: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    acne: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    dandruff: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    hairfall: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    sunburn: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    darkcircles: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    cramps: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    bloating: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    ironfatigue: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    nausea: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    stamina: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    metabolism: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    backpain: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    anxiety: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    restless: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    overthinking: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    cough: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    headache: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    fever: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    throat: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    acidity: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    stomach: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    constipation: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    allergy: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    skin: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    muscle: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    joint: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    immunity: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    energy: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    sleep: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.cold;
};

