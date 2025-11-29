// Test API endpoint: /api/examinationDateTime
// Použití: node test-api.js

const testData = {
  screenings: {
      "mandatory": {
          "oncologistConsultation": {
              "order": true,
              "priority": 3
          },
          "physicalExamination": {
              "order": false,
              "priority": 3
          },
          "bloodTests": {
              "order": false,
              "priority": 3
          },
          "urineTest": {
              "order": false,
              "priority": 3
          },
          "occultBloodTest": {
              "order": false,
              "priority": 3
          },
          "bloodPressureAndPulseMeasurement": {
              "order": false,
              "priority": 3
          },
          "ecg": {
              "order": false,
              "priority": 3
          },
          "chestXray": {
              "order": true,
              "priority": 3
          },
          "abdominalUltrasound": {
              "order": false,
              "priority": 3
          },
          "testicularUltrasound": {
              "order": false,
              "priority": 3
          },
          "breastUltrasound": {
              "order": false,
              "priority": 3
          },
          "inBodyAnalysis": {
              "order": false,
              "priority": 3
          },
          "psaTest": {
              "order": false,
              "priority": 3
          }
      },
      "optional": {
          "colonoscopy": {
              "order": true,
              "priority": 8
          },
          "geneticConsultation": {
              "order": false,
              "priority": 3
          },
          "gynecologicalExamination": {
              "order": true,
              "priority": 8
          },
          "healthyLifestyleCounseling": {
              "order": false,
              "priority": 8
          },
          "smokingCessationCounseling": {
              "order": false,
              "priority": 3
          },
          "addictionCounseling": {
              "order": false,
              "priority": 3
          },
          "physicalActivityCounseling": {
              "order": false,
              "priority": 8
          },
          "mammography": {
              "order": true,
              "priority": 10
          }
  }
  }
};

async function testAPI() {
  console.log('🧪 Testování API: /api/examinationDateTime');
  console.log('==========================================\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/examinationDateTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📝 Response:\n`);
    console.log(JSON.stringify(data, null, 2));
    
    if (data.availableSlots) {
      console.log(`\n✅ Nalezeno ${data.totalExaminations} vyšetření s dostupnými sloty:`);
      Object.entries(data.availableSlots).forEach(([exam, slots]) => {
        console.log(`\n  📋 ${exam}:`);
        console.log(`    Počet slotů: ${slots.length}`);
        slots.forEach((slot, index) => {
          console.log(`    Slot ${index + 1}:`);
          console.log(`      - ID: ${slot.id}`);
          console.log(`      - Čas od: ${slot.timeFrom}`);
          console.log(`      - Délka: ${slot.length} minut`);
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

testAPI();

