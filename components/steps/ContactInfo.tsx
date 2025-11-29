"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, TextInput, Box } from "@mantine/core";
import { FormData } from "@/types/form";
import { RequiredIndicator } from "../form/RequiredIndicator";

export function ContactInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Kontaktní údaje
        </Title>
        <Text size="md" c="dimmed" mb="lg">
          Vyplňte prosím vaše kontaktní údaje pro potvrzení objednávky.
        </Text>
      </Box>

      <Controller
        name="fullName"
        control={control}
        rules={{
          required: "Jméno a příjmení je povinné",
          minLength: {
            value: 3,
            message: "Jméno a příjmení musí mít alespoň 3 znaky",
          },
          validate: (value) => {
            const parts = value.trim().split(/\s+/);
            if (parts.length < 2) {
              return "Zadejte prosím jméno i příjmení";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            label={
              <>
                Jméno a příjmení <RequiredIndicator />
              </>
            }
            placeholder="Jan Novák"
            error={errors.fullName?.message}
            size="md"
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "E-mail je povinný",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Neplatný formát e-mailové adresy",
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            label={
              <>
                E-mail <RequiredIndicator />
              </>
            }
            placeholder="vas.email@example.com"
            error={errors.email?.message}
            size="md"
            type="email"
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        rules={{
          required: "Telefonní číslo je povinné",
          pattern: {
            value: /^(\+420)?[0-9]{9}$/,
            message: "Neplatný formát telefonního čísla (použijte 9 číslic)",
          },
        }}
        render={({ field }) => (
          <TextInput
            {...field}
            label={
              <>
                Telefonní číslo <RequiredIndicator />
              </>
            }
            placeholder="+420123456789"
            error={errors.phone?.message}
            size="md"
            type="tel"
          />
        )}
      />
    </Stack>
  );
}
