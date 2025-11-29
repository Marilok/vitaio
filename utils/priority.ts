import { FormData } from "@/types/form";
import { calculateBMI } from "./bmi";

interface ScreeningEligibility {
  showProstateScreening: boolean;
  showLungCancerScreening: boolean;
  showCervicalCancerScreening: boolean;
  showBreastCancerScreening: boolean;
  showColorectalCancerScreening: boolean;
}

export function getScreeningEligibility(
  gender: "male" | "female",
  age: number | undefined,
  hasFamilyCancerHistory: boolean | undefined
): ScreeningEligibility {
  const patientAge = age || 0;
  const hasFamilyHistory = hasFamilyCancerHistory || false;

  return {
    showProstateScreening:
      gender === "male" && patientAge >= 50 && patientAge <= 69,
    showLungCancerScreening: true,
    showCervicalCancerScreening: gender === "female" && patientAge >= 15,
    showBreastCancerScreening:
      gender === "female" && (patientAge >= 45 || hasFamilyHistory),
    showColorectalCancerScreening: patientAge >= 45 && patientAge <= 74,
  };
}

export function calculatePriorityScore(data: FormData): number {
  let priority = 0;

  // +10 for rectal bleeding
  if (data.hasRectalBleeding) {
    priority += 10;
  }

  // +5 if taking Aspirin (medication ID: 3)
  if (data.medications?.includes("3")) {
    priority += 5;
  }

  // +3 if BMI over 28
  const bmi = calculateBMI(data.weight, data.height);
  if (bmi > 28) {
    priority += 3;
  }

  // +5 if smoking at least 1 cigarette per week
  if (data.weeklyCigarettes && data.weeklyCigarettes >= 1) {
    priority += 5;
  }

  // +5 for frequent alcohol consumption, +3 for occasional
  if (data.alcoholConsumption === "frequent") {
    priority += 5;
  } else if (data.alcoholConsumption === "occasional") {
    priority += 3;
  }

  // +2 for each unchecked visible screening checkbox in Step 7
  const eligibility = getScreeningEligibility(
    data.gender,
    data.age,
    data.hasFamilyCancerHistory
  );

  if (eligibility.showProstateScreening && !data.hadProstateScreening) {
    priority += 2;
  }
  if (eligibility.showLungCancerScreening && !data.hadLungCancerScreening) {
    priority += 2;
  }
  if (
    eligibility.showCervicalCancerScreening &&
    !data.hadCervicalCancerScreening
  ) {
    priority += 2;
  }
  if (eligibility.showBreastCancerScreening && !data.hadBreastCancerScreening) {
    priority += 2;
  }
  if (
    eligibility.showColorectalCancerScreening &&
    !data.hadColorectalCancerScreening
  ) {
    priority += 2;
  }

  return priority;
}

