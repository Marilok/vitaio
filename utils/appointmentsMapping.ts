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
 * @param selectedAppointmentIds - Array of selected appointment IDs
 * @returns Screenings object in the format from screenings.json
 */
export function transformAppointmentsToScreenings(
  selectedAppointmentIds: number[]
): typeof DEFAULT_SCREENINGS {
  // Deep clone the default structure
  const result = JSON.parse(JSON.stringify(DEFAULT_SCREENINGS));

  // Set order to true for all selected appointments
  selectedAppointmentIds.forEach((id) => {
    const screeningKey = APPOINTMENT_TO_SCREENING_MAP[id];
    if (screeningKey) {
      // Check in mandatory first
      if (result.mandatory[screeningKey]) {
        result.mandatory[screeningKey].order = true;
      }
      // Then check in optional
      if (result.optional[screeningKey]) {
        result.optional[screeningKey].order = true;
      }
    }
  });

  return result;
}

