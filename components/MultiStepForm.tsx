"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Paper, Stack } from "@mantine/core";
import { BasicInfo } from "./steps/BasicInfo";
import { SymptomsAndFamily } from "./steps/SymptomsAndFamily";
import { Medications } from "./steps/Medications";
import { Lifestyle } from "./steps/Lifestyle";
import { Screening } from "./steps/Screening";
import { Step8Appointments } from "./steps/Step8Appointments";
import { Step9Appointments } from "./steps/Step9Appointments";
import { FormProgress } from "./form/FormProgress";
import { FormNavigation } from "./form/FormNavigation";
import { StepContainer } from "./form/StepContainer";
import { PlaceholderStep } from "./form/PlaceholderStep";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormProvider } from "@/contexts/MultiStepFormContext";
import { FormData } from "@/types/form";
import { calculatePriorityScore } from "@/utils/priority";
import { transformAppointmentsToScreenings } from "@/utils/appointmentsMapping";

const TOTAL_STEPS = 9;

// Define which fields to validate for each step
const getFieldsForStep = (
  step: number,
  formValues?: Partial<FormData>
): (keyof FormData)[] => {
  switch (step) {
    case 0:
      return ["gender", "age"];
    case 1:
      return []; // No required fields in step 2 (symptoms + family history)
    case 2:
      return []; // No required fields in step 3 (medications)
    case 3: {
      // Step 4 - Lifestyle: dynamically add fields based on checkbox state
      const fields: (keyof FormData)[] = [
        "height",
        "weight",
        "weeklyExerciseMinutes",
      ];

      // If user is a smoker, add smoking-related fields
      if (formValues?.isSmoker) {
        fields.push("cigarettePacksPerWeek", "smokingYears");
      }

      // If user drinks alcohol, add drinking-related fields
      if (formValues?.drinksAlcohol) {
        fields.push("beersPerWeek", "drinkingYears");
      }

      return fields;
    }
    case 7:
      return ["bookedAppointments"]; // Step 8 - Appointment booking validation
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
      isSmoker: undefined,
      cigarettePacksPerWeek: undefined,
      smokingYears: undefined,
      drinksAlcohol: undefined,
      beersPerWeek: undefined,
      drinkingYears: undefined,
      weeklyCigarettes: undefined,
      alcoholConsumption: undefined,
      hadProstateScreening: undefined,
      hadLungCancerScreening: undefined,
      hadCervicalCancerScreening: undefined,
      hadBreastCancerScreening: undefined,
      hadColorectalCancerScreening: undefined,
      selectedAppointments: [],
      bookedAppointments: [],
      priority: 0,
    },
  });

  const {
    handleSubmit,
    trigger,
    getValues,
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
    getFieldsForStep: (step: number) => getFieldsForStep(step, getValues()),
    trigger,
  });

  const onSubmit = async (data: FormData) => {
    const priorityScore = calculatePriorityScore(data);
    const finalData = { ...data, priority: priorityScore };

    // Transform selected appointments to screenings.json format
    const screeningsData = transformAppointmentsToScreenings(
      data.selectedAppointments,
      data
    );

    console.log("Form submitted:", finalData);
    console.log("Priority Score:", priorityScore);
    console.log(
      "Selected Appointments (screenings.json format):",
      screeningsData
    );

    try {
      // Call API endpoint with screeningsData
      const response = await fetch("/api/examinationDateTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenings: screeningsData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error calling API:", errorData);
        throw new Error(errorData.error || "Unable to load available slots");
      }

      const result = await response.json();
      console.log("API answer:", result);
    } catch (error) {
      console.error("Error sending form:", error);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BasicInfo />;
      case 1:
        return <SymptomsAndFamily />;
      case 2:
        return <Medications />;
      case 3:
        return <Lifestyle />;
      case 4:
        return <Screening />;
      case 5:
        return <PlaceholderStep stepNumber={6} />;
      case 6:
        return <Step8Appointments />;
      case 7:
        return <Step9Appointments />;
      case 8:
        return <PlaceholderStep stepNumber={9} />;
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
