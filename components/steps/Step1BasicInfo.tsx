'use client';

import { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import {
  Stack,
  Title,
  Text,
  NumberInput,
  SegmentedControl,
  Box,
} from '@mantine/core';
import { Controller } from 'react-hook-form';

interface FormData {
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
}

interface Step1Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

export function Step1BasicInfo({ control, errors }: Step1Props) {
  return (
    <Stack gap="lg" pt="md">
      <Box>
        <Title order={3} mb="xs">
          Basic Information
        </Title>
        <Text size="sm" c="dimmed">
          Please provide your basic information to get started
        </Text>
      </Box>

      <Controller
        name="gender"
        control={control}
        rules={{ required: 'Gender is required' }}
        render={({ field }) => (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Gender <Text component="span" c="red">*</Text>
            </Text>
            <SegmentedControl
              {...field}
              fullWidth
              data={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
              ]}
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
          required: 'Age is required',
          min: { value: 1, message: 'Age must be at least 1' },
          max: { value: 120, message: 'Age must be less than 120' },
        }}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Age"
            placeholder="Enter your age"
            required
            min={1}
            max={120}
            error={errors.age?.message}
            description="Years old"
          />
        )}
      />

      <Controller
        name="weight"
        control={control}
        rules={{
          required: 'Weight is required',
          min: { value: 1, message: 'Weight must be at least 1 kg' },
          max: { value: 500, message: 'Weight must be less than 500 kg' },
        }}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Weight"
            placeholder="Enter your weight"
            required
            min={1}
            max={500}
            error={errors.weight?.message}
            description="Kilograms (kg)"
            decimalScale={1}
          />
        )}
      />

      <Controller
        name="height"
        control={control}
        rules={{
          required: 'Height is required',
          min: { value: 50, message: 'Height must be at least 50 cm' },
          max: { value: 300, message: 'Height must be less than 300 cm' },
        }}
        render={({ field }) => (
          <NumberInput
            {...field}
            label="Height"
            placeholder="Enter your height"
            required
            min={50}
            max={300}
            error={errors.height?.message}
            description="Centimeters (cm)"
          />
        )}
      />
    </Stack>
  );
}

