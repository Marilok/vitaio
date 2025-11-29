"use client";

import { useForm, FormProvider, Path } from "react-hook-form";
import { Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAppData } from "@/contexts/AppDataContext";
import { BasicInfo } from "./steps/BasicInfo";
import { SymptomsAndFamily } from "./steps/SymptomsAndFamily";
import { Medications } from "./steps/Medications";
import { Lifestyle } from "./steps/Lifestyle";
import { Screening } from "./steps/Screening";
import { Step8Appointments } from "./steps/Step8Appointments";
import { Step9Appointments } from "./steps/Step9Appointments";
import { ContactInfo } from "./steps/ContactInfo";
import { FormProgress } from "./form/FormProgress";
import { FormNavigation } from "./form/FormNavigation";
import { StepContainer } from "./form/StepContainer";
import { AnimatedVectors } from "./AnimatedVectors";

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
): Path<FormData>[] => {
  switch (step) {
    case 0:
      return ["gender", "age"];
    case 1:
      return []; // No required fields in step 2 (symptoms + family history)
    case 2:
      return []; // No required fields in step 3 (medications)
    case 3: {
      // Step 4 - Lifestyle: dynamically add fields based on checkbox state
      const fields: Path<FormData>[] = [
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
function HealthAssessmentForm() {
  const { setHealthAssessmentData } = useAppData();
  const router = useRouter();

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
    setHealthAssessmentData(finalData);
    router.push("/booking");
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

// Loading Component with proper context and centering
function FormEvaluationLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Create a dummy context for the loading state to show animated background
  const dummyContext = {
    activeStep: 4, // Show the final step colors during loading
    direction: "forward" as const,
    isFirstStep: false,
    isLastStep: true,
    totalSteps: 5,
    nextStep: async () => false,
    prevStep: () => {},
    goToStep: () => {},
    onSubmit: () => {},
    isSubmitting: false,
  };

  return (
    <MultiStepFormProvider value={dummyContext}>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 0",
        }}
      >
        <AnimatedVectors />
        <Paper
          shadow="md"
          p="xl"
          radius="md"
          w={720}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Center>
            <Stack align="center" gap="lg">
              <Loader size="xl" type="dots" />
              <Text size="lg" fw={500}>
                Vyhodnocujeme Váš dotazník
              </Text>
            </Stack>
          </Center>
        </Paper>
      </div>
    </MultiStepFormProvider>
  );
}

// Appointments Form Component
function AppointmentsForm() {
  const router = useRouter();
  const { healthAssessmentData, setConfirmationData, setAppointmentData } =
    useAppData();

  // Redirect if no health assessment data
  useEffect(() => {
    if (
      !healthAssessmentData ||
      Object.keys(healthAssessmentData).length === 0
    ) {
      router.push("/");
    }
  }, [healthAssessmentData, router]);

  const methods = useForm<FormData>({
    defaultValues: healthAssessmentData || {},
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
    totalSteps: 3, // Step8Appointments, Step9Appointments, and ContactInfo
    getFieldsForStep: (step: number): Path<FormData>[] => {
      switch (step) {
        case 0:
          return []; // Step8Appointments - no required fields initially
        case 1:
          return ["bookedAppointments"]; // Step9Appointments - booking validation
        case 2:
          return ["firstName", "lastName", "email", "phone"]; // ContactInfo - contact details validation
        default:
          return [];
      }
    },
    trigger,
  });

  const onSubmit = async (data: FormData) => {
    // Store appointment data in context
    setAppointmentData(data.bookedAppointments || []);

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

      await response.json(); // Process the response

      // Send single email confirmation with all booked appointments
      try {
        const appointments = (data.bookedAppointments || []).map(
          (appointment) => {
            const appointmentDate = new Date(appointment.dateTime);
            const endDate = new Date(appointmentDate.getTime() + 30 * 60000); // Default 30 minutes

            return {
              appointmentName: `Vyšetření Health Screening`,
              date: appointmentDate.toISOString().split("T")[0], // YYYY-MM-DD format
              startTime: appointmentDate.toTimeString().slice(0, 5), // HH:MM format
              endTime: endDate.toTimeString().slice(0, 5), // HH:MM format
              description: `Rezervované vyšetření v rámci zdravotní analýzy`,
            };
          }
        );

        const emailResponse = await fetch("/api/email/confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            appointments: appointments,
            location: "VitaIO Health Clinic",
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          throw new Error(
            errorData.error || "Failed to send confirmation email"
          );
        }

        // Store confirmation data in context
        const confirmationDataToSet = {
          email: data.email,
          appointmentCount: data.bookedAppointments?.length || 1,
          appointmentData: data.appointmentData || [],
        };
        console.log("Setting confirmation data:", confirmationDataToSet);
        setConfirmationData(confirmationDataToSet);

        notifications.show({
          title: "Úspěch",
          message: "Potvrzovací email byl úspěšně odeslán",
          color: "green",
        });

        router.push("/confirmation");
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        notifications.show({
          title: "Chyba při odesílání emailu",
          message:
            emailError instanceof Error
              ? emailError.message
              : "Nepodařilo se odeslat potvrzovací email",
          color: "red",
          autoClose: false, // Keep the notification visible
        });
        // Don't redirect on email error, keep user on the form
        return;
      }
    } catch (error) {
      console.error("Error sending form:", error);
      notifications.show({
        title: "Chyba při odesílání formuláře",
        message:
          error instanceof Error ? error.message : "Došlo k neočekávané chybě",
        color: "red",
        autoClose: false, // Keep the notification visible
      });
      // Don't redirect on general errors, keep user on the form
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step8Appointments />;
      case 1:
        return <Step9Appointments />;
      case 2:
        return <ContactInfo />;
      default:
        return null;
    }
  };

  if (!healthAssessmentData || Object.keys(healthAssessmentData).length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <FormProvider {...methods}>
      <MultiStepFormProvider
        value={{
          activeStep,
          direction,
          isFirstStep,
          isLastStep,
          totalSteps: 3,
          nextStep,
          prevStep,
          goToStep,
          onSubmit: handleSubmit(onSubmit),
          isSubmitting,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 0",
          }}
        >
          <AnimatedVectors />
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            w={1000}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Stack gap="xl">
              <FormProgress title="Objednání vyšetření" />
              <StepContainer>{renderStepContent()}</StepContainer>
              <FormNavigation isAppointmentForm />
            </Stack>
          </Paper>
        </div>
      </MultiStepFormProvider>
    </FormProvider>
  );
}

// Main orchestrating component
export function MultiStepForm() {
  return <HealthAssessmentForm />;
}

// Export the AppointmentsForm for use in the booking page
export { AppointmentsForm };

// Wrapper component that provides context to both form and vectors
export function MultiStepFormWithVectors() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<
    "health-assessment" | "loading"
  >("health-assessment");

  const handleFormSubmission = () => {
    setCurrentPhase("loading");
  };

  const handleLoadingComplete = () => {
    // Navigate to the booking page
    router.push("/booking");
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case "health-assessment":
        return (
          <HealthAssessmentFormWithVectors
            onFormSubmit={handleFormSubmission}
          />
        );
      case "loading":
        return <FormEvaluationLoader onComplete={handleLoadingComplete} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderPhase()}
    </div>
  );
}

// Modified HealthAssessmentForm that includes vectors with shared context
function HealthAssessmentFormWithVectors({
  onFormSubmit,
}: {
  onFormSubmit: () => void;
}) {
  const { setHealthAssessmentData } = useAppData();
  const router = useRouter();

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
    setHealthAssessmentData(finalData);
    // Trigger loading state
    onFormSubmit();
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
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 0",
          }}
        >
          <AnimatedVectors />
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            w={720}
            style={{ position: "relative", zIndex: 1 }}
            mt={"lg"}
          >
            <Stack gap="xl">
              <FormProgress title="Moje zdravotní analýza" />
              <StepContainer>{renderStepContent()}</StepContainer>
              <FormNavigation />
            </Stack>
          </Paper>
        </div>
      </MultiStepFormProvider>
    </FormProvider>
  );
}
