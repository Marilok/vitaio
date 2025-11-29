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
  Slider,
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

      {bmi > 0 && weight && height && (
        <Box>
          <Text size="md" fw={500} mb="sm">
            Vaše BMI (Body Mass Index): <strong>{bmi}</strong> - {bmiCategory}
          </Text>
          <Slider
            value={bmi}
            min={15}
            max={35}
            step={0.1}
            color={bmiColor}
            size="lg"
            thumbSize={20}
            labelAlwaysOn
            label={(value) => value.toFixed(1)}
            marks={[
              { value: 18.5, label: "Podváha" },
              { value: 25, label: "Normální" },
              { value: 30, label: "Nadváha" },
              { value: 35, label: "Obezita" },
            ]}
            disabled
            styles={{
              track: {
                background: `linear-gradient(to right, 
                  #1976d2 0%, #1976d2 18.5%, 
                  #4caf50 18.5%, #4caf50 25%, 
                  #ff9800 25%, #ff9800 30%, 
                  #f44336 30%, #f44336 100%)`,
              },
              bar: {
                display: "none",
              },
              thumb: {
                backgroundColor: bmiColor,
                borderColor: bmiColor,
              },
            }}
          />
          <Text size="xs" c="dimmed" mt="sm">
            BMI se vypočítává jako váha (kg) dělená druhou mocninou výšky (m).
            Váš výpočet: {weight} kg / ({(height / 100).toFixed(2)} m)² = {bmi}
          </Text>
        </Box>
      )}

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
                required: "Počet krabiček je povinný",
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={
                    <Fragment>
                      Krabičky cigaret týdně <RequiredIndicator />
                    </Fragment>
                  }
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
                required: "Počet let je povinný",
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={
                    <Fragment>
                      Jak dlouho kouříte (roky) <RequiredIndicator />
                    </Fragment>
                  }
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
                required: "Počet piv je povinný",
                min: { value: 0, message: "Minimální hodnota je 0" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={
                    <Fragment>
                      Piv týdně <RequiredIndicator />
                    </Fragment>
                  }
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
                required: "Počet let je povinný",
                min: { value: 0, message: "Minimální hodnota je 0 let" },
              }}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label={
                    <Fragment>
                      Jak dlouho pijete (roky) <RequiredIndicator />
                    </Fragment>
                  }
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
