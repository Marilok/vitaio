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
          👋 Základní informace o mě
        </Title>
      </Box>

      <Group align="flex-start" gap="xl">
        <Controller
          name="gender"
          control={control}
          rules={{ required: "Pohlaví je povinné" }}
          render={({ field }) => (
            <Box>
              <Text size="lg" fw={500} mb="xs">
                Jsem... <RequiredIndicator />
              </Text>
              <SegmentedControl
                {...field}
                size="lg"
                color={
                  field.value === "male"
                    ? "var(--mantine-color-blue-7)"
                    : "var(--mantine-color-pink-7)"
                }
                data={[
                  {
                    label: (
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
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
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
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
            required:
              "Vyplňte prosím svůj věk, abychom mohli nabídnout relevantní doporučení",
            min: { value: 1, message: "Musíte být starý alespoň 1 rok" },
            max: { value: 130, message: "Musíte být mladší než 130 let" },
          }}
          render={({ field }) => (
            <Box>
              <Text size="lg" fw={500} mb="xs">
                Je mi... <RequiredIndicator />
              </Text>
              <NumberInput
                {...field}
                min={1}
                size="lg"
                max={130}
                error={errors.age?.message}
                placeholder="zadejte Váš věk"
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
                style={{ maxWidth: 260 }}
              />
            </Box>
          )}
        />
      </Group>
    </Stack>
  );
}
