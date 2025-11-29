# Screeningová vyšetření - Kritéria způsobilosti

Tento dokument popisuje pravidla pro zobrazení screeningových vyšetření v kroku 7 formuláře zdravotního posouzení.

## Přehled

Funkce `getScreeningEligibility()` v `Step7Screening.tsx` určuje, která screeningová vyšetření by měla být pacientovi zobrazena na základě jeho demografických údajů a zdravotní anamnézy.

## Vstupní parametry

- **gender**: Pohlaví pacienta (`"male"` | `"female"`)
- **age**: Věk pacienta v letech (number)
- **hasFamilyCancerHistory**: Zda má pacient rodinnou anamnézu nádorů (boolean)

## Kritéria pro jednotlivá vyšetření

### 1. Vyšetření prostaty (`showProstateScreening`)

**Podmínka**: Pouze pro muže ve věku 50-69 let

```typescript
gender === "male" && age >= 50 && age <= 69;
```

**Důvod**: Screening prostaty je doporučován pouze mužům v této věkové kategorii, kdy je riziko karcinomu prostaty nejvyšší.

---

### 2. Vyšetření karcinomu plic (`showLungCancerScreening`)

**Podmínka**: Bez omezení - dostupné pro všechny

```typescript
true;
```

**Důvod**: Screening karcinomu plic je relevantní pro všechny pacienty bez ohledu na věk nebo pohlaví.

---

### 3. Karcinom děložního hrdla (`showCervicalCancerScreening`)

**Podmínka**: Pouze pro ženy od 15 let

```typescript
gender === "female" && age >= 15;
```

**Důvod**: Screening cervikálního karcinomu je doporučován pro sexuálně aktivní ženy od 15 let.

---

### 4. Karcinom prsu (`showBreastCancerScreening`)

**Podmínka**: Ženy od 45 let NEBO ženy s rodinnou anamnézou nádorů (bez věkového omezení)

```typescript
gender === "female" && (age >= 45 || hasFamilyCancerHistory);
```

**Důvod**:

- Standardní screening je doporučován ženám od 45 let
- Ženy s rodinnou anamnézou mají zvýšené riziko a měly by být screenovány bez ohledu na věk

---

### 5. Vyšetření kolorektálního karcinomu (`showColorectalCancerScreening`)

**Podmínka**: Obě pohlaví ve věku 45-74 let

```typescript
age >= 45 && age <= 74;
```

**Důvod**: Screening kolorektálního karcinomu je doporučován pro muže i ženy v této věkové kategorii, kdy je riziko onemocnění nejvyšší a screening nejefektivnější.

---

## TypeScript Interface

```typescript
interface ScreeningEligibility {
  showProstateScreening: boolean;
  showLungCancerScreening: boolean;
  showCervicalCancerScreening: boolean;
  showBreastCancerScreening: boolean;
  showColorectalCancerScreening: boolean;
}
```

## Příklad použití

```typescript
const eligibility = getScreeningEligibility("female", 50, true);

// Výsledek:
// {
//   showProstateScreening: false,        // není muž
//   showLungCancerScreening: true,       // vždy zobrazit
//   showCervicalCancerScreening: true,   // žena 15+
//   showBreastCancerScreening: true,     // žena 45+ nebo rodinná anamnéza
//   showColorectalCancerScreening: true  // 45-74 let
// }
```

## Poznámky

- Pokud není věk vyplněn (`undefined`), funkce použije hodnotu `0`, což může ovlivnit zobrazení některých vyšetření
- Pokud není vyplněna rodinná anamnéza (`undefined`), funkce použije hodnotu `false`
- Všechna screeningová vyšetření jsou nepovinná (optional checkboxy)
