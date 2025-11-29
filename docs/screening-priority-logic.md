# Screening Priority Logic

Tento dokument popisuje logiku pro dynamické nastavování priorit vyšetření na základě zdravotního stavu pacienta. Priority se vypočítávají ve funkci `transformAppointmentsToScreenings()` v souboru `utils/appointmentsMapping.ts`.

## Přehled

Každé vyšetření ve struktuře `screenings.json` má dva atributy:

- **`order`**: Boolean - zda je vyšetření objednáno (vybrané uživatelem)
- **`priority`**: Number - priorita vyšetření (výchozí hodnota 0)

Priorita se **dynamicky zvyšuje** na základě zdravotních rizikových faktorů pacienta. Vyšší číslo = vyšší priorita.

## Vstupní data

Funkce přijímá:

1. **`selectedAppointmentIds`**: Pole ID vybraných vyšetření z kroku 8
2. **`formData`**: Kompletní data formuláře (`FormData` typ)

## Rizikové faktory

### 1. Krvácení z konečníku (`hasRectalBleeding`)

**Podmínka**: `formData.hasRectalBleeding === true`

**Důvod**: Krvácení ze stolice může indikovat vážné onemocnění tlustého střeva včetně kolorektálního karcinomu.

**Ovlivněná vyšetření**:

| Vyšetření                | Kategorie | Přidaná priorita | Zdůvodnění                               |
| ------------------------ | --------- | ---------------- | ---------------------------------------- |
| `colonoscopy`            | optional  | +10              | Primární vyšetření tlustého střeva       |
| `oncologistConsultation` | mandatory | +8               | Konzultace s gastroenterologem/onkologem |
| `occultBloodTest`        | mandatory | +7               | Potvrzení přítomnosti krve ve stolici    |

**Příklad**:

```typescript
if (hasRectalBleeding) {
  colonoscopy.priority += 10;
  oncologistConsultation.priority += 8;
  occultBloodTest.priority += 7;
}
```

---

### 2. Nadváha nebo nezdravý životní styl

**Podmínky**:

- **BMI > 25** (nadváha nebo obezita)
- **NEBO** nezdravý životní styl:
  - Méně než 150 minut cvičení týdně (`weeklyExerciseMinutes < 150`)
  - Pití alkoholu (`drinksAlcohol === true`)
  - Kouření (`isSmoker === true`)

**Důvod**: Nadváha a nezdravý životní styl jsou klíčové rizikové faktory pro většinu civilizačních onemocnění včetně rakoviny, kardiovaskulárních chorob a diabetu.

**Ovlivněná vyšetření**:

| Vyšetření                    | Kategorie            | Přidaná priorita | Zdůvodnění                  |
| ---------------------------- | -------------------- | ---------------- | --------------------------- |
| **Všechna vyšetření**        | mandatory + optional | +3               | Celkové zvýšení rizika      |
| `healthyLifestyleCounseling` | optional             | +5 (extra)       | Nutná změna životního stylu |
| `physicalActivityCounseling` | optional             | +5 (extra)       | Podpora pohybové aktivity   |

**Příklad výpočtu**:

```typescript
const bmi = calculateBMI(weight, height);
const hasHighBMI = bmi > 25;
const hasUnhealthyLifestyle =
  (weeklyExerciseMinutes || 0) < 150 || drinksAlcohol || isSmoker;

if (hasHighBMI || hasUnhealthyLifestyle) {
  // +3 pro všechna vyšetření
  allMandatoryScreenings.priority += 3;
  allOptionalScreenings.priority += 3;

  // Extra priorita pro poradny
  healthyLifestyleCounseling.priority += 5; // Celkem +8
  physicalActivityCounseling.priority += 5; // Celkem +8
}
```

---

### 3. Kouření (`isSmoker`)

**Podmínka**: `formData.isSmoker === true`

**Důvod**: Kouření je hlavní rizikový faktor pro rakovinu plic, kardiovaskulární onemocnění a další vážné zdravotní problémy.

**Ovlivněná vyšetření**:

