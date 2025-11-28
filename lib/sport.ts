import { HEALTH_LIMITS } from './config';

/**
 * Type definition for sport activity entry
 */
export interface SportActivity {
  name: string;
  minutes: number;
}

/**
 * Calculates total weekly sport activity minutes from an array of activities
 * @param activities - Array of sport activities with name and minutes
 * @returns Total minutes of sport activity
 */
export function calculateTotalSportMinutes(activities: SportActivity[]): number {
  if (!Array.isArray(activities)) {
    throw new Error('Activities must be an array');
  }
  
  return activities.reduce((total, activity) => {
    if (typeof activity.minutes !== 'number' || activity.minutes < 0) {
      throw new Error(`Invalid minutes value for activity "${activity.name}": must be a non-negative number`);
    }
    return total + activity.minutes;
  }, 0);
}

/**
 * Checks if sport activity is below the recommended minimum (150 minutes per week)
 * @param activities - Array of sport activities with name and minutes
 * @param minimumLimit - Minimum recommended activity threshold (defaults to config value)
 * @returns true if activity is below minimum (insufficient), false otherwise
 */
export function isLimitSportActivity(activities: SportActivity[], minimumLimit: number = HEALTH_LIMITS.SPORT_ACTIVITY_MINIMUM): boolean {
  const totalMinutes = calculateTotalSportMinutes(activities);
  return totalMinutes < minimumLimit;
}

/**
 * Checks if sport activity meets the recommended minimum requirements
 * @param activities - Array of sport activities with name and minutes
 * @param minimumLimit - Minimum recommended activity threshold (defaults to config value)
 * @returns true if activity meets or exceeds minimum, false otherwise
 */
export function meetsSportActivityRequirements(activities: SportActivity[], minimumLimit: number = HEALTH_LIMITS.SPORT_ACTIVITY_MINIMUM): boolean {
  return !isLimitSportActivity(activities, minimumLimit);
}