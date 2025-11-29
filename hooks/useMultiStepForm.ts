import { useState } from "react";
import { UseFormTrigger, FieldValues, Path } from "react-hook-form";

interface UseMultiStepFormProps<T extends FieldValues> {
  totalSteps: number;
  getFieldsForStep: (step: number) => Path<T>[];
  trigger: UseFormTrigger<T>;
  shouldSkipStep?: (step: number) => boolean;
}

export function useMultiStepForm<T extends FieldValues>({
  totalSteps,
  getFieldsForStep,
  trigger,
  shouldSkipStep,
}: UseMultiStepFormProps<T>) {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  const findNextValidStep = (currentStep: number, forward: boolean): number => {
    let nextStep = forward ? currentStep + 1 : currentStep - 1;

    while (nextStep >= 0 && nextStep < totalSteps) {
      if (!shouldSkipStep || !shouldSkipStep(nextStep)) {
        return nextStep;
      }
      nextStep = forward ? nextStep + 1 : nextStep - 1;
    }

    return currentStep;
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid && !isLastStep) {
      setDirection("forward");
      const nextValidStep = findNextValidStep(activeStep, true);
      setActiveStep(nextValidStep);
    }

    return isValid;
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setDirection("backward");
      const prevValidStep = findNextValidStep(activeStep, false);
      setActiveStep(prevValidStep);
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
