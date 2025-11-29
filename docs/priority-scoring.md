# Priority Score Calculation

This document describes the priority scoring system used in the health assessment form. The priority score helps identify patients who may need more urgent medical attention based on their risk factors and screening history.

## Overview

The priority score is calculated automatically when the form is submitted. It starts at a base value of **0** and increases based on various risk factors and missing preventive screenings.

## Calculation Function

Location: `/utils/priority.ts`

Function: `calculatePriorityScore(data: FormData): number`

## Risk Factors and Point Values

### 1. Rectal Bleeding (`hasRectalBleeding`)

**Points**: +10

**Condition**: Patient reported rectal bleeding

```typescript
if (data.hasRectalBleeding) {
  priority += 10;
}
```

**Rationale**: Rectal bleeding can be a sign of serious conditions including colorectal cancer and requires urgent medical attention.

---

### 2. Aspirin Medication (`medications`)

**Points**: +5

**Condition**: Patient is taking Aspirin (medication ID: 3)

```typescript
if (data.medications?.includes("3")) {
  priority += 5;
}
```

**Rationale**: Regular aspirin use may indicate cardiovascular conditions or be used for prevention, suggesting elevated health risk.

---

### 3. High BMI (`weight`, `height`)

**Points**: +3

**Condition**: BMI > 28

```typescript
const bmi = calculateBMI(data.weight, data.height);
if (bmi > 28) {
  priority += 3;
}
```

**Rationale**: BMI over 28 indicates overweight or obesity, which is associated with increased risk of various chronic diseases.

---

### 4. Smoking (`weeklyCigarettes`)

**Points**: +5

**Condition**: Smoking at least 1 cigarette per week

```typescript
if (data.weeklyCigarettes && data.weeklyCigarettes >= 1) {
  priority += 5;
}
```

**Rationale**: Any level of smoking increases cancer risk and other serious health conditions.

---

### 5. Alcohol Consumption (`alcoholConsumption`)

**Points**: 
- +5 for frequent drinking
- +3 for occasional drinking
- +0 for abstaining

**Condition**: Based on reported alcohol consumption frequency

```typescript
if (data.alcoholConsumption === "frequent") {
  priority += 5;
} else if (data.alcoholConsumption === "occasional") {
  priority += 3;
}
```

**Rationale**: Regular alcohol consumption is a known risk factor for various cancers and liver disease.

---

### 6. Missing Preventive Screenings (Step 7)

**Points**: +2 per each unchecked visible screening

**Condition**: For each screening checkbox that:
1. Is visible based on eligibility criteria (age, gender, family history)
2. Is NOT checked by the patient

```typescript
const eligibility = getScreeningEligibility(
  data.gender,
  data.age,
  data.hasFamilyCancerHistory
);

if (eligibility.showProstateScreening && !data.hadProstateScreening) {
  priority += 2;
}
// ... repeated for each screening type
```

**Eligible Screenings**:
- **Prostate**: Men aged 50-69
- **Lung Cancer**: Everyone
- **Cervical Cancer**: Women aged 15+
- **Breast Cancer**: Women aged 45+ OR with family cancer history
- **Colorectal Cancer**: Both genders aged 45-74

**Rationale**: Missing recommended screenings means potential undetected health issues, increasing patient risk.

---

## Priority Score Interpretation

| Score Range | Risk Level | Interpretation |
|-------------|-----------|----------------|
| 0-5 | Low | Patient has minimal risk factors and is up to date with screenings |
| 6-15 | Medium | Patient has some risk factors or missing screenings |
| 16-25 | High | Patient has multiple risk factors or significant gaps in preventive care |
| 26+ | Very High | Patient requires urgent medical attention and comprehensive screening |

## Example Calculation

**Patient Profile**:
- Gender: Female
- Age: 52
- Weight: 85 kg
- Height: 165 cm (BMI: 31.2)
- Rectal bleeding: Yes
- Medications: Aspirin
- Weekly cigarettes: 0
- Alcohol: Occasional
- Missing screenings: Breast cancer, Colorectal cancer

**Priority Calculation**:
```
Base score:                    0
+ Rectal bleeding:           +10
+ Taking Aspirin:             +5
+ BMI over 28:                +3
+ Occasional alcohol:         +3
+ Missing breast screening:   +2
+ Missing colorectal:         +2
─────────────────────────────
Total Priority Score:         25 (High Risk)
```

## Implementation Notes

1. The priority score is calculated on form submission
2. The score is stored in the `priority` field of `FormData`
3. Only visible screenings (based on eligibility) are counted as "missing"
4. The BMI calculation uses the same utility function as Step 6 display
5. Medication IDs are stored as strings in the medications array

## Usage in Code

```typescript
import { calculatePriorityScore } from "@/utils/priority";

const onSubmit = (data: FormData) => {
  const priorityScore = calculatePriorityScore(data);
  const finalData = { ...data, priority: priorityScore };
  
  // Submit to backend or process further
  console.log("Priority Score:", priorityScore);
};
```

## Future Enhancements

Potential improvements to the priority scoring system:

1. Add weighted scoring based on age groups
2. Consider family cancer history as a separate risk factor
3. Include additional medications beyond Aspirin
4. Add time-based factors (e.g., years since last screening)
5. Implement machine learning for risk prediction

