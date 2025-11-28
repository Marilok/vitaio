import { HEALTH_LIMITS } from "./config";

/**
 * Calculates pack-years of smoking
 * Pack-years = (number of cigarettes per day / 20) × number of years smoking
 * @param cigarettesPerDay - Number of cigarettes smoked per day
 * @param yearsOfSmoking - Number of years the person has been smoking
 * @returns Pack-years value
 */
export function calculatePackYears(
  cigarettesPerDay: number,
  yearsOfSmoking: number
): number {
  if (cigarettesPerDay < 0 || yearsOfSmoking < 0) {
    throw new Error(
      "Cigarettes per day and years of smoking must be non-negative numbers"
    );
  }

  return (cigarettesPerDay / 20) * yearsOfSmoking;
}

/**
 * Checks if smoking is within acceptable limits (pack-years < limit)
 * @param packYears - Pack-years value
 * @param limit - Pack-years limit threshold (defaults to config value)
 * @returns true if pack-years < limit (within limits), false otherwise
 */
export function isLimitSmoking(
  packYears: number,
  limit: number = HEALTH_LIMITS.SMOKING_PACK_YEARS_LIMIT
): boolean {
  return packYears < limit;
}

/**
 * Convenience function to calculate pack-years and check if smoking is within limits
 * @param cigarettesPerDay - Number of cigarettes smoked per day
 * @param yearsOfSmoking - Number of years the person has been smoking
 * @returns true if pack-years < 20 (within limits), false otherwise
 */
export function isSmokingWithinLimits(
  cigarettesPerDay: number,
  yearsOfSmoking: number
): boolean {
  const packYears = calculatePackYears(cigarettesPerDay, yearsOfSmoking);
  return isLimitSmoking(packYears);
}
