"use client";

import { useFormContext } from "react-hook-form";
import { Stack, Title, Box } from "@mantine/core";
import { FormData } from "@/types/form";

export function WomenOnly() {
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
          ⚕️ Gynekologická péče
        </Title>
      </Box>

      {/* This component can be used for future women-specific questions */}
    </Stack>
  );
}