| Vyšetření                    | Kategorie | Přidaná priorita | Zdůvodnění                           |
| ---------------------------- | --------- | ---------------- | ------------------------------------ |
| `chestXray`                  | mandatory | +12              | Screening rakoviny plic (CT/rentgen) |
| `smokingCessationCounseling` | optional  | +10              | Pomoc při odvykání kouření           |
| `bloodTests`                 | mandatory | +5               | Kontrola celkového zdravotního stavu |

**Příklad**:

```typescript
if (isSmoker) {
  chestXray.priority += 12;
  smokingCessationCounseling.priority += 10;
  bloodTests.priority += 5;
}
```

---

### 4. Rodinná anamnéza rakoviny (`hasFamilyCancerHistory`)

**Podmínka**: `formData.hasFamilyCancerHistory === true`

**Důvod**: Rodinná anamnéza nádorových onemocnění výrazně zvyšuje genetické riziko onemocnění rakovinou.

**Ovlivněná vyšetření**:

| Vyšetření                  | Kategorie            | Přidaná priorita | Zdůvodnění                        |
| -------------------------- | -------------------- | ---------------- | --------------------------------- |
| **Všechna vyšetření**      | mandatory + optional | +5               | Celkově zvýšené riziko rakoviny   |
| `mammography`              | optional             | **+15 (EXTRA!)** | Velmi vysoké riziko rakoviny prsu |
| `geneticConsultation`      | optional             | +12 (extra)      | Posouzení dědičného rizika        |
| `gynecologicalExamination` | optional             | +10 (ženy)       | Screening gynekologických nádorů  |
| `breastUltrasound`         | mandatory            | +10 (ženy)       | Ultrazvuk prsů                    |
| `psaTest`                  | mandatory            | +10 (muži)       | Screening rakoviny prostaty       |
| `testicularUltrasound`     | mandatory            | +8 (muži)        | Ultrazvuk varlat                  |

**Příklad pro ženu s rodinnou anamnézou**:

```typescript
if (hasFamilyCancerHistory) {
  // +5 pro všechna vyšetření
  allScreenings.priority += 5;

  // Extra priorita pro specifická vyšetření
  mammography.priority += 15; // Celkem +20
  geneticConsultation.priority += 12; // Celkem +17

  if (gender === "female") {
    gynecologicalExamination.priority += 10; // Celkem +15
    breastUltrasound.priority += 10; // Celkem +15
  }
}
```

---

### 5. Věk pacienta

**Podmínky a ovlivněná vyšetření**:

#### Věk 50+ let

| Vyšetření     | Podmínka                         | Přidaná priorita | Zdůvodnění                     |
| ------------- | -------------------------------- | ---------------- | ------------------------------ |
| `colonoscopy` | `age >= 50`                      | +5               | Doporučený screening od 50 let |
| `psaTest`     | `age >= 50 && gender === "male"` | +7               | Screening prostaty u mužů      |

#### Věk 45+ let (ženy)

| Vyšetření                  | Podmínka                           | Přidaná priorita | Zdůvodnění                        |
| -------------------------- | ---------------------------------- | ---------------- | --------------------------------- |
| `mammography`              | `age >= 45 && gender === "female"` | +7               | Screening rakoviny prsu           |
| `gynecologicalExamination` | `age >= 45 && gender === "female"` | +5               | Pravidelné gynekologické kontroly |

**Příklad**:

```typescript
const age = formData.age || 0;

if (age >= 50) {
  colonoscopy.priority += 5;

  if (gender === "male") {
    psaTest.priority += 7;
  }
}

if (age >= 45 && gender === "female") {
  mammography.priority += 7;
  gynecologicalExamination.priority += 5;
}
```

---

### 6. Vysoká konzumace alkoholu

**Podmínka**: `formData.drinksAlcohol === true` **A** `formData.beersPerWeek > 7`

**Důvod**: Častá konzumace alkoholu zvyšuje riziko poškození jater, slinivky a dalších orgánů.

**Ovlivněná vyšetření**:

| Vyšetření             | Kategorie | Přidaná priorita | Zdůvodnění                        |
| --------------------- | --------- | ---------------- | --------------------------------- |
| `bloodTests`          | mandatory | +6               | Kontrola jaterních funkcí         |
| `abdominalUltrasound` | mandatory | +6               | Vyšetření jater a břišních orgánů |
| `addictionCounseling` | optional  | +8               | Pomoc při řešení závislosti       |

