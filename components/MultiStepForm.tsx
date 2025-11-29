"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Paper, Stack } from "@mantine/core";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2Symptoms } from "./steps/Step2Symptoms";
import { Step3FamilyHistory } from "./steps/Step3FamilyHistory";
import { Step4Medications } from "./steps/Step4Medications";
import { Step5WomenOnly } from "./steps/Step5WomenOnly";
import { Step6Lifestyle } from "./steps/Step6Lifestyle";
import { Step7Screening } from "./steps/Step7Screening";
import { FormProgress } from "./form/FormProgress";
import { FormNavigation } from "./form/FormNavigation";
import { StepContainer } from "./form/StepContainer";
import { PlaceholderStep } from "./form/PlaceholderStep";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormProvider } from "@/contexts/MultiStepFormContext";
import { FormData } from "@/types/form";
import { calculatePriorityScore } from "@/utils/priority";

const TOTAL_STEPS = 10;

// Define which fields to validate for each step
const getFieldsForStep = (step: number): (keyof FormData)[] => {
  switch (step) {
    case 0:
      return ["gender", "age"];
    case 1:
      return []; // No required fields in step 2
    case 2:
      return []; // No required fields in step 3
    case 3:
      return []; // No required fields in step 4 (medications optional)
    case 4:
      return ["hasGynecologist"]; // Step 5 - only for women
    case 5:
      return [
        "height",
        "weight",
        "weeklyExerciseMinutes",
        "alcoholConsumption",
      ]; // Step 6
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
      medications: [],
      hasGynecologist: undefined,
      bookGynecologyExam: undefined,
      weeklyExerciseMinutes: undefined,
      weeklyCigarettes: undefined,
      alcoholConsumption: undefined,
      hadProstateScreening: undefined,
      hadLungCancerScreening: undefined,
      hadCervicalCancerScreening: undefined,
      hadBreastCancerScreening: undefined,
      hadColorectalCancerScreening: undefined,
      priority: 0,
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    formState: { isSubmitting },
  } = methods;

  // Helper function to check if a step should be skipped
  const shouldSkipStep = (step: number): boolean => {
    const gender = getValues("gender");

    // Step 5 (index 4) is only for women
    if (step === 4 && gender === "male") {
      return true;
    }

    return false;
  };

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
    shouldSkipStep,
  });

  const onSubmit = (data: FormData) => {
    const priorityScore = calculatePriorityScore(data);
    const finalData = { ...data, priority: priorityScore };
    console.log("Form submitted:", finalData);
    console.log("Priority Score:", priorityScore);
    console.log(JSON.stringify(finalData, null, 2));
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
        return <Step4Medications />;
      case 4:
        return <Step5WomenOnly />;
      case 5:
        return <Step6Lifestyle />;
      case 6:
        return <Step7Screening />;
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
        <Paper shadow="md" p="xl" radius="md" miw="740px">
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
