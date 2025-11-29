export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    return 0;
  }
  
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
}

export function getBMICategory(bmi: number): string {
  if (bmi === 0) return "";
  if (bmi < 18.5) return "Podváha";
  if (bmi < 25) return "Normální váha";
  if (bmi < 30) return "Nadváha";
  if (bmi < 35) return "Obezita 1. stupně";
  if (bmi < 40) return "Obezita 2. stupně";
  return "Obezita 3. stupně";
}

export function getBMICategoryColor(bmi: number): string {
  if (bmi === 0) return "gray";
  if (bmi < 18.5) return "yellow";
  if (bmi < 25) return "green";
  if (bmi < 30) return "orange";
  return "red";
}

