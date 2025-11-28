"use client";

import { createContext, useContext, ReactNode } from "react";

interface MultiStepFormContextValue {
  activeStep: number;
  direction: "forward" | "backward";
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  goToStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const MultiStepFormContext = createContext<
  MultiStepFormContextValue | undefined
>(undefined);

export function MultiStepFormProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MultiStepFormContextValue;
}) {
  return (
    <MultiStepFormContext.Provider value={value}>
      {children}
    </MultiStepFormContext.Provider>
  );
}

export function useMultiStepFormContext() {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      "useMultiStepFormContext must be used within MultiStepFormProvider"
    );
  }
  return context;
}

