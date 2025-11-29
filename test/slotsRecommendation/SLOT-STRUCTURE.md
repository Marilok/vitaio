# Struktura Slot objektu

## 📦 Slot Object

Každý slot nyní obsahuje 3 vlastnosti:

```typescript
interface SlotInfo {
  id: number;        // Unikátní ID slotu
  timeFrom: string;  // ISO 8601 timestamp (začátek slotu)
  length: number;    // Délka vyšetření v minutách
}
```

## 📊 Příklad Response

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
      }
    ]
  },
  "totalExaminations": 2,
  "message": "Dostupné sloty byly úspěšně načteny"
}
```

## 🕐 Výpočet konce vyšetření

Pomocí `timeFrom` a `length` můžeš vypočítat konec vyšetření:

```javascript
const slot = {
  id: 1,
  timeFrom: "2025-12-01T09:00:00.000Z",
  length: 30
};

// Konec vyšetření
const startTime = new Date(slot.timeFrom);
const endTime = new Date(startTime.getTime() + slot.length * 60000);

console.log("Začátek:", startTime.toLocaleTimeString()); // 09:00:00
console.log("Konec:", endTime.toLocaleTimeString());     // 09:30:00
```

## 📅 Formátování času

### V JavaScriptu:
```javascript
const slot = data.availableSlots.oncologistConsultation[0];
const date = new Date(slot.timeFrom);

// Datum
const dateStr = date.toLocaleDateString('cs-CZ'); 
// "1. 12. 2025"

// Čas
const timeStr = date.toLocaleTimeString('cs-CZ', { 
  hour: '2-digit', 
  minute: '2-digit' 
});
// "09:00"

// Délka
const lengthStr = `${slot.length} min`;
// "30 min"
```

### Příklad zobrazení:
```
📅 Dostupné termíny pro Konzultace s onkologem:

1. 🕐 1. 12. 2025 v 09:00 (30 min)
2. 🕐 1. 12. 2025 v 10:00 (30 min)
3. 🕐 1. 12. 2025 v 11:00 (30 min)
```

## 🔍 Kontrola překrývání (v klientské aplikaci)

Pokud chceš zkontrolovat, jestli se dva vybrané sloty nepřekrývají:

```javascript
function doSlotsOverlap(slot1, slot2) {
  const start1 = new Date(slot1.timeFrom);
  const end1 = new Date(start1.getTime() + slot1.length * 60000);
  
  const start2 = new Date(slot2.timeFrom);
  const end2 = new Date(start2.getTime() + slot2.length * 60000);
  
  return start1 < end2 && end1 > start2;
}

// Použití:
const slot1 = { 
  id: 1, 
  timeFrom: "2025-12-01T09:00:00.000Z", 
  length: 30 
};
const slot2 = { 
  id: 2, 
  timeFrom: "2025-12-01T09:20:00.000Z", 
  length: 30 
};

if (doSlotsOverlap(slot1, slot2)) {
  console.log("❌ Sloty se překrývají!");
} else {
  console.log("✅ Sloty jsou v pořádku");
}
```

