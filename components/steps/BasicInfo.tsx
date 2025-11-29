"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  NumberInput,
  SegmentedControl,
  Box,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { Fragment } from "react";
import { RequiredIndicator } from "@/components/form/RequiredIndicator";
import { IconMars, IconVenus, IconCalendar } from "@tabler/icons-react";

export function BasicInfo() {
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
            style={{ maxWidth: 200 }}
          />
        )}
      />
    </Stack>
  );
}
