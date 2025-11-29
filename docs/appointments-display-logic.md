# Appointments Display Logic - Step 8

Tento dokument popisuje logiku zobrazování vyšetření v kroku 8 (Doporučené termíny) formuláře zdravotního posouzení.

## Přehled

Krok 8 zobrazuje dvě kategorie vyšetření:
1. **Mandatory (Povinná vyšetření)** - automaticky vybraná, nelze odebrat
2. **Optional (Další dostupná vyšetření)** - volitelná, uživatel si může vybrat

## Mandatory Appointments

### Kritéria zobrazení

Mandatory appointments se zobrazují **POUZE** pokud splňují kritéria způsobilosti z `screening-eligibility.md`. Nejedná se o pevný seznam, ale o dynamické vyšetření podle demografických údajů pacienta.

### Mapování ID na Screening Kritéria

| ID | Vyšetření | Zobrazit pokud | Doporučeno pokud |
|----|-----------|----------------|------------------|
| 1 | Vyšetření prostaty | `showProstateScreening === true` | `hadProstateScreening === false` |
| 2 | CT plic | `showLungCancerScreening === true` | `hadLungCancerScreening === false` |
| 3 | Gynekologické vyšetření | `showCervicalCancerScreening === true` | `hadCervicalCancerScreening === false` |
| 4 | Mamografie | `showBreastCancerScreening === true` | `hadBreastCancerScreening === false` |
| 5 | Kolonoskopie | `showColorectalCancerScreening === true` | `hadColorectalCancerScreening === false` |

### Screening Eligibility Kritéria

#### 1. Vyšetření prostaty (ID: 1)
**Zobrazit**: Muži ve věku 50-69 let
```typescript
gender === "male" && age >= 50 && age <= 69
```
**Doporučeno**: Pokud screening ještě neabsolvovali

---

#### 2. CT plic (ID: 2)
**Zobrazit**: Všichni pacienti bez omezení
```typescript
true
```
**Doporučeno**: Pokud screening ještě neabsolvovali

---

#### 3. Gynekologické vyšetření (ID: 3)
**Zobrazit**: Ženy od 15 let
```typescript
gender === "female" && age >= 15
```
**Doporučeno**: Pokud screening ještě neabsolvovaly

---

#### 4. Mamografie (ID: 4)
**Zobrazit**: Ženy od 45 let NEBO ženy s rodinnou anamnézou nádorů (bez věkového omezení)
```typescript
gender === "female" && (age >= 45 || hasFamilyCancerHistory)
```
**Doporučeno**: Pokud screening ještě neabsolvovaly

---

#### 5. Kolonoskopie (ID: 5)
**Zobrazit**: Muži i ženy ve věku 45-74 let
```typescript
age >= 45 && age <= 74
```
**Doporučeno**: Pokud screening ještě neabsolvovali

---

## Vizuální rozlišení Mandatory Appointments

### Doporučená vyšetření
- **Badge**: Červený "Doporučeno"
- **Border**: Silný červený (2px, `var(--mantine-color-red-4)`)
- **Pozadí**: Světle červené (`var(--mantine-color-red-0)`)
- **Stav**: Automaticky vybrané, disabled checkbox
- **Význam**: Pacient tento screening ještě neabsolvoval A splňuje kritéria způsobilosti

### Povinná vyšetření (ne doporučená)
- **Badge**: Šedý "Povinné"
- **Border**: Tenký šedý (1px, `var(--mantine-color-gray-3)`)
- **Pozadí**: Světle šedé (`var(--mantine-color-gray-0)`)
- **Stav**: Automaticky vybrané, disabled checkbox
- **Význam**: Pacient tento screening již absolvoval, ale stále splňuje kritéria způsobilosti

## Optional Appointments

### Kritéria zobrazení

Optional appointments (ID: 6-14) se zobrazují **VŽDY** bez ohledu na demografické údaje nebo předchozí screeningy.

### Seznam Optional Appointments

| ID | Vyšetření | Kategorie |
|----|-----------|-----------|
| 6 | Test okultního krvácení stolice | Vyšetření |
| 7 | Sigmoidoskopie | Vyšetření |
| 8 | Gastroenterolog | Konzultace |
| 9 | Gynekolog | Konzultace |
| 10 | Urolog | Konzultace |
| 11 | Praktický lékař | Konzultace |
| 12 | Onkolog | Konzultace |
| 13 | Radiolog | Konzultace |
| 14 | Nutriční poradce | Konzultace |

### Vizuální zobrazení

- **Badge**: Žádný
- **Border**: Standardní šedý (1px)
- **Pozadí**: Bílé (default)
- **Při výběru**: 
  - Border: Modrý primary color (2px)
  - Pozadí: Světle modré (`var(--mantine-primary-color-light)`)
