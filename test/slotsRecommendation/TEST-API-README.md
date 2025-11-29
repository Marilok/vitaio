# API Testování - Examination DateTime

## 📌 Endpoint

```
POST /api/examinationDateTime
```

## 📥 Request Body

```json
{
  "screenings": {
    "mandatory": {
      "oncologistConsultation": {
        "order": true,
        "priority": 1
      },
      "physicalExamination": {
        "order": true,
        "priority": 2
      },
      "bloodTests": {
        "order": true,
        "priority": 3
      }
    },
    "optional": {
      "colonoscopy": {
        "order": true,
        "priority": 13
      },
      "geneticConsultation": {
        "order": false,
        "priority": 14
      }
    }
  }
}
```

## 📤 Response (Success)

```json
{
  "success": true,
  "availableSlots": {
    "oncologistConsultation": [
      {
        "id": 1,
        "timeFrom": "2025-12-01T09:00:00.000Z",
        "length": 30
      },
      {
        "id": 5,
        "timeFrom": "2025-12-01T10:00:00.000Z",
        "length": 30
      },
      {
        "id": 12,
        "timeFrom": "2025-12-01T11:00:00.000Z",
        "length": 30
      }
    ],
    "physicalExamination": [
      {
        "id": 3,
        "timeFrom": "2025-12-01T09:30:00.000Z",
        "length": 45
      },
      {
        "id": 8,
        "timeFrom": "2025-12-01T10:30:00.000Z",
        "length": 45
      },
      {
        "id": 15,
        "timeFrom": "2025-12-01T13:00:00.000Z",
        "length": 45
      }
    ],
    "bloodTests": [
      {
        "id": 7,
        "timeFrom": "2025-12-01T08:00:00.000Z",
        "length": 15
      },
      {
        "id": 14,
        "timeFrom": "2025-12-01T08:30:00.000Z",
        "length": 15
      },
      {
        "id": 22,
        "timeFrom": "2025-12-01T14:00:00.000Z",
        "length": 15
      }
    ]
  },
  "totalExaminations": 3,
  "message": "Dostupné sloty byly úspěšně načteny"
}
```

### Vysvětlení struktury:

- **availableSlots**: Objekt, kde:
  - **klíč** = název vyšetření (např. `oncologistConsultation`)
  - **hodnota** = pole s max 3 objekty slotů, každý slot obsahuje:
    - **id**: Unikátní ID slotu (number)
    - **timeFrom**: Začátek slotu ve formátu ISO 8601 timestamp (string)
    - **length**: Délka vyšetření v minutách (number)
  
- **totalExaminations**: Počet vyšetření s `order: true`
- **message**: Informační zpráva

## ❌ Error Responses

### Chybí povinné pole
```json
{
  "error": "Chybí povinné pole: screenings"
}
```

### Žádná vyšetření k naplánování
```json
{
  "error": "Žádná vyšetření k naplánování"
}
```

### Nejsou dostupné termíny
```json
{
  "error": "Nejsou dostupné žádné volné termíny"
}
```

## 🧪 Testování

### Metoda 1: Node.js
```bash
node test-api.js
```

### Metoda 2: Bash script
```bash
./test-api.sh
```

### Metoda 3: cURL
```bash
curl -X POST http://localhost:3000/api/examinationDateTime \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "screenings": {
    "mandatory": {
      "oncologistConsultation": {"order": true, "priority": 1},
      "physicalExamination": {"order": true, "priority": 2}
    },
    "optional": {}
  }
}
EOF
```

### Metoda 4: VS Code REST Client
Otevři soubor `test-api.http` ve VS Code s nainstalovanou extensionem "REST Client"

## 📝 Poznámky

- Pro každé vyšetření s `order: true` API vrátí až 3 dostupné sloty
- Sloty jsou seřazeny podle data (nejdříve dostupné první)
- Pokud není dostupných 3 sloty, vrátí se méně (nebo prázdné pole `[]`)
- Pokud vyšetření není v databázi (v tabulce ExaminationType), vrátí se prázdné pole

