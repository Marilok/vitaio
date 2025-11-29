"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Alert,
  Button,
  Box,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
  IconInfoCircle,
  IconClock,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/cs";
import { FormData } from "@/types/form";
import { transformAppointmentsToScreenings } from "@/utils/appointmentsMapping";
import { translateExaminationName } from "@/utils/examinationTranslations";
import appointmentsData from "@/db/appointments.json";

// Set Czech locale for dayjs
dayjs.locale("cs");

interface ExaminationType {
  id: number;
  description: string;
}

interface Slot {
  id: string;
  dateTime: string;
  examination_type_id: number;
  booking_id: string | null;
  ExaminationType?: ExaminationType;
}

interface SlotInfo {
  id: number;
  timeFrom: string;
  minutes: number;
  examination_type_id: number;
  category?: string;
}

interface ExaminationDateTimeResponse {
  success: boolean;
  availableSlots: Record<string, SlotInfo[]>;
  totalExaminations: number;
  message: string;
  error?: string;
}

interface SelectedAppointment {
  appointmentTypeId: number;
  examination_type_id: number;
  slotId: string;
  dateTime: string;
  minutes?: number;
  isManuallySelected?: boolean; // true = uživatel ručně upravil, false = automaticky předvybrané
}

interface ScreeningItem {
  order: boolean;
  priority: number;
}

interface ScreeningsData {
  mandatory: Record<string, ScreeningItem>;
  optional: Record<string, ScreeningItem>;
}

