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
  medications: Array<{
    id: string;
    name: string;
    frequency: string;
    dosage: string;
    isCustom?: boolean;
  }>;

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

  // Step 8 - Appointments
  selectedAppointments: number[];

  // Step 8 - Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 9 - Appointment Booking
  bookedAppointments: Array<{
    appointmentTypeId: number;
    examination_type_id: number;
    slotId: string;
    dateTime: string;
  }>;

  // Appointment Data with full details
  appointmentData?: Array<{
    id: number;
    examinationName: string;
    dateTime: string;
    slotId: string;
    examination_type_id: number;
    minutes: number;
    isManuallySelected: boolean;
  }>;

  // Priority Score
  priority: number;

  // Add more steps data as needed
}
