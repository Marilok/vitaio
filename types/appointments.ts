export interface Appointment {
  id: number;
  name: string;
  description: string;
  type: "consultation" | "examination";
  url: string;
}

export interface SelectedAppointments {
  appointmentIds: number[];
  submittedAt?: Date;
}
