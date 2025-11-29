"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box } from "@mantine/core";
import { FormData } from "@/types/form";
import { getScreeningEligibility } from "@/utils/priority";
import { calculatePackYears } from "@/utils/packYears";

export function Screening() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const gender = watch("gender");
  const age = watch("age");
  const hasFamilyCancerHistory = watch("hasFamilyCancerHistory");
  const isSmoker = watch("isSmoker");
  const cigarettePacksPerWeek = watch("cigarettePacksPerWeek");
  const smokingYears = watch("smokingYears");

  const eligibility = getScreeningEligibility(
    gender,
    age,
    hasFamilyCancerHistory,
    isSmoker,
    cigarettePacksPerWeek,
    smokingYears
  );

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🫁 Screeningová vyšetření
        </Title>
        <Text size="md" c="dimmed" mb="md">
          Zaškrtněte vyšetření, která jste již{" "}
          {gender === "female" ? "absolvovala" : "absolvoval"} v uvedeném
          intervalu.
        </Text>
      </Box>

      <Stack gap="md">
        {[
          {
            name: "hadCervicalCancerScreening",
            show: eligibility.showCervicalCancerScreening,
            label: "Gynekolog + cytologie čípku (každý rok)",
            description: "15+ let: preventivní gynekologické vyšetření",
          },
          {
            name: "hadBreastCancerScreening",
            show: eligibility.showBreastCancerScreening,
            label: "Mamografie (1× za 2 roky)",
            description: "45+ let: screeningové vyšetření prsů",
          },
          {
            name: "hadColorectalCancerScreening",
            show: eligibility.showColorectalCancerScreening,
            label: "Kolonoskopie",
            description: "50+ let: screening kolorektálního karcinomu",
          },
          {
            name: "hadOccultBloodTest",
            show: eligibility.showOccultBloodTest,
            label: "Test okultního krvácení stolice (TOKS)",
            description:
              age && age >= 55
                ? "55+ let: hrazeno 2× ročně"
                : "50-54 let: hrazeno 1× ročně",
          },
          {
            name: "hadProstateScreening",
            show: eligibility.showProstateScreening,
            label: "PSA screening prostaty (pilotní program)",
            description: "50–69 let: preventivní vyšetření prostaty",
          },
          {
            name: "hadLungCancerScreening",
            show: eligibility.showLungCancerScreening,
            label: "CT plic (pro kuřáky/bývalé kuřáky)",
            description: (() => {
              const packYears = calculatePackYears(
                cigarettePacksPerWeek,
                smokingYears
              );
              return `55–74 let: screening karcinomu plic (≥20 balíčkoroky)${
                packYears > 0 ? ` - Vaše balíčkoroky: ${packYears}` : ""
              }`;
            })(),
          },
        ]
          .filter((screening) => screening.show)
          .map((screening) => (
            <Box key={screening.name}>
              <Controller
                name={screening.name as keyof FormData}
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Checkbox
                    {...field}
                    checked={!!value}
                    size="md"
                    onChange={(event) => onChange(event.currentTarget.checked)}
                    label={
                      <Box>
                        <Text fw={500}>{screening.label}</Text>
                        <Text size="sm" c="dimmed">
                          {screening.description}
                        </Text>
                      </Box>
                    }
                    error={
                      errors[screening.name as keyof typeof errors]?.message
                    }
                  />
                )}
              />
            </Box>
          ))}
      </Stack>
    </Stack>
  );
}
