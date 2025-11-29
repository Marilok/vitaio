export interface FormData {
  // Step 1 - Basic Info
  gender: "male" | "female";
  age: number;
  weight: number;
  height: number;

  // Step 2 - Symptoms
  hasRectalBleeding: boolean;

  // Step 3 - Family History
  hasFamilyCancerHistory: boolean;

  // Step 4 - Medications
  medications: string[];

  // Step 5 - Women Only
  hasGynecologist?: string; // "yes" | "no"
  bookGynecologyExam?: boolean;

  // Step 5 - Lifestyle (formerly Step 6)
  weeklyExerciseMinutes: number;
  isSmoker?: boolean;
  cigarettePacksPerWeek?: number;
  smokingYears?: number;
  drinksAlcohol?: boolean;
  beersPerWeek?: number;
  drinkingYears?: number;
  weeklyCigarettes?: number; // Keep for backwards compatibility
  alcoholConsumption?: string; // Keep for backwards compatibility

  // Step 7 - Screening
  hadProstateScreening?: boolean;
  hadLungCancerScreening?: boolean;
  hadCervicalCancerScreening?: boolean; // Only for women
  hadBreastCancerScreening?: boolean; // Only for women
  hadColorectalCancerScreening?: boolean;

  // Priority Score
  priority: number;

  // Add more steps data as needed
}
