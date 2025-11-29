"use client";

import { useFormContext, Controller } from "react-hook-form";
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
import { Appointment } from "@/types/appointments";

interface Step8AppointmentsProps {
  recommendedAppointments?: number[];
}

// Default recommended appointments (you can customize these IDs based on your data)
const DEFAULT_RECOMMENDED_APPOINTMENTS = [1, 2, 5, 7]; // Example appointment IDs

export function Step8Appointments({
  recommendedAppointments = DEFAULT_RECOMMENDED_APPOINTMENTS,
}: Step8AppointmentsProps = {}) {
  const { control, watch } = useFormContext<FormData>();

  const selectedAppointments = watch("selectedAppointments") || [];

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
            {/* Medical Examinations Section */}
            <Box>
              <Title order={4} mb="md">
                Lékařská vyšetření
              </Title>
              <Grid>
                {appointmentsData
                  .filter((appointment) => appointment.type === "examination")
                  .map((appointment: Appointment) => {
                    const isSelected = field.value.includes(appointment.id);
                    const isRecommended = recommendedAppointments.includes(
                      appointment.id
                    );

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
                              : isRecommended
                              ? "var(--mantine-color-mou-blue-3)"
                              : undefined,
                            borderWidth: 1,
                            backgroundColor: isSelected
                              ? "var(--mantine-primary-color-light)"
                              : isRecommended && !isSelected
                              ? "var(--mantine-color-mou-blue-0)"
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
                                {isRecommended && (
                                  <Badge size="sm" variant="filled">
                                    Doporučeno
                                  </Badge>
                                )}
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
                          <Text size="sm" c="dimmed" mb="md">
                            {appointment.description}
                          </Text>
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
                        </Card>
                      </Grid.Col>
                    );
                  })}
              </Grid>
            </Box>

            {/* Health Consultations Section */}
            <Box>
              <Title order={4} mb="md">
                Zdravotní konzultace
              </Title>
              <Grid>
                {appointmentsData
                  .filter((appointment) => appointment.type === "consultation")
                  .map((appointment: Appointment) => {
                    const isSelected = field.value.includes(appointment.id);
                    const isRecommended = recommendedAppointments.includes(
                      appointment.id
                    );

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
                              : isRecommended
                              ? "var(--mantine-color-mou-blue-3)"
                              : undefined,
                            borderWidth: 1,
                            backgroundColor: isSelected
                              ? "var(--mantine-primary-color-light)"
                              : isRecommended && !isSelected
                              ? "var(--mantine-color-mou-blue-0)"
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
                                {isRecommended && (
                                  <Badge size="sm" variant="filled">
                                    Doporučeno
                                  </Badge>
                                )}
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
                          <Text size="sm" c="dimmed" mb="md">
                            {appointment.description}
                          </Text>
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
