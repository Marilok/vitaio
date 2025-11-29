"use client";

import { useFormContext, Controller } from "react-hook-form";
import React from "react";
import {
  Stack,
  Title,
  Text,
  Grid,
  Card,
  Checkbox,
  Group,
  Anchor,
  Box,
  Badge,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { FormData } from "@/types/form";
import appointmentsData from "@/db/appointments.json";
import { getScreeningEligibility } from "@/utils/priority";
import {
  APPOINTMENT_TO_SCREENING_MAP,
  transformAppointmentsToScreenings,
} from "@/utils/appointmentsMapping";
import { getScreeningPrice } from "@/utils/screeningPrice";

interface AppointmentData {
  id: number;
  name: string;
  description?: string;
  type: string;
  url?: string;
  price?: number;
  category?: string;
}

const appointments: AppointmentData[] = appointmentsData as AppointmentData[];

// Priority thresholds for appointment recommendations
const PRIORITY_THRESHOLD_HIGH = 20; // "Silně doporučeno"
const PRIORITY_THRESHOLD_LOW = 5; // "Doporučeno"

/**
 * Calculate priority for a specific appointment based on form data
 */
function getAppointmentPriority(
  appointmentId: number,
  formData: FormData
): number {
  // Get all screenings with priorities
  const screenings = transformAppointmentsToScreenings(
    [appointmentId],
    formData
  );

  // Map appointment ID to screening key
  const screeningKey = APPOINTMENT_TO_SCREENING_MAP[appointmentId];

  if (!screeningKey) return 0;

  // Check in mandatory first, then optional
  if (screeningKey in screenings.mandatory) {
    return screenings.mandatory[
      screeningKey as keyof typeof screenings.mandatory
    ].priority;
  }

  if (screeningKey in screenings.optional) {
    return screenings.optional[screeningKey as keyof typeof screenings.optional]
      .priority;
  }

  return 0;
}

export function Step8Appointments() {
  const { control, watch, setValue } = useFormContext<FormData>();

  const formData = watch(); // Get all form data for priority calculation
  const gender = watch("gender");
  const age = watch("age");
  const hasFamilyCancerHistory = watch("hasFamilyCancerHistory");
  const hadProstateScreening = watch("hadProstateScreening");
  const isSmoker = watch("isSmoker");
  const cigarettePacksPerWeek = watch("cigarettePacksPerWeek");
  const smokingYears = watch("smokingYears");

  const eligibility = getScreeningEligibility(
    gender,
    age,
    hasFamilyCancerHistory,
    isSmoker,
    cigarettePacksPerWeek,
    smokingYears
  );

  // Determine which mandatory appointments to show and recommend
  const mandatoryAppointmentsConfig = [
    {
      id: 1,
      show: eligibility.showProstateScreening,
      recommend: !hadProstateScreening,
    },
    { id: 15, show: true, recommend: true },
    { id: 16, show: true, recommend: true },
    { id: 17, show: true, recommend: true },
    { id: 18, show: true, recommend: true },
    { id: 19, show: true, recommend: true },
    { id: 20, show: true, recommend: true },
    { id: 21, show: true, recommend: true },
    { id: 22, show: true, recommend: true },
    { id: 23, show: true, recommend: true },
    { id: 24, show: true, recommend: true },
    { id: 25, show: true, recommend: true },
    { id: 26, show: true, recommend: true },
  ];

  // Filter appointments based on eligibility and gender
  const visibleMandatoryAppointments = appointments
    .filter((app) => app.type === "mandatory")
    .filter((app) => {
      const config = mandatoryAppointmentsConfig.find((c) => c.id === app.id);
      if (!config?.show) return false;

      // Filter gender-specific mandatory appointments
      // PSA Test (id: 1) - only for males
      if (app.id === 1 && gender !== "male") return false;

      // Breast Ultrasound (id: 24) - only for females
      if (app.id === 24 && gender !== "female") return false;

      // Testicular Ultrasound (id: 23) - only for males
      if (app.id === 23 && gender !== "male") return false;

      return true;
    })
    .map((app) => ({
      ...app,
      isRecommended: mandatoryAppointmentsConfig.find((c) => c.id === app.id)
        ?.recommend,
    }));

  const optionalAppointments = appointments
    .filter((app) => app.type === "optional")
    .filter((app) => {
      // Apply eligibility filtering based on screening criteria
      // IDs 2-5 are screening appointments that have specific eligibility criteria
      if (app.id === 2) return true; // CT plic - always available
      if (app.id === 3) return eligibility.showCervicalCancerScreening; // Gynekologické vyšetření - only for eligible patients
      if (app.id === 4) return eligibility.showBreastCancerScreening; // Mamografie - only for eligible patients
      if (app.id === 5) return eligibility.showColorectalCancerScreening; // Kolonoskopie - only for eligible patients
      if (app.id === 6) return eligibility.showOccultBloodTest; // Test okultního krvácení - only for eligible patients (50+)

      // ID 9 - Gynekologická konzultace - only for women
      if (app.id === 9) return eligibility.showGynecologicalConsultation;

      // Other IDs (consultations and counseling) are always available
      return true;
    })
    .map((app) => ({
      ...app,
      priority: getAppointmentPriority(app.id, formData),
    }))
    .sort((a, b) => b.priority - a.priority); // Sort by priority descending (highest first)

  // Group optional appointments by category
  const examinationAppointments = optionalAppointments.filter(
    (app) => app.category === "examination"
  );
  const consultationAppointments = optionalAppointments.filter(
    (app) => app.category === "consultation"
  );
  const counselingAppointments = optionalAppointments.filter(
    (app) => app.category === "counseling"
  );

  // Auto-select all visible mandatory appointments on mount
  React.useEffect(() => {
    const currentSelected = watch("selectedAppointments") || [];
    const mandatoryIds = visibleMandatoryAppointments.map((app) => app.id);
    const needsUpdate = mandatoryIds.some(
      (id) => !currentSelected.includes(id)
    );

    if (needsUpdate) {
      const newSelected = Array.from(
        new Set([...currentSelected, ...mandatoryIds])
      );
      setValue("selectedAppointments", newSelected);
    }
  }, [visibleMandatoryAppointments, setValue, watch]);

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🧑‍⚕️ Doporučené vyšetření pro mě
        </Title>
        <Text size="md" c="dimmed">
          Na základě vyplněných informací jsme navrhli následující vyšetření:
        </Text>
      </Box>

      <Controller
        name="selectedAppointments"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Stack gap="xl">
            {/* Mandatory Screenings Section */}
            {visibleMandatoryAppointments.length > 0 && (
              <Box>
                <Group gap="xs" mb="md">
                  <Title order={4}>Povinná vyšetření</Title>
                  <Badge color="red" variant="light" size="md">
                    Automaticky přidáno
                  </Badge>
                </Group>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    borderColor: "var(--mantine-color-red-4)",
                    borderWidth: 1,
                    backgroundColor: "var(--mantine-color-red-0)",
                  }}
                >
                  <Group justify="space-between" align="flex-start" mb="0">
                    <Box style={{ flex: 1 }}>
                      <Group gap="xs" align="center" mb="xs">
                        <Text fw={500} size="lg">
                          Základní preventivní balíček
                        </Text>
                        <Badge size="sm" variant="filled" color="red">
                          Povinné
                        </Badge>
                      </Group>
                      <Text size="xl" fw={600} c="blue" mb="sm">
                        10 000 Kč
                      </Text>
                    </Box>
                    <Checkbox checked={true} disabled size="md" />
                  </Group>
                  <Text size="sm" c="dimmed" mb="sm">
                    Tato vyšetření jsou pro vás doporučena na základě vašeho
                    zdravotního stavu a nelze je odebrat.
                  </Text>
                  <Text size="sm" fw={500} mb="xs">
                    Zahrnuje:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {visibleMandatoryAppointments
                      .map((app) => app.name)
                      .join(", ")}
                  </Text>
                </Card>
              </Box>
            )}

            {/* Examinations Section */}
            {examinationAppointments.length > 0 && (
              <Box>
                <Title order={4} mb="0">
                  Vyšetření
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  Vyberte další vyšetření, která byste chtěli absolvovat.
                </Text>
                <Grid>
                  {examinationAppointments.map((appointment) => {
                    const isSelected = field.value.includes(appointment.id);
                    const priority = appointment.priority;

                    // Determine badge based on priority
                    let priorityBadge = null;
                    if (priority >= PRIORITY_THRESHOLD_HIGH) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="red">
                          Silně doporučeno
                        </Badge>
                      );
                    } else if (priority >= PRIORITY_THRESHOLD_LOW) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="orange">
                          Doporučeno
                        </Badge>
                      );
                    }

                    return (
                      <Grid.Col
                        key={appointment.id}
                        span={{ base: 12, sm: 6, md: 4 }}
                        style={{ display: "flex" }}
                      >
                        <Card
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-4)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-4)"
                                : undefined,
                            borderWidth: 1,
                            backgroundColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-0)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-0)"
                                : undefined,
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter(
                                  (id: number) => id !== appointment.id
                                )
                              : [...field.value, appointment.id];
                            field.onChange(newValue);
                          }}
                        >
                          {priorityBadge && <Box mb="sm">{priorityBadge}</Box>}
                          <Group
                            justify="space-between"
                            align="flex-start"
                            mb="xs"
                          >
                            <Box style={{ flex: 1 }}>
                              <Text fw={500} size="md" mb="xs">
                                {appointment.name}
                              </Text>
                              {(() => {
                                const screeningPrice = getScreeningPrice(
                                  appointment.id,
                                  formData
                                );
                                if (screeningPrice.isFree) {
                                  return (
                                    <>
                                      <Text size="lg" fw={700} c="green">
                                        ZDARMA
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        {screeningPrice.reason}
                                      </Text>
                                    </>
                                  );
                                } else if (appointment.price) {
                                  return (
                                    <Text size="lg" fw={600} c="blue">
                                      {appointment.price.toLocaleString(
                                        "cs-CZ"
                                      )}{" "}
                                      Kč
                                    </Text>
                                  );
                                }
                                return null;
                              })()}
                            </Box>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {
                                const newValue = isSelected
                                  ? field.value.filter(
                                      (id: number) => id !== appointment.id
                                    )
                                  : [...field.value, appointment.id];
                                field.onChange(newValue);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              size="md"
                            />
                          </Group>
                          {appointment.description && (
                            <Text size="sm" c="dimmed" mb="md">
                              {appointment.description}
                            </Text>
                          )}
                          {appointment.url && (
                            <Anchor
                              href={appointment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Group gap="xs" align="center">
                                <Text size="sm">Dozvědět se více</Text>
                                <IconExternalLink size={14} />
                              </Group>
                            </Anchor>
                          )}
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Consultations Section */}
            {consultationAppointments.length > 0 && (
              <Box>
                <Title order={4} mb="0">
                  Konzultace
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  Vyberte konzultace s odborníky.
                </Text>
                <Grid>
                  {consultationAppointments.map((appointment) => {
                    const isSelected = field.value.includes(appointment.id);
                    const priority = appointment.priority;

                    // Determine badge based on priority
                    let priorityBadge = null;
                    if (priority >= PRIORITY_THRESHOLD_HIGH) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="red">
                          Silně doporučeno
                        </Badge>
                      );
                    } else if (priority >= PRIORITY_THRESHOLD_LOW) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="orange">
                          Doporučeno
                        </Badge>
                      );
                    }

                    return (
                      <Grid.Col
                        key={appointment.id}
                        span={{ base: 12, sm: 6, md: 4 }}
                        style={{ display: "flex" }}
                      >
                        <Card
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-4)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-4)"
                                : undefined,
                            borderWidth: 1,
                            backgroundColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-0)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-0)"
                                : undefined,
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter(
                                  (id: number) => id !== appointment.id
                                )
                              : [...field.value, appointment.id];
                            field.onChange(newValue);
                          }}
                        >
                          {priorityBadge && <Box mb="sm">{priorityBadge}</Box>}
                          <Group
                            justify="space-between"
                            align="flex-start"
                            mb="xs"
                          >
                            <Box style={{ flex: 1 }}>
                              <Text fw={500} size="md" mb="xs">
                                {appointment.name}
                              </Text>
                              {(() => {
                                const screeningPrice = getScreeningPrice(
                                  appointment.id,
                                  formData
                                );
                                if (screeningPrice.isFree) {
                                  return (
                                    <>
                                      <Text size="lg" fw={700} c="green">
                                        ZDARMA
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        {screeningPrice.reason}
                                      </Text>
                                    </>
                                  );
                                } else if (appointment.price) {
                                  return (
                                    <Text size="lg" fw={600} c="blue">
                                      {appointment.price.toLocaleString(
                                        "cs-CZ"
                                      )}{" "}
                                      Kč
                                    </Text>
                                  );
                                }
                                return null;
                              })()}
                            </Box>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {
                                const newValue = isSelected
                                  ? field.value.filter(
                                      (id: number) => id !== appointment.id
                                    )
                                  : [...field.value, appointment.id];
                                field.onChange(newValue);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              size="md"
                            />
                          </Group>
                          {appointment.description && (
                            <Text size="sm" c="dimmed" mb="md">
                              {appointment.description}
                            </Text>
                          )}
                          {appointment.url && (
                            <Anchor
                              href={appointment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Group gap="xs" align="center">
                                <Text size="sm">Dozvědět se více</Text>
                                <IconExternalLink size={14} />
                              </Group>
                            </Anchor>
                          )}
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Counseling Section */}
            {counselingAppointments.length > 0 && (
              <Box>
                <Title order={4} mb="md">
                  Poradenství
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  Vyberte poradenství pro zdravý životní styl.
                </Text>
                <Grid>
                  {counselingAppointments.map((appointment) => {
                    const isSelected = field.value.includes(appointment.id);
                    const priority = appointment.priority;

                    // Determine badge based on priority
                    let priorityBadge = null;
                    if (priority >= PRIORITY_THRESHOLD_HIGH) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="red">
                          Silně doporučeno
                        </Badge>
                      );
                    } else if (priority >= PRIORITY_THRESHOLD_LOW) {
                      priorityBadge = (
                        <Badge size="sm" variant="filled" color="orange">
                          Doporučeno
                        </Badge>
                      );
                    }

                    return (
                      <Grid.Col
                        key={appointment.id}
                        span={{ base: 12, sm: 6, md: 4 }}
                        style={{ display: "flex" }}
                      >
                        <Card
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-4)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-4)"
                                : undefined,
                            borderWidth: 1,
                            backgroundColor:
                              priority >= PRIORITY_THRESHOLD_HIGH
                                ? "var(--mantine-color-red-0)"
                                : priority >= PRIORITY_THRESHOLD_LOW
                                ? "var(--mantine-color-orange-0)"
                                : undefined,
                            position: "relative",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter(
                                  (id: number) => id !== appointment.id
                                )
                              : [...field.value, appointment.id];
                            field.onChange(newValue);
                          }}
                        >
                          {priorityBadge && <Box mb="sm">{priorityBadge}</Box>}
                          <Group
                            justify="space-between"
                            align="flex-start"
                            mb="xs"
                          >
                            <Box style={{ flex: 1 }}>
                              <Text fw={500} size="md" mb="xs">
                                {appointment.name}
                              </Text>
                              {(() => {
                                const screeningPrice = getScreeningPrice(
                                  appointment.id,
                                  formData
                                );
                                if (screeningPrice.isFree) {
                                  return (
                                    <>
                                      <Text size="lg" fw={700} c="green">
                                        ZDARMA
                                      </Text>
                                      <Text size="xs" c="dimmed">
                                        {screeningPrice.reason}
                                      </Text>
                                    </>
                                  );
                                } else if (appointment.price) {
                                  return (
                                    <Text size="lg" fw={600} c="blue">
                                      {appointment.price.toLocaleString(
                                        "cs-CZ"
                                      )}{" "}
                                      Kč
                                    </Text>
                                  );
                                }
                                return null;
                              })()}
                            </Box>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => {
                                const newValue = isSelected
                                  ? field.value.filter(
                                      (id: number) => id !== appointment.id
                                    )
                                  : [...field.value, appointment.id];
                                field.onChange(newValue);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              size="md"
                            />
                          </Group>
                          {appointment.description && (
                            <Text size="sm" c="dimmed" mb="md">
                              {appointment.description}
                            </Text>
                          )}
                          {appointment.url && (
                            <Anchor
                              href={appointment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Group gap="xs" align="center">
                                <Text size="sm">Dozvědět se více</Text>
                                <IconExternalLink size={14} />
                              </Group>
                            </Anchor>
                          )}
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Total Price Section */}
            <Card
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
              style={{
                borderColor: "var(--mantine-color-orange-6)",
                borderWidth: 2,
                backgroundColor: "var(--mantine-color-orange-0)",
              }}
            >
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="xl" fw={600} mb="xs">
                    Celková cena vyšetření
                  </Text>
                  <Text size="sm" c="dimmed">
                    Základní preventivní balíček
                    {field.value.filter((id: number) => {
                      const app = appointments.find((a) => a.id === id);
                      return app?.type === "optional";
                    }).length > 0 && (
                      <>
                        {" + "}
                        {field.value
                          .filter((id: number) => {
                            const app = appointments.find((a) => a.id === id);
                            return app?.type === "optional";
                          })
                          .map((id: number) => {
                            const app = appointments.find((a) => a.id === id);
                            return app?.name;
                          })
                          .join(", ")}
                      </>
                    )}
                  </Text>
                </Box>
                <Text size="2rem" fw={700} c="orange">
                  {(() => {
                    // Base price for mandatory package
                    let totalPrice = 10000;

                    // Add prices of selected optional appointments (excluding free screenings)
                    field.value.forEach((id: number) => {
                      const appointment = appointments.find(
                        (a) => a.id === id && a.type === "optional"
                      );
                      if (appointment) {
                        // Check if this is a free screening
                        const screeningPrice = getScreeningPrice(id, formData);
                        if (!screeningPrice.isFree && appointment.price) {
                          totalPrice += appointment.price;
                        }
                      }
                    });

                    return totalPrice.toLocaleString("cs-CZ");
                  })()}{" "}
                  Kč
                </Text>
              </Group>
            </Card>
          </Stack>
        )}
      />
    </Stack>
  );
}
