import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface ScreeningItem {
  order: boolean;
  priority: number;
}

interface ScreeningsData {
  mandatory: Record<string, ScreeningItem>;
  optional: Record<string, ScreeningItem>;
}

interface Slot {
  id: number;
  dateTime: string;
  examination_type_id: number;
  booking_id: number | null;
  minutes: number;
}

interface ExaminationType {
  id: number;
  name: string;
}

interface ScheduleRequest {
  screenings: ScreeningsData;
}

interface SlotInfo {
  id: number;
  timeFrom: string;
  minutes: number;
  category?: ExaminationCategory;
}

interface ScheduleResponse {
  success: boolean;
  availableSlots: Record<string, SlotInfo[]>;
  totalExaminations: number;
  message: string;
}

type ExaminationCategory = 'laboratory' | 'imaging' | 'ekg' | 'consultation';

/**
 * Mapa přiřazující každému vyšetření jeho kategorii
 */
const EXAMINATION_CATEGORIES: Record<string, ExaminationCategory> = {
  // Laboratory
  'bloodTests': 'laboratory',
  'urineTest': 'laboratory',
  'occultBloodTest': 'laboratory',
  'psaTest': 'laboratory',
  
  // Imaging
  'chestXray': 'imaging',
  'abdominalUltrasound': 'imaging',
  'testicularUltrasound': 'imaging',
  'breastUltrasound': 'imaging',
  'mammography': 'imaging',
  'colonoscopy': 'imaging',
  'inBodyAnalysis': 'imaging',
  
  // EKG
  'ecg': 'ekg',
  'bloodPressureAndPulseMeasurement': 'ekg',
  
  // Consultation
  'oncologistConsultation': 'consultation',
  'physicalExamination': 'consultation',
  'geneticConsultation': 'consultation',
  'gynecologicalExamination': 'consultation',
  'healthyLifestyleCounseling': 'consultation',
  'smokingCessationCounseling': 'consultation',
  'addictionCounseling': 'consultation',
  'physicalActivityCounseling': 'consultation',
};

/**
 * Priorita kategorií vyšetření (nižší číslo = vyšší priorita)
 */
const CATEGORY_PRIORITY: Record<ExaminationCategory, number> = {
  'laboratory': 1,
  'imaging': 2,
  'ekg': 3,
  'consultation': 4,
};

/**
 * Vrací kategorii vyšetření podle jeho názvu
 */
function getExaminationCategory(examinationName: string): ExaminationCategory | null {
  return EXAMINATION_CATEGORIES[examinationName] || null;
}

/**
 * Vrací prioritu kategorie (nižší číslo = vyšší priorita)
 */
function getCategoryPriority(category: ExaminationCategory | null): number {
  if (!category) return 999; // Neznámé kategorie na konec
  return CATEGORY_PRIORITY[category];
}

/**
 * Kontroluje, zda se dva sloty časově překrývají
 */
