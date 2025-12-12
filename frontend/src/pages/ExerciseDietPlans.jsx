import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ExerciseDietPlans() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('exercise');
  const [expandedDay, setExpandedDay] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // New state for enhanced features
  const [dailyCheckIns, setDailyCheckIns] = useState(() => {
    const saved = localStorage.getItem('dailyCheckIns');
    const lastResetDate = localStorage.getItem('lastWeekReset');
    const today = new Date();
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    currentMonday.setHours(0, 0, 0, 0);
    
    // Check if we need to reset (new week started)
    const needsReset = !lastResetDate || new Date(lastResetDate) < currentMonday;
    
    if (needsReset) {
      // Reset for new week
      localStorage.setItem('lastWeekReset', currentMonday.toISOString());
      const freshData = {
        0: { exercise: false, diet: false, hydration: false },
        1: { exercise: false, diet: false, hydration: false },
        2: { exercise: false, diet: false, hydration: false },
        3: { exercise: false, diet: false, hydration: false },
        4: { exercise: false, diet: false, hydration: false },
        5: { exercise: false, diet: false, hydration: false },
        6: { exercise: false, diet: false, hydration: false }
      };
      localStorage.setItem('dailyCheckIns', JSON.stringify(freshData));
      return freshData;
    }
    
    return saved ? JSON.parse(saved) : {
      0: { exercise: false, diet: false, hydration: false },
      1: { exercise: false, diet: false, hydration: false },
      2: { exercise: false, diet: false, hydration: false },
      3: { exercise: false, diet: false, hydration: false },
      4: { exercise: false, diet: false, hydration: false },
      5: { exercise: false, diet: false, hydration: false },
      6: { exercise: false, diet: false, hydration: false }
    };
  });
  const [dailyNotes, setDailyNotes] = useState(() => {
    const saved = localStorage.getItem('dailyNotes');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentNote, setCurrentNote] = useState('');
  const [dailyMoods, setDailyMoods] = useState(() => {
    const saved = localStorage.getItem('dailyMoods');
    return saved ? JSON.parse(saved) : {};
  });
  const [streak, setStreak] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Get current day of week (0 = Monday, 1 = Tuesday, etc.)
  const getCurrentDayIndex = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Convert: Sunday (0) -> 6, Monday (1) -> 0, Tuesday (2) -> 1, etc.
    const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    console.log('Current Date:', today.toDateString());
    console.log('Day of Week:', dayOfWeek, '-> Index:', index);
    return index;
  };

  // Get day names array
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      
      // Set current day and auto-expand it
      const todayIndex = getCurrentDayIndex();
      setCurrentDayIndex(todayIndex);
      setExpandedDay(todayIndex);
      
      // Trigger animations after a short delay
      setTimeout(() => setIsVisible(true), 100);
    } catch (err) {
      console.error('Error loading user:', err);
      navigate('/login');
    }
  }, [navigate]);

  const membershipPlan = user?.membership?.plan || 'free';
  const isProOrElite = membershipPlan === 'pro' || membershipPlan === 'elite';
  const isElite = membershipPlan === 'elite';

  // Calculate streak
  useEffect(() => {
    const calculateStreak = () => {
      let currentStreak = 0;
      
      // Snapchat-style streak: count consecutive PREVIOUS days (not including today)
      // Start from yesterday (i=1) and go backwards
      for (let i = 1; i < 7; i++) {
        const dayIndex = (currentDayIndex - i + 7) % 7;
        const checkIn = dailyCheckIns[dayIndex];
        
        // Count as completed if BOTH exercise AND diet are done
        if (checkIn?.exercise && checkIn?.diet) {
          currentStreak++;
        } else {
          // Stop counting when we hit an incomplete day
          break;
        }
      }
      
      setStreak(currentStreak);
    };
    calculateStreak();
  }, [dailyCheckIns, currentDayIndex]);

  // Helper Functions
  const handleCheckIn = (type) => {
    const newCheckIns = {
      ...dailyCheckIns,
      [expandedDay]: {
        ...dailyCheckIns[expandedDay],
        [type]: !dailyCheckIns[expandedDay]?.[type]
      }
    };
    setDailyCheckIns(newCheckIns);
    localStorage.setItem('dailyCheckIns', JSON.stringify(newCheckIns));
    
    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 1000);
  };

  const calculateWeeklyProgress = () => {
    return dayNames.map((_, index) => {
      const checkIn = dailyCheckIns[index];
      return {
        exercise: checkIn?.exercise ? 100 : 0,
        diet: checkIn?.diet ? 100 : 0,
        hydration: checkIn?.hydration ? 100 : 0
      };
    });
  };

  const weeklyProgress = calculateWeeklyProgress();

  // Load note when day changes
  useEffect(() => {
    if (expandedDay !== null) {
      setCurrentNote(dailyNotes[expandedDay] || '');
    }
  }, [expandedDay, dailyNotes]);

  const calculateMacros = (meals) => {
    // Simplified macro calculation
    return {
      protein: 30,
      carbs: 50,
      fats: 20
    };
  };

  // Free user blocked view
  if (membershipPlan === 'free') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Premium Feature</h2>
          <p className="text-gray-600 mb-6">
            Exercise & Diet Plans are available for Pro & Elite members only.
          </p>
          <button
            onClick={() => navigate('/membership')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Upgrade Membership
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const exercisePlans = {
    pro: [
      {
        day: 'Monday',
        focus: 'Upper Body Strength',
        exercises: [
          { name: 'Warm-up: Arm Circles', sets: '2', reps: '30s each', rest: '30s' },
          { name: 'Push-ups', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Dumbbell Rows', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Shoulder Press', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '45s' },
          { name: 'Bicep Curls', sets: '3', reps: '12-15', rest: '45s' },
          { name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '45s' },
          { name: 'Chest Flyes', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Cool-down: Stretching', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Lower Body & Core',
        exercises: [
          { name: 'Warm-up: Leg Swings', sets: '2', reps: '20 each', rest: '30s' },
          { name: 'Squats', sets: '4', reps: '12-15', rest: '90s' },
          { name: 'Lunges', sets: '3', reps: '10 each leg', rest: '60s' },
          { name: 'Leg Press', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Calf Raises', sets: '3', reps: '15-20', rest: '45s' },
          { name: 'Plank', sets: '3', reps: '45-60s hold', rest: '45s' },
          { name: 'Russian Twists', sets: '3', reps: '20', rest: '45s' },
          { name: 'Bicycle Crunches', sets: '3', reps: '20', rest: '45s' },
          { name: 'Cool-down: Leg Stretches', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Cardio & Flexibility',
        exercises: [
          { name: 'Warm-up: Light Jog', sets: '1', reps: '5 min', rest: '-' },
          { name: 'Running/Jogging', sets: '1', reps: '20-30 min', rest: '-' },
          { name: 'Jump Rope', sets: '3', reps: '2 min', rest: '60s' },
          { name: 'High Knees', sets: '3', reps: '1 min', rest: '45s' },
          { name: 'Jumping Jacks', sets: '3', reps: '1 min', rest: '45s' },
          { name: 'Yoga Flow', sets: '1', reps: '15 min', rest: '-' },
          { name: 'Stretching', sets: '1', reps: '10 min', rest: '-' },
          { name: 'Cool-down: Walking', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Thursday',
        focus: 'Full Body Circuit',
        exercises: [
          { name: 'Warm-up: Dynamic Stretches', sets: '1', reps: '5 min', rest: '-' },
          { name: 'Burpees', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Mountain Climbers', sets: '3', reps: '20', rest: '45s' },
          { name: 'Kettlebell Swings', sets: '3', reps: '15', rest: '60s' },
          { name: 'Box Jumps', sets: '3', reps: '10', rest: '60s' },
          { name: 'Battle Ropes', sets: '3', reps: '30s', rest: '45s' },
          { name: 'Medicine Ball Slams', sets: '3', reps: '12', rest: '60s' },
          { name: 'Rowing Machine', sets: '3', reps: '2 min', rest: '60s' },
          { name: 'Cool-down: Stretching', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Friday',
        focus: 'Upper Body Endurance',
        exercises: [
          { name: 'Warm-up: Shoulder Rotations', sets: '2', reps: '30s each', rest: '30s' },
          { name: 'Pull-ups', sets: '3', reps: '8-10', rest: '90s' },
          { name: 'Bench Press', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Lat Pulldown', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Cable Flyes', sets: '3', reps: '12-15', rest: '45s' },
          { name: 'Face Pulls', sets: '3', reps: '15', rest: '45s' },
          { name: 'Overhead Tricep Extension', sets: '3', reps: '12', rest: '45s' },
          { name: 'Cool-down: Upper Body Stretch', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Saturday',
        focus: 'Active Recovery',
        exercises: [
          { name: 'Light Walking', sets: '1', reps: '30 min', rest: '-' },
          { name: 'Swimming', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Cycling (Easy Pace)', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Foam Rolling', sets: '1', reps: '15 min', rest: '-' },
          { name: 'Gentle Yoga', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Gentle Stretching', sets: '1', reps: '15 min', rest: '-' }
        ]
      },
      {
        day: 'Sunday',
        focus: 'Rest & Recovery',
        exercises: [
          { name: 'Complete Rest', sets: '-', reps: '-', rest: '-' },
          { name: 'Light Stretching (Optional)', sets: '1', reps: '10 min', rest: '-' },
          { name: 'Meditation (Optional)', sets: '1', reps: '10 min', rest: '-' },
          { name: 'Mobility Work (Optional)', sets: '1', reps: '15 min', rest: '-' }
        ]
      }
    ],
    elite: [
      {
        day: 'Monday',
        focus: 'Advanced Upper Body Power',
        exercises: [
          { name: 'Warm-up: Dynamic Stretches', sets: '1', reps: '5 min', rest: '-' },
          { name: 'Weighted Push-ups', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'Barbell Rows', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Military Press', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Weighted Dips', sets: '3', reps: '10-12', rest: '60s' },
          { name: 'Face Pulls', sets: '3', reps: '15', rest: '45s' },
          { name: 'Hammer Curls', sets: '3', reps: '12-15', rest: '45s' },
          { name: 'Cable Crossovers', sets: '3', reps: '15', rest: '45s' },
          { name: 'Cool-down: Stretching', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Advanced Lower Body & Core',
        exercises: [
          { name: 'Warm-up: Leg Swings', sets: '2', reps: '20 each', rest: '30s' },
          { name: 'Barbell Squats', sets: '5', reps: '10-12', rest: '120s' },
          { name: 'Romanian Deadlifts', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Bulgarian Split Squats', sets: '3', reps: '12 each', rest: '60s' },
          { name: 'Leg Press', sets: '4', reps: '15', rest: '60s' },
          { name: 'Weighted Plank', sets: '3', reps: '60s hold', rest: '60s' },
          { name: 'Hanging Leg Raises', sets: '3', reps: '15', rest: '45s' },
          { name: 'Cable Woodchops', sets: '3', reps: '15 each', rest: '45s' },
          { name: 'Cool-down: Leg Stretches', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Wednesday',
        focus: 'HIIT & Conditioning',
        exercises: [
          { name: 'Warm-up: Light Jog', sets: '1', reps: '5 min', rest: '-' },
          { name: 'Sprint Intervals', sets: '8', reps: '30s sprint', rest: '90s' },
          { name: 'Box Jumps', sets: '4', reps: '12', rest: '60s' },
          { name: 'Battle Ropes', sets: '4', reps: '45s', rest: '60s' },
          { name: 'Burpees', sets: '4', reps: '15', rest: '60s' },
          { name: 'Rowing Machine', sets: '3', reps: '3 min', rest: '90s' },
          { name: 'Yoga Flow', sets: '1', reps: '15 min', rest: '-' },
          { name: 'Cool-down: Walking', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Thursday',
        focus: 'Advanced Full Body Strength',
        exercises: [
          { name: 'Warm-up: Dynamic Stretches', sets: '1', reps: '5 min', rest: '-' },
          { name: 'Deadlifts', sets: '5', reps: '8-10', rest: '120s' },
          { name: 'Bench Press', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Pull-ups (Weighted)', sets: '4', reps: '8-10', rest: '90s' },
          { name: 'Overhead Press', sets: '4', reps: '10-12', rest: '90s' },
          { name: 'Barbell Lunges', sets: '3', reps: '12 each', rest: '60s' },
          { name: "Farmer's Walk", sets: '3', reps: '50m', rest: '60s' },
          { name: 'Cool-down: Stretching', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Friday',
        focus: 'Upper Body Hypertrophy',
        exercises: [
          { name: 'Warm-up: Arm Circles', sets: '2', reps: '30s each', rest: '30s' },
          { name: 'Incline Dumbbell Press', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'T-Bar Rows', sets: '4', reps: '12-15', rest: '60s' },
          { name: 'Arnold Press', sets: '3', reps: '12-15', rest: '60s' },
          { name: 'Preacher Curls', sets: '3', reps: '15', rest: '45s' },
          { name: 'Skull Crushers', sets: '3', reps: '15', rest: '45s' },
          { name: 'Cable Lateral Raises', sets: '3', reps: '20', rest: '45s' },
          { name: 'Cool-down: Upper Body Stretch', sets: '1', reps: '5 min', rest: '-' }
        ]
      },
      {
        day: 'Saturday',
        focus: 'Active Recovery & Mobility',
        exercises: [
          { name: 'Swimming', sets: '1', reps: '30 min', rest: '-' },
          { name: 'Cycling (Easy Pace)', sets: '1', reps: '30 min', rest: '-' },
          { name: 'Foam Rolling', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Dynamic Stretching', sets: '1', reps: '15 min', rest: '-' },
          { name: 'Yoga Session', sets: '1', reps: '30 min', rest: '-' },
          { name: 'Sauna/Steam Room', sets: '1', reps: '15 min', rest: '-' }
        ]
      },
      {
        day: 'Sunday',
        focus: 'Complete Rest & Recovery',
        exercises: [
          { name: 'Complete Rest', sets: '-', reps: '-', rest: '-' },
          { name: 'Light Walking (Optional)', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Meditation', sets: '1', reps: '15 min', rest: '-' },
          { name: 'Mobility Work', sets: '1', reps: '20 min', rest: '-' },
          { name: 'Massage/Self-Myofascial Release', sets: '1', reps: '20 min', rest: '-' }
        ]
      }
    ]
  };

  const dietPlans = {
    pro: [
      {
        day: 'Monday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Oatmeal with berries', 'Scrambled eggs', 'Green tea'], calories: 450 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Apple', 'Handful of almonds'], calories: 200 },
          { time: 'Lunch (1:00 PM)', items: ['Grilled chicken breast', 'Brown rice', 'Mixed vegetables', 'Salad'], calories: 550 },
          { time: 'Evening Snack (4:00 PM)', items: ['Protein shake', 'Banana'], calories: 250 },
          { time: 'Dinner (7:00 PM)', items: ['Baked salmon', 'Quinoa', 'Steamed broccoli'], calories: 500 }
        ],
        totalCalories: 1950
      },
      {
        day: 'Tuesday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Greek yogurt with granola', 'Mixed berries', 'Coffee'], calories: 400 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Protein bar', 'Orange'], calories: 220 },
          { time: 'Lunch (1:00 PM)', items: ['Turkey sandwich (whole grain)', 'Sweet potato', 'Garden salad'], calories: 520 },
          { time: 'Evening Snack (4:00 PM)', items: ['Hummus with carrot sticks'], calories: 180 },
          { time: 'Dinner (7:00 PM)', items: ['Lean beef stir-fry', 'Brown rice', 'Mixed vegetables'], calories: 580 }
        ],
        totalCalories: 1900
      },
      {
        day: 'Wednesday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Smoothie bowl with protein powder', 'Granola', 'Mixed berries'], calories: 420 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Greek yogurt', 'Walnuts'], calories: 200 },
          { time: 'Lunch (1:00 PM)', items: ['Grilled fish', 'Quinoa', 'Steamed vegetables', 'Side salad'], calories: 540 },
          { time: 'Evening Snack (4:00 PM)', items: ['Apple slices', 'Almond butter'], calories: 220 },
          { time: 'Dinner (7:00 PM)', items: ['Lean pork', 'Sweet potato', 'Green beans'], calories: 520 }
        ],
        totalCalories: 1900
      },
      {
        day: 'Thursday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Whole grain toast', 'Avocado', 'Poached eggs', 'Green tea'], calories: 480 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Protein smoothie', 'Spinach', 'Banana'], calories: 250 },
          { time: 'Lunch (1:00 PM)', items: ['Chicken wrap', 'Whole wheat tortilla', 'Vegetables'], calories: 520 },
          { time: 'Evening Snack (4:00 PM)', items: ['Cottage cheese', 'Berries'], calories: 180 },
          { time: 'Dinner (7:00 PM)', items: ['Grilled tofu', 'Brown rice', 'Stir-fried vegetables'], calories: 500 }
        ],
        totalCalories: 1930
      },
      {
        day: 'Friday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Protein pancakes', 'Greek yogurt', 'Honey'], calories: 450 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Mixed nuts', 'Apple'], calories: 220 },
          { time: 'Lunch (1:00 PM)', items: ['Tuna salad', 'Whole grain bread', 'Vegetables'], calories: 500 },
          { time: 'Evening Snack (4:00 PM)', items: ['Protein bar', 'Orange'], calories: 240 },
          { time: 'Dinner (7:00 PM)', items: ['Grilled chicken breast', 'Quinoa', 'Roasted vegetables'], calories: 550 }
        ],
        totalCalories: 1960
      },
      {
        day: 'Saturday',
        meals: [
          { time: 'Breakfast (9:00 AM)', items: ['Omelette with vegetables', 'Whole grain toast', 'Fresh juice'], calories: 480 },
          { time: 'Mid-Morning (11:30 AM)', items: ['Yogurt parfait', 'Granola', 'Berries'], calories: 280 },
          { time: 'Lunch (1:30 PM)', items: ['Grilled salmon', 'Quinoa salad', 'Avocado'], calories: 580 },
          { time: 'Evening Snack (4:30 PM)', items: ['Hummus', 'Vegetable sticks'], calories: 200 },
          { time: 'Dinner (7:30 PM)', items: ['Lean beef stir-fry', 'Brown rice', 'Mixed vegetables'], calories: 520 }
        ],
        totalCalories: 2060
      },
      {
        day: 'Sunday',
        meals: [
          { time: 'Breakfast (9:00 AM)', items: ['French toast (whole grain)', 'Greek yogurt', 'Berries'], calories: 500 },
          { time: 'Brunch (12:00 PM)', items: ['Quinoa bowl', 'Grilled chicken', 'Vegetables'], calories: 450 },
          { time: 'Afternoon Snack (3:00 PM)', items: ['Smoothie', 'Protein powder', 'Banana'], calories: 280 },
          { time: 'Dinner (6:30 PM)', items: ['Baked cod', 'Sweet potato', 'Steamed broccoli'], calories: 480 }
        ],
        totalCalories: 1710
      }
    ],
    elite: [
      {
        day: 'Monday',
        meals: [
          { time: 'Pre-Workout (6:30 AM)', items: ['BCAA drink', 'Banana'], calories: 150 },
          { time: 'Breakfast (8:30 AM)', items: ['Protein pancakes', 'Egg whites', 'Avocado', 'Green smoothie'], calories: 550 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Greek yogurt', 'Mixed nuts', 'Berries'], calories: 280 },
          { time: 'Lunch (1:30 PM)', items: ['Grilled chicken', 'Quinoa', 'Roasted vegetables', 'Large salad'], calories: 600 },
          { time: 'Pre-Workout (4:00 PM)', items: ['Pre-workout supplement', 'Rice cakes with almond butter'], calories: 250 },
          { time: 'Post-Workout (6:00 PM)', items: ['Whey protein shake', 'Banana'], calories: 300 },
          { time: 'Dinner (8:00 PM)', items: ['Grilled salmon', 'Sweet potato', 'Asparagus', 'Side salad'], calories: 650 }
        ],
        totalCalories: 2780,
        supplements: ['Whey Protein', 'BCAA', 'Creatine', 'Omega-3']
      },
      {
        day: 'Tuesday',
        meals: [
          { time: 'Pre-Workout (6:30 AM)', items: ['BCAA drink', 'Banana'], calories: 150 },
          { time: 'Breakfast (8:30 AM)', items: ['Egg white omelet', 'Oatmeal', 'Berries', 'Protein shake'], calories: 580 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Greek yogurt', 'Almonds', 'Apple'], calories: 300 },
          { time: 'Lunch (1:30 PM)', items: ['Lean beef', 'Brown rice', 'Broccoli', 'Salad'], calories: 620 },
          { time: 'Pre-Workout (4:00 PM)', items: ['Pre-workout supplement', 'Whole grain toast with peanut butter'], calories: 280 },
          { time: 'Post-Workout (6:00 PM)', items: ['Whey protein shake', 'Banana', 'Honey'], calories: 320 },
          { time: 'Dinner (8:00 PM)', items: ['Grilled chicken', 'Quinoa', 'Mixed vegetables'], calories: 600 }
        ],
        totalCalories: 2850,
        supplements: ['Whey Protein', 'BCAA', 'Pre-Workout', 'Creatine']
      },
      {
        day: 'Wednesday',
        meals: [
          { time: 'Breakfast (7:00 AM)', items: ['Protein pancakes', 'Egg whites', 'Berries'], calories: 520 },
          { time: 'Mid-Morning (10:00 AM)', items: ['Protein bar', 'Orange'], calories: 250 },
          { time: 'Lunch (1:00 PM)', items: ['Turkey breast', 'Sweet potato', 'Green beans'], calories: 580 },
          { time: 'Afternoon Snack (4:00 PM)', items: ['Cottage cheese', 'Walnuts', 'Honey'], calories: 320 },
          { time: 'Dinner (7:00 PM)', items: ['Baked cod', 'Quinoa', 'Asparagus'], calories: 550 }
        ],
        totalCalories: 2220,
        supplements: ['Whey Protein', 'Omega-3', 'Multivitamin']
      },
      {
        day: 'Thursday',
        meals: [
          { time: 'Pre-Workout (6:30 AM)', items: ['BCAA drink', 'Rice cakes'], calories: 180 },
          { time: 'Breakfast (8:30 AM)', items: ['Scrambled eggs', 'Avocado toast', 'Protein shake'], calories: 600 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Greek yogurt', 'Granola', 'Berries'], calories: 320 },
          { time: 'Lunch (1:30 PM)', items: ['Grilled steak', 'Brown rice', 'Mixed vegetables'], calories: 680 },
          { time: 'Pre-Workout (4:00 PM)', items: ['Pre-workout', 'Banana', 'Almond butter'], calories: 300 },
          { time: 'Post-Workout (6:00 PM)', items: ['Whey protein shake', 'Dextrose'], calories: 350 },
          { time: 'Dinner (8:00 PM)', items: ['Grilled salmon', 'Quinoa', 'Roasted vegetables'], calories: 650 }
        ],
        totalCalories: 3080,
        supplements: ['Whey Protein', 'BCAA', 'Creatine', 'Pre-Workout']
      },
      {
        day: 'Friday',
        meals: [
          { time: 'Breakfast (7:30 AM)', items: ['Protein oatmeal', 'Egg whites', 'Berries'], calories: 550 },
          { time: 'Mid-Morning (10:30 AM)', items: ['Protein shake', 'Apple', 'Almonds'], calories: 320 },
          { time: 'Lunch (1:00 PM)', items: ['Chicken breast', 'Sweet potato', 'Broccoli'], calories: 600 },
          { time: 'Afternoon Snack (4:00 PM)', items: ['Greek yogurt', 'Honey', 'Walnuts'], calories: 280 },
          { time: 'Dinner (7:00 PM)', items: ['Lean beef', 'Quinoa', 'Asparagus', 'Salad'], calories: 650 }
        ],
        totalCalories: 2400,
        supplements: ['Whey Protein', 'Omega-3', 'Multivitamin']
      },
      {
        day: 'Saturday',
        meals: [
          { time: 'Breakfast (8:00 AM)', items: ['Protein pancakes', 'Greek yogurt', 'Berries'], calories: 480 },
          { time: 'Mid-Morning (11:00 AM)', items: ['Smoothie bowl', 'Granola'], calories: 350 },
          { time: 'Lunch (1:30 PM)', items: ['Grilled chicken salad', 'Quinoa', 'Avocado'], calories: 520 },
          { time: 'Afternoon Snack (4:00 PM)', items: ['Protein bar', 'Banana'], calories: 280 },
          { time: 'Dinner (7:00 PM)', items: ['Baked salmon', 'Brown rice', 'Vegetables'], calories: 580 }
        ],
        totalCalories: 2210,
        supplements: ['Whey Protein', 'Omega-3']
      },
      {
        day: 'Sunday',
        meals: [
          { time: 'Breakfast (9:00 AM)', items: ['Eggs benedict', 'Fruit salad', 'Green tea'], calories: 520 },
          { time: 'Brunch (12:00 PM)', items: ['Protein smoothie', 'Whole grain toast', 'Avocado'], calories: 450 },
          { time: 'Afternoon Snack (3:00 PM)', items: ['Greek yogurt', 'Berries', 'Honey'], calories: 280 },
          { time: 'Dinner (6:00 PM)', items: ['Grilled chicken', 'Roasted vegetables', 'Quinoa'], calories: 580 }
        ],
        totalCalories: 1830,
        supplements: ['Whey Protein', 'Multivitamin']
      }
    ]
  };

  const currentExercisePlan = isElite ? exercisePlans.elite : exercisePlans.pro;
  const currentDietPlan = isElite ? dietPlans.elite : dietPlans.pro;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 overflow-hidden">
          <h1 
            className={`text-4xl md:text-5xl font-bold mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Your Personalized Fitness Plans
            </span>
          </h1>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transition-all duration-[1500ms] ease-out delay-300 ${isVisible ? 'w-48' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Complete weekly workout routines and meal plans tailored to your goals
          </p>
        </div>

        {/* Day Selector */}
        <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 border-t-4 border-blue-600 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <h3 className="text-sm font-semibold text-blue-900 mb-3">Select Day</h3>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day, index) => {
              const isToday = index === currentDayIndex;
              const isSelected = index === expandedDay;
              return (
                <button
                  key={index}
                  onClick={() => setExpandedDay(index)}
                  className={`py-3 px-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isSelected
                      ? isToday
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-blue-600 text-white shadow-lg'
                      : isToday
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{day.substring(0, 3)}</div>
                    {isToday && <div className="text-xs mt-1">Today</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className={`bg-white rounded-2xl shadow-lg p-2 mb-6 border-t-4 border-gray-300 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '700ms' }}>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('exercise')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'exercise'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Exercise Plans
              </div>
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'diet'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Diet Plans
              </div>
            </button>
          </div>
        </div>

        {/* Exercise Plans Content */}
        {activeTab === 'exercise' && expandedDay !== null && currentExercisePlan[expandedDay] && (
          <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
            {(() => {
              const dayPlan = currentExercisePlan[expandedDay];
              const isToday = expandedDay === currentDayIndex;
              return (
              <div className={`rounded-2xl shadow-lg overflow-hidden ${
                isToday ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500' : 'bg-white'
              }`}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 relative">
                    {isToday && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        TODAY
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isToday ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                      <span className={`font-bold ${isToday ? 'text-white' : 'text-blue-600'}`}>
                        {dayPlan.day.substring(0, 3)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className={`text-lg font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                        {dayPlan.day}
                      </h3>
                      <p className={`text-sm ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                        {dayPlan.focus}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="space-y-3">
                      {dayPlan.exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">{exIndex + 1}</span>
                              </div>
                              <span className="font-medium text-gray-900">{exercise.name}</span>
                            </div>

                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                            <span>{exercise.sets} sets</span>
                            <span>•</span>
                            <span>{exercise.reps} reps</span>
                            <span>•</span>
                            <span>{exercise.rest} rest</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons for Exercise */}
                  <div className="mt-6 flex gap-3 no-print">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Plan
                    </button>
                  </div>
                </div>
              </div>
            );
            })()}
          </div>
        )}

        {/* Diet Plans Content */}
        {activeTab === 'diet' && expandedDay !== null && currentDietPlan[expandedDay] && (
          <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
            {(() => {
              const dayPlan = currentDietPlan[expandedDay];
              const isToday = expandedDay === currentDayIndex;
              return (
              <div className={`rounded-2xl shadow-lg overflow-hidden ${
                isToday ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-500' : 'bg-white'
              }`}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 relative">
                    {isToday && (
                      <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        TODAY
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isToday ? 'bg-green-600' : 'bg-green-100'
                    }`}>
                      <span className={`font-bold ${isToday ? 'text-white' : 'text-green-600'}`}>
                        {dayPlan.day.substring(0, 3)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className={`text-lg font-bold ${isToday ? 'text-green-900' : 'text-gray-900'}`}>
                        {dayPlan.day}
                      </h3>
                      <p className={`text-sm ${isToday ? 'text-green-700' : 'text-gray-600'}`}>
                        {dayPlan.totalCalories} calories
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="space-y-4">
                      {dayPlan.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{meal.time}</h4>
                            <span className="text-sm text-gray-600">{meal.calories} cal</span>
                          </div>
                          <ul className="space-y-1">
                            {meal.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {isElite && dayPlan.supplements && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                        <h4 className="font-semibold text-purple-900 mb-2">Recommended Supplements</h4>
                        <div className="flex flex-wrap gap-2">
                          {dayPlan.supplements.map((supplement, supIndex) => (
                            <span
                              key={supIndex}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                            >
                              {supplement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Calorie Breakdown Chart */}
                    <div className="mt-6 bg-gray-50 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-4">Macro Breakdown</h4>
                      <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 100 100" className="transform -rotate-90">
                            {/* Protein - Blue */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="20"
                              strokeDasharray="75.4 251.2"
                              className="transition-all duration-1000"
                            />
                            {/* Carbs - Green */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="20"
                              strokeDasharray="125.6 251.2"
                              strokeDashoffset="-75.4"
                              className="transition-all duration-1000"
                            />
                            {/* Fats - Orange */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="20"
                              strokeDasharray="50.2 251.2"
                              strokeDashoffset="-201"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{dayPlan.totalCalories}</div>
                              <div className="text-xs text-gray-600">calories</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-blue-600 rounded"></div>
                              <span className="text-sm font-medium text-gray-700">Protein</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">30%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                              <span className="text-sm font-medium text-gray-700">Carbs</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">50%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-orange-600 rounded"></div>
                              <span className="text-sm font-medium text-gray-700">Fats</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">20%</span>
                          </div>
                        </div>
                      </div>
                      {isElite && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            💡 Elite Tip: Your macros are optimized for muscle building and recovery
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
            })()}
          </div>
        )}

        {/* Hidden Print-Only Section - Shows Both Exercise and Diet Plans */}
        <div className="print-only" style={{ display: 'none' }}>
          {expandedDay !== null && currentExercisePlan[expandedDay] && currentDietPlan[expandedDay] && (
            <div className="print-content">
              {/* Print Header */}
              <div className="print-header">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {isElite ? 'Elite' : 'Pro'} Fitness Plan - {dayNames[expandedDay]}
                </h1>
                <p className="text-gray-600 mb-6">Your complete exercise and diet plan for the day</p>
              </div>

              {/* Exercise Plan for Print */}
              <div className="print-section">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 border-b-2 border-blue-600 pb-2">
                  Exercise Plan
                </h2>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Focus: {currentExercisePlan[expandedDay].focus}
                  </p>
                </div>
                <div className="space-y-3">
                  {currentExercisePlan[expandedDay].exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                          {exIndex + 1}
                        </span>
                        <span className="font-medium text-gray-900">{exercise.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{exercise.sets} sets</span>
                        <span>•</span>
                        <span>{exercise.reps} reps</span>
                        <span>•</span>
                        <span>{exercise.rest} rest</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diet Plan for Print */}
              <div className="print-section" style={{ pageBreakBefore: 'auto', marginTop: '40px' }}>
                <h2 className="text-2xl font-bold text-green-900 mb-4 border-b-2 border-green-600 pb-2">
                  Diet Plan
                </h2>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Total Calories: {currentDietPlan[expandedDay].totalCalories} cal
                  </p>
                </div>
                <div className="space-y-4">
                  {currentDietPlan[expandedDay].meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{meal.time}</h4>
                        <span className="text-sm text-gray-600 font-medium">{meal.calories} cal</span>
                      </div>
                      <ul className="space-y-1">
                        {meal.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-green-600">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {isElite && currentDietPlan[expandedDay].supplements && (
                  <div className="mt-6 p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
                    <h4 className="font-semibold text-purple-900 mb-3">Recommended Supplements</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentDietPlan[expandedDay].supplements.map((supplement, supIndex) => (
                        <span
                          key={supIndex}
                          className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
                        >
                          {supplement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calorie Breakdown Chart */}
                <div className="mt-6 bg-gray-50 rounded-xl p-5 no-print">
                  <h4 className="font-semibold text-gray-900 mb-4">Macro Breakdown</h4>
                  <div className="flex items-center gap-8">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 100 100" className="transform -rotate-90">
                        {/* Protein - Blue */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="20"
                          strokeDasharray="75.4 251.2"
                          className="transition-all duration-1000"
                        />
                        {/* Carbs - Green */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray="125.6 251.2"
                          strokeDashoffset="-75.4"
                          className="transition-all duration-1000"
                        />
                        {/* Fats - Orange */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray="50.2 251.2"
                          strokeDashoffset="-201"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{currentDietPlan[expandedDay].totalCalories}</div>
                          <div className="text-xs text-gray-600">calories</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Protein</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-600 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Carbs</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">50%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-orange-600 rounded"></div>
                          <span className="text-sm font-medium text-gray-700">Fats</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">20%</span>
                      </div>
                    </div>
                  </div>
                  {isElite && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        💡 Elite Tip: Your macros are optimized for muscle building and recovery
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3 no-print">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Plan
                  </button>
                </div>
              </div>

              {/* Print Footer */}
              <div className="print-footer" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                <p className="text-sm text-gray-600 text-center">
                  FitLife - {isElite ? 'Elite' : 'Pro'} Member | Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Daily Check-In Section - At the top with visual progress */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mt-6 no-print border-t-4 border-blue-600 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '900ms' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Check-In</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-blue-50 transition-all">
                <input 
                  type="checkbox"
                  checked={dailyCheckIns[currentDayIndex]?.exercise || false}
                  onChange={() => handleCheckIn('exercise')}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex-1 font-medium group-hover:text-blue-600 transition-colors">Exercise Completed</span>
                {showSuccessAnimation && dailyCheckIns[currentDayIndex]?.exercise && (
                  <span className="text-green-600 animate-bounce text-xl">✓</span>
                )}
              </label>
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-green-50 transition-all">
                <input 
                  type="checkbox"
                  checked={dailyCheckIns[currentDayIndex]?.diet || false}
                  onChange={() => handleCheckIn('diet')}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="flex-1 font-medium group-hover:text-green-600 transition-colors">Diet Followed</span>
                {showSuccessAnimation && dailyCheckIns[currentDayIndex]?.diet && (
                  <span className="text-green-600 animate-bounce text-xl">✓</span>
                )}
              </label>
              {isElite && (
                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-cyan-50 transition-all">
                  <input 
                    type="checkbox"
                    checked={dailyCheckIns[currentDayIndex]?.hydration || false}
                    onChange={() => handleCheckIn('hydration')}
                    className="w-5 h-5 text-cyan-600 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="flex-1 font-medium group-hover:text-cyan-600 transition-colors">Hydration Goal</span>
                  {showSuccessAnimation && dailyCheckIns[currentDayIndex]?.hydration && (
                    <span className="text-green-600 animate-bounce text-xl">✓</span>
                  )}
                </label>
              )}
              <div className="pt-4 border-t border-gray-200 text-center">
                <span className="font-semibold text-gray-900">{dayNames[currentDayIndex]}</span>
                <div className="text-sm text-gray-600 mt-1">Keep up the great work!</div>
              </div>
            </div>

            {/* Right: Visual Progress Circle */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Circular Progress with animation */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle with animation */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(() => {
                      const checkedCount = (dailyCheckIns[currentDayIndex]?.exercise ? 1 : 0) + 
                                          (dailyCheckIns[currentDayIndex]?.diet ? 1 : 0) + 
                                          (isElite && dailyCheckIns[currentDayIndex]?.hydration ? 1 : 0);
                      const totalTasks = isElite ? 3 : 2;
                      const percentage = (checkedCount / totalTasks) * 100;
                      return (percentage / 100) * 503;
                    })()} 503`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text with scale animation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-900 transition-all duration-500 transform hover:scale-110">
                    {(() => {
                      const checkedCount = (dailyCheckIns[currentDayIndex]?.exercise ? 1 : 0) + 
                                          (dailyCheckIns[currentDayIndex]?.diet ? 1 : 0) + 
                                          (isElite && dailyCheckIns[currentDayIndex]?.hydration ? 1 : 0);
                      const totalTasks = isElite ? 3 : 2;
                      return Math.round((checkedCount / totalTasks) * 100);
                    })()}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Today's Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Tracker */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mt-6 no-print border-t-4 border-green-600 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1000ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Weekly Progress Tracker</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span>Exercise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>Diet</span>
              </div>
              {isElite && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                  <span>Hydration</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {dayNames.map((day, index) => (
              <div key={index} className="group hover:bg-gray-50 p-3 rounded-lg transition-all">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">{day}</span>
                  <span className="text-sm text-gray-600">
                    {weeklyProgress[index].exercise}% • {weeklyProgress[index].diet}%
                    {isElite && ` • ${weeklyProgress[index].hydration}%`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${weeklyProgress[index].exercise}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${weeklyProgress[index].diet}%` }}
                    />
                  </div>
                  {isElite && (
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-cyan-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${weeklyProgress[index].hydration}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations Section */}
        <div className={`bg-gray-50 rounded-2xl p-6 mt-6 no-print border-t-4 border-gray-400 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1100ms' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Smart Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Workout Tips</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Add 10 min cardio warm-up before strength training</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Increase weight by 5% next week for progressive overload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Focus on form over speed for better results</span>
                </li>
              </ul>
            </div>

            {isElite && (
              <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">Meal Upgrades</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Add 20g protein to breakfast for muscle recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Include leafy greens in lunch for micronutrients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Post-workout shake within 30 mins recommended</span>
                  </li>
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Hydration Reminder</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Drink 3L water daily. Set reminders every 2 hours for optimal hydration.
              </p>
              <div className="flex items-center gap-2 text-xs text-cyan-700 bg-cyan-50 px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tip: Drink water before you feel thirsty</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Supplement Suggestions</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Whey Protein - Low protein intake detected</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>BCAA - For intense workout recovery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Omega-3 - Joint and recovery support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Motivation & Streaks Section */}
        <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mt-6 no-print shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1200ms' }}>
          <h3 className="text-2xl font-bold mb-6">Your Progress & Achievements</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="text-5xl font-bold mb-2">{streak}</div>
              <div className="text-lg opacity-90">Day Streak</div>
              <div className="text-sm opacity-75 mt-2">Keep it going!</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="text-5xl font-bold mb-2">
                {Math.round((weeklyProgress.filter(p => p.exercise === 100 && p.diet === 100).length / 7) * 100)}%
              </div>
              <div className="text-lg opacity-90">Weekly Goal</div>
              <div className="text-sm opacity-75 mt-2">Completion rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
              <div className="text-lg font-semibold mb-3">Badges Earned</div>
              <div className="flex gap-3">
                {streak >= 3 && (
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-3xl mb-1">🏆</div>
                    <div className="text-xs">Consistent</div>
                  </div>
                )}
                {streak >= 7 && (
                  <div className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold mb-1">7+</div>
                    <div className="text-xs">Beast Mode</div>
                  </div>
                )}
                {streak < 3 && (
                  <div className="bg-white/10 rounded-lg p-3 text-center opacity-50">
                    <div className="text-3xl mb-1">🔒</div>
                    <div className="text-xs">Locked</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Notes for Today Section */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mt-6 no-print border-t-4 border-yellow-500 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1300ms' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Daily Journal - {dayNames[expandedDay]}</h3>
          
          <div className="space-y-5">
            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling today?</label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { mood: 'Great', color: 'bg-green-100 border-green-400 text-green-700' },
                  { mood: 'Good', color: 'bg-blue-100 border-blue-400 text-blue-700' },
                  { mood: 'Tired', color: 'bg-gray-100 border-gray-400 text-gray-700' },
                  { mood: 'Strong', color: 'bg-orange-100 border-orange-400 text-orange-700' },
                  { mood: 'Sleepy', color: 'bg-purple-100 border-purple-400 text-purple-700' }
                ].map(({ mood, color }) => (
                  <button 
                    key={mood}
                    onClick={() => {
                      const newMoods = {
                        ...dailyMoods,
                        [expandedDay]: mood
                      };
                      setDailyMoods(newMoods);
                      localStorage.setItem('dailyMoods', JSON.stringify(newMoods));
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      dailyMoods[expandedDay] === mood 
                        ? `${color} shadow-md scale-105` 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
              {dailyMoods[expandedDay] && (
                <div className="mt-2 text-sm text-gray-600">
                  You're feeling <span className="font-semibold">{dailyMoods[expandedDay]}</span> today
                </div>
              )}
            </div>

            {/* Personal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal Notes</label>
              <textarea 
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="How was your workout? Any challenges? What went well?"
              />
            </div>

            {/* Save Button */}
            <button 
              onClick={() => {
                const newNotes = {
                  ...dailyNotes,
                  [expandedDay]: currentNote
                };
                setDailyNotes(newNotes);
                localStorage.setItem('dailyNotes', JSON.stringify(newNotes));
                alert('Note saved successfully!');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Save Note
            </button>

            {/* Show Previous Notes */}
            {Object.keys(dailyNotes).filter(day => dailyNotes[day]?.trim()).length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Notes</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dayNames.map((day, index) => {
                    const note = dailyNotes[index];
                    const mood = dailyMoods[index];
                    if (!note?.trim()) return null;
                    
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{day}</span>
                          {mood && (
                            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full border border-blue-300 font-medium">
                              {mood}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Print Styles */}
      <style>{`
        /* Hide print section on screen */
        .print-only {
          display: none;
        }

        /* Smooth animations */
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .fixed.right-6 {
            position: relative !important;
            right: auto !important;
            top: auto !important;
            width: 100% !important;
            margin-top: 1rem;
          }
        }
        
        @media print {
          /* Hide screen elements */
          nav, header, footer, button {
            display: none !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Hide the main screen content */
          .min-h-screen > div > div:not(.print-only) {
            display: none !important;
          }
          
          /* Show and position print section */
          .print-only {
            display: block !important;
            position: relative !important;
            padding: 20px;
            margin: 0;
          }
          
          .print-content {
            max-width: 100%;
            margin: 0 auto;
          }
          
          .print-header {
            margin-bottom: 30px;
          }
          
          .print-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          /* Reset page styling for print */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          #root {
            background: white !important;
          }
          
          /* Remove animations and transitions */
          * {
            animation: none !important;
            transition: none !important;
            box-shadow: none !important;
          }
          
          /* Make text darker for print */
          .text-gray-600 {
            color: #4b5563 !important;
          }
          
          .text-gray-700 {
            color: #374151 !important;
          }
          
          .text-gray-800 {
            color: #1f2937 !important;
          }
          
          .text-gray-900 {
            color: #111827 !important;
          }
          
          .text-blue-600 {
            color: #2563eb !important;
          }
          
          .text-blue-900 {
            color: #1e3a8a !important;
          }
          
          .text-green-600 {
            color: #16a34a !important;
          }
          
          .text-green-900 {
            color: #14532d !important;
          }
          
          .text-purple-800 {
            color: #6b21a8 !important;
          }
          
          .text-purple-900 {
            color: #581c87 !important;
          }
          
          /* Ensure borders are visible */
          .border {
            border: 1px solid #d1d5db !important;
          }
          
          .border-2 {
            border-width: 2px !important;
          }
          
          .border-blue-600 {
            border-color: #2563eb !important;
          }
          
          .border-green-600 {
            border-color: #16a34a !important;
          }
          
          .border-purple-300 {
            border-color: #d8b4fe !important;
          }
          
          .border-gray-200 {
            border-color: #e5e7eb !important;
          }
          
          /* Background colors for print */
          .bg-blue-100 {
            background-color: #dbeafe !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .bg-purple-50 {
            background-color: #faf5ff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .bg-purple-200 {
            background-color: #e9d5ff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Rounded corners */
          .rounded-lg {
            border-radius: 0.5rem;
          }
          
          .rounded-full {
            border-radius: 9999px;
          }
          
          /* Padding and spacing */
          .p-3 {
            padding: 0.75rem;
          }
          
          .p-4 {
            padding: 1rem;
          }
          
          .px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          
          .mb-2 {
            margin-bottom: 0.5rem;
          }
          
          .mb-3 {
            margin-bottom: 0.75rem;
          }
          
          .mb-4 {
            margin-bottom: 1rem;
          }
          
          .mb-6 {
            margin-bottom: 1.5rem;
          }
          
          .mt-6 {
            margin-top: 1.5rem;
          }
          
          /* Flexbox */
          .flex {
            display: flex;
          }
          
          .items-center {
            align-items: center;
          }
          
          .justify-between {
            justify-content: space-between;
          }
          
          .gap-2 {
            gap: 0.5rem;
          }
          
          .gap-3 {
            gap: 0.75rem;
          }
          
          .gap-4 {
            gap: 1rem;
          }
          
          .flex-wrap {
            flex-wrap: wrap;
          }
          
          /* Spacing */
          .space-y-1 > * + * {
            margin-top: 0.25rem;
          }
          
          .space-y-3 > * + * {
            margin-top: 0.75rem;
          }
          
          .space-y-4 > * + * {
            margin-top: 1rem;
          }
          
          /* Text alignment */
          .text-center {
            text-align: center;
          }
          
          /* Font sizes */
          .text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          
          .text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          
          .text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          
          .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }
          
          /* Font weights */
          .font-medium {
            font-weight: 500;
          }
          
          .font-semibold {
            font-weight: 600;
          }
          
          .font-bold {
            font-weight: 700;
          }
          
          /* Width and height */
          .w-8 {
            width: 2rem;
          }
          
          .h-8 {
            height: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
