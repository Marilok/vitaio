"use client";

import { useForm } from "react-hook-form";
import { Paper, Stack } from "@mantine/core";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { FormProgress } from "./form/FormProgress";
import { FormNavigation } from "./form/FormNavigation";
import { StepContainer } from "./form/StepContainer";
import { PlaceholderStep } from "./form/PlaceholderStep";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormProvider } from "@/contexts/MultiStepFormContext";

interface FormData {
  // Step 1
  gender: "male" | "female";
  age: number;
  weight: number;
  height: number;
  // Add more steps data as needed
}

const TOTAL_STEPS = 10;

// Define which fields to validate for each step
const getFieldsForStep = (step: number): (keyof FormData)[] => {
  switch (step) {
    case 0:
      return ["gender", "age", "weight", "height"];
    // Add more cases for other steps
    default:
      return [];
  }
};

export function MultiStepForm() {
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      gender: "male",
      age: undefined,
      weight: undefined,
      height: undefined,
    },
  });

  const {
    activeStep,
    direction,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
  } = useMultiStepForm({
    totalSteps: TOTAL_STEPS,
    getFieldsForStep,
    trigger,
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1BasicInfo control={control} errors={errors} watch={watch} />
        );
      case 1:
        return <PlaceholderStep stepNumber={2} />;
      case 2:
        return <PlaceholderStep stepNumber={3} />;
      case 3:
        return <PlaceholderStep stepNumber={4} />;
      case 4:
        return <PlaceholderStep stepNumber={5} />;
      case 5:
        return <PlaceholderStep stepNumber={6} />;
      case 6:
        return <PlaceholderStep stepNumber={7} />;
      case 7:
        return <PlaceholderStep stepNumber={8} />;
      case 8:
        return <PlaceholderStep stepNumber={9} />;
      case 9:
        return <PlaceholderStep stepNumber={10} />;
      default:
        return null;
    }
  };

  return (
    <MultiStepFormProvider
      value={{
        activeStep,
        direction,
        isFirstStep,
        isLastStep,
        totalSteps: TOTAL_STEPS,
        nextStep,
        prevStep,
        goToStep,
        onSubmit: handleSubmit(onSubmit),
        isSubmitting,
      }}
    >
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="xl">
          <FormProgress />

          <StepContainer>{renderStepContent()}</StepContainer>

          <FormNavigation />
        </Stack>
      </Paper>
    </MultiStepFormProvider>
  );
}
