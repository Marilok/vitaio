"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";

export function Step3FamilyHistory() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Rodinná anamnéza
        </Title>
        <Text size="sm" c="dimmed">
          Prosím odpovězte na následující otázku o výskytu nádorů v rodině
        </Text>
      </Box>

      <Controller
        name="hasFamilyCancerHistory"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Box>
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label="V rodině v jedné pokrevní linii byly minimálně 2 výskyty nádorů s výskytem do 50 let věku"
              error={errors.hasFamilyCancerHistory?.message}
            />
            {errors.hasFamilyCancerHistory && (
              <Text size="sm" c="red" mt="xs">
                {errors.hasFamilyCancerHistory.message}
              </Text>
            )}
          </Box>
        )}
      />
    </Stack>
  );
}
