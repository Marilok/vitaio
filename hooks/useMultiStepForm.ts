import { useState } from "react";
import { UseFormTrigger } from "react-hook-form";

interface UseMultiStepFormProps<T> {
  totalSteps: number;
  getFieldsForStep: (step: number) => (keyof T)[];
  trigger: UseFormTrigger<T>;
}

export function useMultiStepForm<T>({
  totalSteps,
  getFieldsForStep,
  trigger,
}: UseMultiStepFormProps<T>) {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid && !isLastStep) {
      setDirection("forward");
      setActiveStep((current) => current + 1);
    }

    return isValid;
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setDirection("backward");
      setActiveStep((current) => current - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setDirection(step > activeStep ? "forward" : "backward");
      setActiveStep(step);
    }
  };

  return {
    activeStep,
    direction,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
  };
}


