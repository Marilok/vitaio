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

  // Step 6 - Lifestyle
  weeklyExerciseMinutes: number;
  weeklyCigarettes?: number;
  alcoholConsumption: string;

  // Step 7 - Screening
  hadProstateScreening?: boolean;
  hadLungCancerScreening?: boolean;
  hadCervicalCancerScreening?: boolean; // Only for women
  hadBreastCancerScreening?: boolean; // Only for women
  hadColorectalCancerScreening?: boolean;

  // Step 8 - Appointments
  selectedAppointments: number[];

  // Priority Score
  priority: number;

  // Add more steps data as needed
}
