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

// Set Czech locale for dayjs
dayjs.locale("cs");

interface ExaminationType {
  id: number;
  name: string;
  description: string;
}

interface Slot {
  id: string;
  dateTime: string;
  examination_type_id: number;
  booking_id: string | null;
  ExaminationType?: ExaminationType;
}

interface ApiResponse {
  success: boolean;
  data: Slot[];
  count: number;
  error?: string;
}

interface SelectedAppointment {
  appointmentTypeId: number;
  slotId: string;
  dateTime: string;
}

export function Step9Appointments() {
  const { watch, setValue } = useFormContext<FormData>();
  const selectedAppointments = useMemo(
    () => watch("selectedAppointments") || [],
    [watch]
  );

  const [slotsByAppointment, setSlotsByAppointment] = useState<
    Record<number, Slot[]>
  >({});
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

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);

        const appointmentIds = selectedAppointments.filter((id) => !isNaN(id));

        const slotPromises = appointmentIds.map(async (appointmentId) => {
          const response = await fetch(
            `/api/slots?examination_type_id=${appointmentId}`
          );
          const data: ApiResponse = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error ||
                `Failed to fetch slots for appointment ${appointmentId}`
            );
          }

          return { appointmentId, slots: data.data };
        });

        const results = await Promise.all(slotPromises);

        // Build slots by appointment object
        const newSlotsByAppointment: Record<number, Slot[]> = {};
        results.forEach(({ appointmentId, slots }) => {
          newSlotsByAppointment[appointmentId] = slots;
        });

        setSlotsByAppointment(newSlotsByAppointment);

        // Focus calendar and select earliest available date when slots are loaded
        const allSlots = results.flatMap((result) => result.slots);
        if (allSlots.length > 0) {
          const availableDates = allSlots.map((slot) =>
            dayjs(slot.dateTime).format("YYYY-MM-DD")
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
      fetchSlots();
    }
  }, [selectedAppointments]);

  // Update form field when booked appointments change
  useEffect(() => {
    setValue("bookedAppointments", bookedAppointments);
  }, [bookedAppointments, setValue]);

  // Helper functions for appointment management
  const getRequestedAppointments = () => {
    return selectedAppointments.filter((id) => !isNaN(id));
  };

  const getCurrentAppointment = () => {
    const appointments = getRequestedAppointments();
    return appointments[currentAppointmentIndex] || null;
  };

  const getEarliestDateForAppointment = (appointmentId: number) => {
    const appointmentSlots = slotsByAppointment[appointmentId] || [];
    if (appointmentSlots.length === 0) return null;

    const availableDates = appointmentSlots.map((slot) =>
      dayjs(slot.dateTime).format("YYYY-MM-DD")
    );
    const uniqueDates = [...new Set(availableDates)].sort();
    return dayjs(uniqueDates[0]).toDate();
  };

  const getExaminationTypeDetails = (appointmentId: number) => {
    const appointmentSlots = slotsByAppointment[appointmentId] || [];
    if (appointmentSlots.length === 0) return null;
    return appointmentSlots[0]?.ExaminationType || null;
  };

  const handleSlotSelection = (slotId: string, dateTime: string) => {
    const currentApt = getCurrentAppointment();
    if (!currentApt) return;

    // Add or update appointment selection
    const newSelection: SelectedAppointment = {
      appointmentTypeId: currentApt,
      slotId,
      dateTime,
    };

    setBookedAppointments((prev) => {
      const filtered = prev.filter(
        (apt) => apt.appointmentTypeId !== currentApt
      );
      return [...filtered, newSelection];
    });

    setSelectedSlot(slotId);

    // Auto-advance to next appointment after a short delay
    setTimeout(() => {
      const appointments = getRequestedAppointments();
      if (currentAppointmentIndex < appointments.length - 1) {
        const nextIndex = currentAppointmentIndex + 1;
        const nextAppointmentId = appointments[nextIndex];
        const earliestDate = getEarliestDateForAppointment(nextAppointmentId);

        setCurrentAppointmentIndex(nextIndex);
        setSelectedSlot(null);

        if (earliestDate) {
          setSelectedDate(earliestDate);
          setCalendarDate(earliestDate);
        } else {
          setSelectedDate(null);
        }
      }
    }, 1000);
  };

  // Get available dates from slots data
  const allSlots = Object.values(slotsByAppointment).flat();
  const availableDates = allSlots.map((slot) =>
    dayjs(slot.dateTime).format("YYYY-MM-DD")
  );
  const uniqueAvailableDates = [...new Set(availableDates)];

  const getSlotsForSelectedDate = () => {
    if (!selectedDate) return [];

    const currentApt = getCurrentAppointment();
    if (!currentApt) return [];

    const appointmentSlots = slotsByAppointment[currentApt] || [];
    const selectedDateString = dayjs(selectedDate).format("YYYY-MM-DD");

    return appointmentSlots.filter(
      (slot) => dayjs(slot.dateTime).format("YYYY-MM-DD") === selectedDateString
    );
  };

  const selectedDateSlots = getSlotsForSelectedDate();

  // Calculate date range for DatePicker
  const getDateRange = () => {
    const today = new Date();
    const allSlots = Object.values(slotsByAppointment).flat();

    if (allSlots.length === 0) {
      return {
        minDate: today,
        maxDate: dayjs().add(3, "month").toDate(),
      };
    }

    // Find the latest available date
    const latestSlotDate = allSlots.reduce((latest, slot) => {
      const slotDate = dayjs(slot.dateTime);
      return slotDate.isAfter(latest) ? slotDate : latest;
    }, dayjs(allSlots[0].dateTime));

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
          Vyberte konkrétní datum a čas pro vaše vybrané termíny.
        </Text>
      </Box>

      {error && (
        <Alert icon={<IconInfoCircle size="1rem" />} color="red" title="Chyba">
          {error}
        </Alert>
      )}

      {getCurrentAppointment() && (
        <>
          <Group align="start" gap="lg" style={{ width: "100%" }}>
            {/* First Column: Appointment Cards */}
            <Stack gap="sm" style={{ flex: "0 0 250px" }}>
              <Text fw={500} size="sm">
                Termíny k rezervaci:
              </Text>
              <Stack gap="xs">
                {getRequestedAppointments().map((appointmentId, index) => {
                  const isSelected = bookedAppointments.some(
                    (apt) => apt.appointmentTypeId === appointmentId
                  );
                  const isCurrent = getCurrentAppointment() === appointmentId;
                  const examinationType =
                    getExaminationTypeDetails(appointmentId);
                  const selectedAppointment = bookedAppointments.find(
                    (apt) => apt.appointmentTypeId === appointmentId
                  );

                  return (
                    <Card
                      key={appointmentId}
                      withBorder
                      padding="sm"
                      radius="sm"
                      style={{
                        opacity: isSelected || isCurrent ? 1 : 0.6,
                        backgroundColor: isSelected
                          ? "var(--mantine-color-green-1)"
                          : isCurrent
                          ? "var(--mantine-color-blue-1)"
                          : "var(--mantine-color-gray-1)",
                        borderColor: isSelected
                          ? "var(--mantine-color-green-4)"
                          : isCurrent
                          ? "var(--mantine-color-blue-4)"
                          : "var(--mantine-color-gray-3)",
                      }}
                    >
                      <Group gap="sm" align="flex-start">
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: isSelected
                              ? "var(--mantine-color-green-6)"
                              : isCurrent
                              ? "var(--mantine-color-blue-6)"
                              : "var(--mantine-color-gray-4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {isSelected ? <IconCheck size={12} /> : index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text
                            fw={500}
                            size="sm"
                            c={isSelected || isCurrent ? undefined : "dimmed"}
                            style={{ lineHeight: 1.3 }}
                          >
                            {examinationType?.name ||
                              `Vyšetření typu ${appointmentId}`}
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
                              ? "Vybíráte"
                              : "Čeká na výběr"}
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
                Object.values(slotsByAppointment).flat().length > 0 && (
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "8px",
                    maxHeight: 400,
                    overflow: "auto",
                  }}
                >
                  {selectedDateSlots.map((slot) => (
                    <Card
                      key={slot.id}
                      withBorder
                      padding="sm"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedSlot === slot.id
                            ? "var(--mantine-primary-color-light)"
                            : "var(--mantine-color-gray-0)",
                        borderColor:
                          selectedSlot === slot.id
                            ? "var(--mantine-primary-color-filled)"
                            : "var(--mantine-color-gray-3)",
                        borderWidth: 2,
                        textAlign: "center",
                      }}
                      onClick={() => {
                        if (selectedSlot === slot.id) {
                          setSelectedSlot(null);
                        } else {
                          handleSlotSelection(slot.id, slot.dateTime);
                        }
                      }}
                    >
                      <Text fw={selectedSlot === slot.id ? 600 : 500} size="sm">
                        {dayjs(slot.dateTime).format("HH:mm")}
                      </Text>
                    </Card>
                  ))}
                </div>
              )}
            </Stack>
          </Group>
        </>
      )}
    </Stack>
  );
}
