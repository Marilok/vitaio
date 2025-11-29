"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  Box,
  NumberInput,
  Group,
  Checkbox,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { calculateBMI, getBMICategory, getBMICategoryColor } from "@/utils/bmi";
import { IconRuler, IconWeight, IconRun } from "@tabler/icons-react";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";
import { Fragment } from "react";

export function Lifestyle() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>();

  const weight = watch("weight");
  const height = watch("height");
  const isSmoker = watch("isSmoker");
  const drinksAlcohol = watch("drinksAlcohol");
  const gender = watch("gender");

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMICategoryColor(bmi);

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🏃 Můj životní styl
        </Title>
      </Box>

      <Box mb={"xl"} mt={"sm"}>
        <Text size="md" fw={500} mb="sm">
          {bmi > 0 && weight && height ? (
            <>
              Moje BMI (Body Mass Index) je <strong>{bmi}</strong> {"("}
              {bmiCategory}
              {")"}
            </>
          ) : (
            "BMI (Body Mass Index)"
          )}
        </Text>

        {/* Custom BMI Progress Bar */}
        <Box style={{ position: "relative", marginBottom: "16px" }}>
          {/* Background track */}
          <Box
            style={{
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#e9ecef",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Color segments */}
            <Box
              style={{
                position: "absolute",
                left: "0%",
                width: `${((18.5 - 15) / (40 - 15)) * 100}%`,
                height: "100%",
                backgroundColor: "#1976d2",
              }}
            />
            <Box
              style={{
                position: "absolute",
                left: `${((18.5 - 15) / (40 - 15)) * 100}%`,
                width: `${((25 - 18.5) / (40 - 15)) * 100}%`,
                height: "100%",
                backgroundColor: "#4caf50",
              }}
            />
            <Box
              style={{
                position: "absolute",
                left: `${((25 - 15) / (40 - 15)) * 100}%`,
                width: `${((30 - 25) / (40 - 15)) * 100}%`,
                height: "100%",
                backgroundColor: "#ffd54f",
              }}
            />
            <Box
              style={{
                position: "absolute",
                left: `${((30 - 15) / (40 - 15)) * 100}%`,
                width: `${((35 - 30) / (40 - 15)) * 100}%`,
                height: "100%",
                backgroundColor: "#ff9800",
              }}
            />
            <Box
              style={{
                position: "absolute",
                left: `${((35 - 15) / (40 - 15)) * 100}%`,
                width: `${((40 - 35) / (40 - 15)) * 100}%`,
                height: "100%",
                backgroundColor: "#f44336",
              }}
            />
          </Box>

          {/* BMI Indicator */}
          {bmi > 0 && weight && height && (
            <Box
              style={{
                position: "absolute",
                left: `calc(${Math.min(
                  Math.max(((bmi - 15) / (40 - 15)) * 100, 0),
                  100
                )}% - 10px)`,
                top: "-6px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: bmiColor,
                border: "2px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                zIndex: 1,
              }}
            />
          )}

          {/* Labels */}
          <Box style={{ position: "relative", marginTop: "8px" }}>
            <Text
              size="xs"
              style={{
                position: "absolute",
                left: `${((18.5 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              18.5
            </Text>
            <Text
              size="xs"
              style={{
                position: "absolute",
                left: `${((25 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              25
            </Text>
            <Text
              size="xs"
              style={{
                position: "absolute",
                left: `${((30 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              30
            </Text>
            <Text
              size="xs"
              style={{
                position: "absolute",
                left: `${((35 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              35
            </Text>
          </Box>

          {/* Category labels */}
          <Box style={{ position: "relative", marginTop: "16px" }}>
            <Text
              size="xs"
              c="dimmed"
              style={{
                position: "absolute",
                left: `${((18.5 - 15) / 2 / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              Podváha
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{
                position: "absolute",
                left: `${(((18.5 + 25) / 2 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              Normální
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{
                position: "absolute",
                left: `${(((25 + 30) / 2 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              Obezita I
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{
                position: "absolute",
                left: `${(((30 + 35) / 2 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              Obezita II
            </Text>
            <Text
              size="xs"
              c="dimmed"
              style={{
                position: "absolute",
                left: `${(((35 + 40) / 2 - 15) / (40 - 15)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              Obezita III
            </Text>
          </Box>
        </Box>
      </Box>

      <Group grow preventGrowOverflow={false} gap="md">
        <Controller
          name="height"
          control={control}
          rules={{
            required: "Pro výpočet BMI je potřeba znát výšku",
            min: { value: 50, message: "Výška musí být alespoň 50 cm" },
            max: { value: 300, message: "Výška musí být menší než 300 cm" },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={
                <Fragment>
                  Měřím.. <RequiredIndicator />
                </Fragment>
              }
              min={50}
              max={300}
              error={errors.height?.message}
              leftSection={<IconRuler size={16} />}
              suffix={field.value ? " cm" : ""}
              style={{ maxWidth: 150 }}
            />
          )}
        />

        <Controller
          name="weight"
          control={control}
          rules={{
            required: "Pro výpočet BMI je potřeba znát hmotnost",
            min: { value: 1, message: "Hmotnost musí být alespoň 1 kg" },
            max: { value: 500, message: "Hmotnost musí být menší než 500 kg" },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={
                <Fragment>
                  Vážím.. <RequiredIndicator />
                </Fragment>
              }
              min={1}
              max={500}
              error={errors.weight?.message}
              decimalScale={1}
              leftSection={<IconWeight size={16} />}
              suffix={field.value ? " kg" : ""}
              style={{ maxWidth: 150 }}
            />
          )}
        />

        <Controller
          name="weeklyExerciseMinutes"
          control={control}
          rules={{
            required: "Počet minut je povinný",
            min: { value: 0, message: "Minimální hodnota je 0 minut" },
            max: {
              value: 10080,
              message: "Maximum je 10080 minut (7 dní × 24 hodin)",
            },
          }}
          render={({ field }) => {
            const formatSuffix = () => {
              if (!field.value) return "";
              const value = Number(field.value);
              if (value === 1) return " minuta";
              if (value >= 2 && value <= 4) return " minuty";
              return " minut";
            };

            return (
              <NumberInput
                {...field}
                label={
                  <Fragment>
                    Za týden nasportuji.. <RequiredIndicator />
                  </Fragment>
                }
                placeholder="Zadejte počet minut"
                min={0}
                max={10080}
                leftSection={<IconRun size={16} />}
                suffix={formatSuffix()}
                error={errors.weeklyExerciseMinutes?.message}
                style={{ maxWidth: 200 }}
              />
            );
          }}
        />
      </Group>

      <Box>
        <Controller
          name="isSmoker"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              size="md"
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                onChange(checked);
                if (!checked) {
                  setValue("cigarettePacksPerWeek", undefined);
                  setValue("smokingYears", undefined);
                }
              }}
              label={gender === "female" ? "Jsem kuřačka" : "Jsem kuřák"}
            />
          )}
        />

        {isSmoker && (
          <Group grow preventGrowOverflow={false} gap="md" mt="md">
            <Controller
              name="cigarettePacksPerWeek"
              control={control}
              rules={{
                required: "Počet krabiček je povinný",
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => {
                const formatCigaretteSuffix = () => {
                  if (!field.value) return "";
                  const value = Number(field.value);
                  if (value === 1) return " krabičku";
                  if (value >= 2 && value <= 4) return " krabičky";
                  return " krabiček";
                };

                return (
                  <NumberInput
                    {...field}
                    label={
                      <Fragment>
                        Týdně vykouřím <RequiredIndicator />
                      </Fragment>
                    }
                    placeholder="Počet krabiček"
                    min={0}
                    decimalScale={1}
                    suffix={formatCigaretteSuffix()}
                    error={errors.cigarettePacksPerWeek?.message}
                  />
                );
              }}
            />

            <Controller
              name="smokingYears"
              control={control}
              rules={{
                required: "Počet let je povinný",
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => {
                const formatYearsSuffix = () => {
                  if (!field.value) return "";
                  const value = Number(field.value);
                  if (value === 1) return " rok";
                  if (value >= 2 && value <= 4) return " roky";
                  return " let";
                };

                return (
                  <NumberInput
                    {...field}
                    label={
                      <Fragment>
                        Jak dlouho kouřím <RequiredIndicator />
                      </Fragment>
                    }
                    placeholder="Počet let"
                    min={0}
                    suffix={formatYearsSuffix()}
                    error={errors.smokingYears?.message}
                  />
                );
              }}
            />
          </Group>
        )}
      </Box>

      <Box>
        <Controller
          name="drinksAlcohol"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                onChange(checked);
                if (!checked) {
                  setValue("beersPerWeek", undefined);
                  setValue("drinkingYears", undefined);
                }
              }}
              size="md"
              label="Piji alkohol"
            />
          )}
        />

        {drinksAlcohol && (
          <Group grow preventGrowOverflow={false} gap="md" mt="md">
            <Controller
              name="beersPerWeek"
              control={control}
              rules={{
                required: "Počet piv je povinný",
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => {
                const formatDrinkSuffix = () => {
                  if (!field.value) return "";
                  const value = Number(field.value);
                  if (value === 1) return " alkoholický nápoj";
                  if (value >= 2 && value <= 4) return " alkoholické nápoje";
                  return " alkoholických nápojů";
                };

                return (
                  <NumberInput
                    {...field}
                    label={
                      <Fragment>
                        Týdně vypiji <RequiredIndicator />
                      </Fragment>
                    }
                    placeholder="Počet alkoholických nápojů"
                    min={0}
                    decimalScale={1}
                    suffix={formatDrinkSuffix()}
                    error={errors.beersPerWeek?.message}
                  />
                );
              }}
            />

            <Controller
              name="drinkingYears"
              control={control}
              rules={{
                required: "Počet let je povinný",
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => {
                const formatYearsSuffix = () => {
                  if (!field.value) return "";
                  const value = Number(field.value);
                  if (value === 1) return " rok";
                  if (value >= 2 && value <= 4) return " roky";
                  return " let";
                };

                return (
                  <NumberInput
                    {...field}
                    label={
                      <Fragment>
                        Jak dlouho piji <RequiredIndicator />
                      </Fragment>
                    }
                    placeholder="Počet let"
                    min={0}
                    suffix={formatYearsSuffix()}
                    error={errors.drinkingYears?.message}
                  />
                );
              }}
            />
          </Group>
        )}
      </Box>
    </Stack>
  );
}
