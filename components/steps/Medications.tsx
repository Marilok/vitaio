"use client";

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { useEffect, useRef } from "react";
import {
  Stack,
  Title,
  Text,
  Select,
  TextInput,
  Group,
  Button,
  Card,
  ActionIcon,
  Box,
} from "@mantine/core";
import { FormData } from "@/types/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import medicamentsData from "@/db/medicaments.json";

// Transform medicaments data for Select
const medicamentOptions = medicamentsData.map((med) => ({
  value: med.id.toString(),
  label: med.name,
}));

// Common frequency options
const frequencyOptions = [
  { value: "1x denně", label: "1x denně" },
  { value: "2x denně", label: "2x denně" },
  { value: "3x denně", label: "3x denně" },
  { value: "4x denně", label: "4x denně" },
  { value: "Podle potřeby", label: "Podle potřeby" },
  { value: "Týdně", label: "Týdně" },
  { value: "Měsíčně", label: "Měsíčně" },
];

export function Medications() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const hasInitialized = useRef(false);

  // Initialize with one empty medication if none exist
  useEffect(() => {
    if (fields.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      append({
        id: "",
        name: "",
        frequency: "",
        dosage: "",
        isCustom: false,
      });
    }
  }, [fields.length, append]);

  const addMedication = () => {
    append({
      id: "",
      name: "",
      frequency: "",
      dosage: "",
      isCustom: false,
    });
  };

  const addCustomMedication = () => {
    append({
      id: "custom",
      name: "",
      frequency: "",
      dosage: "",
      isCustom: true,
    });
  };

  const handleMedicationSelect = (index: number, selectedId: string) => {
    const selectedMed = medicamentsData.find(
      (med) => med.id.toString() === selectedId
    );
    if (selectedMed) {
      // Update the medication name when a new medication is selected
      const currentMedications = watch("medications") || [];
      currentMedications[index] = {
        ...currentMedications[index],
        id: selectedId,
        name: selectedMed.name,
      };
    }
  };

  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          💊 Užívané léky
        </Title>
        <Text size="md" c="dimmed">
          Uveďte léky, které pravidelně užíváte, včetně dávkování a frekvence:
        </Text>
      </Box>

      <Stack gap="md">
        {fields.map((field, index) => {
          const medications = watch("medications");
          const isCustom = medications?.[index]?.isCustom || false;

          return (
            <Card key={field.id} padding="0" radius="0" shadow="none">
              <Group align="flex-start" gap="xs">
                {isCustom ? (
                  <Controller
                    name={`medications.${index}.name`}
                    control={control}
                    rules={{ required: "Zadejte název léku" }}
                    render={({ field: nameField }) => (
                      <TextInput
                        {...nameField}
                        label="Název léku"
                        placeholder="Napište název léku"
                        w={220}
                        size="md"
                        error={errors.medications?.[index]?.name?.message}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name={`medications.${index}.id`}
                    control={control}
                    rules={{ required: "Vyberte lék" }}
                    render={({ field: selectField }) => (
                      <Select
                        {...selectField}
                        w={220}
                        label="Název léku"
                        placeholder="Vyberte lék"
                        data={medicamentOptions}
                        searchable
                        clearable
                        size="md"
                        error={errors.medications?.[index]?.id?.message}
                        onChange={(value) => {
                          selectField.onChange(value);
                          if (value) {
                            handleMedicationSelect(index, value);
                          }
                        }}
                      />
                    )}
                  />
                )}

                <Controller
                  name={`medications.${index}.frequency`}
                  control={control}
                  rules={{ required: "Zadejte frekvenci" }}
                  render={({ field: freqField }) => (
                    <Select
                      {...freqField}
                      label="Frekvence"
                      placeholder="Jak často"
                      w={"140"}
                      data={frequencyOptions}
                      size="md"
                      error={errors.medications?.[index]?.frequency?.message}
                    />
                  )}
                />

                <Controller
                  name={`medications.${index}.dosage`}
                  control={control}
                  rules={{ required: "Zadejte dávkování" }}
                  render={({ field: dosageField }) => (
                    <TextInput
                      {...dosageField}
                      label="Dávkování"
                      placeholder="např. 1 tableta, 5mg"
                      size="md"
                      error={errors.medications?.[index]?.dosage?.message}
                    />
                  )}
                />

                <ActionIcon
                  color="red"
                  variant="light"
                  size="xl"
                  onClick={() => remove(index)}
                  style={{ marginTop: 24, flexShrink: 0 }}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>
            </Card>
          );
        })}

        <Group gap="md">
          <Button
            variant="light"
            color="mou-blue"
            leftSection={<IconPlus size={16} />}
            onClick={addMedication}
            size="md"
          >
            Přidat další lék
          </Button>

          <Button
            variant="outline"
            color="mou-blue"
            leftSection={<IconPlus size={16} />}
            onClick={addCustomMedication}
            size="md"
          >
            Doplnit jiné léky, které nejsou v seznamu
          </Button>
        </Group>

        {fields.length === 0 && (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            Nevyužívám pravidelně žádné léky
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
