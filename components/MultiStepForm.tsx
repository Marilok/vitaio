"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Paper, Stack } from "@mantine/core";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Symptoms } from "./steps/Step2Symptoms";
import { Step3FamilyHistory } from "./steps/Step3FamilyHistory";
import { FormProgress } from "./form/FormProgress";
import { FormNavigation } from "./form/FormNavigation";
import { StepContainer } from "./form/StepContainer";
import { PlaceholderStep } from "./form/PlaceholderStep";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormProvider } from "@/contexts/MultiStepFormContext";
import { FormData } from "@/types/form";

const TOTAL_STEPS = 10;

// Define which fields to validate for each step
const getFieldsForStep = (step: number): (keyof FormData)[] => {
  switch (step) {
    case 0:
      return ["gender", "age", "weight", "height"];
    case 1:
      return []; // No required fields in step 2
    case 2:
      return []; // No required fields in step 3
    // Add more cases for other steps
    default:
      return [];
  }
};

export function MultiStepForm() {
  const methods = useForm<FormData>({
    defaultValues: {
      gender: "male",
      age: undefined,
      weight: undefined,
      height: undefined,
      hasRectalBleeding: undefined,
      hasFamilyCancerHistory: undefined,
    },
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

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
        return <Step1BasicInfo />;
      case 1:
        return <Step2Symptoms />;
      case 2:
        return <Step3FamilyHistory />;
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
    <FormProvider {...methods}>
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
    </FormProvider>
  );
}
