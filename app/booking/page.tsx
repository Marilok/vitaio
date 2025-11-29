"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Center, Text, Paper, Stack } from "@mantine/core";
import { AppointmentsForm } from "@/components/MultiStepForm";
import { FormData } from "@/types/form";

function getStoredFormData(): FormData | null {
  if (typeof window === "undefined") return null;

  try {
    const storedData = sessionStorage.getItem("healthAssessmentData");
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error("Error parsing stored form data:", error);
    return null;
  }
}

export default function BookingPage() {
  const router = useRouter();
  const [formData] = useState<FormData | null>(() => getStoredFormData());

  useEffect(() => {
    if (!formData) {
      router.push("/");
    }
  }, [formData, router]);

  if (!formData) {
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
        <AppointmentsForm formData={formData} />
      </Center>
    </Container>
  );
}
