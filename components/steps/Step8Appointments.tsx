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

interface AppointmentData {
  id: number;
  name: string;
  description?: string;
  type: string;
  url?: string;
}

const appointments: AppointmentData[] = appointmentsData as AppointmentData[];

export function Step8Appointments() {
  const { control, watch, setValue } = useFormContext<FormData>();

  const gender = watch("gender");
  const age = watch("age");
  const hasFamilyCancerHistory = watch("hasFamilyCancerHistory");
  const hadProstateScreening = watch("hadProstateScreening");
  const hadLungCancerScreening = watch("hadLungCancerScreening");
  const hadCervicalCancerScreening = watch("hadCervicalCancerScreening");
  const hadBreastCancerScreening = watch("hadBreastCancerScreening");
  const hadColorectalCancerScreening = watch("hadColorectalCancerScreening");

  const eligibility = getScreeningEligibility(
    gender,
    age,
    hasFamilyCancerHistory
  );

  // Determine which appointments to recommend based on missing screenings
  const recommendedAppointmentIds: number[] = [];

  // Prostate screening: Men aged 50-69
  if (eligibility.showProstateScreening && !hadProstateScreening) {
    recommendedAppointmentIds.push(1); // ID 1: Vyšetření prostaty
  }

  // Lung cancer screening: Everyone
  if (eligibility.showLungCancerScreening && !hadLungCancerScreening) {
    recommendedAppointmentIds.push(2); // ID 2: CT plic
  }

  // Cervical cancer screening: Women aged 15+
  if (eligibility.showCervicalCancerScreening && !hadCervicalCancerScreening) {
    recommendedAppointmentIds.push(3); // ID 3: Gynekologické vyšetření
  }

  // Breast cancer screening: Women aged 45+ OR with family cancer history
  if (eligibility.showBreastCancerScreening && !hadBreastCancerScreening) {
    recommendedAppointmentIds.push(4); // ID 4: Mamografie
  }

  // Colorectal cancer screening: Both genders aged 45-74
  if (
    eligibility.showColorectalCancerScreening &&
    !hadColorectalCancerScreening
  ) {
    recommendedAppointmentIds.push(5); // ID 5: Kolonoskopie
  }

  const mandatoryAppointments = appointments.filter(
    (app) => app.type === "mandatory"
  );
  const optionalAppointments = appointments.filter(
    (app) => app.type === "optional"
  );

  // Determine which mandatory appointments are recommended
  const mandatoryAppointmentsWithRecommendation = mandatoryAppointments.map(
    (app) => ({
      ...app,
      isRecommended: recommendedAppointmentIds.includes(app.id),
    })
  );

  // Auto-select all mandatory appointments on mount
  React.useEffect(() => {
    const currentSelected = watch("selectedAppointments") || [];
    const mandatoryIds = mandatoryAppointments.map((app) => app.id);
    const needsUpdate = mandatoryIds.some(
      (id) => !currentSelected.includes(id)
    );

    if (needsUpdate) {
      const newSelected = Array.from(
        new Set([...currentSelected, ...mandatoryIds])
      );
      setValue("selectedAppointments", newSelected);
    }
  }, [mandatoryAppointments, setValue, watch]);

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Doporučené termíny
        </Title>
        <Text size="md" c="dimmed" mb="lg">
          Vyberte termíny, které byste chtěli rezervovat na základě vašeho
          zdravotního posouzení.
        </Text>
      </Box>

      <Controller
        name="selectedAppointments"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <Stack gap="xl">
            {/* Mandatory Screenings Section */}
            {mandatoryAppointments.length > 0 && (
              <Box>
                <Group gap="xs" mb="md">
                  <Title order={4}>Povinná vyšetření</Title>
                  <Badge color="red" variant="light" size="md">
                    Automaticky přidáno
                  </Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="md">
                  Tato vyšetření jsou pro vás doporučena na základě vašeho
                  zdravotního stavu a nelze je odebrat.
                </Text>
                <Grid>
                  {mandatoryAppointmentsWithRecommendation.map(
                    (appointment) => {
                      const isSelected = true; // Always selected

                      return (
                        <Grid.Col
                          key={appointment.id}
                          span={{ base: 12, sm: 6, md: 4 }}
                        >
                          <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                              borderColor: appointment.isRecommended
                                ? "var(--mantine-color-red-4)"
                                : "var(--mantine-color-gray-3)",
                              borderWidth: appointment.isRecommended ? 2 : 1,
                              backgroundColor: appointment.isRecommended
                                ? "var(--mantine-color-red-0)"
                                : "var(--mantine-color-gray-0)",
                              opacity: 1,
                            }}
                          >
                            <Group
                              justify="space-between"
                              align="flex-start"
                              mb="xs"
                            >
                              <Box style={{ flex: 1 }}>
                                <Group gap="xs" align="center" mb="xs">
                                  <Text fw={500} size="md">
                                    {appointment.name}
                                  </Text>
                                  <Badge
                                    size="sm"
                                    variant="filled"
                                    color={
                                      appointment.isRecommended ? "red" : "gray"
                                    }
                                  >
                                    {appointment.isRecommended
                                      ? "Doporučeno"
                                      : "Povinné"}
                                  </Badge>
                                </Group>
                              </Box>
                              <Checkbox
                                checked={isSelected}
                                disabled
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
                    }
                  )}
                </Grid>
              </Box>
            )}

            {/* Optional Screenings Section */}
            <Box>
              <Title order={4} mb="md">
                Další dostupná vyšetření
              </Title>
              <Text size="sm" c="dimmed" mb="md">
                Vyberte další vyšetření, která byste chtěli absolvovat.
              </Text>
              <Grid>
                {optionalAppointments.map((appointment) => {
                  const isSelected = field.value.includes(appointment.id);

                  return (
                    <Grid.Col
                      key={appointment.id}
                      span={{ base: 12, sm: 6, md: 4 }}
                    >
                      <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderColor: isSelected
                            ? "var(--mantine-primary-color-filled)"
                            : undefined,
                          borderWidth: isSelected ? 2 : 1,
                          backgroundColor: isSelected
                            ? "var(--mantine-primary-color-light)"
                            : undefined,
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
                        <Group
                          justify="space-between"
                          align="flex-start"
                          mb="xs"
                        >
                          <Box style={{ flex: 1 }}>
                            <Group gap="xs" align="center" mb="xs">
                              <Text fw={500} size="md">
                                {appointment.name}
                              </Text>
                            </Group>
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
          </Stack>
        )}
      />
    </Stack>
  );
}
