"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Stack,
  Title,
  Text,
  TextInput,
  Box,
  Group,
  Card,
  Divider,
  Table,
  Select,
} from "@mantine/core";
import { IconUser, IconMail, IconPhone } from "@tabler/icons-react";
import { FormData } from "@/types/form";
import { RequiredIndicator } from "../form/RequiredIndicator";
import appointmentsData from "@/db/appointments.json";
import { getScreeningPrice } from "@/utils/screeningPrice";

interface AppointmentData {
  id: number;
  name: string;
  description?: string;
  type: string;
  url?: string;
  price?: number;
  category?: string;
}

const appointments: AppointmentData[] = appointmentsData as AppointmentData[];

const countryOptions = [
  { value: "+420", label: "+420" },
  { value: "+421", label: "+421" },
];

export function ContactInfo() {
  const [countryCode, setCountryCode] = useState("+420");

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<FormData>();

  const selectedAppointments = watch("selectedAppointments") || [];
  const gender = watch("gender");

  // Get mandatory appointments based on gender
  const mandatoryAppointments = appointments.filter((app) => {
    if (app.type !== "mandatory") return false;

    // Filter gender-specific mandatory appointments
    if (app.id === 1 && gender !== "male") return false; // PSA Test
    if (app.id === 24 && gender !== "female") return false; // Breast Ultrasound
    if (app.id === 23 && gender !== "male") return false; // Testicular Ultrasound

    return true;
  });

  // Get selected optional appointments
  const optionalAppointments = appointments.filter(
    (app) => app.type === "optional" && selectedAppointments.includes(app.id)
  );

  // Calculate total price considering free screenings
  const mandatoryPackagePrice = 10000;
  const optionalPrice = optionalAppointments.reduce((sum, app) => {
    const screeningPrice = getScreeningPrice(app.id, watch() as FormData);
    if (screeningPrice.isFree) {
      return sum; // Free screening, don't add to price
    }
    return sum + (app.price || 0);
  }, 0);
  const totalPrice = mandatoryPackagePrice + optionalPrice;

  return (
    <Stack gap="md" pt="md">
      <Box>
        <Title order={3} mb="xs">
          📞 Kontaktní údaje
        </Title>
        <Text size="md" c="dimmed">
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

        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500} mb={5}>
            Telefonní číslo <RequiredIndicator />
          </Text>
          <Group gap="xs" align="flex-start">
            <Select
              data={countryOptions}
              value={countryCode}
              onChange={(value) => {
                if (value) {
                  setCountryCode(value);
                  // Update the phone field to include the new country code
                  const currentPhone = watch("phone") || "";
                  const phoneWithoutPrefix = currentPhone.replace(
                    /^\+\d{3}/,
                    ""
                  );
                  setValue("phone", `${value}${phoneWithoutPrefix}`);
                }
              }}
              size="md"
              
              allowDeselect={false}
            />
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Telefonní číslo je povinné",
                pattern: {
                  value: /^(\+420|\+421)[0-9]{9}$/,
                  message:
                    "Neplatný formát telefonního čísla (použijte 9 číslic)",
                },
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="123456789"
                  error={errors.phone?.message}
                  size="md"
                  type="tel"
                  style={{ flex: 1 }}
                  leftSection={<IconPhone size={16} />}
                  onChange={(event) => {
                    const phoneNumber = event.currentTarget.value.replace(
                      /^\+\d{3}/,
                      ""
                    );
                    const fullPhone = `${countryCode}${phoneNumber}`;
                    field.onChange(fullPhone);
                  }}
                  value={field.value?.replace(/^\+\d{3}/, "") || ""}
                />
              )}
            />
          </Group>
        </Box>
      </Group>

      {/* Summary of Selected Appointments */}
      <Card
        mt="lg"
        shadow="md"
        padding="lg"
        radius="md"
        withBorder
        style={{
          borderColor: "var(--mantine-color-orange-6)",
          borderWidth: 2,
          backgroundColor: "var(--mantine-color-orange-0)",
        }}
      >
        <Title order={4} mb="md">
          📋 Souhrn objednávky
        </Title>

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{ backgroundColor: "white" }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Vyšetření</Table.Th>
              <Table.Th style={{ textAlign: "right", width: "120px" }}>
                Cena
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {/* Mandatory Package */}
            <Table.Tr>
              <Table.Td>
                <Text fw={600}>Základní preventivní balíček</Text>
                <Text size="xs" c="dimmed">
                  {mandatoryAppointments.map((app) => app.name).join(", ")}
                </Text>
              </Table.Td>
              <Table.Td style={{ textAlign: "right" }}>
                <Text fw={600}>10 000 Kč</Text>
              </Table.Td>
            </Table.Tr>

            {/* Optional Appointments */}
            {optionalAppointments.map((app) => {
              const screeningPrice = getScreeningPrice(
                app.id,
                watch() as FormData
              );
              return (
                <Table.Tr key={app.id}>
                  <Table.Td>
                    {app.name}
                    {screeningPrice.isFree && (
                      <Text size="xs" c="dimmed">
                        {screeningPrice.reason}
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    {screeningPrice.isFree ? (
                      <Text fw={700} c="green">
                        ZDARMA
                      </Text>
                    ) : (
                      <Text>{(app.price || 0).toLocaleString("cs-CZ")} Kč</Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>

        <Divider my="md" />

        {/* Total Price */}
        <Group justify="space-between" align="center">
          <Text size="xl" fw={700}>
            Celková cena
          </Text>
          <Text size="2rem" fw={700} c="orange">
            {totalPrice.toLocaleString("cs-CZ")} Kč
          </Text>
        </Group>
      </Card>
    </Stack>
  );
}
