import { HEALTH_LIMITS } from './config';

/**
 * Calculates Body Mass Index (BMI)
 * @param weight - Weight in kilograms
 * @param height - Height in meters
 * @returns BMI value
 */
export function calculateBMI(weight: number, height: number): number {
  if (height <= 0 || weight <= 0) {
    throw new Error('Weight and height must be positive numbers');
  }
  
  return weight / (height * height);
}

/**
 * Checks if BMI indicates unhealthy weight (BMI > limit)
 * @param bmi - BMI value
 * @param limit - BMI limit threshold (defaults to config value)
 * @returns true if BMI > limit (unhealthy), false otherwise
 */
export function isLimitBMI(bmi: number, limit: number = HEALTH_LIMITS.BMI_LIMIT): boolean {
  return bmi > limit;
}

/**
 * Convenience function to calculate BMI and check if it's unhealthy
 * @param weight - Weight in kilograms
 * @param height - Height in meters
 * @returns true if BMI > 28 (unhealthy), false otherwise
 */
export function isUnhealthyWeight(weight: number, height: number): boolean {
  const bmi = calculateBMI(weight, height);
  return isLimitBMI(bmi);
}