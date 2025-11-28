"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  NumberInput,
  SegmentedControl,
  Box,
  Group,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { Fragment } from "react";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";
import {
  IconUser,
  IconCalendar,
  IconWeight,
  IconRuler,
  IconMars,
  IconVenus,
} from "@tabler/icons-react";

export function Step1BasicInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Základní informace
        </Title>
        <Text size="sm" c="dimmed">
          Prosím vyplňte vaše základní údaje
        </Text>
      </Box>

      <Controller
        name="gender"
        control={control}
        rules={{ required: "Pohlaví je povinné" }}
        render={({ field }) => (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Pohlaví <RequiredIndicator />
            </Text>
            <SegmentedControl
              {...field}
              fullWidth
              color={
                field.value === "male"
                  ? "var(--mantine-color-blue-7)"
                  : "var(--mantine-color-pink-7)"
              }
              data={[
                {
                  label: (
                    <Box
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <IconMars size={16} />
                      Muž
                    </Box>
                  ),
                  value: "male",
                },
                {
                  label: (
                    <Box
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <IconVenus size={16} />
                      Žena
                    </Box>
                  ),
                  value: "female",
                },
              ]}
              style={{ maxWidth: 300 }}
            />
            {errors.gender && (
              <Text size="sm" c="red" mt="xs">
                {errors.gender.message}
              </Text>
            )}
          </Box>
        )}
      />

      <Group grow preventGrowOverflow={false} gap="md">
        <Controller
          name="age"
          control={control}
          rules={{
            required: "Věk je povinný",
            min: { value: 1, message: "Věk musí být alespoň 1" },
            max: { value: 120, message: "Věk musí být menší než 120" },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              label={
                <Fragment>
                  Věk <RequiredIndicator />
                </Fragment>
              }
              min={1}
              max={120}
              error={errors.age?.message}
              leftSection={<IconCalendar size={16} />}
              suffix={
                field.value
                  ? field.value === 1
                    ? " rok"
                    : field.value < 5
                    ? " roky"
                    : " let"
                  : ""
              }
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
      </Group>
    </Stack>
  );
}
