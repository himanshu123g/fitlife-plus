// New Remedies to be added to existing remediesData
// These will extend the current 15 remedies with 15 more

import React from 'react';

export const newRemedies = [
  // SKIN & HAIR CARE (5 remedies)
  {
    id: 16,
    title: "Acne",
    category: "Skin & Hair Care",
    shortDescription: "Natural treatments for clear, healthy skin",
    icon: "acne",
    symptoms: [
      "Pimples and blackheads",
      "Oily skin",
      "Redness and inflammation",
      "Scarring",
      "Painful cysts"
    ],
    causes: [
      "Hormonal changes",
      "Excess oil production",
      "Bacteria buildup",
      "Poor skincare routine",
      "Stress and diet"
    ],
    treatments: [
      "Apply neem paste or neem oil on affected areas",
      "Use honey and cinnamon face mask twice weekly",
      "Apply aloe vera gel before bed",
      "Steam face to open pores",
      "Use tea tree oil (diluted) as spot treatment",
      "Drink plenty of water (8-10 glasses daily)"
    ],
    avoid: [
      "Touching or picking at acne",
      "Heavy makeup and oily products",
      "Excessive sun exposure",
      "Dairy and high-sugar foods",
      "Harsh scrubbing"
    ],
    whenToConsult: "If acne is severe, painful, or causing scarring",
    recommendedFoods: ["Green tea", "Turmeric", "Cucumber", "Lemon water", "Berries", "Nuts"],
    preventionTips: [
      "Wash face twice daily with gentle cleanser",
      "Change pillowcases regularly",
      "Avoid touching face with dirty hands",
      "Remove makeup before sleeping",
      "Stay hydrated and eat balanced diet"
    ]
  },
  {
    id: 17,
    title: "Dandruff",
    category: "Skin & Hair Care",
    shortDescription: "Effective remedies for flaky scalp and itching",
    icon: "dandruff",
    symptoms: [
      "White flakes on scalp and shoulders",
      "Itchy scalp",
      "Dry or oily scalp",
      "Redness",
      "Scalp irritation"
    ],
    causes: [
      "Dry skin",
      "Fungal infection",
      "Not shampooing enough",
      "Sensitivity to hair products",
      "Stress"
    ],
    treatments: [
      "Apply coconut oil with lemon juice, leave for 30 minutes",
      "Use neem water as final rinse",
      "Apply yogurt and lemon mask weekly",
      "Massage with tea tree oil (diluted)",
      "Use fenugreek seed paste",
      "Apply aloe vera gel on scalp"
    ],
    avoid: [
      "Harsh chemical shampoos",
      "Hot water for hair wash",
      "Excessive styling products",
      "Scratching scalp",
      "Stress and lack of sleep"
    ],
    whenToConsult: "If dandruff persists despite treatment or causes hair loss",
    recommendedFoods: ["Omega-3 rich foods", "Zinc-rich foods", "Biotin", "Probiotics", "Green vegetables", "Eggs"],
    preventionTips: [
      "Wash hair regularly with mild shampoo",
      "Avoid sharing combs and brushes",
      "Manage stress levels",
      "Get adequate sunlight",
      "Maintain scalp hygiene"
    ]
  },
  {
    id: 18,
    title: "Hair Fall",
    category: "Skin & Hair Care",
    shortDescription: "Natural solutions to reduce hair loss",
    icon: "hairfall",
    symptoms: [
      "Excessive hair shedding",
      "Thinning hair",
      "Visible scalp",
      "Weak hair strands",
      "Slow hair growth"
    ],
    causes: [
      "Nutritional deficiencies",
      "Stress and anxiety",
      "Hormonal imbalance",
      "Harsh hair treatments",
      "Genetics"
    ],
    treatments: [
      "Massage scalp with warm coconut oil weekly",
      "Apply onion juice on scalp for 30 minutes",
      "Use fenugreek seed paste as hair mask",
      "Apply aloe vera gel on scalp",
      "Consume amla (Indian gooseberry) daily",
      "Use egg white and olive oil mask"
    ],
    avoid: [
      "Tight hairstyles",
      "Excessive heat styling",
      "Chemical treatments",
      "Harsh brushing when wet",
      "Stress and poor diet"
    ],
    whenToConsult: "If hair loss is sudden, patchy, or accompanied by other symptoms",
    recommendedFoods: ["Spinach", "Eggs", "Berries", "Nuts", "Sweet potatoes", "Avocados"],
    preventionTips: [
      "Eat protein-rich diet",
      "Handle hair gently when wet",
      "Use wide-toothed comb",
      "Protect hair from sun and pollution",
      "Get regular trims"
    ]
  },
  {
    id: 19,
    title: "Sunburn",
    category: "Skin & Hair Care",
    shortDescription: "Soothing relief for sun-damaged skin",
    icon: "sunburn",
    symptoms: [
      "Red, painful skin",
      "Warm to touch",
      "Peeling skin",
      "Blisters",
      "Headache and fever (severe cases)"
    ],
    causes: [
      "Excessive sun exposure",
      "No sunscreen protection",
      "Peak sun hours (10 AM - 4 PM)",
      "Reflective surfaces (water, sand)",
      "Fair skin type"
    ],
    treatments: [
      "Apply cool aloe vera gel frequently",
      "Take cool baths with baking soda",
      "Apply cold milk compress",
      "Use cucumber slices on affected areas",
      "Apply coconut oil after cooling",
      "Stay hydrated with water and coconut water"
    ],
    avoid: [
      "Further sun exposure",
      "Hot showers",
      "Tight clothing",
      "Popping blisters",
      "Harsh soaps"
    ],
    whenToConsult: "If blisters cover large area, severe pain, or signs of infection",
    recommendedFoods: ["Water-rich fruits", "Green tea", "Tomatoes", "Carrots", "Watermelon", "Yogurt"],
    preventionTips: [
      "Apply sunscreen 30 minutes before going out",
      "Wear protective clothing and hat",
      "Avoid peak sun hours",
      "Seek shade when possible",
      "Reapply sunscreen every 2 hours"
    ]
  },
  {
    id: 20,
    title: "Dark Circles",
    category: "Skin & Hair Care",
    shortDescription: "Natural remedies for brighter under-eye area",
    icon: "darkcircles",
    symptoms: [
      "Dark discoloration under eyes",
      "Puffiness",
      "Tired appearance",
      "Fine lines",
      "Dull skin"
    ],
    causes: [
      "Lack of sleep",
      "Stress and fatigue",
      "Dehydration",
      "Genetics",
      "Excessive screen time"
    ],
    treatments: [
      "Apply cold cucumber slices for 15 minutes",
      "Use cold tea bags (green or black tea)",
      "Apply almond oil before bed",
      "Use potato juice as compress",
      "Apply rose water with cotton pads",
      "Get 7-8 hours of quality sleep"
    ],
    avoid: [
      "Rubbing eyes",
      "Excessive salt intake",
      "Alcohol and smoking",
      "Late-night screen time",
      "Dehydration"
    ],
    whenToConsult: "If dark circles worsen suddenly or accompanied by swelling",
    recommendedFoods: ["Vitamin C foods", "Iron-rich foods", "Water", "Green vegetables", "Tomatoes", "Oranges"],
    preventionTips: [
      "Maintain regular sleep schedule",
      "Use sunscreen around eyes",
      "Stay hydrated throughout day",
      "Take breaks from screens",
      "Manage stress levels"
    ]
  },

  // WOMEN'S WELLNESS (4 remedies)
  {
    id: 21,
    title: "Menstrual Cramps",
    category: "Women's Wellness",
    shortDescription: "Natural pain relief for period discomfort",
    icon: "cramps",
    symptoms: [
      "Lower abdominal pain",
      "Back pain",
      "Nausea",
      "Headache",
      "Fatigue"
    ],
    causes: [
      "Uterine contractions",
      "Hormonal changes",
      "Prostaglandin release",
      "Stress",
      "Poor diet"
    ],
    treatments: [
      "Apply heating pad on lower abdomen",
      "Drink ginger tea with honey",
      "Consume cinnamon tea",
      "Practice gentle yoga and stretching",
      "Massage abdomen with warm sesame oil",
      "Drink warm water throughout the day"
    ],
    avoid: [
      "Caffeine and alcohol",
      "Salty and processed foods",
      "Smoking",
      "Stress and anxiety",
      "Sedentary lifestyle"
    ],
    whenToConsult: "If pain is severe, interferes with daily activities, or worsens over time",
    recommendedFoods: ["Bananas", "Dark chocolate", "Ginger", "Chamomile tea", "Leafy greens", "Nuts"],
    preventionTips: [
      "Exercise regularly throughout month",
      "Maintain healthy weight",
      "Reduce stress through meditation",
      "Stay hydrated",
      "Track cycle to prepare in advance"
    ]
  },
  {
    id: 22,
    title: "PCOS Bloating",
    category: "Women's Wellness",
    shortDescription: "Relief from hormonal bloating and discomfort",
    icon: "bloating",
    symptoms: [
      "Abdominal bloating",
      "Water retention",
      "Weight gain",
      "Digestive discomfort",
      "Fatigue"
    ],
    causes: [
      "Hormonal imbalance",
      "Insulin resistance",
      "Inflammation",
      "Poor gut health",
      "Stress"
    ],
    treatments: [
      "Drink spearmint tea twice daily",
      "Consume cinnamon water in morning",
      "Take fenugreek seeds soaked overnight",
      "Drink fennel seed water",
      "Practice gentle abdominal massage",
      "Eat small, frequent meals"
    ],
    avoid: [
      "Refined carbohydrates",
      "Sugary foods and drinks",
      "Dairy products (if sensitive)",
      "Processed foods",
      "Excessive salt"
    ],
    whenToConsult: "If bloating is severe, persistent, or accompanied by other PCOS symptoms",
    recommendedFoods: ["Leafy greens", "Berries", "Fatty fish", "Nuts", "Whole grains", "Turmeric"],
    preventionTips: [
      "Maintain balanced diet low in refined carbs",
      "Exercise regularly (30 minutes daily)",
      "Manage stress through yoga or meditation",
      "Get adequate sleep",
      "Stay hydrated"
    ]
  },
  {
    id: 23,
    title: "Iron Deficiency Fatigue",
    category: "Women's Wellness",
    shortDescription: "Natural ways to boost iron and energy levels",
    icon: "ironfatigue",
    symptoms: [
      "Extreme tiredness",
      "Weakness",
      "Pale skin",
      "Shortness of breath",
      "Dizziness"
    ],
    causes: [
      "Heavy menstrual bleeding",
      "Poor iron absorption",
      "Inadequate dietary iron",
      "Pregnancy",
      "Chronic conditions"
    ],
    treatments: [
      "Consume iron-rich foods (spinach, dates, raisins)",
      "Drink beetroot juice daily",
      "Take blackstrap molasses with warm water",
      "Eat vitamin C foods with iron sources",
      "Cook in cast iron cookware",
      "Consume pomegranate juice"
    ],
    avoid: [
      "Tea and coffee with meals (blocks iron absorption)",
      "Calcium supplements with iron-rich meals",
      "Excessive fiber with iron",
      "Antacids during meals",
      "Processed foods"
    ],
    whenToConsult: "If fatigue is severe, persistent, or accompanied by chest pain or rapid heartbeat",
    recommendedFoods: ["Spinach", "Lentils", "Red meat", "Pumpkin seeds", "Quinoa", "Dark chocolate"],
    preventionTips: [
      "Eat iron-rich foods regularly",
      "Pair iron with vitamin C sources",
      "Manage menstrual flow if heavy",
      "Get regular blood tests",
      "Consider iron supplements if needed"
    ]
  },
  {
    id: 24,
    title: "Morning Sickness",
    category: "Women's Wellness",
    shortDescription: "Gentle relief for pregnancy-related nausea",
    icon: "nausea",
    symptoms: [
      "Nausea",
      "Vomiting",
      "Food aversions",
      "Sensitivity to smells",
      "Fatigue"
    ],
    causes: [
      "Hormonal changes (hCG)",
      "Low blood sugar",
      "Stress",
      "Vitamin deficiencies",
      "Sensitive stomach"
    ],
    treatments: [
      "Eat small, frequent meals",
      "Consume ginger tea or ginger candies",
      "Snack on crackers before getting up",
      "Drink lemon water",
      "Try peppermint tea",
      "Get fresh air and rest"
    ],
    avoid: [
      "Empty stomach",
      "Spicy and greasy foods",
      "Strong smells",
      "Lying down immediately after eating",
      "Stress and fatigue"
    ],
    whenToConsult: "If unable to keep food or fluids down, losing weight, or showing signs of dehydration",
    recommendedFoods: ["Crackers", "Bananas", "Rice", "Toast", "Ginger", "Lemon"],
    preventionTips: [
      "Eat before feeling hungry",
      "Keep snacks by bedside",
      "Stay hydrated with small sips",
      "Get adequate rest",
      "Avoid triggers (smells, foods)"
    ]
  },

  // MEN'S WELLNESS (3 remedies)
  {
    id: 25,
    title: "Low Stamina",
    category: "Men's Wellness",
    shortDescription: "Natural ways to boost energy and endurance",
    icon: "stamina",
    symptoms: [
      "Quick fatigue during exercise",
      "Low energy levels",
      "Reduced endurance",
      "Muscle weakness",
      "Poor recovery"
    ],
    causes: [
      "Poor diet",
      "Lack of exercise",
      "Inadequate sleep",
      "Stress",
      "Nutritional deficiencies"
    ],
    treatments: [
      "Consume ashwagandha with warm milk",
      "Eat dates and almonds daily",
      "Drink beetroot juice before workout",
      "Take banana with honey",
      "Practice regular cardio exercise",
      "Get 7-8 hours of quality sleep"
    ],
    avoid: [
      "Processed and junk foods",
      "Excessive alcohol",
      "Smoking",
      "Sedentary lifestyle",
      "Chronic stress"
    ],
    whenToConsult: "If fatigue is persistent, worsening, or accompanied by other symptoms",
    recommendedFoods: ["Oats", "Bananas", "Sweet potatoes", "Eggs", "Nuts", "Green tea"],
    preventionTips: [
      "Exercise regularly (mix cardio and strength)",
      "Eat balanced diet with complex carbs",
      "Stay hydrated throughout day",
      "Manage stress effectively",
      "Maintain healthy sleep schedule"
    ]
  },
  {
    id: 26,
    title: "Slow Metabolism",
    category: "Men's Wellness",
    shortDescription: "Natural metabolism boosters for better energy",
    icon: "metabolism",
    symptoms: [
      "Weight gain despite diet",
      "Low energy",
      "Difficulty losing weight",
      "Feeling cold",
      "Slow digestion"
    ],
    causes: [
      "Sedentary lifestyle",
      "Poor diet",
      "Lack of muscle mass",
      "Inadequate sleep",
      "Stress"
    ],
    treatments: [
      "Drink green tea 2-3 times daily",
      "Consume ginger and lemon water in morning",
      "Eat protein with every meal",
      "Practice strength training exercises",
      "Drink cold water throughout day",
      "Eat spicy foods (cayenne pepper)"
    ],
    avoid: [
      "Skipping meals",
      "Crash diets",
      "Excessive sitting",
      "Sugary drinks",
      "Lack of sleep"
    ],
    whenToConsult: "If weight gain is sudden, unexplained, or accompanied by other symptoms",
    recommendedFoods: ["Lean protein", "Green tea", "Chili peppers", "Whole grains", "Legumes", "Coffee"],
    preventionTips: [
      "Build muscle through strength training",
      "Eat protein-rich breakfast",
      "Stay active throughout day",
      "Get adequate sleep (7-8 hours)",
      "Manage stress levels"
    ]
  },
  {
    id: 27,
    title: "Lower Back Pain",
    category: "Men's Wellness",
    shortDescription: "Relief for common back discomfort and stiffness",
    icon: "backpain",
    symptoms: [
      "Dull aching in lower back",
      "Stiffness",
      "Muscle spasms",
      "Pain radiating to legs",
      "Difficulty standing straight"
    ],
    causes: [
      "Poor posture",
      "Muscle strain",
      "Sedentary lifestyle",
      "Heavy lifting",
      "Weak core muscles"
    ],
    treatments: [
      "Apply warm compress for 15-20 minutes",
      "Practice gentle stretching exercises",
      "Massage with warm mustard or sesame oil",
      "Try cat-cow yoga pose",
      "Use proper lumbar support when sitting",
      "Apply ice pack if inflammation present"
    ],
    avoid: [
      "Prolonged sitting or standing",
      "Heavy lifting without proper form",
      "Sleeping on stomach",
      "High heels or unsupportive shoes",
      "Sudden twisting movements"
    ],
    whenToConsult: "If pain is severe, radiates down legs, or accompanied by numbness or weakness",
    recommendedFoods: ["Anti-inflammatory foods", "Turmeric", "Ginger", "Omega-3 rich foods", "Leafy greens", "Berries"],
    preventionTips: [
      "Maintain good posture",
      "Strengthen core muscles",
      "Use proper lifting techniques",
      "Take breaks from sitting",
      "Maintain healthy weight"
    ]
  },

  // SLEEP & STRESS RELIEF (3 remedies)
  {
    id: 28,
    title: "Anxiety Relief",
    category: "Sleep & Stress Relief",
    shortDescription: "Natural ways to calm mind and reduce worry",
    icon: "anxiety",
    symptoms: [
      "Excessive worrying",
      "Restlessness",
      "Rapid heartbeat",
      "Difficulty concentrating",
      "Muscle tension"
    ],
    causes: [
      "Chronic stress",
      "Life changes",
      "Trauma",
      "Genetics",
      "Medical conditions"
    ],
    treatments: [
      "Practice deep breathing exercises (4-7-8 technique)",
      "Drink chamomile or lavender tea",
      "Practice meditation for 10-15 minutes daily",
      "Try progressive muscle relaxation",
      "Consume ashwagandha tea",
      "Spend time in nature"
    ],
    avoid: [
      "Excessive caffeine",
      "Alcohol and smoking",
      "Negative news and social media",
      "Isolation",
      "Skipping meals"
    ],
    whenToConsult: "If anxiety interferes with daily life, causes panic attacks, or persists for weeks",
    recommendedFoods: ["Chamomile tea", "Dark chocolate", "Yogurt", "Almonds", "Blueberries", "Green tea"],
    preventionTips: [
      "Maintain regular exercise routine",
      "Practice mindfulness daily",
      "Get adequate sleep",
      "Connect with supportive people",
      "Limit caffeine and alcohol"
    ]
  },
  {
    id: 29,
    title: "Restlessness",
    category: "Sleep & Stress Relief",
    shortDescription: "Calming remedies for physical and mental agitation",
    icon: "restless",
    symptoms: [
      "Inability to sit still",
      "Constant fidgeting",
      "Racing thoughts",
      "Difficulty relaxing",
      "Irritability"
    ],
    causes: [
      "Stress and anxiety",
      "Excessive caffeine",
      "Lack of physical activity",
      "Poor sleep",
      "Nutritional imbalances"
    ],
    treatments: [
      "Practice gentle yoga or stretching",
      "Take a warm bath with Epsom salt",
      "Drink passionflower or valerian tea",
      "Try aromatherapy with lavender oil",
      "Practice grounding techniques (5-4-3-2-1)",
      "Listen to calming music"
    ],
    avoid: [
      "Stimulants (caffeine, energy drinks)",
      "Screen time before bed",
      "Stressful activities in evening",
      "Heavy meals late at night",
      "Intense exercise close to bedtime"
    ],
    whenToConsult: "If restlessness is persistent, severe, or affecting quality of life",
    recommendedFoods: ["Magnesium-rich foods", "Bananas", "Oats", "Herbal teas", "Nuts", "Whole grains"],
    preventionTips: [
      "Establish regular daily routine",
      "Exercise earlier in the day",
      "Limit caffeine intake",
      "Practice relaxation techniques",
      "Create calming bedtime ritual"
    ]
  },
  {
    id: 30,
    title: "Overthinking at Night",
    category: "Sleep & Stress Relief",
    shortDescription: "Techniques to quiet racing thoughts before sleep",
    icon: "overthinking",
    symptoms: [
      "Racing thoughts at bedtime",
      "Difficulty falling asleep",
      "Replaying conversations",
      "Worrying about future",
      "Mental exhaustion"
    ],
    causes: [
      "Stress and anxiety",
      "Unresolved issues",
      "Lack of mental boundaries",
      "Overstimulation",
      "Poor sleep hygiene"
    ],
    treatments: [
      "Write thoughts in journal before bed",
      "Practice 4-7-8 breathing technique",
      "Listen to guided sleep meditation",
      "Drink warm milk with nutmeg",
      "Try body scan relaxation",
      "Use white noise or calming sounds"
    ],
    avoid: [
      "Screens 1 hour before bed",
      "Stimulating activities in evening",
      "Caffeine after 2 PM",
      "Discussing stressful topics at night",
      "Working in bedroom"
    ],
    whenToConsult: "If overthinking causes chronic insomnia or affects mental health",
    recommendedFoods: ["Chamomile tea", "Warm milk", "Bananas", "Almonds", "Honey", "Tart cherry juice"],
    preventionTips: [
      "Set worry time earlier in day",
      "Create relaxing bedtime routine",
      "Keep bedroom for sleep only",
      "Practice mindfulness during day",
      "Address concerns before evening"
    ]
  }
];


// New icon definitions for the new remedies
export const newIcons = {
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
  )
};

// Most common remedies (for quick access section)
export const mostCommonRemedies = [1, 2, 4, 6, 11]; // IDs: Cold, Cough, Fever, Acidity, Muscle Soreness

// Quick filter chips
export const quickFilters = [
  { id: "fever", label: "Fever", category: "Common Illness" },
  { id: "digestion", label: "Digestion", category: "Digestion" },
  { id: "immunity", label: "Immunity", category: "Immunity" },
  { id: "relaxation", label: "Relaxation", category: "Sleep & Stress Relief" },
  { id: "skincare", label: "Skin Care", category: "Skin & Hair Care" },
  { id: "haircare", label: "Hair Care", category: "Skin & Hair Care" },
  { id: "painrelief", label: "Pain Relief", category: "Fitness Recovery" }
];
