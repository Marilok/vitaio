import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createEvent, EventAttributes } from "ics";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentEmailRequest {
  name: string;
  email: string;
  appointmentName: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  description?: string;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AppointmentEmailRequest = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.appointmentName ||
      !body.date ||
      !body.startTime ||
      !body.endTime
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Parse date and time
    const appointmentDate = new Date(`${body.date}T${body.startTime}:00`);
    const endDate = new Date(`${body.date}T${body.endTime}:00`);

    // Create ICS event
    const eventData: EventAttributes = {
      start: [
        appointmentDate.getFullYear(),
        appointmentDate.getMonth() + 1,
        appointmentDate.getDate(),
        appointmentDate.getHours(),
        appointmentDate.getMinutes(),
      ],
      end: [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours(),
        endDate.getMinutes(),
      ],
      title: body.appointmentName,
      attendees: [{ name: body.name, email: body.email }],
      status: "CONFIRMED",
    };

    const { error: icsError, value: icsFile } = createEvent(eventData);

    if (icsError) {
      console.error("Error creating ICS file:", icsError);
      return NextResponse.json(
        { error: "Failed to create calendar event" },
        { status: 500 }
      );
    }

    // Format date and time for email display
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedStartTime = appointmentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const formattedEndTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Appointment Confirmation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              text-align: center;
            }
            .appointment-card {
              background-color: #ffffff;
              border: 2px solid #e9ecef;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .appointment-title {
              font-size: 24px;
              font-weight: bold;
              color: #495057;
              margin-bottom: 10px;
            }
            .appointment-details {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 6px;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 4px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .detail-label {
              font-weight: 600;
              color: #6c757d;
            }
            .detail-value {
              color: #495057;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #007bff; margin: 0;">VitaIO Health</h1>
            <p style="margin: 5px 0 0 0; color: #6c757d;">Appointment Confirmation</p>
          </div>

          <div class="appointment-card">
            <div class="appointment-title">${body.appointmentName}</div>
            <p>Dear ${body.name},</p>
            <p>Your appointment has been confirmed. Please find the details below:</p>

            <div class="appointment-details">
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formattedStartTime} - ${formattedEndTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Appointment:</span>
                <span class="detail-value">${body.appointmentName}</span>
              </div>
              ${
                body.location
                  ? `
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${body.location}</span>
              </div>
              `
                  : ""
              }
              ${
                body.description
                  ? `
              <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${body.description}</span>
              </div>
              `
                  : ""
              }
            </div>

            <p>A calendar event has been attached to this email. Please add it to your calendar to receive reminders.</p>
            
            <p>If you need to reschedule or cancel your appointment, please contact us as soon as possible.</p>
          </div>

          <div class="footer">
            <p>Thank you for choosing VitaIO Health</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;

    // Send email with ICS attachment
    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "VitaIO Health <noreply@vitaio.health>",
      to: [body.email],
      subject: `Appointment Confirmation - ${body.appointmentName}`,
      html: emailHtml,
      attachments: [
        {
          filename: "appointment.ics",
          content: Buffer.from(icsFile || ""),
          contentType: "text/calendar",
        },
      ],
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Confirmation email sent successfully",
      emailId: data?.id,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
