import { HEALTH_LIMITS } from "./config";

/**
 * Type definition for alcoholic drink entry
 */
export interface AlcoholicDrink {
  name: string;
  count: number;
}

/**
 * Calculates total daily alcohol consumption from an array of drinks
 * @param drinks - Array of alcoholic drinks with name and count
 * @returns Total number of drinks consumed
 */
export function calculateTotalDrinks(drinks: AlcoholicDrink[]): number {
  if (!Array.isArray(drinks)) {
    throw new Error("Drinks must be an array");
  }

  return drinks.reduce((total, drink) => {
    if (typeof drink.count !== "number" || drink.count < 0) {
      throw new Error(
        `Invalid count value for drink "${drink.name}": must be a non-negative number`
      );
    }
    return total + drink.count;
  }, 0);
}

/**
 * Checks if alcohol consumption exceeds the recommended daily limit
 * @param drinks - Array of alcoholic drinks with name and count
 * @param dailyLimit - Maximum recommended daily drinks (defaults to config value)
 * @returns true if consumption exceeds limit (over limit), false otherwise
 */
export function isLimitAlcohol(
  drinks: AlcoholicDrink[],
  dailyLimit: number = HEALTH_LIMITS.ALCOHOL_DAILY_LIMIT
): boolean {
  const totalDrinks = calculateTotalDrinks(drinks);
  return totalDrinks > dailyLimit;
}

/**
 * Checks if alcohol consumption is within the recommended daily limits
 * @param drinks - Array of alcoholic drinks with name and count
 * @param dailyLimit - Maximum recommended daily drinks (defaults to config value)
 * @returns true if consumption is within limits, false otherwise
 */
export function meetsAlcoholLimits(
  drinks: AlcoholicDrink[],
  dailyLimit: number = HEALTH_LIMITS.ALCOHOL_DAILY_LIMIT
): boolean {
  return !isLimitAlcohol(drinks, dailyLimit);
}
