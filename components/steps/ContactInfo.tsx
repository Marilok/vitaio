"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, TextInput, Box, Group } from "@mantine/core";
import { IconUser, IconMail, IconPhone } from "@tabler/icons-react";
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
          📞 Kontaktní údaje
        </Title>
        <Text size="md" c="dimmed" mb="lg">
          Vyplňte prosím vaše kontaktní údaje pro potvrzení objednávky.
        </Text>
      </Box>

      <Group grow preventGrowOverflow={false} gap="md">
        <Controller
          name="firstName"
          control={control}
          rules={{
            required: "Jméno je povinné",
            minLength: {
              value: 2,
              message: "Jméno musí mít alespoň 2 znaky",
            },
          }}
          render={({ field }) => (
            <TextInput
              {...field}
              label={
                <>
                  Jméno <RequiredIndicator />
                </>
              }
              placeholder="Jan"
              error={errors.firstName?.message}
              size="md"
              leftSection={<IconUser size={16} />}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          rules={{
            required: "Příjmení je povinné",
            minLength: {
              value: 2,
              message: "Příjmení musí mít alespoň 2 znaky",
            },
          }}
          render={({ field }) => (
            <TextInput
              {...field}
              label={
                <>
                  Příjmení <RequiredIndicator />
                </>
              }
              placeholder="Novák"
              error={errors.lastName?.message}
              size="md"
              leftSection={<IconUser size={16} />}
            />
          )}
        />
      </Group>

      <Group grow preventGrowOverflow={false} gap="md">
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
              leftSection={<IconMail size={16} />}
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
              leftSection={<IconPhone size={16} />}
            />
          )}
        />
      </Group>
    </Stack>
  );
}
