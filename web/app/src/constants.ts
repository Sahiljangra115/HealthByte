import { DailyStats, Meal, UserProfile } from './types';

export const MOCK_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@healthbyte.ai',
  goal: 'gain',
  height: 182,
  weight: 78.5,
  targetCalories: 2400,
  macros: {
    protein: 40,
    carbs: 30,
    fat: 30
  }
};

export const MOCK_STATS: DailyStats = {
  consumed: 1240,
  target: 1840,
  water: 1.2,
  waterTarget: 2.5,
  steps: 6204,
  stepsTarget: 10000,
  activeKcal: 320,
  heartRate: 72,
  spo2: 98,
  sleep: '7h 12m'
};

export const MOCK_MEALS: Meal[] = [
  {
    id: '1',
    name: 'Oats + Banana + Almond Milk',
    time: '8:14 AM',
    calories: 380,
    protein: 12,
    carbs: 45,
    fat: 8,
    type: 'breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    name: 'Quinoa Avocado Bowl',
    time: '1:15 PM',
    calories: 420,
    protein: 22,
    carbs: 52,
    fat: 18,
    type: 'lunch',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200&h=200'
  }
];
