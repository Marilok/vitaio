/**
 * Slovník pro překlad názvů vyšetření z angličtiny do češtiny
 */
export const EXAMINATION_TRANSLATIONS: Record<string, string> = {
  // Laboratory - Laboratorní vyšetření
  'bloodTests': 'Krevní testy',
  'urineTest': 'Vyšetření moči',
  'occultBloodTest': 'Test na okultní krvácení',
  'psaTest': 'PSA test',
  
  // Imaging - Zobrazovací metody
  'chestXray': 'RTG hrudníku',
  'abdominalUltrasound': 'Ultrazvuk břicha',
  'testicularUltrasound': 'Ultrazvuk varlat',
  'breastUltrasound': 'Ultrazvuk prsou',
  'mammography': 'Mamografie',
  'colonoscopy': 'Kolonoskopie',
  'inBodyAnalysis': 'InBody analýza',
  
  // EKG
  'ecg': 'EKG',
  'bloodPressureAndPulseMeasurement': 'Měření tlaku a pulzu',
  
  // Consultation - Konzultace
  'oncologistConsultation': 'Konzultace s onkologem',
  'physicalExamination': 'Fyzikální vyšetření',
  'geneticConsultation': 'Genetická konzultace',
  'gynecologicalExamination': 'Gynekologické vyšetření',
  'healthyLifestyleCounseling': 'Poradenství pro zdravý životní styl',
  'smokingCessationCounseling': 'Poradenství pro odvykání kouření',
  'addictionCounseling': 'Poradenství pro odvykání závislostí',
  'physicalActivityCounseling': 'Poradenství pro pohybovou aktivitu',
};

/**
 * Funkce pro překlad názvu vyšetření
 * @param examinationName - anglický název vyšetření
 * @returns český název vyšetření nebo původní název, pokud překlad neexistuje
 */
export function translateExaminationName(examinationName: string): string {
  return EXAMINATION_TRANSLATIONS[examinationName] || examinationName;
}

