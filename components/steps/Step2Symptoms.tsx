"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";

export function Step2Symptoms() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Příznaky
        </Title>
        <Text size="sm" c="dimmed">
          Prosím odpovězte na následující otázky o vašich příznacích
        </Text>
      </Box>

      <Controller
        name="hasRectalBleeding"
        control={control}
        rules={{
          required:
            "Toto pole je povinné. Prosím zaškrtněte, pokud jste měl(a) krvácení stolice, nebo nechte nezaškrtnuté.",
        }}
        render={({ field: { value, onChange, ...field } }) => (
          <Box>
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label={
                <Text size="sm">
                  Měl(a) jsem krvácení stolice <RequiredIndicator />
                </Text>
              }
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
    </Stack>
  );
}
