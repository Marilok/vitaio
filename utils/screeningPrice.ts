import { FormData } from "@/types/form";
import { getScreeningEligibility } from "./priority";

/**
 * Determines if a screening appointment should be free based on:
 * 1. Patient eligibility (age, gender)
 * 2. Whether they have NOT completed the screening in the required interval
 *
 * If checkbox is NOT checked in Step 7 = they haven't done it = FREE
 * If checkbox IS checked in Step 7 = they have done it = PAID
 */
export function getScreeningPrice(
  appointmentId: number,
  formData: FormData
): { isFree: boolean; reason?: string } {
  const eligibility = getScreeningEligibility(
    formData.gender,
    formData.age,
    formData.hasFamilyCancerHistory,
    formData.isSmoker,
    formData.cigarettePacksPerWeek,
    formData.smokingYears
  );

  // Mapping appointment IDs to screening eligibility and form fields
  const screeningMap: Record<
    number,
    {
      isEligible: boolean;
      hasCompleted: boolean;
      reason: string;
    }
  > = {
    // ID 3 - Gynekologické vyšetření (cervical cancer screening)
    3: {
      isEligible: eligibility.showCervicalCancerScreening,
      hasCompleted: formData.hadCervicalCancerScreening || false,
      reason: "Screeningový program placený ženám od 15 let",
    },
    // ID 4 - Mamografie (breast cancer screening)
    4: {
      isEligible: eligibility.showBreastCancerScreening,
      hasCompleted: formData.hadBreastCancerScreening || false,
      reason: "Screeningový program dostupný pro ženy od 45 let",
    },
    // ID 5 - Kolonoskopie (colorectal cancer screening)
    5: {
      isEligible: eligibility.showColorectalCancerScreening,
      hasCompleted: formData.hadColorectalCancerScreening || false,
      reason:
        formData.gender === "female"
          ? "Máte nárok na screeningový program pro ženy od 50 let"
          : "Máte nárok na screeningový program pro muže od 50 let",
    },
    // ID 6 - Test okultního krvácení stolice (TOKS)
    6: {
      isEligible: eligibility.showOccultBloodTest,
      hasCompleted: formData.hadOccultBloodTest || false,
      reason:
        (formData.age || 0) >= 55
          ? "Screeningový program je pro Vás hrazen 2× ročně"
          : "Screeningový program je pro Vás hrazen 1× ročně",
    },
    // ID 1 - Vyšetření prostaty (prostate screening) - this might not be in optional, check if needed
    1: {
      isEligible: eligibility.showProstateScreening,
      hasCompleted: formData.hadProstateScreening || false,
      reason:
        "Můžete čerpat z pilotního screeningového programu pro muže 50–69 let",
    },
    // ID 2 - CT plic (lung cancer screening)
    2: {
      isEligible: eligibility.showLungCancerScreening,
      hasCompleted: formData.hadLungCancerScreening || false,
      reason:
        "Screeningový program určený pro kuřáky ve věku 55–74 let (s více než 20 balíčkoroky), hrazený 1× ročně",
    },
  };

  const screening = screeningMap[appointmentId];

  // If not a screening appointment, return not free
  if (!screening) {
    return { isFree: false };
  }

  // If eligible AND has NOT completed = FREE (checkbox not checked)
  // If eligible AND has completed = PAID (checkbox checked)
  if (screening.isEligible && !screening.hasCompleted) {
    return { isFree: true, reason: screening.reason };
  }

  return { isFree: false };
}
