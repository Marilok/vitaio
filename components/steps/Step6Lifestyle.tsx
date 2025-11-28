"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  Box,
  Alert,
  NumberInput,
  Select,
  Group,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { calculateBMI, getBMICategory, getBMICategoryColor } from "@/utils/bmi";
import { IconInfoCircle, IconRuler, IconWeight } from "@tabler/icons-react";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";
import { Fragment } from "react";

export function Step6Lifestyle() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const weight = watch("weight");
  const height = watch("height");

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMICategoryColor(bmi);

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Životní styl a rizika
        </Title>
        <Text size="sm" c="dimmed">
          Informace o vašem životním stylu a zdravotních rizicích
        </Text>
      </Box>

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
        render={({ field }) => (
          <NumberInput
            {...field}
            label={
              <Fragment>
                Minuty střední zátěže týdně <RequiredIndicator />
              </Fragment>
            }
            placeholder="Zadejte počet minut"
            min={0}
            max={10080}
            error={errors.weeklyExerciseMinutes?.message}
          />
        )}
      />

      <Controller
        name="weeklyCigarettes"
        control={control}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Počet vykouřených cigaret týdně"
            placeholder="Zadejte počet cigaret"
            min={0}
            error={errors.weeklyCigarettes?.message}
          />
        )}
      />

      <Controller
        name="alcoholConsumption"
        control={control}
        rules={{ required: "Prosím vyberte jednu z možností" }}
        render={({ field }) => (
          <Select
            {...field}
            label={
              <Fragment>
                Konzumace alkoholu <RequiredIndicator />
              </Fragment>
            }
            placeholder="Vyberte možnost"
            data={[
              { value: "frequent", label: "Piji často" },
              { value: "occasional", label: "Piji příležitostně" },
              { value: "abstinent", label: "Abstinuji" },
            ]}
            error={errors.alcoholConsumption?.message}
            clearable
          />
        )}
      />

      <Group grow preventGrowOverflow={false} gap="md">
        <Controller
          name="height"
          control={control}
          rules={{
            required: "Výška je povinná",
            min: { value: 50, message: "Výška musí být alespoň 50 cm" },
            max: { value: 300, message: "Výška musí být menší než 300 cm" },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={
                <Fragment>
                  Výška <RequiredIndicator />
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
            required: "Hmotnost je povinná",
            min: { value: 1, message: "Hmotnost musí být alespoň 1 kg" },
            max: { value: 500, message: "Hmotnost musí být menší než 500 kg" },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={
                <Fragment>
                  Hmotnost <RequiredIndicator />
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
      </Group>

      {bmi > 0 && weight && height && (
        <Alert
          icon={<IconInfoCircle />}
          title="Vaše BMI (Body Mass Index)"
          color={bmiColor}
        >
          <Stack gap="xs">
            <Text size="lg" fw={700}>
              BMI: {bmi}
            </Text>
            <Text size="sm">
              Kategorie: <strong>{bmiCategory}</strong>
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              BMI se vypočítává jako váha (kg) dělená druhou mocninou výšky (m).
              Váš výpočet: {weight} kg / ({(height / 100).toFixed(2)} m)² ={" "}
              {bmi}
            </Text>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
