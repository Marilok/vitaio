import { FormData } from "@/types/form";
import { calculateBMI } from "./bmi";

/**
 * Mapping between appointment IDs from appointments.json and screening keys from screenings.json
 */
export const APPOINTMENT_TO_SCREENING_MAP: Record<number, string> = {
  // Mandatory appointments
  1: "psaTest", // Vyšetření prostaty
  2: "chestXray", // CT plic
  3: "gynecologicalExamination", // Gynekologické vyšetření
  4: "mammography", // Mamografie
  5: "colonoscopy", // Kolonoskopie

  // Optional appointments
  6: "occultBloodTest", // Test okultního krvácení stolice
  7: "colonoscopy", // Sigmoidoskopie (using colonoscopy as fallback)
  8: "oncologistConsultation", // Gastroenterolog (mapped to oncologist)
  9: "gynecologicalExamination", // Gynekolog
  10: "oncologistConsultation", // Urolog (mapped to oncologist)
  11: "physicalExamination", // Praktický lékař
  12: "oncologistConsultation", // Onkolog
  13: "chestXray", // Radiolog (mapped to xray)
  14: "healthyLifestyleCounseling", // Nutriční poradce
};

/**
 * All screening keys from screenings.json in the correct structure
 */
export const DEFAULT_SCREENINGS = {
  mandatory: {
    oncologistConsultation: {
      order: false,
      priority: 0,
    },
    physicalExamination: {
      order: false,
      priority: 0,
    },
    bloodTests: {
      order: false,
      priority: 0,
    },
    urineTest: {
      order: false,
      priority: 0,
    },
    occultBloodTest: {
      order: false,
      priority: 0,
    },
    bloodPressureAndPulseMeasurement: {
      order: false,
      priority: 0,
    },
    ecg: {
      order: false,
      priority: 0,
    },
    chestXray: {
      order: false,
      priority: 0,
    },
    abdominalUltrasound: {
      order: false,
      priority: 0,
    },
    testicularUltrasound: {
      order: false,
      priority: 0,
    },
    breastUltrasound: {
      order: false,
      priority: 0,
    },
    inBodyAnalysis: {
      order: false,
      priority: 0,
    },
    psaTest: {
      order: false,
      priority: 0,
    },
  },
  optional: {
    colonoscopy: {
      order: false,
      priority: 0,
    },
    geneticConsultation: {
      order: false,
      priority: 0,
    },
    gynecologicalExamination: {
      order: false,
      priority: 0,
    },
    healthyLifestyleCounseling: {
      order: false,
      priority: 0,
    },
    smokingCessationCounseling: {
      order: false,
      priority: 0,
    },
    addictionCounseling: {
      order: false,
      priority: 0,
    },
    physicalActivityCounseling: {
      order: false,
      priority: 0,
    },
    mammography: {
      order: false,
      priority: 0,
    },
  },
};

/**
 * Transforms selected appointment IDs into screenings.json format
 * and dynamically calculates priority based on patient health data
 *
 * @param selectedAppointmentIds - Array of selected appointment IDs
 * @param formData - Complete form data with patient health information
 * @returns Screenings object in the format from screenings.json
 */
