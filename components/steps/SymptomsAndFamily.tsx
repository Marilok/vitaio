"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";

export function SymptomsAndFamily() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🌡️ Příznaky a rodinná anamnéza
        </Title>
      </Box>

      <Controller
        name="hasRectalBleeding"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Box>
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label="Měl(a) jsem někdy krvácení stolice"
              error={errors.hasRectalBleeding?.message}
            />
            {errors.hasRectalBleeding && (
              <Text size="sm" c="red" mt="xs">
                {errors.hasRectalBleeding.message}
              </Text>
            )}
          </Box>
        )}
      />

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
