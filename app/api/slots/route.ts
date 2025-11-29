import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const examinationTypeId = searchParams.get("examination_type_id");

    // Build query conditions with join to examination type table
    let query = supabase
      .from("Slot")
      .select(
        `
        *,
        ExaminationType:examination_type_id (
          id,
          name,
          description
        )
      `
      )
      .is("booking_id", null)
      .gt("dateTime", new Date().toISOString());

    // Add examination_type_id filter if provided
    if (examinationTypeId) {
      query = query.eq("examination_type_id", parseInt(examinationTypeId));
    }

    // Fetch available slots with conditions
    const { data: slots, error } = await query;

    if (error) {
      console.error("Error fetching slots:", error);
      return NextResponse.json(
        { error: "Failed to fetch slots", details: error.message },
        { status: 500 }
      );
    }

    // Log filtered values to console
    const filterDescription = examinationTypeId
      ? `booking_id=null, examination_type_id=${examinationTypeId}, future dates`
      : `booking_id=null, future dates (all examination types)`;

    console.log(`Available slots (${filterDescription}):`, slots);
    console.log("Total available slots found:", slots?.length || 0);

    // Log each slot individually for detailed view
    slots?.forEach((slot, index) => {
      console.log(`Available Slot ${index + 1}:`, {
        id: slot.id,
        dateTime: slot.dateTime,
        examination_type_id: slot.examination_type_id,
        examination_type_name: slot.ExaminationType?.name,
        examination_type_description: slot.ExaminationType?.description,
        booking_id: slot.booking_id,
        ...slot,
      });
    });

    return NextResponse.json({
      success: true,
      data: slots,
      count: slots?.length || 0,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
