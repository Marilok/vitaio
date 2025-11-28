"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Box, Radio, Checkbox, Group } from "@mantine/core";
import { FormData } from "@/types/form";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";

export function Step5WomenOnly() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const gender = watch("gender");
  const hasGynecologist = watch("hasGynecologist");

  // This step should only be visible for women
  if (gender !== "female") {
    return null;
  }

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Gynekologická péče
        </Title>
        <Text size="sm" c="dimmed">
          Informace o vaší gynekologické péči
        </Text>
      </Box>

      <Controller
        name="hasGynecologist"
        control={control}
        rules={{ required: "Prosím vyberte jednu z možností" }}
        render={({ field }) => (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Máte vlastního gynekologa? <RequiredIndicator />
            </Text>
            <Radio.Group {...field}>
              <Group>
                <Radio value="yes" label="ANO" />
                <Radio value="no" label="NE" />
              </Group>
            </Radio.Group>
            {errors.hasGynecologist && (
              <Text size="sm" c="red" mt="xs">
                {errors.hasGynecologist.message}
              </Text>
            )}
          </Box>
        )}
      />

      {hasGynecologist === "no" && (
        <Controller
          name="bookGynecologyExam"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label="Objednat Gynekologické vyšetření"
            />
          )}
        />
      )}
    </Stack>
  );
}