function doSlotsOverlap(slot1: Slot, slot2: Slot): boolean {
  const start1 = new Date(slot1.dateTime);
  const end1 = new Date(start1.getTime() + slot1.minutes * 60000);
  
  const start2 = new Date(slot2.dateTime);
  const end2 = new Date(start2.getTime() + slot2.minutes * 60000);
  
  // Sloty se překrývají, pokud se jejich časové intervaly protínají
  return start1 < end2 && end1 > start2;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScheduleRequest = await request.json();

    if (!body.screenings) {
      return NextResponse.json(
        { error: "Chybí povinné pole: screenings" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Získat všechny typy vyšetření z databáze
    const { data: examinationTypes, error: examTypesError } = await supabase
      .from("ExaminationType")
      .select("*");

    if (examTypesError) {
      console.error("Chyba při načítání typů vyšetření:", examTypesError);
      return NextResponse.json(
        { error: "Nepodařilo se načíst typy vyšetření" },
        { status: 500 }
      );
    }

    // 2. Sestavit seznam vyšetření k objednání s prioritami
    const examinationsToSchedule: Array<{
      name: string;
      priority: number;
    }> = [];

    // Projít mandatory i optional vyšetření
    for (const [key, item] of Object.entries(body.screenings.mandatory)) {
      if (item.order) {
        examinationsToSchedule.push({
          name: key,
          priority: item.priority,
        });
      }
    }

    for (const [key, item] of Object.entries(body.screenings.optional || {})) {
      if (item.order) {
        examinationsToSchedule.push({
          name: key,
          priority: item.priority,
        });
      }
    }

    // Seřadit nejprve podle kategorie (laboratory → imaging → ekg → consultation)
    // a pak podle priority (vyšší číslo = vyšší priorita = první)
    examinationsToSchedule.sort((a, b) => {
      const categoryA = getExaminationCategory(a.name);
      const categoryB = getExaminationCategory(b.name);
      
      const categoryPriorityA = getCategoryPriority(categoryA);
      const categoryPriorityB = getCategoryPriority(categoryB);
      
      // Nejprve porovnat podle kategorie (nižší číslo = vyšší priorita)
      if (categoryPriorityA !== categoryPriorityB) {
        return categoryPriorityA - categoryPriorityB;
      }
      
      // Pokud jsou stejné kategorie, porovnat podle priority vyšetření (vyšší číslo = vyšší priorita)
      return b.priority - a.priority;
    });

    // Debug log
    console.log('=== Pořadí zpracování vyšetření ===');
    examinationsToSchedule.forEach((exam, idx) => {
      console.log(`${idx + 1}. ${exam.name} (priority: ${exam.priority}, category: ${getExaminationCategory(exam.name)})`);
    });

    if (examinationsToSchedule.length === 0) {
      return NextResponse.json(
        { error: "Žádná vyšetření k naplánování" },
        { status: 400 }
      );
    }

    // 3. Načíst všechny volné sloty (bez booking_id)
    const { data: availableSlots, error: slotsError } = await supabase
      .from("Slot")
      .select("*")
      .is("booking_id", null)
      .order("dateTime", { ascending: true });

    if (slotsError) {
      console.error("Chyba při načítání slotů:", slotsError);
      return NextResponse.json(
        { error: "Nepodařilo se načíst dostupné termíny" },
        { status: 500 }
      );
    }

    if (!availableSlots || availableSlots.length === 0) {
      return NextResponse.json(
        { error: "Nejsou dostupné žádné volné termíny" },
        { status: 404 }
      );
    }

    // 4. Vytvořit mapu examination type name -> id
    const examTypeNameToId = new Map<string, number>();
    for (const examType of examinationTypes as ExaminationType[]) {
      examTypeNameToId.set(examType.name, examType.id);
    }

    // 5. Pro každé vyšetření najít 3 dostupné sloty BEZ časového překrývání
    const result: Record<string, SlotInfo[]> = {};
    const allSelectedSlots: Slot[] = []; // Sleduje všechny již vybrané sloty

    for (const examination of examinationsToSchedule) {
      const examTypeId = examTypeNameToId.get(examination.name);
      const category = getExaminationCategory(examination.name);
      
      if (!examTypeId) {
        console.warn(`Typ vyšetření "${examination.name}" nebyl nalezen v databázi`);
        result[examination.name] = [];
        continue;
      }

      // Najít sloty pro tento typ vyšetření, které se NEPŘEKRÝVAJÍ s již vybranými
      const candidateSlots = (availableSlots as Slot[])
        .filter(slot => slot.examination_type_id === examTypeId);

      const nonOverlappingSlots: SlotInfo[] = [];

      for (const candidateSlot of candidateSlots) {
        // Pokud už máme 3 sloty, přestaň hledat
        if (nonOverlappingSlots.length >= 3) break;

        // Kontrola, zda se tento slot nepřekrývá s již vybranými sloty
        const overlaps = allSelectedSlots.some(selectedSlot => 
          doSlotsOverlap(candidateSlot, selectedSlot)
        );

        if (!overlaps) {
          // Tento slot nevytváří konflikt, přidej ho
          nonOverlappingSlots.push({
            id: candidateSlot.id,
            timeFrom: candidateSlot.dateTime,
            minutes: candidateSlot.minutes,
            category: category || undefined
          });
          
          // Přidej ho do seznamu vybraných slotů
          allSelectedSlots.push(candidateSlot);
        }
      }

      result[examination.name] = nonOverlappingSlots;
    }

    // 6. Vytvořit seřazený objekt availableSlots podle pořadí v examinationsToSchedule
    const sortedAvailableSlots: Record<string, SlotInfo[]> = {};
    for (const examination of examinationsToSchedule) {
      if (result[examination.name]) {
        sortedAvailableSlots[examination.name] = result[examination.name];
      }
    }

    // 7. Vrátit úspěšnou odpověď
    return NextResponse.json({
      success: true,
      availableSlots: sortedAvailableSlots,
      totalExaminations: examinationsToSchedule.length,
      message: "Available slots were successfully loaded",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
