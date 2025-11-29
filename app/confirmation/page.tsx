"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  Anchor,
  Box,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { useAppData } from "@/contexts/AppDataContext";

export default function ConfirmationPage() {
  const router = useRouter();
  const { confirmationData } = useAppData();
  const email = confirmationData.email || TEXTS.defaultEmail;
  const appointmentCount = confirmationData.appointmentCount || 1;

  useEffect(() => {
    if (!confirmationData.email) {
      router.push("/");
    }
  }, [confirmationData.email, router]);
  return (
    <Box
      style={{
        minHeight: "100%",
        backgroundColor: "#4A7C59", // mou-green color
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container size="xl" py="xl">
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Left side - Content */}
          <Stack gap="xl" style={{ textAlign: "left", maxWidth: 500 }}>
            <Title
              order={1}
              size="4rem"
              style={{
                color: "white",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}
            >
              {appointmentCount !== 1
                ? TEXTS.appointmentsConfirmed
                : TEXTS.appointmentConfirmed}
            </Title>

            <Text
              size="xl"
              c={"white"}
              style={{
                maxWidth: 500,
                fontSize: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              {TEXTS.confirmationMessage}{" "}
              <span style={{ fontWeight: 700 }}>{email}</span>
            </Text>

            <Stack gap="xs">
              <Anchor href="/" underline="never" style={{ marginTop: "2rem" }}>
                <Button
                  size="xl"
                  rightSection={<IconArrowRight size={20} />}
                  style={{
                    background: "white",
                    color: "#4A7C59",
                    fontSize: "1.1rem",
                    padding: "1rem 2rem",
                    borderRadius: "50px",
                    border: "none",
                    fontWeight: 600,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:scale-105"
                >
                  Zpět na hlavní stránku
                </Button>
              </Anchor>

              <Text size="sm" c={"white"} className="ml-16!">
                Děkujeme za vaši důvěru
              </Text>
            </Stack>
          </Stack>
          {/* Right side - Stock Image */}
          <Box
            style={{
              position: "relative",
              width: "100%",
              height: "500px",
            }}
          >
            <Image
              src="/stock_2.webp"
              alt="Successful appointment confirmation"
              fill
              style={{
                objectFit: "cover",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Czech translations
const TEXTS = {
  defaultEmail: "vaše emailová adresa",
  appointmentConfirmed: "Termín byl úspěšně potvrzen!",
  appointmentsConfirmed: "Termíny byly úspěšně potvrzeny!",
  confirmationMessage:
    "Potvrzovací email se všemi detaily termínu, instrukcemi pro přípravu a informacemi o místě byl odeslán na:",
};
