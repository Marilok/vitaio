/**
 * Health assessment configuration constants
 */
export const HEALTH_LIMITS = {
  /** BMI limit above which weight is considered unhealthy */
  BMI_LIMIT: 28,
  /** Pack-years limit above which smoking is considered excessive */
  SMOKING_PACK_YEARS_LIMIT: 20,
  /** Minimum recommended weekly sport activity in minutes */
  SPORT_ACTIVITY_MINIMUM: 150,
  /** Maximum recommended daily alcohol consumption (number of drinks) */
  ALCOHOL_DAILY_LIMIT: 2,
} as const;
