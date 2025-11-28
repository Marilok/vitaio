"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";

export function Step7Screening() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const gender = watch("gender");

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Screeningová vyšetření
        </Title>
        <Text size="sm" c="dimmed">
          Absolvoval(a) jsem tento screening v doporučeném intervalu
        </Text>
      </Box>

      <Stack gap="md">
        <Controller
          name="hadProstateScreening"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label={<Text size="sm">Vyšetření prostaty</Text>}
              error={errors.hadProstateScreening?.message}
            />
          )}
        />

        <Controller
          name="hadLungCancerScreening"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label={<Text size="sm">Vyšetření karcinomu plic</Text>}
              error={errors.hadLungCancerScreening?.message}
            />
          )}
        />

        {gender === "female" && (
          <>
            <Controller
              name="hadCervicalCancerScreening"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  checked={value || false}
                  onChange={(event) => onChange(event.currentTarget.checked)}
                  label={<Text size="sm">Karcinom děložního hrdla</Text>}
                  error={errors.hadCervicalCancerScreening?.message}
                />
              )}
            />

            <Controller
              name="hadBreastCancerScreening"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  checked={value || false}
                  onChange={(event) => onChange(event.currentTarget.checked)}
                  label={<Text size="sm">Karcinom prsu</Text>}
                  error={errors.hadBreastCancerScreening?.message}
                />
              )}
            />
          </>
        )}

        <Controller
          name="hadColorectalCancerScreening"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label={<Text size="sm">Vyšetření kolorektálního karcinomu</Text>}
              error={errors.hadColorectalCancerScreening?.message}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

