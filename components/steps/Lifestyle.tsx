"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  Box,
  Alert,
  NumberInput,
  Group,
  Checkbox,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { calculateBMI, getBMICategory, getBMICategoryColor } from "@/utils/bmi";
import { IconInfoCircle, IconRuler, IconWeight } from "@tabler/icons-react";
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

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMICategoryColor(bmi);

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🏃 Životní styl a rizika
        </Title>
        <Text size="sm" c="dimmed">
          Informace o vašem životním stylu a zdravotních rizicích
        </Text>
      </Box>

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

      <Box>
        <Controller
          name="isSmoker"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Checkbox
              {...field}
              checked={value || false}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                onChange(checked);
                if (!checked) {
                  setValue("cigarettePacksPerWeek", undefined);
                  setValue("smokingYears", undefined);
                }
              }}
              label={<Text size="sm">Jsem kuřák</Text>}
            />
          )}
        />

        {isSmoker && (
          <Group grow preventGrowOverflow={false} gap="md" mt="md">
            <Controller
              name="cigarettePacksPerWeek"
              control={control}
              rules={{
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Krabičky cigaret týdně"
                  placeholder="Počet krabiček"
                  min={0}
                  decimalScale={1}
                  error={errors.cigarettePacksPerWeek?.message}
                />
              )}
            />

            <Controller
              name="smokingYears"
              control={control}
              rules={{
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Jak dlouho kouříte (roky)"
                  placeholder="Počet let"
                  min={0}
                  error={errors.smokingYears?.message}
                />
              )}
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
              label={<Text size="sm">Piji alkohol</Text>}
            />
          )}
        />

        {drinksAlcohol && (
          <Group grow preventGrowOverflow={false} gap="md" mt="md">
            <Controller
              name="beersPerWeek"
              control={control}
              rules={{
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Piv týdně"
                  placeholder="Počet piv"
                  min={0}
                  decimalScale={1}
                  error={errors.beersPerWeek?.message}
                />
              )}
            />

            <Controller
              name="drinkingYears"
              control={control}
              rules={{
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Jak dlouho pijete (roky)"
                  placeholder="Počet let"
                  min={0}
                  error={errors.drinkingYears?.message}
                />
              )}
            />
          </Group>
        )}
      </Box>
    </Stack>
  );
}