export function transformAppointmentsToScreenings(
  selectedAppointmentIds: number[],
  formData: FormData
): typeof DEFAULT_SCREENINGS {
  // Deep clone the default structure
  const result = JSON.parse(JSON.stringify(DEFAULT_SCREENINGS));

  // Calculate health risk factors
  const bmi = calculateBMI(formData.weight, formData.height);
  const hasHighBMI = bmi > 25; // Overweight or obese
  const hasRectalBleeding = formData.hasRectalBleeding || false;
  const hasFamilyCancerHistory = formData.hasFamilyCancerHistory || false;
  const isSmoker = formData.isSmoker || false;
  const hasUnhealthyLifestyle =
    (formData.weeklyExerciseMinutes || 0) < 150 || // Less than recommended 150 min/week
    formData.drinksAlcohol ||
    isSmoker;

  // Helper function to add priority to a screening
  const addPriority = (
    category: "mandatory" | "optional",
    key: string,
    priorityToAdd: number
  ) => {
    if (result[category][key]) {
      result[category][key].priority += priorityToAdd;
    }
  };

  // Set order to true for ALL mandatory appointments based on gender
  Object.keys(result.mandatory).forEach((key) => {
    // Gender-specific mandatory screenings
    if (key === "testicularUltrasound" || key === "psaTest") {
      // Only for males
      if (formData.gender === "male") {
        result.mandatory[key].order = true;
      }
    } else if (key === "breastUltrasound") {
      // Only for females
      if (formData.gender === "female") {
        result.mandatory[key].order = true;
      }
    } else {
      // All other mandatory screenings for everyone
      result.mandatory[key].order = true;
    }
  });

  // Set order to true for all selected optional appointments
  selectedAppointmentIds.forEach((id) => {
    const screeningKey = APPOINTMENT_TO_SCREENING_MAP[id];
    if (screeningKey) {
      // Only check in optional (mandatory are already set above)
      if (result.optional[screeningKey]) {
        result.optional[screeningKey].order = true;
      }
    }
  });

  // PRIORITY LOGIC BASED ON HEALTH CONDITIONS

  // 1. Rectal bleeding - prioritize colonoscopy and gastroenterology
  if (hasRectalBleeding) {
    addPriority("optional", "colonoscopy", 10);
    addPriority("mandatory", "oncologistConsultation", 8); // Gastroenterologist mapped to oncologist
    addPriority("mandatory", "occultBloodTest", 7);
  }

  // 2. High BMI or unhealthy lifestyle - increase priority for all examinations
  if (hasHighBMI || hasUnhealthyLifestyle) {
    const priorityBoost = 3;

    // Mandatory screenings
    Object.keys(result.mandatory).forEach((key) => {
      addPriority("mandatory", key, priorityBoost);
    });

    // Optional screenings
    Object.keys(result.optional).forEach((key) => {
      addPriority("optional", key, priorityBoost);
    });

    // Extra priority for lifestyle counseling
    addPriority("optional", "healthyLifestyleCounseling", 5);
    addPriority("optional", "physicalActivityCounseling", 5);
  }

  // 3. Smoker - prioritize lung examination
  if (isSmoker) {
    addPriority("mandatory", "chestXray", 12);
    addPriority("optional", "smokingCessationCounseling", 10);
    addPriority("mandatory", "bloodTests", 5); // General health check
  }

  // 4. Family cancer history - increase priority for all examinations
  if (hasFamilyCancerHistory) {
    const priorityBoost = 5;

    // Mandatory screenings
    Object.keys(result.mandatory).forEach((key) => {
      addPriority("mandatory", key, priorityBoost);
    });

    // Optional screenings
    Object.keys(result.optional).forEach((key) => {
      addPriority("optional", key, priorityBoost);
    });

    // EXTRA priority for mammography (breast cancer screening)
    addPriority("optional", "mammography", 15);

    // Extra priority for genetic consultation
    addPriority("optional", "geneticConsultation", 12);

    // Extra priority for gender-specific screenings
    if (formData.gender === "female") {
      addPriority("optional", "gynecologicalExamination", 10);
      addPriority("mandatory", "breastUltrasound", 10);
    }

    if (formData.gender === "male") {
      addPriority("mandatory", "psaTest", 10);
      addPriority("mandatory", "testicularUltrasound", 8);
    }
  }

  // 5. Additional condition-specific priorities

  // Age-based priorities
  const age = formData.age || 0;
  if (age >= 50) {
    addPriority("optional", "colonoscopy", 5);
    if (formData.gender === "male") {
      addPriority("mandatory", "psaTest", 7);
    }
  }

  if (age >= 45 && formData.gender === "female") {
    addPriority("optional", "mammography", 7);
    addPriority("optional", "gynecologicalExamination", 5);
  }

  // Alcohol consumption
  if (formData.drinksAlcohol && (formData.beersPerWeek || 0) > 7) {
    addPriority("mandatory", "bloodTests", 6);
    addPriority("mandatory", "abdominalUltrasound", 6);
    addPriority("optional", "addictionCounseling", 8);
  }

  return result;
}
