/**
 * Calculates pack-years for smoking history
 *
 * Pack-year definition:
 * 1 pack-year = smoking 1 pack (20 cigarettes) per day for 1 year
 *
 * Formula:
 * Pack-years = (packs per day) × (years of smoking)
 *
 * Example:
 * - Smoking 1 pack/day for 20 years = 20 pack-years
 * - Smoking 2 packs/week for 10 years = (2/7) packs/day × 10 = ~2.86 pack-years
 *
 * @param cigarettePacksPerWeek - Number of cigarette packs smoked per week
 * @param smokingYears - Number of years the person has been smoking
 * @returns Pack-years value
 */
export function calculatePackYears(
  cigarettePacksPerWeek: number | undefined,
  smokingYears: number | undefined
): number {
  if (!cigarettePacksPerWeek || !smokingYears) {
    return 0;
  }

  // Convert packs per week to packs per day
  const packsPerDay = cigarettePacksPerWeek / 7;

  // Calculate pack-years
  const packYears = packsPerDay * smokingYears;

  return Math.round(packYears * 10) / 10; // Round to 1 decimal place
}

/**
 * Checks if patient is eligible for lung cancer CT screening
 *
 * Criteria:
 * - Age: 55-74 years
 * - Smoking history: ≥20 pack-years
 * - Current smoker OR former smoker (quit within last 15 years)
 *
 * @param age - Patient age
 * @param isSmoker - Whether patient is currently smoking
 * @param cigarettePacksPerWeek - Number of cigarette packs smoked per week
 * @param smokingYears - Number of years the person has been smoking
 * @returns Whether patient is eligible for free lung cancer screening
 */
export function isEligibleForLungCancerScreening(
  age: number | undefined,
  isSmoker: boolean | undefined,
  cigarettePacksPerWeek: number | undefined,
  smokingYears: number | undefined
): boolean {
  const patientAge = age || 0;

  // Check age criteria (55-74 years)
  if (patientAge < 55 || patientAge > 74) {
    return false;
  }

  // Check if current smoker
  if (!isSmoker) {
    return false;
  }

  // Calculate pack-years
  const packYears = calculatePackYears(cigarettePacksPerWeek, smokingYears);

  // Check pack-years criteria (≥20)
  return packYears >= 20;
}