export function Step9Appointments() {
  const { watch, setValue, getValues } = useFormContext<FormData>();
  const selectedAppointments = useMemo(
    () => watch("selectedAppointments") || [],
    [watch]
  );

  const [recommendedSlots, setRecommendedSlots] = useState<
    Record<string, SlotInfo[]>
  >({});
  const [examinationNames, setExaminationNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Multi-appointment states
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);
  const [bookedAppointments, setBookedAppointments] = useState<
    SelectedAppointment[]
  >([]);
  const [alternativeSlots, setAlternativeSlots] = useState<
    Record<string, SlotInfo[]>
  >({});
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  useEffect(() => {
    const fetchRecommendedSlots = async () => {
      try {
        setLoading(true);
        setError(null);

        const formData = getValues();

        // Transform appointments to screenings format
        const screeningsData = transformAppointmentsToScreenings(
          selectedAppointments,
          formData
        );

        // Call the examinationDateTime API
        const response = await fetch("/api/examinationDateTime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            screenings: screeningsData,
          }),
        });

        const data: ExaminationDateTimeResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch recommended slots");
        }

        setRecommendedSlots(data.availableSlots);
        setExaminationNames(Object.keys(data.availableSlots));

        // Automatically select the first recommended slot for each examination
        const autoBookedAppointments: SelectedAppointment[] = [];
        
        Object.entries(data.availableSlots).forEach(([examinationName, slots]) => {
          if (slots.length > 0) {
            const firstSlot = slots[0];
            autoBookedAppointments.push({
              appointmentTypeId: firstSlot.id, // Using slot ID as appointment type ID
              examination_type_id: firstSlot.examination_type_id,
              slotId: firstSlot.id.toString(),
              dateTime: firstSlot.timeFrom,
              minutes: firstSlot.minutes,
              isManuallySelected: false, // Automaticky předvybrané
            });
          }
        });

        setBookedAppointments(autoBookedAppointments);

        // Set current appointment index to the last one (all are already selected)
        setCurrentAppointmentIndex(Object.keys(data.availableSlots).length - 1);

        // Focus calendar and select earliest available date when slots are loaded
        const allSlots = Object.values(data.availableSlots).flat();
        if (allSlots.length > 0) {
          const availableDates = allSlots.map((slot) =>
            dayjs(slot.timeFrom).format("YYYY-MM-DD")
          );
          const uniqueDates = [...new Set(availableDates)].sort();
          const earliestDate = dayjs(uniqueDates[0]).toDate();
          setCalendarDate(earliestDate);
          setSelectedDate(earliestDate);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (selectedAppointments.length > 0) {
      fetchRecommendedSlots();
    }
  }, [selectedAppointments, getValues]);

  // Update form field when booked appointments change
  useEffect(() => {
    console.log("💾 Ukládám bookedAppointments:", bookedAppointments);
    setValue("bookedAppointments", bookedAppointments);
  }, [bookedAppointments, setValue]);

  // Update appointmentData with full details when booked appointments change
  useEffect(() => {
    console.log("🔄 Aktualizace appointmentData...");
    console.log("  📦 Rezervované termíny (bookedAppointments):", bookedAppointments);
    console.log("  🗂️ Doporučené sloty (recommendedSlots):", recommendedSlots);
    
    const fullAppointmentData = bookedAppointments.map((apt) => {
      // Find examination name from recommendedSlots
      let examinationName = "";
      for (const [name, slots] of Object.entries(recommendedSlots)) {
        if (slots.some((slot) => slot.examination_type_id === apt.examination_type_id)) {
          examinationName = name;
          break;
        }
      }

      // Find appointment details from appointments.json
      const appointmentDetails = appointmentsData.find(
        (app) => app.id === apt.appointmentTypeId
      );

      const result = {
        id: apt.appointmentTypeId,
        examinationName: translateExaminationName(examinationName),
        dateTime: apt.dateTime,
        slotId: apt.slotId,
        examination_type_id: apt.examination_type_id,
        minutes: apt.minutes || 30,
        isManuallySelected: apt.isManuallySelected || false,
      };

      console.log(`  ✅ Vytvořen záznam pro vyšetření:`, {
        id: result.id,
        examinace: result.examinationName,
        čas: dayjs(result.dateTime).format("D.M.YYYY v HH:mm"),
        ručně_vybrané: result.isManuallySelected,
      });

      return result;
    });

    setValue("appointmentData", fullAppointmentData);
    console.log("📅 ✨ KOMPLETNÍ DATA ULOŽENA DO appointmentData:", fullAppointmentData);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  }, [bookedAppointments, recommendedSlots, setValue]);

  // Helper functions for appointment management
  const getRequestedAppointments = () => {
    return examinationNames;
  };

  const getCurrentAppointment = () => {
    return examinationNames[currentAppointmentIndex] || null;
  };

  const getEarliestDateForAppointment = (appointmentName: string) => {
    const appointmentSlots = recommendedSlots[appointmentName] || [];
    if (appointmentSlots.length === 0) return null;

    const availableDates = appointmentSlots.map((slot) =>
      dayjs(slot.timeFrom).format("YYYY-MM-DD")
    );
    const uniqueDates = [...new Set(availableDates)].sort();
    return dayjs(uniqueDates[0]).toDate();
  };

  const getExaminationTypeDetails = (appointmentName: string) => {
    return {
      name: translateExaminationName(appointmentName),
      description: translateExaminationName(appointmentName),
    };
  };

  /**
   * Kontroluje, zda jsou dva sloty v konfliktu (překrývají se nebo jsou příliš blízko)
   * Mezi sloty musí být minimálně 30 minut mezera
   */
  const areSlotsConflicting = (
    slot1: { dateTime: string; minutes: number },
    slot2: { dateTime: string; minutes: number }
  ): boolean => {
    const BUFFER_MINUTES = 30; // Minimální mezera mezi sloty

    const start1 = new Date(slot1.dateTime);
    const end1 = new Date(start1.getTime() + slot1.minutes * 60000);

    const start2 = new Date(slot2.dateTime);
    const end2 = new Date(start2.getTime() + slot2.minutes * 60000);

    // Přidáme buffer k oběma slotům
    const end1WithBuffer = new Date(end1.getTime() + BUFFER_MINUTES * 60000);
    const end2WithBuffer = new Date(end2.getTime() + BUFFER_MINUTES * 60000);

    // Sloty jsou v konfliktu, pokud se jejich časové intervaly (včetně bufferu) protínají
    return start1 < end2WithBuffer && end1WithBuffer > start2;
  };

  /**
   * Kontroluje, zda je slot v konfliktu s nějakým již rezervovaným termínem
   */
  const isSlotConflictingWithBooked = (
    slot: SlotInfo,
    currentExaminationTypeId: number
  ): boolean => {
    return bookedAppointments.some((bookedApt) => {
      // Nechceme kontrolovat konflikt s termínem stejného vyšetření (to chceme přepsat)
      if (bookedApt.examination_type_id === currentExaminationTypeId) {
        return false;
      }

      // Kontrola časového konfliktu
      return areSlotsConflicting(
        { dateTime: slot.timeFrom, minutes: slot.minutes },
        { dateTime: bookedApt.dateTime, minutes: bookedApt.minutes || 30 } // Výchozí 30 minut, pokud není zadáno
      );
    });
  };

  // Fetch alternative slots for a specific examination type
  const fetchAlternativeSlots = async (
    appointmentName: string,
    examinationTypeId: number
  ) => {
    try {
      setLoadingAlternatives(true);

      const response = await fetch(
        `/api/slots?examination_type_id=${examinationTypeId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Nepodařilo se načíst alternativní termíny"
        );
      }

      // Store alternative slots for this examination
      setAlternativeSlots((prev) => ({
        ...prev,
        [appointmentName]: data.slots || [],
      }));
    } catch (err) {
      console.error("Chyba při načítání alternativních slotů:", err);
      setAlternativeSlots((prev) => ({
        ...prev,
        [appointmentName]: [],
      }));
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const handleSlotSelection = (
    slotId: string,
    dateTime: string,
    examinationName: string,
    examinationTypeId: number,
    minutes: number
  ) => {
    // We need to map examination name to appointment type ID
    // For now, we'll use a hash of the name or store it differently
    // This is a simplified approach - you might want to adjust based on your needs
    const appointmentTypeId = parseInt(slotId.split("-")[0]) || 0;

    const newSelection: SelectedAppointment = {
      appointmentTypeId,
      examination_type_id: examinationTypeId,
      slotId,
      dateTime,
      minutes,
      isManuallySelected: true, // Uživatel ručně vybral
    };

    console.log("🎯 Uživatel vybral slot:", {
      vyšetření: translateExaminationName(examinationName),
      čas: dayjs(dateTime).format("D.M.YYYY v HH:mm"),
      slotId,
      examination_type_id: examinationTypeId,
      minuty: minutes,
      ručně_vybráno: true,
    });

    setBookedAppointments((prev) => {
      // Remove any previous selection for this examination type
      const filtered = prev.filter((apt) => {
        // Check if this appointment belongs to the same examination type
        return apt.examination_type_id !== examinationTypeId;
      });
      const updated = [...filtered, newSelection];
      console.log("📋 Aktualizované rezervované termíny:", updated);
      return updated;
    });

    setSelectedSlot(slotId);

    // After selecting a slot, move away from current appointment to show it as selected (green)
    // Find the next appointment that is not selected yet, or go to the last one
    const nextUnselectedIndex = examinationNames.findIndex((name, idx) => {
      if (idx <= currentAppointmentIndex) return false;
      const hasSelection = bookedAppointments.some((apt) => {
        const slots = recommendedSlots[name] || [];
        return slots.some(
          (s) => s.examination_type_id === apt.examination_type_id
        );
      });
      return !hasSelection;
    });

    if (nextUnselectedIndex !== -1) {
      setCurrentAppointmentIndex(nextUnselectedIndex);
      // Also fetch alternative slots for the next appointment
      const nextAppointmentName = examinationNames[nextUnselectedIndex];
      const nextSlots = recommendedSlots[nextAppointmentName] || [];
      if (nextSlots.length > 0) {
        fetchAlternativeSlots(
          nextAppointmentName,
          nextSlots[0].examination_type_id
        );
        const earliestDate = getEarliestDateForAppointment(nextAppointmentName);
        if (earliestDate) {
          setSelectedDate(earliestDate);
          setCalendarDate(earliestDate);
        }
      }
    } else {
      // All appointments are selected, set current to -1 or last one
      setCurrentAppointmentIndex(examinationNames.length);
    }
  };

  // Get available dates from slots data
  const allSlots = useMemo(() => {
    const currentApt = getCurrentAppointment();

    // If we have alternative slots for current appointment, use those
    if (currentApt && alternativeSlots[currentApt]?.length > 0) {
      return alternativeSlots[currentApt];
    }

    // Otherwise use all recommended slots
    return Object.values(recommendedSlots).flat();
  }, [recommendedSlots, alternativeSlots, currentAppointmentIndex]);

  const availableDates = allSlots.map((slot) =>
    dayjs(slot.timeFrom).format("YYYY-MM-DD")
  );
  const uniqueAvailableDates = [...new Set(availableDates)];

  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];

    const currentApt = getCurrentAppointment();
    if (!currentApt && examinationNames.length > 0) {
      // If all appointments are selected, show slots for the first examination
      const firstExamination = examinationNames[0];

      // Use alternative slots if available, otherwise use recommended slots
      const slotsSource =
        alternativeSlots[firstExamination]?.length > 0
          ? alternativeSlots[firstExamination]
          : recommendedSlots[firstExamination] || [];

      const selectedDateString = dayjs(selectedDate).format("YYYY-MM-DD");
      return slotsSource.filter(
        (slot) =>
          dayjs(slot.timeFrom).format("YYYY-MM-DD") === selectedDateString
      );
    }

    if (!currentApt) return [];

    // Use alternative slots if available, otherwise use recommended slots
    const slotsSource =
      alternativeSlots[currentApt]?.length > 0
        ? alternativeSlots[currentApt]
        : recommendedSlots[currentApt] || [];

    const selectedDateString = dayjs(selectedDate).format("YYYY-MM-DD");

    return slotsSource.filter(
      (slot) => dayjs(slot.timeFrom).format("YYYY-MM-DD") === selectedDateString
    );
  };

  const selectedDateSlots = getSlotsForSelectedDate();

  // Calculate date range for DatePicker
  const getDateRange = () => {
    const today = new Date();
    const allSlots = Object.values(recommendedSlots).flat();

    if (allSlots.length === 0) {
      return {
        minDate: today,
        maxDate: dayjs().add(3, "month").toDate(),
      };
    }

    // Find the latest available date
    const latestSlotDate = allSlots.reduce((latest, slot) => {
      const slotDate = dayjs(slot.timeFrom);
      return slotDate.isAfter(latest) ? slotDate : latest;
    }, dayjs(allSlots[0].timeFrom));

    return {
      minDate: today,
      maxDate: latestSlotDate.add(1, "day").toDate(),
    };
  };

  const { minDate, maxDate } = getDateRange();

  // Function to exclude dates that don't have available slots
  const excludeDate = (date: Date) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");
    return !uniqueAvailableDates.includes(dateString);
  };

  // Style available dates with light moss-green color and selected date with primary color
  const getDayProps = (date: string) => {
    const dateString = dayjs(date).format("YYYY-MM-DD");
    const hasSlots = uniqueAvailableDates.includes(dateString);
    const isSelected =
      selectedDate && dayjs(selectedDate).format("YYYY-MM-DD") === dateString;

    if (isSelected) {
      return {
        style: {
          backgroundColor: "var(--mantine-primary-color-filled)",
          color: "var(--mantine-color-white)",
          fontWeight: 700,
        },
      };
    }

    if (hasSlots) {
      return {
        style: {
          backgroundColor: "var(--mantine-color-green-1)",
          color: "var(--mantine-color-green-9)",
          fontWeight: 600,
        },
      };
    }

    return {};
  };

  // Get earliest and latest available dates
  const getEarliestDate = () => {
    if (uniqueAvailableDates.length === 0) return null;
    const sortedDates = uniqueAvailableDates.sort();
    return dayjs(sortedDates[0]).toDate();
  };

  const getLatestDate = () => {
    if (uniqueAvailableDates.length === 0) return null;
    const sortedDates = uniqueAvailableDates.sort();
    return dayjs(sortedDates[sortedDates.length - 1]).toDate();
  };

  const goToEarliestDate = () => {
    const earliest = getEarliestDate();
    if (earliest) {
      setSelectedDate(earliest);
      setCalendarDate(earliest); // Focus the calendar to this month
    }
  };

  const goToLatestDate = () => {
    const latest = getLatestDate();
    if (latest) {
      setSelectedDate(latest);
      setCalendarDate(latest); // Focus the calendar to this month
    }
  };

  // If no appointments are selected, show message
  if (selectedAppointments.length === 0) {
    return (
      <Stack gap="lg" pt="md">
        <Box>
          <Title order={3} mb="xs">
            🗓️ Rezervace termínů
          </Title>
          <Text size="md" c="dimmed">
            Nejprve vyberte termíny v předchozím kroku.
          </Text>
        </Box>
        <Alert
          icon={<IconInfoCircle size="1rem" />}
          color="blue"
          title="Žádné termíny nevybrány"
        >
          Vraťte se do předchozího kroku a vyberte termíny, které chcete
          rezervovat.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Rezervace termínů
        </Title>
        <Text size="md" c="dimmed">
          Můžete upravit automaticky vybrané termíny kliknutím na vyšetření a
          výběrem jiného času.
        </Text>
      </Box>

      {error && (
        <Alert icon={<IconInfoCircle size="1rem" />} color="red" title="Chyba">
          {error}
        </Alert>
      )}

      {!loading && examinationNames.length > 0 && (
        <>
          <Group align="start" gap="lg" style={{ width: "100%" }}>
            {/* First Column: Appointment Cards */}
            <Stack gap="sm" style={{ flex: "0 0 250px" }}>
              <Text fw={500} size="sm">
                Termíny k rezervaci:
              </Text>
              <Stack gap="xs">
                {getRequestedAppointments().map((appointmentName, index) => {
                  // Get examination_type_id for this appointment
                  const appointmentSlots =
                    recommendedSlots[appointmentName] || [];
                  const examinationTypeId =
                    appointmentSlots.length > 0
                      ? appointmentSlots[0].examination_type_id
                      : null;

                  // Check if this examination type has a booked appointment
                  const selectedAppointment = bookedAppointments.find(
                    (apt) => apt.examination_type_id === examinationTypeId
                  );
                  const isSelected = selectedAppointment !== undefined;
                  
                  const isCurrent = getCurrentAppointment() === appointmentName;
                  const examinationType =
                    getExaminationTypeDetails(appointmentName);
                  
                  // Determine colors based on state
                  // isCurrent (editing) = yellow #ffd600
                  // isManuallySelected = green #008638
                  // auto-selected = blue #53c0d7
                  const isManuallySelected = selectedAppointment?.isManuallySelected === true;
                  
                  let backgroundColor, borderColor, circleColor;
                  
                  if (isCurrent) {
                    // Právě upravuje - žlutá
                    backgroundColor = "#fff9e6"; // Light yellow
                    borderColor = "#ffd600";
                    circleColor = "#ffd600";
                  } else if (isSelected) {
                    if (isManuallySelected) {
                      // Ručně upravené - zelená
                      backgroundColor = "#e6f5ec"; // Light green
                      borderColor = "#008638";
                      circleColor = "#008638";
                    } else {
                      // Automaticky předvybrané - modrá
                      backgroundColor = "#e6f7fa"; // Light blue
                      borderColor = "#53c0d7";
                      circleColor = "#53c0d7";
                    }
                  } else {
                    // Nevybrané - šedá
                    backgroundColor = "var(--mantine-color-gray-1)";
                    borderColor = "var(--mantine-color-gray-3)";
                    circleColor = "var(--mantine-color-gray-4)";
                  }

                  return (
                    <Card
                      key={appointmentName}
                      withBorder
                      padding="sm"
                      radius="sm"
                      style={{
                        opacity: isSelected || isCurrent ? 1 : 0.6,
                        backgroundColor,
                        borderColor,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setCurrentAppointmentIndex(index);

                        // Get examination_type_id from the first slot of this appointment
                        const appointmentSlots =
                          recommendedSlots[appointmentName] || [];
                        if (appointmentSlots.length > 0) {
                          const examinationTypeId =
                            appointmentSlots[0].examination_type_id;
                          // Fetch all alternative slots for this examination type
                          fetchAlternativeSlots(
                            appointmentName,
                            examinationTypeId
                          );
                        }

                        // If there's an existing appointment, show its date, otherwise show earliest
                        const existingAppointment = bookedAppointments.find(
                          (apt) => {
                            const slots =
                              recommendedSlots[appointmentName] || [];
                            return (
                              slots.length > 0 &&
                              apt.examination_type_id ===
                                slots[0].examination_type_id
                            );
                          }
                        );

                        if (existingAppointment) {
                          // Show the date of the existing appointment
                          const existingDate = dayjs(
                            existingAppointment.dateTime
                          ).toDate();
                          setSelectedDate(existingDate);
                          setCalendarDate(existingDate);
                          setSelectedSlot(existingAppointment.slotId);
                        } else {
                          // Show earliest available date
                          const earliestDate =
                            getEarliestDateForAppointment(appointmentName);
                          if (earliestDate) {
                            setSelectedDate(earliestDate);
                            setCalendarDate(earliestDate);
                          }
                          setSelectedSlot(null);
                        }
                      }}
                    >
                      <Group gap="sm" align="flex-start">
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: circleColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && !isCurrent ? (
                            <IconCheck size={12} />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text
                            fw={500}
                            size="sm"
                            c={isSelected || isCurrent ? undefined : "dimmed"}
                            style={{ lineHeight: 1.3 }}
                          >
                            {examinationType?.name ||
                              `Vyšetření ${appointmentName}`}
                          </Text>
                          <Text
                            size="xs"
                            c={isSelected || isCurrent ? "dimmed" : "dark.3"}
                          >
                            {isSelected && selectedAppointment
                              ? dayjs(selectedAppointment.dateTime).format(
                                  "D.M.YYYY v HH:mm"
                                )
                              : isCurrent
                              ? "Upravit termín"
                              : "Kliknutím upravit"}
                          </Text>
                        </div>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            </Stack>

            {/* Second Column: Calendar + Buttons */}
            <Stack gap="sm" style={{ flex: "0 0 auto" }}>
              <DatePicker
                value={selectedDate}
                onChange={(date) =>
                  setSelectedDate(date ? new Date(date) : null)
                }
                excludeDate={(date) => excludeDate(new Date(date))}
                minDate={minDate}
                maxDate={maxDate}
                date={calendarDate}
                onDateChange={(date) => setCalendarDate(new Date(date))}
                getDayProps={getDayProps}
              />

              {!loading &&
                Object.values(recommendedSlots).flat().length > 0 && (
                  <Stack gap="xs">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={goToEarliestDate}
                      disabled={uniqueAvailableDates.length === 0}
                      leftSection={<IconClock size={16} />}
                      fullWidth
                    >
                      Nejdřívější termíny
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={goToLatestDate}
                      disabled={uniqueAvailableDates.length === 0}
                      leftSection={<IconCalendar size={16} />}
                      fullWidth
                    >
                      Nejpozdější termíny
                    </Button>
                  </Stack>
                )}
            </Stack>

            {/* Third Column: Time Slots */}
            <Stack gap="sm" style={{ flex: "1 1 auto", minWidth: 200 }}>
              {getCurrentAppointment() ? (
                <>
                  <Text fw={500} size="md">
                    {selectedDate &&
                      `${dayjs(selectedDate).format("D. MMMM YYYY")}`}
                  </Text>

                  {selectedDate && selectedDateSlots.length === 0 && (
                    <Text c="dimmed" size="sm">
                      Pro toto datum nejsou k dispozici žádné sloty
                    </Text>
                  )}

                  {selectedDate && selectedDateSlots.length > 0 && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                          maxHeight: 400,
                          overflow: "auto",
                        }}
                      >
                        {selectedDateSlots.map((slot) => {
                          const slotIdString = slot.id.toString();
                          const currentApt = getCurrentAppointment();
                          const currentExaminationType = currentApt
                            ? recommendedSlots[currentApt]?.[0]
                                ?.examination_type_id || null
                            : null;

                          // Zkontrolovat, zda je slot v konfliktu s již rezervovanými termíny
                          const isConflicting = currentExaminationType
                            ? isSlotConflictingWithBooked(
                                slot,
                                currentExaminationType
                              )
                            : false;

                          return (
                            <Card
                              key={slot.id}
                              withBorder
                              padding="sm"
                              style={{
                                cursor: isConflicting
                                  ? "not-allowed"
                                  : "pointer",
                                backgroundColor:
                                  selectedSlot === slotIdString
                                    ? "var(--mantine-primary-color-light)"
                                    : "var(--mantine-color-gray-0)",
                                borderColor:
                                  selectedSlot === slotIdString
                                    ? "var(--mantine-primary-color-filled)"
                                    : "var(--mantine-color-gray-3)",
                                borderWidth: 2,
                                textAlign: "center",
                                opacity: isConflicting ? 0.4 : 1,
                              }}
                              onClick={() => {
                                if (isConflicting) return; // Zabránit výběru konfliktního slotu

                                if (selectedSlot === slotIdString) {
                                  setSelectedSlot(null);
                                } else if (currentApt) {
                                  handleSlotSelection(
                                    slotIdString,
                                    slot.timeFrom,
                                    currentApt,
                                    slot.examination_type_id,
                                    slot.minutes
                                  );
                                }
                              }}
                            >
                              <Text
                                fw={selectedSlot === slotIdString ? 600 : 500}
                                size="sm"
                                c={isConflicting ? "dimmed" : undefined}
                              >
                                {dayjs(slot.timeFrom).format("HH:mm")}
                              </Text>
                            </Card>
                          );
                        })}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Text c="dimmed" size="sm" ta="center" mt="md">
                  Vyberte vyšetření pro zobrazení dostupných časů
                </Text>
              )}
            </Stack>
          </Group>
        </>
      )}
    </Stack>
  );
}