- **Stav**: Volitelné, lze zaškrtnout/odškrtnout
- **Interakce**: Kliknutelná karta + checkbox

## Implementační logika

### Krok 1: Získání eligibility dat
```typescript
const eligibility = getScreeningEligibility(
  gender,
  age,
  hasFamilyCancerHistory
);
```

### Krok 2: Konfigurace mandatory appointments
```typescript
const mandatoryAppointmentsConfig = [
  { id: 1, show: eligibility.showProstateScreening, recommend: !hadProstateScreening },
  { id: 2, show: eligibility.showLungCancerScreening, recommend: !hadLungCancerScreening },
  { id: 3, show: eligibility.showCervicalCancerScreening, recommend: !hadCervicalCancerScreening },
  { id: 4, show: eligibility.showBreastCancerScreening, recommend: !hadBreastCancerScreening },
  { id: 5, show: eligibility.showColorectalCancerScreening, recommend: !hadColorectalCancerScreening },
];
```

### Krok 3: Filtrování viditelných appointments
```typescript
const visibleMandatoryAppointments = appointments
  .filter((app) => app.type === "mandatory")
  .filter((app) => {
    const config = mandatoryAppointmentsConfig.find((c) => c.id === app.id);
    return config?.show; // Zobrazit pouze pokud splňuje kritéria
  })
  .map((app) => ({
    ...app,
    isRecommended: mandatoryAppointmentsConfig.find((c) => c.id === app.id)?.recommend,
  }));
```

### Krok 4: Auto-select mandatory appointments
```typescript
React.useEffect(() => {
  const mandatoryIds = visibleMandatoryAppointments.map((app) => app.id);
  setValue("selectedAppointments", [...currentSelected, ...mandatoryIds]);
}, [visibleMandatoryAppointments]);
```

## Příklady

### Příklad 1: Mladá žena (25 let) bez rodinné anamnézy

**Mandatory appointments zobrazené:**
- ✅ CT plic (ID: 2) - Doporučeno
- ✅ Gynekologické vyšetření (ID: 3) - Doporučeno

**Mandatory appointments NEZOBRAZENÉ:**
- ❌ Vyšetření prostaty (ID: 1) - Není muž
- ❌ Mamografie (ID: 4) - Mladší než 45 let a bez rodinné anamnézy
- ❌ Kolonoskopie (ID: 5) - Mladší než 45 let

**Optional appointments:** Všechny dostupné (ID: 6-14)

---

### Příklad 2: Muž (55 let) s rodinnou anamnézou, absolvoval screening prostaty

**Mandatory appointments zobrazené:**
- ✅ Vyšetření prostaty (ID: 1) - Povinné (ne doporučeno, už absolvoval)
- ✅ CT plic (ID: 2) - Doporučeno
- ✅ Kolonoskopie (ID: 5) - Doporučeno

**Mandatory appointments NEZOBRAZENÉ:**
- ❌ Gynekologické vyšetření (ID: 3) - Není žena
- ❌ Mamografie (ID: 4) - Není žena

**Optional appointments:** Všechny dostupné (ID: 6-14)

---

### Příklad 3: Žena (30 let) s rodinnou anamnézou nádorů

**Mandatory appointments zobrazené:**
- ✅ CT plic (ID: 2) - Doporučeno
- ✅ Gynekologické vyšetření (ID: 3) - Doporučeno
- ✅ Mamografie (ID: 4) - Doporučeno (rodinná anamnéza = bez věkového omezení!)

**Mandatory appointments NEZOBRAZENÉ:**
- ❌ Vyšetření prostaty (ID: 1) - Není muž
- ❌ Kolonoskopie (ID: 5) - Mladší než 45 let

**Optional appointments:** Všechny dostupné (ID: 6-14)

---

## Data Flow

```
User Input (Steps 1-6)
    ↓
getScreeningEligibility() 
    ↓
Screening Eligibility Flags
    ↓
mandatoryAppointmentsConfig
    ↓
Filter & Map Appointments
    ↓
visibleMandatoryAppointments
    ↓
Auto-select via useEffect
    ↓
Render with Visual Distinction
```

## Poznámky

1. **Dynamické zobrazení**: Mandatory appointments se mění podle věku, pohlaví a odpovědí uživatele
2. **Automatický výběr**: Všechny viditelné mandatory appointments jsou automaticky vybrané
3. **Nelze odebrat**: Mandatory appointments mají disabled checkbox
4. **Vizuální feedback**: Červené = doporučeno (nový screening), šedé = povinné (už absolvováno)
5. **Optional vždy dostupné**: Uživatel může vybrat jakékoliv další vyšetření
6. **Reference**: Kompletní screening kritéria viz `screening-eligibility.md`


