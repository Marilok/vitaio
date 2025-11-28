import medicamentsData from '../db/medicaments.json';
import iarc1Data from '../db/iarc1.json';

/**
 * Type definitions for medicament and IARC1 substance data
 */
export interface Medicament {
  id: number;
  name: string;
  ingredients: string[];
}

export interface IARC1Substance {
  id: number;
  substance: string;
}

/**
 * Finds medicaments that contain IARC1 carcinogenic substances
 * @param medicamentIds - Array of medicament IDs to check
 * @returns Object containing results of the check
 */
export function checkMedicamentsForIARC1(medicamentIds: number[]): {
  hasIARC1Substances: boolean;
  foundSubstances: string[];
  affectedMedicaments: { id: number; name: string; dangerousIngredients: string[] }[];
} {
  if (!Array.isArray(medicamentIds)) {
    throw new Error('Medicament IDs must be an array');
  }

  // Get IARC1 substances as a set for faster lookup (case-insensitive)
  const iarc1Substances = new Set(
    iarc1Data.map(item => item.substance.toLowerCase())
  );

  const foundSubstances = new Set<string>();
  const affectedMedicaments: { id: number; name: string; dangerousIngredients: string[] }[] = [];

  // Check each selected medicament
  for (const medicamentId of medicamentIds) {
    if (typeof medicamentId !== 'number') {
      throw new Error(`Invalid medicament ID: ${medicamentId}. Must be a number.`);
    }

    const medicament = medicamentsData.find(med => med.id === medicamentId);
    if (!medicament) {
      throw new Error(`Medicament with ID ${medicamentId} not found`);
    }

    // Check if any ingredients match IARC1 substances
    const dangerousIngredients: string[] = [];
    for (const ingredient of medicament.ingredients) {
      if (iarc1Substances.has(ingredient.toLowerCase())) {
        dangerousIngredients.push(ingredient);
        foundSubstances.add(ingredient);
      }
    }

    if (dangerousIngredients.length > 0) {
      affectedMedicaments.push({
        id: medicament.id,
        name: medicament.name,
        dangerousIngredients
      });
    }
  }

  return {
    hasIARC1Substances: foundSubstances.size > 0,
    foundSubstances: Array.from(foundSubstances),
    affectedMedicaments
  };
}

/**
 * Simple boolean check if any selected medicaments contain IARC1 substances
 * @param medicamentIds - Array of medicament IDs to check
 * @returns true if any medicament contains IARC1 substances, false otherwise
 */
export function isLimitMedicaments(medicamentIds: number[]): boolean {
  const result = checkMedicamentsForIARC1(medicamentIds);
  return result.hasIARC1Substances;
}