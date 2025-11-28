'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Paper,
  Button,
  Group,
  Title,
  Stack,
  Progress,
  Text,
  Box,
  Transition,
} from '@mantine/core';
import { Step1BasicInfo } from './steps/Step1BasicInfo';

interface FormData {
  // Step 1
  gender: 'male' | 'female';
  age: number;
  weight: number;
  height: number;
  // Add more steps data as needed
}

const TOTAL_STEPS = 10;

export function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      gender: 'male',
      age: undefined,
      weight: undefined,
      height: undefined,
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    // Define which fields to validate for each step
    switch (activeStep) {
      case 0:
        fieldsToValidate = ['gender', 'age', 'weight', 'height'];
        break;
      // Add more cases for other steps
    }

    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && activeStep < TOTAL_STEPS - 1) {
      setDirection('forward');
      setActiveStep((current) => current + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setDirection('backward');
      setActiveStep((current) => current - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const progress = ((activeStep + 1) / TOTAL_STEPS) * 100;

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1BasicInfo control={control} errors={errors} watch={watch} />;
      case 1:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 2</Title>
            <Text c="dimmed">Step 2 content coming soon...</Text>
          </Box>
        );
      case 2:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 3</Title>
            <Text c="dimmed">Step 3 content coming soon...</Text>
          </Box>
        );
      case 3:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 4</Title>
            <Text c="dimmed">Step 4 content coming soon...</Text>
          </Box>
        );
      case 4:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 5</Title>
            <Text c="dimmed">Step 5 content coming soon...</Text>
          </Box>
        );
      case 5:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 6</Title>
            <Text c="dimmed">Step 6 content coming soon...</Text>
          </Box>
        );
      case 6:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 7</Title>
            <Text c="dimmed">Step 7 content coming soon...</Text>
          </Box>
        );
      case 7:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 8</Title>
            <Text c="dimmed">Step 8 content coming soon...</Text>
          </Box>
        );
      case 8:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 9</Title>
            <Text c="dimmed">Step 9 content coming soon...</Text>
          </Box>
        );
      case 9:
        return (
          <Box style={{ minHeight: 300 }}>
            <Title order={3} mb="md">Step 10</Title>
            <Text c="dimmed">Step 10 content coming soon...</Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md">
      <Stack gap="xl">
        <Box>
          <Group justify="space-between" mb="xs">
            <Title order={2}>Health Assessment</Title>
            <Text size="sm" c="dimmed" fw={500}>
              Step {activeStep + 1} of {TOTAL_STEPS}
            </Text>
          </Group>
          <Progress value={progress} size="sm" radius="xl" />
        </Box>

        <Box style={{ position: 'relative', minHeight: 400 }}>
          <Transition
            mounted={true}
            transition={direction === 'forward' ? 'slide-left' : 'slide-right'}
            duration={300}
            timingFunction="ease"
          >
            {(styles) => (
              <Box style={styles}>
                {renderStepContent()}
              </Box>
            )}
          </Transition>
        </Box>

        <Group justify="space-between" mt="xl">
          <Button 
            variant="default" 
            onClick={prevStep} 
            disabled={activeStep === 0}
            size="md"
          >
            Previous
          </Button>

          {activeStep === TOTAL_STEPS - 1 ? (
            <Button onClick={handleSubmit(onSubmit)} size="md">
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={nextStep} size="md">
              Next
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

