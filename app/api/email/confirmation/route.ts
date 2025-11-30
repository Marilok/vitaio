import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createEvent, EventAttributes } from "ics";

const resend = new Resend(process.env.RESEND_API_KEY);

// Czech declension helper function
function getCzechVocative(name: string): string {
  const lowerName = name.toLowerCase();
  const lastChar = lowerName.slice(-1);
  const lastTwoChars = lowerName.slice(-2);

  // Common male name endings -> vocative
  if (
    lastChar === "a" &&
    !lowerName.endsWith("cha") &&
    !lowerName.endsWith("sha")
  ) {
    return name.slice(0, -1) + "o"; // Jana -> Jano, but not for foreign names
  }
  if (lastChar === "e") {
    return name; // No change for names ending in 'e'
  }
  if (lastChar === "l") {
    return name + "e"; // Pavel -> Pavle
  }
  if (lastChar === "r") {
    return name + "e"; // Petr -> Petre
  }
  if (lastChar === "k") {
    return name.slice(0, -1) + "ku"; // Tomáš -> not applicable, but Marek -> Marku
  }
  if (lastChar === "š") {
    return name.slice(0, -1) + "ši"; // Tomáš -> Tomáši
  }
  if (lastTwoChars === "ek") {
    return name.slice(0, -2) + "ku"; // Marek -> Marku
  }
  if (lastTwoChars === "el") {
    return name.slice(0, -2) + "le"; // Karel -> Karle
  }

  // Default: add 'e' for most male names, keep unchanged for female names ending in consonants
  if (["n", "t", "d", "m", "v", "j"].includes(lastChar)) {
    return name + "e";
  }

  return name; // Default: no change
}

interface AppointmentItem {
  appointmentName: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  description?: string;
}

interface AppointmentEmailRequest {
  name: string;
  email: string;
  appointments: AppointmentItem[];
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AppointmentEmailRequest = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.email ||
      !body.appointments ||
      !Array.isArray(body.appointments) ||
      body.appointments.length === 0
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

    // Create ICS events for all appointments
    const icsFiles: string[] = [];

    for (const appointment of body.appointments) {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.startTime}:00`
      );
      const endDate = new Date(`${appointment.date}T${appointment.endTime}:00`);

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
        title: appointment.appointmentName,
        description: appointment.description || "Vyšetření",
        attendees: [{ name: body.name, email: body.email }],
        status: "CONFIRMED",
        location: body.location || "MOÚ, Pekařská 53, 656 91 Brno",
      };

      const { error: icsError, value: icsFile } = createEvent(eventData);

      if (icsError) {
        console.error(
          "Error creating ICS file for appointment:",
          appointment.appointmentName,
          icsError
        );
        continue; // Skip this appointment but continue with others
      }

      if (icsFile) {
        icsFiles.push(icsFile);
      }
    }

    // Format appointments for email display
    const formattedAppointments = body.appointments.map((appointment) => {
      const appointmentDate = new Date(
        `${appointment.date}T${appointment.startTime}:00`
      );
      const endDate = new Date(`${appointment.date}T${appointment.endTime}:00`);

      return {
        name: appointment.appointmentName,
        description: appointment.description || "",
        formattedDate: appointmentDate.toLocaleDateString("cs-CZ", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        formattedStartTime: appointmentDate.toLocaleTimeString("cs-CZ", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
        formattedEndTime: endDate.toLocaleTimeString("cs-CZ", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
      };
    });

    // Email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Potvrzení rezervací</title>
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
            <h1 style="color: #f04600; margin: 0;">MOÚ Brno</h1>
            <p style="margin: 5px 0 0 0; color: #6c757d;">Potvrzení rezervací</p>
          </div>

          <div class="appointment-card">
            <div class="appointment-title">Potvrzení objednávky vyšetření</div>
            <p>Vážený/á ${getCzechVocative(body.name)},</p>
            <p>Vaše objednávka byla úspěšně potvrzena. Níže najdete detaily všech rezervovaných vyšetření:</p>

            ${formattedAppointments
              .map(
                (appointment, index) => `
              <div class="appointment-details" style="margin-bottom: 20px; border-bottom: ${
                index < formattedAppointments.length - 1
                  ? "1px solid #e9ecef"
                  : "none"
              }; padding-bottom: ${
                  index < formattedAppointments.length - 1 ? "15px" : "0"
                };">
                <h4 style="color: #495057; margin-bottom: 10px;">${
                  appointment.name
                }</h4>
                <div class="detail-row">
                  <span class="detail-label">Datum:</span>
                  <span class="detail-value">${appointment.formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Čas:</span>
                  <span class="detail-value">${
                    appointment.formattedStartTime
                  } - ${appointment.formattedEndTime}</span>
                </div>
                ${
                  body.location
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Místo:</span>
                  <span class="detail-value">${body.location}</span>
                </div>
                `
                    : ""
                }
                ${
                  appointment.description
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Popis:</span>
                  <span class="detail-value">${appointment.description}</span>
                </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}

            <p>K tomuto e-mailu jsou přiloženy kalendářní události. Prosím přidejte je do svého kalendáře pro připomínky.</p>
            
            <p>Pokud potřebujete přeložit nebo zrušit některé z vyšetření, kontaktujte nás prosím co nejdříve.</p>
          </div>

          <div class="footer">
            <p>Děkujeme, že jste si vybrali MOÚ Brno</p>
            <p>Toto je automaticky generovaná zpráva. Neodpovídejte prosím na tento e-mail.</p>
            <p>Pro změny nebo dotazy kontaktujte recepci MOÚ.</p>
          </div>
        </body>
      </html>
    `;

    // Send email with ICS attachments
    const attachments = icsFiles.map((icsFile, index) => ({
      filename: `appointment_${index + 1}.ics`,
      content: Buffer.from(icsFile),
      contentType: "text/calendar",
    }));

    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "VitaIO Health <noreply@vitaio.health>",
      to: [body.email],
      subject: `Potvrzení objednávky vyšetření - ${body.appointments.length} ${
        body.appointments.length === 1
          ? "termín"
          : body.appointments.length < 5
          ? "termíny"
          : "termínů"
      }`,
      html: emailHtml,
      attachments: attachments,
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