**Příklad**:

```typescript
if (drinksAlcohol && beersPerWeek > 7) {
  bloodTests.priority += 6;
  abdominalUltrasound.priority += 6;
  addictionCounseling.priority += 8;
}
```

---

## Kumulativní efekt priorit

Priority se **sčítají**, pokud pacient splňuje více rizikových faktorů současně.

### Příklad 1: Žena (50 let) s rodinnou anamnézou + kouření

**Vstupní data**:

- `gender`: "female"
- `age`: 50
- `hasFamilyCancerHistory`: true
- `isSmoker`: true
- `height`: 165 cm
- `weight`: 80 kg
- `weeklyExerciseMinutes`: 60

**Výpočet BMI**: 80 / (1.65)² = **29.4** (nadváha)

**Aplikované faktory**:

1. ✅ Rodinná anamnéza (+5 pro všechny)
2. ✅ Kouření (specifické priority)
3. ✅ Nadváha/nezdravý životní styl (+3 pro všechny)
4. ✅ Věk 50+ (specifické priority)
5. ✅ Věk 45+ žena (specifické priority)

**Výsledné priority vybraných vyšetření**:

```json
{
  "mandatory": {
    "chestXray": {
      "order": true,
      "priority": 20
    },
    // +12 (kouření) +5 (rodina) +3 (lifestyle)

    "bloodTests": {
      "order": false,
      "priority": 13
    },
    // +5 (kouření) +5 (rodina) +3 (lifestyle)

    "breastUltrasound": {
      "order": false,
      "priority": 18
    }
    // +10 (rodina, žena) +5 (rodina) +3 (lifestyle)
  },
  "optional": {
    "mammography": {
      "order": true,
      "priority": 30
    },
    // +15 (rodina EXTRA) +7 (věk 45+) +5 (rodina) +3 (lifestyle)

    "smokingCessationCounseling": {
      "order": true,
      "priority": 18
    },
    // +10 (kouření) +5 (rodina) +3 (lifestyle)

    "healthyLifestyleCounseling": {
      "order": false,
      "priority": 13
    },
    // +5 (lifestyle extra) +5 (rodina) +3 (lifestyle)

    "colonoscopy": {
      "order": false,
      "priority": 13
    }
    // +5 (věk 50+) +5 (rodina) +3 (lifestyle)
  }
}
```

---

### Příklad 2: Muž (35 let) s krvácením z konečníku

**Vstupní data**:

- `gender`: "male"
- `age`: 35
- `hasRectalBleeding`: true
- `hasFamilyCancerHistory`: false
- `isSmoker`: false
- `BMI`: 23 (normální)

**Aplikované faktory**:

1. ✅ Krvácení z konečníku (specifické priority)

**Výsledné priority**:

```json
{
  "mandatory": {
    "oncologistConsultation": {
      "order": true,
      "priority": 8
    },
    // +8 (krvácení)

    "occultBloodTest": {
      "order": true,
      "priority": 7
    }
    // +7 (krvácení)
  },
  "optional": {
    "colonoscopy": {
      "order": true,
      "priority": 10
    }
    // +10 (krvácení)
  }
}
```

---

## Tabulka všech prioritních pravidel

