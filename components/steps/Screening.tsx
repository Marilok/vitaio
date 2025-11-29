"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";
import { getScreeningEligibility } from "@/utils/priority";

export function Screening() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const gender = watch("gender");
  const age = watch("age");
  const hasFamilyCancerHistory = watch("hasFamilyCancerHistory");

  const eligibility = getScreeningEligibility(
    gender,
    age,
    hasFamilyCancerHistory
  );

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🫁 Screeningová vyšetření
        </Title>
        <Text size="md" c="dimmed">
          {gender === "female" ? "Absolvovala" : "Absolvoval"} jsem tento
          screening v uvedeném intervalu
        </Text>
      </Box>

      <Stack gap="md">
        {[
          {
            name: "hadProstateScreening",
            show: eligibility.showProstateScreening,
            label: "Vyšetření prostaty v posledních 2 letech",
          },
          {
            name: "hadLungCancerScreening",
            show: eligibility.showLungCancerScreening,
            label: "Vyšetření karcinomu plic v posledních 12 měsících",
          },
          {
            name: "hadCervicalCancerScreening",
            show: eligibility.showCervicalCancerScreening,
            label:
              "Vyšetření karcinomu děložního hrdla v posledních 12 měsících",
          },
          {
            name: "hadBreastCancerScreening",
            show: eligibility.showBreastCancerScreening,
            label: "Vyšetření karcinomu prsu v posledních 2 letech",
          },
          {
            name: "hadColorectalCancerScreening",
            show: eligibility.showColorectalCancerScreening,
            label: "Vyšetření kolorektálního karcinomu v posledních 10 letech",
          },
        ]
          .filter((screening) => screening.show)
          .map((screening) => (
            <Controller
              key={screening.name}
              name={screening.name as keyof FormData}
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  checked={!!value}
                  size="md"
                  onChange={(event) => onChange(event.currentTarget.checked)}
                  label={screening.label}
                  error={errors[screening.name as keyof typeof errors]?.message}
                />
              )}
            />
          ))}
      </Stack>
    </Stack>
  );
}
