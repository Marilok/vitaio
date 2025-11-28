/**
 * Types for email API routes
 */

export interface AppointmentEmailRequest {
  /** Full name of the person receiving the appointment */
  name: string;
  /** Email address to send the confirmation to */
  email: string;
  /** Name/title of the appointment */
  appointmentName: string;
  /** Appointment date in YYYY-MM-DD format */
  date: string;
  /** Start time in HH:MM format (24-hour) */
  startTime: string;
  /** End time in HH:MM format (24-hour) */
  endTime: string;
}

export interface AppointmentEmailResponse {
  /** Whether the email was sent successfully */
  success: boolean;
  /** Success or error message */
  message: string;
  /** Email ID from the email service (if successful) */
  emailId?: string;
  /** Error details (if failed) */
  error?: string;
}

/**
 * Utility function to send appointment confirmation email
 */
export async function sendAppointmentConfirmation(
  appointmentData: AppointmentEmailRequest
): Promise<AppointmentEmailResponse> {
  try {
    const response = await fetch("/api/email/confirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send email");
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
