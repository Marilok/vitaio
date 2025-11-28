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
  hasGynecologist?: boolean;
  bookGynecologyExam?: boolean;

  // Step 6 - Lifestyle
  weeklyExerciseMinutes: number;
  weeklyCigarettes?: number;
  alcoholConsumption: string;

  // Add more steps data as needed
}
