"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FormData } from "@/types/form";

// Type aliases for clarity
export type HealthAssessmentData = Partial<FormData>;

// Appointment Data Types
export interface AppointmentData {
  appointmentTypeId: number;
  examination_type_id: number;
  slotId: string;
  dateTime: string;
}

// Confirmation Data Types
export interface ConfirmationData {
  email?: string;
  appointmentCount?: number;
  appointmentData?: Array<{
    id: number;
    examinationName: string;
    dateTime: string;
    slotId: string;
    examination_type_id: number;
    minutes: number;
    isManuallySelected: boolean;
  }>;
}

// Context Types
interface AppDataContextType {
  healthAssessmentData: HealthAssessmentData;
  setHealthAssessmentData: (data: HealthAssessmentData) => void;
  appointmentData: AppointmentData[];
  setAppointmentData: (data: AppointmentData[]) => void;
  confirmationData: ConfirmationData;
  setConfirmationData: (data: ConfirmationData) => void;
}

// Create Context
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Provider Component
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [healthAssessmentData, setHealthAssessmentData] =
    useState<HealthAssessmentData>({});
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>(
    {}
  );

  return (
    <AppDataContext.Provider
      value={{
        healthAssessmentData,
        setHealthAssessmentData,
        appointmentData,
        setAppointmentData,
        confirmationData,
        setConfirmationData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

// Hook to use the context
export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
