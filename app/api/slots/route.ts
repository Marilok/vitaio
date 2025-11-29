import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface SlotInfo {
  id: number;
  timeFrom: string;
  minutes: number;
  examination_type_id: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examinationTypeId = searchParams.get("examination_type_id");

    if (!examinationTypeId) {
      return NextResponse.json(
        { error: "Chybí povinný parametr: examination_type_id" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Načíst všechny volné sloty pro daný examination_type_id
    const { data: availableSlots, error: slotsError } = await supabase
      .from("Slot")
      .select("*")
      .eq("examination_type_id", parseInt(examinationTypeId))
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
        { 
          success: true,
          slots: [],
          message: "Pro tento typ vyšetření nejsou dostupné žádné volné termíny" 
        },
        { status: 200 }
      );
    }

    // Formátovat sloty do požadovaného formátu
    const formattedSlots: SlotInfo[] = availableSlots.map((slot: any) => ({
      id: slot.id,
      timeFrom: slot.dateTime,
      minutes: slot.minutes,
      examination_type_id: slot.examination_type_id,
    }));

    return NextResponse.json({
      success: true,
      slots: formattedSlots,
      total: formattedSlots.length,
      message: "Sloty byly úspěšně načteny",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
