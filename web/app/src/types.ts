export type Goal = 'lose' | 'maintain' | 'gain';

export interface UserProfile {
  name: string;
  email: string;
  goal: Goal;
  height: number;
  weight: number;
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyStats {
  consumed: number;
  target: number;
  water: number;
  waterTarget: number;
  steps: number;
  stepsTarget: number;
  activeKcal: number;
  heartRate: number;
  spo2: number;
  sleep: string;
}
