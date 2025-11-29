"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Center, Text, Paper, Stack } from "@mantine/core";
import { AppointmentsForm } from "@/components/MultiStepForm";
import { useAppData } from "@/contexts/AppDataContext";

export default function BookingPage() {
  const router = useRouter();
  const { healthAssessmentData } = useAppData();

  useEffect(() => {
    if (
      !healthAssessmentData ||
      Object.keys(healthAssessmentData).length === 0
    ) {
      router.push("/");
    }
  }, [healthAssessmentData, router]);

  if (!healthAssessmentData || Object.keys(healthAssessmentData).length === 0) {
    return (
      <Container size="sm" py="xl">
        <Center h={400}>
          <Paper p="xl" shadow="md" radius="md">
            <Stack align="center" gap="md">
              <Text size="lg" fw={500}>
                Data z hodnocení nebyla nalezena
              </Text>
              <Text size="sm" c="dimmed">
                Budete přesměrováni zpět na začátek...
              </Text>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  return (
    <Container
      h={"100%"}
      miw={"100%"}
      py="xl"
      style={{
        backgroundColor: "var(--mantine-primary-color-light)",
      }}
    >
      <Center>
        <AppointmentsForm />
      </Center>
    </Container>
  );
}
