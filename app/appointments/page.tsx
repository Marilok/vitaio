"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Checkbox,
  Button,
  Group,
  Anchor,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import appointmentsData from "@/db/appointments.json";
import { Appointment } from "@/types/appointments";

export default function AppointmentsPage() {
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>(
    []
  );

  const handleAppointmentToggle = (appointmentId: number) => {
    setSelectedAppointments((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleSubmit = () => {
    console.log("Selected appointments:", selectedAppointments);
    // Handle form submission logic here
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" ta="center">
        Recommended Appointments
      </Title>

      <Text size="lg" c="dimmed" mb="xl" ta="center">
        Select the appointments you would like to book based on your health
        assessment.
      </Text>

      {/* Examinations Section */}
      <Title order={2} mb="md" mt="xl">
        Medical Examinations
      </Title>
      <Grid mb="xl">
        {appointmentsData
          .filter((appointment) => appointment.type === "examination")
          .map((appointment: Appointment) => {
            const isSelected = selectedAppointments.includes(appointment.id);

            return (
              <Grid.Col key={appointment.id} span={{ base: 12, sm: 6, md: 4 }}>
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
                    borderWidth: 2,
                  }}
                  onClick={() => handleAppointmentToggle(appointment.id)}
                >
                  <Group justify="space-between" align="flex-start" mb="xs">
                    <Text fw={500} size="lg" style={{ flex: 1 }}>
                      {appointment.name}
                    </Text>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleAppointmentToggle(appointment.id)}
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

      {/* Consultations Section */}
      <Title order={2} mb="md">
        Health Consultations
      </Title>
      <Grid>
        {appointmentsData
          .filter((appointment) => appointment.type === "consultation")
          .map((appointment: Appointment) => {
            const isSelected = selectedAppointments.includes(appointment.id);

            return (
              <Grid.Col key={appointment.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderColor: isSelected
                      ? "var(--mantine-secondary-color-filled)"
                      : undefined,
                    borderWidth: 2,
                  }}
                  onClick={() => handleAppointmentToggle(appointment.id)}
                >
                  <Group justify="space-between" align="flex-start" mb="xs">
                    <Text fw={500} size="lg" style={{ flex: 1 }}>
                      {appointment.name}
                    </Text>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleAppointmentToggle(appointment.id)}
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
                      <Text size="sm">Learn More</Text>
                      <IconExternalLink size={14} />
                    </Group>
                  </Anchor>
                </Card>
              </Grid.Col>
            );
          })}
      </Grid>

      {selectedAppointments.length > 0 && (
        <Group justify="center" mt="xl">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={selectedAppointments.length === 0}
          >
            Book Selected Appointments ({selectedAppointments.length})
          </Button>
        </Group>
      )}
    </Container>
  );
}
