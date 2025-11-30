"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Stack, Title, Text, Checkbox, Box, Textarea } from "@mantine/core";
import { FormData } from "@/types/form";

export function SymptomsAndFamily() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const gender = watch("gender");

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          🌡️ Příznaky a rodinná anamnéza
        </Title>
        <Text size="md" c="dimmed">
          Zaškrtněte platná tvrzení, která se Vás týkají:
        </Text>
      </Box>

      <Controller
        name="hasRectalBleeding"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Box>
            <Checkbox
              {...field}
              checked={value || false}
              size="md"
              onChange={(event) => onChange(event.currentTarget.checked)}
              label={`${
                gender === "female" ? "Měla" : "Měl"
              } jsem někdy krvácení stolice`}
              error={errors.hasRectalBleeding?.message}
            />
            {errors.hasRectalBleeding && (
              <Text size="sm" c="red" mt="xs">
                {errors.hasRectalBleeding.message}
              </Text>
            )}
          </Box>
        )}
      />

      <Controller
        name="hasFamilyCancerHistory"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Box>
            <Checkbox
              size="md"
              {...field}
              checked={value || false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              label="V mé pokrevní rodině (rodiče, sourozenci, prarodiče...) se vyskytly minimálně 2 nádory u příbuzných, kteří byli mladší 50 let"
              error={errors.hasFamilyCancerHistory?.message}
            />
            {errors.hasFamilyCancerHistory && (
              <Text size="sm" c="red" mt="xs">
                {errors.hasFamilyCancerHistory.message}
              </Text>
            )}
          </Box>
        )}
      />

      {gender === "female" && (
        <Controller
          name="hasGynecologist"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <Box>
              <Checkbox
                {...field}
                checked={!!value}
                size="md"
                onChange={(event) => onChange(event.currentTarget.checked)}
                label="Mám vlastního gynekologa"
                error={errors.hasGynecologist?.message}
              />
              {errors.hasGynecologist && (
                <Text size="sm" c="red" mt="xs">
                  {errors.hasGynecologist.message}
                </Text>
              )}
            </Box>
          )}
        />
      )}

      <Box mt="xl">
        <Title order={3} mb="xs">
          🔍 Zdravotní problémy
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Trápí Vás nějaký zdravotní problém? Popište ho prosím co nejpodrobněji
          (od kdy Vás trápí, jak se projevuje, co Vám řekl lékař...), pomůže nám
          to vyhodnotit a doporučit vhodné prohlídky.
        </Text>

        <Stack gap="md">
          <Textarea
            label="Můj zdravotní problém"
            description="(ve formuláři je příklad odpovědi pacienta, kvůli API tokenům je pole neaktivní)"
            placeholder="Vložte lékařskou zprávu, nebo vyhledejte pomocí dotazu"
            value="nedávno mi vyšel pozitivní test na okultní krvácení a chtěl bych poradit které vyšetření bych si měl vybrat"
            minRows={3}
            maxRows={5}
            size="md"
            disabled={true}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
