import { FormData } from "@/types/form";
import { calculateBMI } from "./bmi";
import { isEligibleForLungCancerScreening } from "./packYears";

interface ScreeningEligibility {
  showProstateScreening: boolean;
  showLungCancerScreening: boolean;
  showCervicalCancerScreening: boolean;
  showBreastCancerScreening: boolean;
  showColorectalCancerScreening: boolean;
  showGynecologicalConsultation: boolean;
  showOccultBloodTest: boolean;
}

export function getScreeningEligibility(
  gender: "male" | "female",
  age: number | undefined,
  _hasFamilyCancerHistory: boolean | undefined,
  isSmoker?: boolean,
  cigarettePacksPerWeek?: number,
  smokingYears?: number
): ScreeningEligibility {
  const patientAge = age || 0;

  // Ženy kritéria
  const womenGynecology = gender === "female" && patientAge >= 15; // 15+ let: gynekolog + cytologie čípku (zdarma)
  const womenMammography = gender === "female" && patientAge >= 45; // 45+ let: mamograf 1× za 2 roky (zdarma)
  const womenColorectal = gender === "female" && patientAge >= 50; // 50+ let: TOKS/kolonoskopie (zdarma)

  // Muži kritéria
  const menColorectal = gender === "male" && patientAge >= 50; // 50+ let: TOKS/kolonoskopie (zdarma)
  const menProstate = gender === "male" && patientAge >= 50 && patientAge <= 69; // 50–69 let: PSA screening prostaty (zdarma)

  // CT plic - pro kuřáky/bývalé kuřáky s ≥20 balíčkoroky, věk 55-74 let
  const lungCancerScreening = isEligibleForLungCancerScreening(
    patientAge,
    isSmoker,
    cigarettePacksPerWeek,
    smokingYears
  );

  // Test okultního krvácení - 50+ let pro oba pohlaví
  const occultBloodTest = patientAge >= 50; // 50-54 let: 1x ročně, 55+ let: 2x ročně (zdarma)

  return {
    showProstateScreening: menProstate,
    showLungCancerScreening: lungCancerScreening,
    showCervicalCancerScreening: womenGynecology,
    showBreastCancerScreening: womenMammography,
    showColorectalCancerScreening: womenColorectal || menColorectal,
    showGynecologicalConsultation: gender === "female",
    showOccultBloodTest: occultBloodTest,
  };
}

export function calculatePriorityScore(data: FormData): number {
  let priority = 0;

  // +10 for rectal bleeding
  if (data.hasRectalBleeding) {
    priority += 10;
  }

  // +5 if taking Aspirin (medication ID: 3)
  if (data.medications?.some((med) => med.id === "3")) {
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
    data.hasFamilyCancerHistory,
    data.isSmoker,
    data.cigarettePacksPerWeek,
    data.smokingYears
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