| Rizikový faktor            | Vyšetření                  | Kategorie | Priorita      | Podmínka                           |
| -------------------------- | -------------------------- | --------- | ------------- | ---------------------------------- |
| **Krvácení stolice**       | colonoscopy                | optional  | +10           | `hasRectalBleeding`                |
|                            | oncologistConsultation     | mandatory | +8            | `hasRectalBleeding`                |
|                            | occultBloodTest            | mandatory | +7            | `hasRectalBleeding`                |
| **Nadváha/lifestyle**      | VŠE                        | all       | +3            | `BMI > 25` OR `unhealthyLifestyle` |
|                            | healthyLifestyleCounseling | optional  | +5 extra      | `BMI > 25` OR `unhealthyLifestyle` |
|                            | physicalActivityCounseling | optional  | +5 extra      | `BMI > 25` OR `unhealthyLifestyle` |
| **Kouření**                | chestXray                  | mandatory | +12           | `isSmoker`                         |
|                            | smokingCessationCounseling | optional  | +10           | `isSmoker`                         |
|                            | bloodTests                 | mandatory | +5            | `isSmoker`                         |
| **Rodinná anamnéza**       | VŠE                        | all       | +5            | `hasFamilyCancerHistory`           |
|                            | mammography                | optional  | **+15 extra** | `hasFamilyCancerHistory`           |
|                            | geneticConsultation        | optional  | +12 extra     | `hasFamilyCancerHistory`           |
|                            | gynecologicalExamination   | optional  | +10 extra     | `hasFamilyCancerHistory` + žena    |
|                            | breastUltrasound           | mandatory | +10 extra     | `hasFamilyCancerHistory` + žena    |
|                            | psaTest                    | mandatory | +10 extra     | `hasFamilyCancerHistory` + muž     |
|                            | testicularUltrasound       | mandatory | +8 extra      | `hasFamilyCancerHistory` + muž     |
| **Věk 50+**                | colonoscopy                | optional  | +5            | `age >= 50`                        |
|                            | psaTest                    | mandatory | +7            | `age >= 50` + muž                  |
| **Věk 45+ (ženy)**         | mammography                | optional  | +7            | `age >= 45` + žena                 |
|                            | gynecologicalExamination   | optional  | +5            | `age >= 45` + žena                 |
| **Alkohol (7+ piv/týden)** | bloodTests                 | mandatory | +6            | `beersPerWeek > 7`                 |
|                            | abdominalUltrasound        | mandatory | +6            | `beersPerWeek > 7`                 |
|                            | addictionCounseling        | optional  | +8            | `beersPerWeek > 7`                 |

---

## Implementační poznámky

### Funkce `transformAppointmentsToScreenings()`

**Lokace**: `/utils/appointmentsMapping.ts`

**Parametry**:

1. `selectedAppointmentIds: number[]` - ID vybraných vyšetření
2. `formData: FormData` - Kompletní data formuláře

**Návratová hodnota**: Objekt ve formátu `screenings.json` se všemi vyšetřeními a jejich prioritami

**Proces**:

1. Vytvoření kopie `DEFAULT_SCREENINGS` (všechny priority = 0)
2. Nastavení `order: true` pro vybraná vyšetření
3. Výpočet zdravotních rizik z `formData`
4. Aplikace priorit pomocí helper funkce `addPriority()`
5. Vrácení finálního objektu s vypočítanými prioritami

### Helper funkce `addPriority()`

```typescript
const addPriority = (
  category: "mandatory" | "optional",
  key: string,
  priorityToAdd: number
) => {
  if (result[category][key]) {
    result[category][key].priority += priorityToAdd;
  }
};
```

---

## Použití v aplikaci

Priority se vypočítávají při submitu formuláře v `MultiStepForm.tsx`:

```typescript
const onSubmit = (data: FormData) => {
  // Transformace vybraných appointments na screenings s prioritami
  const screeningsData = transformAppointmentsToScreenings(
    data.selectedAppointments,
    data
  );

  console.log(
    "Selected Appointments (screenings.json format):",
    screeningsData
  );

  // Odesílání na backend...
};
```

---

## Budoucí rozšíření

Možná vylepšení prioritizační logiky:

1. **Váhové koeficienty**: Různé váhy pro různé rizikové faktory
2. **Kombinované podmínky**: Speciální priority pro specifické kombinace rizik
3. **Dynamické prahové hodnoty**: Odvozené od věku, pohlaví, atd.
4. **Machine learning**: Predikce rizika na základě historických dat
5. **Regionální specifika**: Různé priority podle geografické lokality

---

## Reference

- **Screening Eligibility**: `docs/screening-eligibility.md`
- **Priority Scoring**: `docs/priority-scoring.md`
- **Appointments Display**: `docs/appointments-display-logic.md`
- **BMI Calculation**: `utils/bmi.ts`
- **Form Data Types**: `types/form.ts`


