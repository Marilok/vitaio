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

import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { MultiStepFormProvider } from "@/contexts/MultiStepFormContext";
import { FormData } from "@/types/form";
import { calculatePriorityScore } from "@/utils/priority";
import { transformAppointmentsToScreenings } from "@/utils/appointmentsMapping";
import { Loader, Text, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HEALTH_ASSESSMENT_STEPS = 5;

// Define which fields to validate for each step in health assessment
const getHealthAssessmentFieldsForStep = (
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
    case 4:
      return []; // Screening step - no required fields
    default:
      return [];
  }
};

// Health Assessment Form Component
function HealthAssessmentForm({
  onComplete,
}: {
  onComplete: (data: FormData) => void;
}) {
  const methods = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onBlur",
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
    totalSteps: HEALTH_ASSESSMENT_STEPS,
    getFieldsForStep: (step: number) =>
      getHealthAssessmentFieldsForStep(step, getValues()),
    trigger,
  });

  const onSubmit = async (data: FormData) => {
    const priorityScore = calculatePriorityScore(data);
    const finalData = { ...data, priority: priorityScore };
    onComplete(finalData);
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
          totalSteps: HEALTH_ASSESSMENT_STEPS,
          nextStep,
          prevStep,
          goToStep,
          onSubmit: handleSubmit(onSubmit),
          isSubmitting,
        }}
      >
        <Paper shadow="md" p="xl" radius="md" w={720}>
          <Stack gap="xl">
            <FormProgress title="Moje zdravotní analýza" />
            <StepContainer>{renderStepContent()}</StepContainer>
            <FormNavigation />
          </Stack>
        </Paper>
      </MultiStepFormProvider>
    </FormProvider>
  );
}

// Loading Component
function FormEvaluationLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Paper shadow="md" p="xl" radius="md" w={720}>
      <Center>
        <Stack align="center" gap="lg">
          <Loader size="xl" type="dots" />
          <Text size="lg" fw={500}>
            Vyhodnocujeme váš dotazník
          </Text>
        </Stack>
      </Center>
    </Paper>
  );
}

// Appointments Form Component
function AppointmentsForm({ formData }: { formData: FormData }) {
  const methods = useForm<FormData>({
    defaultValues: formData,
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
    totalSteps: 2, // Step8Appointments and Step9Appointments
    getFieldsForStep: (step: number) => {
      switch (step) {
        case 0:
          return []; // Step8Appointments - no required fields initially
        case 1:
          return ["bookedAppointments"]; // Step9Appointments - booking validation
        default:
          return [];
      }
    },
    trigger,
  });

  const onSubmit = async (data: FormData) => {
    // Transform selected appointments to screenings.json format
    const screeningsData = transformAppointmentsToScreenings(
      data.selectedAppointments,
      data
    );

    console.log("Appointments form submitted:", data);
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
        return <Step8Appointments />;
      case 1:
        return <Step9Appointments />;
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
          totalSteps: 2,
          nextStep,
          prevStep,
          goToStep,
          onSubmit: handleSubmit(onSubmit),
          isSubmitting,
        }}
      >
        <Paper shadow="md" p="xl" radius="md" w={1200}>
          <Stack gap="xl">
            <FormProgress title="Objednání vyšetření" />
            <StepContainer>{renderStepContent()}</StepContainer>
            <FormNavigation />
          </Stack>
        </Paper>
      </MultiStepFormProvider>
    </FormProvider>
  );
}

// Main orchestrating component
export function MultiStepForm() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<
    "health-assessment" | "loading"
  >("health-assessment");

  const handleHealthAssessmentComplete = (data: FormData) => {
    // Store form data in sessionStorage for the booking page
    sessionStorage.setItem("healthAssessmentData", JSON.stringify(data));
    setCurrentPhase("loading");
  };

  const handleLoadingComplete = () => {
    // Navigate to the booking page
    router.push("/booking");
  };

  switch (currentPhase) {
    case "health-assessment":
      return (
        <HealthAssessmentForm onComplete={handleHealthAssessmentComplete} />
      );
    case "loading":
      return <FormEvaluationLoader onComplete={handleLoadingComplete} />;
    default:
      return null;
  }
}

// Export the AppointmentsForm for use in the booking page
export { AppointmentsForm };
