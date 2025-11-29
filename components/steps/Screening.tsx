"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box, Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
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
        {(() => {
          const visibleScreenings = [
            {
              name: "hadCervicalCancerScreening",
              show: eligibility.showCervicalCancerScreening,
              label: "Gynekolog + cytologie čípku v posledním roce",
              description:
                "Od 15 let je preventivní gynekologické vyšetření hrazeno ZP 1× ročně",
            },
            {
              name: "hadBreastCancerScreening",
              show: eligibility.showBreastCancerScreening,
              label: "Mamografie v posledních 2 letech",
              description:
                "Od 45 let je screeningové vyšetření prsů hrazeno ZP 1× za 2 roky",
            },
            {
              name: "hadColorectalCancerScreening",
              show: eligibility.showColorectalCancerScreening,
              label: "Kolonoskopie v posledních 10 letech",
              description:
                "Od 50 let je screening kolorektálního karcinomu hrazen ZP 1× za 10 let",
            },
            {
              name: "hadOccultBloodTest",
              show: eligibility.showOccultBloodTest,
              label: "Test okultního krvácení stolice (TOKS) za poslední rok",
              description:
                age && age >= 55
                  ? "Od 55 let je TOKS hrazeno 2× ročně ZP"
                  : "Mezi 50-54 lety je TOKS hrazeno 1× ročně ZP",
            },
            {
              name: "hadProstateScreening",
              show: eligibility.showProstateScreening,
              label: "PSA screening prostaty (pilotní program)",
              description:
                "Mezi 50–69 lety je preventivní vyšetření prostaty hrazeno ZP jednou za 2 roky",
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
                return `Mezi 55–74 lety je screening karcinomu plic (≥20 balíčkoroky) hrazen ZP${
                  packYears > 0 ? ` - Vaše balíčkoroky: ${packYears}` : ""
                }`;
              })(),
            },
          ].filter((screening) => screening.show);

          // Show placeholder if no screenings are eligible
          if (visibleScreenings.length === 0) {
            return (
              <Alert
                icon={<IconInfoCircle size={20} />}
                title="Nemáte nárok na hrazená screeningová vyšetření"
                color="orange"
                variant="light"
              >
                <Text size="sm">
                  Je nám líto, ale na základě vašeho věku, pohlaví a životního
                  stylu nemáte v současné době nárok na žádné hrazené
                  screeningové vyšetření v rámci státních programů. Stále si
                  však můžete vybrat vyšetření z nabídky v dalším kroku.
                </Text>
              </Alert>
            );
          }

          // Render checkboxes for eligible screenings
          return visibleScreenings.map((screening) => (
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
          ));
        })()}
      </Stack>
    </Stack>
  );
}
