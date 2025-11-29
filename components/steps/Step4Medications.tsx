"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, MultiSelect, Box } from "@mantine/core";
import { FormData } from "@/types/form";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";
import medicamentsData from "@/db/medicaments.json";

// Transform medicaments data for MultiSelect
const medicamentOptions = medicamentsData.map((med) => ({
  value: med.id.toString(),
  label: med.name,
}));

export function Step4Medications() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Léky
        </Title>
        <Text size="sm" c="dimmed">
          Vyberte léky, které pravidelně užíváte
        </Text>
      </Box>

      <Controller
        name="medications"
        control={control}
        render={({ field }) => (
          <MultiSelect
            {...field}
            label="Užívané léky"
            placeholder="Vyberte léky"
            data={medicamentOptions}
            searchable
            clearable
            error={errors.medications?.message}
            maxDropdownHeight={200}
          />
        )}
      />
    </Stack>
  );
}
