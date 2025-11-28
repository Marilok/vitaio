"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Title, Text, Box } from "@mantine/core";
import { FormData } from "@/types/form";

export function Step5WomenOnly() {
  const { watch } = useFormContext<FormData>();
  const gender = watch("gender");

  // This step should only be visible for women
  if (gender !== "female") {
    return null;
  }

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Krok pro ženy
        </Title>
        <Text size="sm" c="dimmed">
          Tento krok se zobrazuje pouze ženám
        </Text>
      </Box>

      <Text>
        Obsah kroku 5 pro ženy připravujeme...
      </Text>
    </Stack>
  );
}

