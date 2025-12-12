// FitBot Knowledge Base - 100% ACCURATE PROJECT DATA
// Natural conversational style - No emojis, no text icons, no markdown formatting
// Based on actual FitLife+ implementation

export const fitbotConversation = {
  start: {
    message: "Hi! I'm FitBot, your AI fitness assistant. I can help you with everything on FitLife+!\n\nWhat would you like to explore today?",
    options: [
      { label: "Exercise & Diet Plans", next: "plans_intro" },
      { label: "Home Remedies (15 Remedies)", next: "remedies_intro" },
      { label: "Supplements Guide", next: "supplements_intro" },
      { label: "Order History & Tracking", next: "order_history_intro" },
      { label: "BMI Calculator", next: "bmi_intro" },
      { label: "Membership Benefits", next: "membership_intro" },
      { label: "Video Coaching (Elite Only)", next: "video_coaching_intro" }
    ]
  },

  // ========== MEMBERSHIP SYSTEM - EXACT RULES ==========
  membership_intro: {
    message: "FitLife+ offers three membership tiers:\n\nFREE - Basic access\nPRO - Rs.199/month\nELITE - Rs.499/month\n\nEach tier unlocks different features. What would you like to know?",
    options: [
      { label: "Free Membership Features", next: "free_features" },
      { label: "Pro Membership (Rs.199/month)", next: "pro_features" },
      { label: "Elite Membership (Rs.499/month)", next: "elite_features" },
      { label: "Compare All Plans", next: "membership_compare" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  free_features: {
    message: "Free Membership Includes:\n\n• BMI Calculator with visual charts\n• Basic diet recommendations\n• Access to all 15 natural remedies\n• Browse supplement shop (no discounts)\n• Profile management\n\nNote: Exercise plans, structured diet plans, and FitBot AI require Pro or Elite membership.",
    options: [
      { label: "Upgrade to Pro", next: "pro_features" },
      { label: "View Remedies", next: "remedies_intro" },
      { label: "Back", next: "membership_intro" }
    ]
  },

  pro_features: {
    message: "Pro Membership - Rs.199/month\n\nIncludes everything in Free, plus:\n\n• Complete 7-day exercise plans (standard routines)\n• Structured diet plans (1700-2000 calories)\n• 4% discount on ALL supplements\n• FitBot AI assistant (me!)\n• Weekly progress tracking\n• Daily check-in system\n• Print/download plans\n\nPro gives you structured fitness guidance with standard workout routines.",
    options: [
      { label: "What's different in Elite?", next: "elite_vs_pro" },
      { label: "Exercise Plans Details", next: "exercise_plans" },
      { label: "Diet Plans Details", next: "diet_plans" },
      { label: "Back", next: "membership_intro" }
    ]
  },

  elite_features: {
    message: "Elite Membership - Rs.499/month\n\nIncludes everything in Pro, plus:\n\n• Advanced exercise plans with HIIT routines\n• Elite diet plans (2200-3080 calories)\n• Pre/post workout nutrition\n• 10% discount on ALL supplements\n• Detailed supplement descriptions & guidance\n• 1-on-1 video calls with certified trainers\n• Hydration tracking\n• Advanced progress analytics\n• Priority support\n\nElite provides professional-grade training and nutrition guidance.",
    options: [
      { label: "Video Call System", next: "video_coaching_intro" },
      { label: "Advanced Exercise Plans", next: "elite_exercises" },
      { label: "Elite Diet Features", next: "elite_diet" },
      { label: "Back", next: "membership_intro" }
    ]
  },

  elite_vs_pro: {
    message: "Pro vs Elite Differences:\n\nEXERCISE PLANS:\nPro: Standard routines, 6-9 exercises per day\nElite: Advanced HIIT, 10-12 exercises per day, athlete-level techniques\n\nDIET PLANS:\nPro: 4-5 meals, 1700-2000 calories\nElite: 5-7 meals, 2200-3080 calories, supplement recommendations\n\nDISCOUNTS:\nPro: 4% off supplements\nElite: 10% off supplements\n\nEXCLUSIVE TO ELITE:\n• Video calls with trainers\n• Detailed supplement guidance\n• Hydration tracking",
    options: [
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "membership_intro" }
    ]
  },

  membership_compare: {
    message: "Complete Membership Comparison:\n\nFREE:\n• BMI Calculator\n• Basic diet\n• 15 Natural remedies\n• Browse supplements\n• No discounts\n\nPRO (Rs.199/month):\n• All Free features\n• 7-day exercise plans\n• Structured diet plans\n• 4% supplement discount\n• FitBot AI\n• Progress tracking\n\nELITE (Rs.499/month):\n• All Pro features\n• Advanced HIIT workouts\n• Pre/post workout nutrition\n• 10% supplement discount\n• Video calls with trainers\n• Supplement guidance\n• Hydration tracking",
    options: [
      { label: "Upgrade to Pro", next: "pro_features" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "membership_intro" }
    ]
  },

  // ========== EXERCISE & DIET PLANS - REAL SYSTEM ==========
  plans_intro: {
    message: "Exercise & Diet Plans System\n\nOur plans provide structured weekly programs:\n\n• 7-day weekly structure (Monday-Sunday)\n• Auto-highlights today's plan\n• Separate exercise and diet tabs\n• Print functionality\n• Progress tracking\n• Daily check-ins\n\nNote: Requires Pro or Elite membership\n\nAccess level depends on your membership tier.",
    options: [
      { label: "Exercise Plans Details", next: "exercise_plans" },
      { label: "Diet Plans Details", next: "diet_plans" },
      { label: "Weekly Structure", next: "weekly_structure" },
      { label: "Pro vs Elite Differences", next: "plans_comparison" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  exercise_plans: {
    message: "Exercise Plans System:\n\nPRO MEMBERS:\n• Standard workout routines\n• 6-9 exercises per day\n• Sets, reps, and rest times\n• Upper body, lower body, core focus\n• Weekly progression\n\nELITE MEMBERS:\n• Advanced HIIT routines\n• 10-12 exercises per day\n• Athlete-level techniques\n• Progressive overload\n• Specialized training methods\n\nAll plans include proper warm-up and cool-down routines.",
    options: [
      { label: "Weekly Schedule", next: "weekly_structure" },
      { label: "Elite Advanced Features", next: "elite_exercises" },
      { label: "Progress Tracking", next: "progress_tracking" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  elite_exercises: {
    requiresElite: true,
    message: "Elite Advanced Exercise Features:\n\n• HIIT (High-Intensity Interval Training)\n• Plyometric exercises\n• Olympic lift variations\n• Advanced calisthenics\n• Progressive overload protocols\n• Athlete-level techniques\n• Specialized training methods\n\nElite plans include 10-12 exercises per day with advanced progression.\n\nExample Elite Exercises:\n- Weighted Push-ups\n- Barbell Rows\n- Military Press\n- Weighted Dips\n- Sprint Intervals\n- Box Jumps\n- Battle Ropes",
    options: [
      { label: "Exercise Plans Details", next: "exercise_plans" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  diet_plans: {
    message: "Diet Plans System:\n\nPRO MEMBERS:\n• 4-5 meals per day\n• 1700-2000 calories daily\n• Balanced macronutrients\n• Meal timing guidance\n• Calorie breakdown charts\n\nELITE MEMBERS:\n• 5-7 meals per day\n• 2200-3080 calories daily\n• Pre/post workout nutrition\n• Supplement recommendations\n• Advanced macro optimization\n\nDiet preferences (Veg/Non-veg) are respected in all recommendations.",
    options: [
      { label: "Calorie Ranges", next: "calorie_info" },
      { label: "Elite Nutrition Features", next: "elite_diet" },
      { label: "Diet Preferences", next: "diet_preferences" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  elite_diet: {
    requiresElite: true,
    message: "Elite Diet Features:\n\n• 5-7 meals per day\n• Pre-workout nutrition timing\n• Post-workout recovery meals\n• 2200-3080 calorie range\n• Advanced macro optimization\n• Supplement integration\n• Performance-focused nutrition\n\nExample Elite Day (Monday):\n- Pre-Workout (6:30 AM): BCAA drink, Banana - 150 cal\n- Breakfast (8:30 AM): Protein pancakes, Egg whites, Avocado - 550 cal\n- Mid-Morning (11:00 AM): Greek yogurt, Mixed nuts - 280 cal\n- Lunch (1:30 PM): Grilled chicken, Quinoa, Vegetables - 600 cal\n- Pre-Workout (4:00 PM): Pre-workout supplement, Rice cakes - 250 cal\n- Post-Workout (6:00 PM): Whey protein shake, Banana - 300 cal\n- Dinner (8:00 PM): Grilled salmon, Sweet potato, Asparagus - 650 cal\n\nTotal: 2780 calories\nSupplements: Whey Protein, BCAA, Creatine, Omega-3",
    options: [
      { label: "Supplement Integration", next: "supplement_guidance" },
      { label: "Calorie Information", next: "calorie_info" },
      { label: "Back", next: "diet_plans" }
    ]
  },

  calorie_info: {
    message: "Calorie Ranges by Membership:\n\nPRO MEMBERS:\nDaily Range: 1700-2000 calories\n4-5 meals per day\nBalanced for general fitness\n\nELITE MEMBERS:\nDaily Range: 2200-3080 calories\n5-7 meals per day\nOptimized for muscle building and performance\n\nWeekly Variation:\n- Weekdays: Higher calories (training days)\n- Weekends: Moderate calories (recovery days)\n- Sunday: Lower calories (rest day)\n\nCalories are calculated based on your BMI and fitness goals.",
    options: [
      { label: "Diet Plans", next: "diet_plans" },
      { label: "BMI Calculator", next: "bmi_intro" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  weekly_structure: {
    message: "7-Day Weekly Structure:\n\nMONDAY: Upper Body Strength\nTUESDAY: Lower Body & Core\nWEDNESDAY: Cardio & Flexibility\nTHURSDAY: Full Body Circuit\nFRIDAY: Upper Body Endurance\nSATURDAY: Active Recovery\nSUNDAY: Rest & Recovery\n\nEach day includes both exercise and diet plans. The system auto-highlights today's plan and allows easy navigation between days.\n\nFeatures:\n• Click on any day to view detailed plans\n• Use tabs to switch between Exercise and Diet\n• Print button available for offline access",
    options: [
      { label: "Today's Plan Features", next: "today_features" },
      { label: "Print Functionality", next: "print_help" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  today_features: {
    message: "Today's Plan Features:\n\n• Auto-highlights current day\n• Shows day name and focus area\n• Complete exercise list with sets/reps\n• Full meal plan with timing\n• Calorie breakdown\n• Daily check-in checkboxes\n• Progress tracking\n\nDaily Check-ins:\n• Exercise Completed\n• Diet Followed\n• Hydration Goal (Elite only)\n\nCheck-ins help track your consistency and build streaks!",
    options: [
      { label: "Progress Tracking", next: "progress_tracking" },
      { label: "Weekly Structure", next: "weekly_structure" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  progress_tracking: {
    message: "Progress Tracking System:\n\n• Weekly progress bars\n• Daily check-ins (Exercise/Diet/Hydration)\n• Streak counters\n• Goal completion percentages\n• Achievement badges\n• BMI history charts\n• Calorie tracking\n\nHow it works:\n1. Complete your daily exercise\n2. Follow your diet plan\n3. Check the boxes in your plan\n4. Watch your progress bars fill up\n5. Build your streak!\n\nTrack your fitness journey with comprehensive analytics.",
    options: [
      { label: "Daily Check-ins", next: "checkin_help" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  checkin_help: {
    message: "Daily Check-in System:\n\n• Exercise Completed checkbox\n• Diet Followed checkbox\n• Hydration Goal checkbox (Elite only)\n\nFeatures:\n• Automatic progress bar updates\n• Streak calculation\n• Weekly completion tracking\n\nCheck-ins help maintain consistency and track your commitment.\n\nBenefits:\n- Visual progress tracking\n- Motivation through streaks\n- Accountability\n- Weekly summaries",
    options: [
      { label: "Progress Tracking", next: "progress_tracking" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  plans_comparison: {
    message: "Pro vs Elite Plans Comparison:\n\nEXERCISE:\nPro: 6-9 exercises/day, Standard routines\nElite: 10-12 exercises/day, Advanced HIIT\n\nDIET:\nPro: 4-5 meals, 1700-2000 cal\nElite: 5-7 meals, 2200-3080 cal, Supplement recommendations\n\nFEATURES:\nPro: Basic progress tracking\nElite: Hydration tracking, Advanced analytics\n\nEXAMPLE MONDAY:\nPro: Push-ups, Dumbbell Rows, Shoulder Press (9 exercises)\nElite: Weighted Push-ups, Barbell Rows, Military Press (12 exercises)",
    options: [
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  // ========== NATURAL REMEDIES - EXACT 15 REMEDIES ==========
  remedies_intro: {
    message: "Natural Remedies (Free for all users)\n\nWe provide 15 proven home remedies for common health issues:\n\nCommon Illness (5 remedies)\nDigestion (3 remedies)\nSeasonal (2 remedies)\nFitness Recovery (2 remedies)\nImmunity (3 remedies)\n\nEach remedy includes detailed instructions, ingredients, and usage guidelines.",
    options: [
      { label: "Common Illness Remedies", next: "common_illness_remedies" },
      { label: "Digestion Remedies", next: "digestion_remedies" },
      { label: "Seasonal Remedies", next: "seasonal_remedies" },
      { label: "Fitness Recovery Remedies", next: "fitness_remedies" },
      { label: "Immunity Remedies", next: "immunity_remedies" },
      { label: "All 15 Remedies List", next: "all_remedies" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  common_illness_remedies: {
    message: "Common Illness Remedies (5):\n\n1. Common Cold\n   - Warm water with honey and lemon\n   - Salt water gargle\n   - Steam inhalation\n\n2. Cough\n   - Honey with warm water\n   - Ginger and tulsi tea\n   - Turmeric milk\n\n3. Headache\n   - Cold compress on forehead\n   - Peppermint oil massage\n   - Deep breathing exercises\n\n4. Fever\n   - Stay hydrated\n   - Lukewarm sponge bath\n   - Tulsi tea\n\n5. Sore Throat\n   - Warm salt water gargle\n   - Honey and lemon\n   - Turmeric milk",
    options: [
      { label: "Digestion Remedies", next: "digestion_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  digestion_remedies: {
    message: "Digestion Remedies (3):\n\n6. Acidity & Heartburn\n   - Cold milk or buttermilk\n   - Fennel seeds after meals\n   - Banana or papaya\n\n7. Stomach Pain\n   - Warm ginger tea\n   - Warm compress on abdomen\n   - Ajwain water\n\n8. Constipation\n   - Warm water with lemon (morning)\n   - Fiber-rich foods\n   - Isabgol (psyllium husk)\n   - Exercise regularly",
    options: [
      { label: "Seasonal Remedies", next: "seasonal_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  seasonal_remedies: {
    message: "Seasonal Remedies (2):\n\n9. Seasonal Allergies\n   - Nettle tea (natural antihistamine)\n   - Local honey daily\n   - Saline nasal rinse\n   - Turmeric milk\n\n10. Dry Skin (Winter)\n    - Coconut oil or almond oil\n    - Aloe vera gel\n    - Honey and milk face mask\n    - Use humidifier indoors",
    options: [
      { label: "Fitness Recovery", next: "fitness_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  fitness_remedies: {
    message: "Fitness Recovery Remedies (2):\n\n11. Muscle Soreness\n    - Ice pack first 24 hours, then heat\n    - Gentle stretching\n    - Massage with coconut oil\n    - Cherry juice (anti-inflammatory)\n    - Epsom salt bath\n\n12. Joint Pain\n    - Warm compress (15-20 min)\n    - Massage with warm mustard oil\n    - Turmeric milk daily\n    - Ginger tea\n    - Gentle exercises",
    options: [
      { label: "Immunity Remedies", next: "immunity_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  immunity_remedies: {
    message: "Immunity Remedies (3):\n\n13. Immunity Booster\n    - Warm water with honey, lemon, ginger\n    - Turmeric milk before bed\n    - Citrus fruits\n    - Tulsi tea\n    - 7-8 hours sleep\n    - Exercise 30 min daily\n\n14. Fatigue & Low Energy\n    - Drink plenty of water\n    - Iron-rich foods (spinach, dates)\n    - Almonds and walnuts\n    - Green tea or ginger tea\n    - Morning sunlight (15-20 min)\n\n15. Insomnia\n    - Warm milk with nutmeg\n    - Chamomile or lavender tea\n    - Consistent sleep schedule\n    - Dark, cool room\n    - Avoid screens 1 hour before bed",
    options: [
      { label: "All Remedies List", next: "all_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  all_remedies: {
    message: "Complete 15 Remedies List:\n\nCommon Illness:\n1. Common Cold\n2. Cough\n3. Headache\n4. Fever\n5. Sore Throat\n\nDigestion:\n6. Acidity & Heartburn\n7. Stomach Pain\n8. Constipation\n\nSeasonal:\n9. Seasonal Allergies\n10. Dry Skin (Winter)\n\nFitness Recovery:\n11. Muscle Soreness\n12. Joint Pain\n\nImmunity:\n13. Immunity Booster\n14. Fatigue & Low Energy\n15. Insomnia\n\nAll remedies are available on the Remedies page with detailed instructions, symptoms, causes, treatments, and when to consult a doctor.",
    options: [
      { label: "How to Use Remedies", next: "remedy_usage" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  remedy_usage: {
    message: "How to Use Remedies:\n\nEach remedy includes:\n• Symptoms list\n• Causes\n• Detailed treatments\n• What to avoid\n• When to consult a doctor\n\nAccess:\n1. Go to Remedies page\n2. Browse by category or view all\n3. Click on any remedy card\n4. Read detailed information\n5. Follow instructions carefully\n\nImportant: These are home remedies for mild conditions. Always consult a doctor for serious or persistent symptoms.",
    options: [
      { label: "View All Remedies", next: "all_remedies" },
      { label: "Back", next: "remedies_intro" }
    ]
  },

  // ========== SUPPLEMENTS SYSTEM - REAL DATA ==========
  supplements_intro: {
    message: "FitLife+ Supplement Shop\n\nPremium supplements from trusted brands:\n\n• Multiple premium brands\n• Real-time cart updates\n• Membership discounts (Pro: 4%, Elite: 10%)\n• Buy Now functionality\n• Secure Razorpay checkout\n• Elite members get detailed descriptions\n\nNote: All users can browse and purchase. Discounts applied automatically at checkout.",
    options: [
      { label: "Available Brands", next: "supplement_brands" },
      { label: "Membership Discounts", next: "supplement_discounts" },
      { label: "Cart & Checkout", next: "cart_help" },
      { label: "Elite Supplement Guidance", next: "supplement_guidance" },
      { label: "Product Categories", next: "supplement_categories" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  supplement_brands: {
    message: "Available Supplement Brands:\n\nOur shop features premium brands including:\n\n• MuscleBlaze\n• MuscleTech\n• MyProtein\n• Nutrabay\n• Optimum Nutrition\n\nEach brand offers carefully selected products including protein powders, pre-workouts, BCAAs, creatine, and more.\n\nFeatures:\n• Products organized by brand\n• Easy navigation and filtering\n• High-quality images and descriptions",
    options: [
      { label: "Product Types", next: "supplement_categories" },
      { label: "Membership Discounts", next: "supplement_discounts" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  supplement_categories: {
    message: "Product Categories:\n\nProtein Powders:\n- Whey Protein\n- Isolate Protein\n- Plant-based Protein\n\nPre-Workout:\n- Energy boosters\n- Focus enhancers\n- Performance supplements\n\nPost-Workout:\n- BCAAs\n- Creatine\n- Recovery formulas\n\nHealth & Wellness:\n- Multivitamins\n- Omega-3\n- Joint support\n\nAll products available in the Shop page. Filter by brand or category.",
    options: [
      { label: "Available Brands", next: "supplement_brands" },
      { label: "Membership Discounts", next: "supplement_discounts" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  supplement_discounts: {
    message: "Supplement Discount Structure:\n\nFREE MEMBERS:\n• No discounts\n• Full retail prices\n• Can browse and purchase\n\nPRO MEMBERS (Rs.199/month):\n• 4% discount on ALL products\n• Applied automatically at checkout\n• Savings shown in cart\n\nELITE MEMBERS (Rs.499/month):\n• 10% discount on ALL products\n• Detailed product descriptions\n• Usage instructions\n• Supplement recommendations based on goals\n\nExample: Rs.2000 supplement:\n- Free: Rs.2000\n- Pro: Rs.1920 (save Rs.80)\n- Elite: Rs.1800 (save Rs.200)",
    options: [
      { label: "Elite Supplement Features", next: "supplement_guidance" },
      { label: "How Discounts Work", next: "discount_help" },
      { label: "Upgrade Membership", next: "membership_intro" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  supplement_guidance: {
    requiresElite: true,
    message: "Elite Supplement Guidance:\n\nElite members get exclusive supplement information:\n\n• Detailed product descriptions\n• Usage instructions and timing\n• Dosage recommendations\n• Goal-based suggestions\n• Ingredient explanations\n• Safety guidelines\n• Stack recommendations\n\nExample Guidance:\n- When to take (pre/post workout)\n- How much to take\n- What to mix it with\n- Expected benefits\n- Potential side effects\n\nThis feature helps Elite members make informed supplement choices.",
    options: [
      { label: "Available Supplements", next: "supplement_brands" },
      { label: "Membership Discounts", next: "supplement_discounts" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  cart_help: {
    message: "Shopping Cart System:\n\n• Real-time cart counter in navbar\n• Add/remove products\n• Adjust quantities\n• Automatic discount application\n• Buy Now functionality (replaces cart)\n• Secure Razorpay checkout\n• Order confirmation\n\nBuy Now Feature:\nBuy Now shows a warning before replacing existing cart items. You can choose to replace cart or add to existing cart. Proceeds directly to checkout.\n\nCheckout Process:\n1. Review cart items\n2. See discount applied\n3. Enter shipping details\n4. Secure payment via Razorpay\n5. Order confirmation",
    options: [
      { label: "Checkout Process", next: "checkout_help" },
      { label: "Membership Discounts", next: "supplement_discounts" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  checkout_help: {
    message: "Checkout Process:\n\nStep 1: Cart Review\n• View all items\n• See quantities and prices\n• Discount automatically applied\n• Total amount displayed\n\nStep 2: Shipping Details\n• Full Name\n• Email\n• Phone\n• Complete Address\n\nStep 3: Payment\n• Razorpay secure payment\n• Credit/Debit cards\n• UPI payments\n• Digital wallets\n\nStep 4: Confirmation\n• Order confirmation page\n• Order details\n• Continue shopping option",
    options: [
      { label: "Cart System", next: "cart_help" },
      { label: "Back", next: "supplements_intro" }
    ]
  },

  discount_help: {
    message: "How Discounts Work:\n\nAutomatic Application:\n• Discount applied based on your membership\n• No coupon codes needed\n• Shows in cart and checkout\n• Savings clearly displayed\n\nDiscount Calculation:\n- Pro: Original Price × 0.96 (4% off)\n- Elite: Original Price × 0.90 (10% off)\n\nExample:\nProduct: Rs.2000\n- Free Member: Rs.2000\n- Pro Member: Rs.1920 (You save Rs.80)\n- Elite Member: Rs.1800 (You save Rs.200)\n\nUpgrade message shown if you can save more. Total savings shown at checkout.",
    options: [
      { label: "Membership Plans", next: "membership_intro" },
      { label: "Back", next: "supplement_discounts" }
    ]
  },

  // ========== ORDER HISTORY & TRACKING ==========
  order_history_intro: {
    message: "Order History & Tracking System\n\nView and track all your supplement orders:\n\n• Complete order history\n• Real-time delivery tracking\n• Order details and invoices\n• Membership discount breakdown\n• Payment status\n• Delivery timeline (4 stages)\n\nAccess your Order History from the Dashboard or directly from the navigation menu.",
    options: [
      { label: "How to Check Orders", next: "check_orders" },
      { label: "Delivery Status Tracking", next: "delivery_tracking" },
      { label: "Discount Breakdown", next: "order_discounts" },
      { label: "Reorder Items", next: "reorder_help" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  check_orders: {
    message: "How to Check Your Orders:\n\n1. Go to Dashboard\n2. Click Order History in Quick Actions\n3. View all your past orders\n4. Click View Order Details for any order\n\nEach order shows:\n• Order number and date\n• Items purchased\n• Total amount and discount\n• Payment status\n• Current delivery status\n\nOrders are sorted with latest orders first.",
    options: [
      { label: "Delivery Tracking", next: "delivery_tracking" },
      { label: "Order Details Info", next: "order_details_info" },
      { label: "Back", next: "order_history_intro" }
    ]
  },

  delivery_tracking: {
    message: "Delivery Status Tracking:\n\nYour order goes through 4 stages:\n\n1. Order Placed - Payment confirmed, order received\n2. Shipped - Package dispatched from warehouse\n3. Out for Delivery - Package with delivery partner\n4. Delivered - Package delivered successfully\n\nYou can track your order status in real-time from Order History. Admin updates are reflected instantly.",
    options: [
      { label: "Delivery Timeline", next: "delivery_timeline" },
      { label: "Order Updates", next: "order_updates" },
      { label: "Back", next: "order_history_intro" }
    ]
  },

  delivery_timeline: {
    message: "Typical Delivery Timeline:\n\nOrder Placed: Immediate (after payment)\nShipped: 1-2 business days\nOut for Delivery: 3-5 business days\nDelivered: 4-7 business days\n\nNote: Timeline may vary based on location. You will receive real-time updates as your order progresses through each stage.",
    options: [
      { label: "Track My Orders", next: "check_orders" },
      { label: "Back", next: "delivery_tracking" }
    ]
  },

  order_updates: {
    message: "Order Status Updates:\n\nYou can check order updates anytime:\n• Visit Order History page\n• View current delivery status\n• See status timeline with visual indicators\n• Check estimated delivery date\n\nAdmin updates delivery status as your order progresses. Changes are reflected immediately in your Order History.",
    options: [
      { label: "Check Orders Now", next: "check_orders" },
      { label: "Back", next: "delivery_tracking" }
    ]
  },

  order_details_info: {
    message: "Order Details Page Shows:\n\nOrder Information:\n• Order number and date\n• Payment status and method\n• Transaction ID (Razorpay)\n\nItems:\n• Product names and images\n• Quantities and prices\n• Brand information\n\nPricing:\n• Subtotal amount\n• Membership discount applied\n• Final amount paid\n\nDelivery:\n• Current status with timeline\n• Shipping address\n• Estimated delivery\n\nYou can view complete details for any order from Order History.",
    options: [
      { label: "Discount Breakdown", next: "order_discounts" },
      { label: "Back", next: "check_orders" }
    ]
  },

  order_discounts: {
    message: "Order Discount Breakdown:\n\nYour membership discount is automatically applied:\n\nPRO MEMBERS (Rs.199/month):\n• 4% discount on all supplements\n• Shown in order summary\n• Applied at checkout\n\nELITE MEMBERS (Rs.499/month):\n• 10% discount on all supplements\n• Shown in order summary\n• Applied at checkout\n\nFREE MEMBERS:\n• No discount\n• Full price\n\nDiscount details are visible in:\n• Cart page\n• Checkout page\n• Order confirmation\n• Order History\n• Order Details",
    options: [
      { label: "Upgrade Membership", next: "membership_intro" },
      { label: "View My Orders", next: "check_orders" },
      { label: "Back", next: "order_history_intro" }
    ]
  },

  reorder_help: {
    message: "How to Reorder Items:\n\n1. Go to Order History\n2. Find the order with items you want\n3. View Order Details\n4. Note the products you want to reorder\n5. Go to Shop page\n6. Search for those products\n7. Add to cart and checkout\n\nNote: Currently, there is no one-click reorder button, but you can easily find and repurchase items from your order history.",
    options: [
      { label: "Browse Shop", next: "supplements_intro" },
      { label: "View Order History", next: "check_orders" },
      { label: "Back", next: "order_history_intro" }
    ]
  },

  // ========== BMI & DASHBOARD - REAL FEATURES ==========
  bmi_intro: {
    message: "BMI Calculator & Dashboard\n\nThe BMI Calculator helps you track your Body Mass Index and overall health progress.\n\nFeatures:\n• Calculate BMI using height and weight\n• Visual charts with color coding\n• Track BMI history over time\n• View progress and trends\n• Access from Dashboard page\n\nHeight can be entered in CM or Feet+Inches. Available for all users.\n\nWhat would you like to know?",
    options: [
      { label: "How to Use BMI Calculator", next: "bmi_help" },
      { label: "Height Input Options", next: "height_input" },
      { label: "Dashboard Features", next: "dashboard_features" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  bmi_help: {
    message: "How to Use BMI Calculator:\n\nStep 1: Enter Your Details\n• Height: Choose CM or Feet+Inches\n• Weight: Enter in KG\n\nStep 2: Calculate\n• Click Calculate BMI button\n• View your BMI value instantly\n\nStep 3: Understand Results\n• Underweight: Below 18.5\n• Normal: 18.5-24.9\n• Overweight: 25-29.9\n• Obese: 30 and above\n\nYour BMI is displayed with a color-coded chart showing your category. All calculations are saved in your history for tracking progress.\n\nFormula: BMI = Weight (kg) / Height (m)²",
    options: [
      { label: "Height Input Help", next: "height_input" },
      { label: "BMI History Tracking", next: "bmi_history" },
      { label: "Dashboard Features", next: "dashboard_features" },
      { label: "Back", next: "bmi_intro" }
    ]
  },

  height_input: {
    message: "Height Input Options:\n\nOption 1: Centimeters (CM)\nEnter height in CM\nExample: 175 cm\n\nOption 2: Feet + Inches\nEnter feet\nEnter inches\nExample: 5 feet 9 inches\n\nConversion:\nSystem automatically converts to meters for BMI calculation\n1 foot = 30.48 cm\n1 inch = 2.54 cm\n\nTips:\n• Measure height without shoes\n• Stand straight against a wall\n• Use the same unit consistently for tracking",
    options: [
      { label: "BMI Calculator", next: "bmi_help" },
      { label: "Back", next: "bmi_intro" }
    ]
  },

  bmi_history: {
    message: "BMI History Tracking:\n\n• All BMI calculations saved\n• View historical data\n• Track progress over time\n• Visual charts and graphs\n• Date-wise records\n\nWhat's Tracked:\n- BMI value\n- Weight\n- Height\n- Date of calculation\n- BMI category\n\nBenefits:\n- Monitor weight changes\n- Track fitness progress\n- Identify trends\n- Set realistic goals\n\nHistory is saved in your profile. Access anytime from Dashboard.",
    options: [
      { label: "Dashboard Features", next: "dashboard_features" },
      { label: "Back", next: "bmi_help" }
    ]
  },

  dashboard_features: {
    message: "Dashboard Features:\n\nYour Dashboard is the central hub for all health tracking:\n\nHealth Tracking:\n• BMI Calculator with visual charts\n• BMI History and progress graphs\n• Daily Calorie Logging\n• Progress Visualization over time\n\nQuick Access Sections:\n• Natural Remedies preview cards\n• Recommended Supplements\n• Membership Status display\n• Profile Information summary\n\nThe Dashboard provides a complete overview of your fitness journey with animated charts, color-coded categories, and mobile-friendly design.\n\nAccess your Dashboard from the main navigation menu.",
    options: [
      { label: "How to Use BMI Calculator", next: "bmi_help" },
      { label: "Calorie Tracking", next: "calorie_tracking" },
      { label: "Back", next: "bmi_intro" }
    ]
  },

  calorie_tracking: {
    message: "Calorie Tracking:\n\nFeatures:\n• Daily calorie logging\n• Track food intake\n• Monitor calorie goals\n• Visual progress bars\n• Historical data\n\nHow to Use:\n1. Log your meals\n2. Enter calorie amounts\n3. View daily total\n4. Compare with goals\n5. Track over time\n\nIntegration:\n• Links with diet plans\n• BMI-based recommendations\n• Membership-specific goals\n\nNote: Pro/Elite members get structured diet plans with pre-calculated calories.",
    options: [
      { label: "Diet Plans", next: "diet_plans" },
      { label: "Dashboard Features", next: "dashboard_features" },
      { label: "Back", next: "bmi_intro" }
    ]
  },

  // ========== VIDEO CALL SYSTEM - REAL IMPLEMENTATION ==========
  video_coaching_intro: {
    requiresElite: true,
    message: "Trainer & Video Call System\n\nExclusive for Elite Members (Rs.499/month)\n\nFeatures:\n• Certified professional trainers\n• 1-on-1 video consultations\n• ZegoCloud HD video technology\n• Real-time video calls\n• Trainer availability scheduling\n• Personalized fitness guidance\n\nNote: Trainers are managed by admin. Specific availability times. Book sessions in advance.",
    options: [
      { label: "How Video Calls Work", next: "video_calls" },
      { label: "Trainer Qualifications", next: "trainer_info" },
      { label: "Booking Process", next: "booking_help" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  video_calls: {
    requiresElite: true,
    message: "Video Call System:\n\nTechnology:\n• ZegoCloud integration for HD calls\n• Unique room ID for each session\n• Real-time joining capability\n• 1-on-1 private consultations\n• Screen sharing support\n• Call recording (if needed)\n\nRequirements:\n• Computer or smartphone\n• Stable internet connection\n• Working camera\n• Working microphone\n• Elite membership\n\nHow it Works:\n1. Elite member requests video call\n2. Trainer accepts request\n3. Unique room ID generated\n4. Both join the video call\n5. 1-on-1 consultation begins\n\nNote: Only Elite members can access video calls. Trainers available during scheduled hours.",
    options: [
      { label: "Technical Requirements", next: "video_tech" },
      { label: "Trainer Availability", next: "trainer_schedule" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "video_coaching_intro" }
    ]
  },

  video_tech: {
    requiresElite: true,
    message: "Technical Requirements:\n\nDevice:\n• Desktop/Laptop (recommended)\n• Smartphone/Tablet (supported)\n• Modern web browser\n\nInternet:\n• Minimum 2 Mbps upload/download\n• Stable connection\n• WiFi recommended\n\nHardware:\n• Working webcam\n• Working microphone\n• Speakers/headphones\n\nBrowser:\n• Chrome (recommended)\n• Firefox\n• Safari\n• Edge\n\nTips: Test your setup before first call. Close other apps for best performance.",
    options: [
      { label: "Video Call System", next: "video_calls" },
      { label: "Back", next: "video_coaching_intro" }
    ]
  },

  trainer_info: {
    requiresElite: true,
    message: "Trainer Qualifications:\n\nOur Trainers:\n• Certified fitness professionals\n• Years of experience\n• Specialized training knowledge\n• Personalized approach\n• Professional guidance\n\nWhat Trainers Provide:\n• Form correction\n• Technique guidance\n• Personalized workout advice\n• Nutrition recommendations\n• Motivation and support\n• Goal setting assistance\n\nTrainer Management:\n• Trainers added by admin\n• Credentials verified\n• Availability managed\n\nNote: All trainers are vetted professionals. Elite-only feature.",
    options: [
      { label: "Booking Process", next: "booking_help" },
      { label: "Trainer Availability", next: "trainer_schedule" },
      { label: "Back", next: "video_coaching_intro" }
    ]
  },

  trainer_schedule: {
    requiresElite: true,
    message: "Trainer Availability:\n\nScheduling:\n• Trainers set their availability\n• View available time slots\n• Book sessions in advance\n• Receive confirmation\n\nAvailability Display:\n• Trainer name\n• Available times\n• Specializations\n• Booking status\n\nHow to Book:\n1. Go to Video Call page (Elite only)\n2. View available trainers\n3. Check their availability\n4. Request video call\n5. Wait for trainer acceptance\n6. Join call at scheduled time\n\nNote: This feature is exclusive to Elite members.",
    options: [
      { label: "Booking Process", next: "booking_help" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back", next: "video_coaching_intro" }
    ]
  },

  booking_help: {
    requiresElite: true,
    message: "Booking Process:\n\nStep 1: Access\n• Must be Elite member\n• Go to Video Call page\n\nStep 2: Select Trainer\n• View available trainers\n• Check their availability\n• Read trainer profiles\n\nStep 3: Request Call\n• Click Request Video Call\n• Wait for trainer acceptance\n\nStep 4: Join Call\n• Receive notification\n• Get unique room ID\n• Join video call\n\nStep 5: Consultation\n• 1-on-1 video session\n• Personalized guidance\n• Ask questions\n\nNote: Trainers respond based on their availability.",
    options: [
      { label: "Video Call System", next: "video_calls" },
      { label: "Trainer Information", next: "trainer_info" },
      { label: "Back", next: "video_coaching_intro" }
    ]
  },

  // ========== ACCOUNT & PROFILE ==========
  account: {
    message: "Account & Profile Management:\n\nProfile Information:\n• First Name & Last Name\n• Email address\n• Height (CM or Feet+Inches)\n• Weight\n• Diet preference (Veg/Non-veg)\n\nSettings:\n• Password management\n• Membership status\n• Progress tracking\n\nNote: Your diet preference affects all meal recommendations. Profile updates are saved automatically.",
    options: [
      { label: "Diet Preferences", next: "diet_preferences" },
      { label: "Password Reset", next: "password_help" },
      { label: "Profile Updates", next: "profile_help" },
      { label: "Membership Status", next: "membership_status" },
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  diet_preferences: {
    message: "Diet Preference System:\n\nOptions:\n• Vegetarian: Only vegetarian meal recommendations\n• Non-vegetarian: Both veg and non-veg options\n\nThis setting affects:\n• All diet plan recommendations\n• Meal suggestions\n• Recipe recommendations\n• FitBot dietary advice\n\nHow it Works:\n- If you select Veg, FitBot will ONLY give vegetarian diet recommendations\n- If you select Non-veg, FitBot can recommend both vegetarian and non-vegetarian options\n- Must always use your latest updated preference from the profile section\n\nNote: Update your preference in the Profile section for accurate recommendations. Changes apply immediately to all diet plans.",
    options: [
      { label: "How to Update Preferences", next: "profile_help" },
      { label: "Diet Plans", next: "diet_plans" },
      { label: "Back", next: "account" }
    ]
  },

  profile_help: {
    message: "Profile Updates:\n\nHow to Update Profile:\n1. Go to Profile page\n2. Click Edit button\n3. Update your information\n4. Save changes\n\nEditable Fields:\n• First Name\n• Last Name\n• Height (CM or Feet+Inches)\n• Weight\n• Diet Preference (Veg/Non-veg)\n\nImportant:\n• Email cannot be changed\n• Height affects BMI calculation\n• Weight affects BMI calculation\n• Diet preference affects meal plans\n\nTip: Keep your profile updated for accurate recommendations.",
    options: [
      { label: "Diet Preferences", next: "diet_preferences" },
      { label: "Height Input", next: "height_input" },
      { label: "Back", next: "account" }
    ]
  },

  password_help: {
    message: "Password Management:\n\nForgot Password:\n1. Click 'Forgot Password' on login page\n2. Enter your email\n3. Submit request\n4. Wait for admin approval\n5. Receive password reset link\n6. Set new password\n\nAdmin Approval:\n• Password reset requests require admin approval\n• This ensures account security\n• Admin reviews and approves requests\n\nChange Password:\n• Currently requires password reset process\n• Contact admin if urgent\n\nSecurity Tips:\n• Never share your password\n• Use strong, unique passwords",
    options: [
      { label: "Admin System", next: "admin_system" },
      { label: "Back", next: "account" }
    ]
  },

  membership_status: {
    message: "Membership Status:\n\nView Your Status:\n• Current plan (Free/Pro/Elite)\n• Start date (if Pro/Elite)\n• Features available\n• Discount level\n\nMembership Tiers:\n• Free - Basic features\n• Pro - Rs.199/month\n• Elite - Rs.499/month\n\nHow to Upgrade:\n1. Go to Membership page\n2. Choose Pro or Elite\n3. Complete payment\n4. Instant activation\n\nHow to Downgrade:\n• Contact admin\n• Downgrade to Free anytime\n\nTip: View all membership benefits in Membership page.",
    options: [
      { label: "Membership Plans", next: "membership_intro" },
      { label: "Upgrade Now", next: "membership_compare" },
      { label: "Back", next: "account" }
    ]
  },

  // ========== ADMIN SYSTEM ==========
  admin_system: {
    message: "Admin Panel Features:\n\nUser Management:\n• View all users\n• View user details\n• Manage memberships\n\nSupplement Management:\n• Approve supplements\n• Add/remove supplements\n• Manage product visibility\n\nTrainer Management:\n• Add trainers\n• Manage trainer credentials\n• Set availability\n\nPassword Reset:\n• Approve password reset requests\n• View pending requests\n\nSystem Monitoring:\n• View system statistics\n• Monitor user activity\n\nNote: Admin access is restricted and managed separately from regular user accounts. Only authorized administrators can access admin panel.",
    options: [
      { label: "Back to Main Menu", next: "start" }
    ]
  },

  // ========== ADDITIONAL HELP ==========
  print_help: {
    message: "Print Functionality:\n\nWhat You Can Print:\n• Exercise plans\n• Diet plans\n• Weekly schedules\n• Meal plans\n\nHow to Print:\n1. Open Exercise/Diet Plans page\n2. Select the day you want\n3. Click Print button\n4. Choose printer or Save as PDF\n5. Print or save\n\nPrint Features:\n• Clean, formatted layout\n• All exercise details\n• All meal information\n• Calorie information\n• Supplement recommendations (Elite)\n\nTips: Print weekly plans for offline reference. Save as PDF for digital backup.",
    options: [
      { label: "Exercise Plans", next: "exercise_plans" },
      { label: "Diet Plans", next: "diet_plans" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  nutrition_tips: {
    message: "Nutrition Tips:\n\nGeneral Guidelines:\n• Eat balanced meals\n• Stay hydrated (8-10 glasses water)\n• Include protein in every meal\n• Eat plenty of vegetables\n• Limit processed foods\n• Control portion sizes\n\nMeal Timing:\n• Breakfast within 1 hour of waking\n• Eat every 3-4 hours\n• Pre-workout meal 1-2 hours before\n• Post-workout meal within 30 minutes\n• Dinner 2-3 hours before bed\n\nMacronutrients:\n• Protein: 25-30% of calories\n• Carbs: 45-55% of calories\n• Fats: 20-30% of calories\n\nNote: Pro/Elite members get detailed meal plans with calculated macros.",
    options: [
      { label: "Diet Plans", next: "diet_plans" },
      { label: "Calorie Information", next: "calorie_info" },
      { label: "Back", next: "plans_intro" }
    ]
  },

  // ========== ERROR HANDLING ==========
  unknown: {
    message: "I can only provide information about features that exist in FitLife+. Please choose from the available options or return to the main menu.\n\nNote: I'm designed to give accurate information based on the actual FitLife+ platform. I don't invent features or provide information about things that don't exist.\n\nWhat would you like to know about?",
    options: [
      { label: "Back to Main Menu", next: "start" },
      { label: "Membership Information", next: "membership_intro" },
      { label: "Available Features", next: "feature_access" }
    ]
  },

  feature_access: {
    message: "Feature Access by Membership:\n\nFREE:\n• BMI Calculator\n• Basic Diet\n• 15 Natural Remedies\n• Browse Supplement Shop\n• No discounts\n• No exercise plans\n• No FitBot AI\n\nPRO (Rs.199/month):\n• All Free features\n• 7-day Exercise Plans\n• Structured Diet Plans\n• 4% Supplement Discounts\n• FitBot AI\n• Progress Tracking\n\nELITE (Rs.499/month):\n• All Pro features\n• Advanced HIIT Workouts\n• Pre/Post Workout Nutrition\n• 10% Supplement Discounts\n• Video Calls with Trainers\n• Supplement Guidance\n• Hydration Tracking\n\nUpgrade your membership to access more features!",
    options: [
      { label: "Upgrade to Pro", next: "pro_features" },
      { label: "Upgrade to Elite", next: "elite_features" },
      { label: "Back to Main Menu", next: "start" }
    ]
  }
};

// Helper function to get response
export const getFitBotResponse = (key) => {
  return fitbotConversation[key] || fitbotConversation.unknown;
};

// Handle special actions (like navigation)
export const handleFitBotAction = (action, navigate) => {
  // Scroll to top before navigation
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  switch (action) {
    case 'membership':
      navigate('/membership');
      break;
    case 'shop':
      navigate('/shop');
      break;
    case 'plans':
      navigate('/exercise-diet-plans');
      break;
    case 'remedies':
      navigate('/remedies');
      break;
    case 'dashboard':
      navigate('/dashboard');
      break;
    case 'profile':
      navigate('/profile');
      break;
    case 'video':
      navigate('/video-call');
      break;
    default:
      console.log('Unknown action:', action);
  }
};

// Export for use in FitBot component
export default fitbotConversation;
