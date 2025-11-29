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

export default function Home() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--mantine-primary-color-filled)",
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
              Udělejte krok k lepšímu zdraví
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
              Absolvujte balíček preventivní zdravotní vyšetření od nejlépe
              hodnocené instituce v Česku.
            </Text>

            <Stack gap="xs">
              <Anchor
                href="/assessment"
                underline="never"
                style={{ marginTop: "2rem" }}
              >
                <Button
                  size="xl"
                  rightSection={<IconArrowRight size={20} />}
                  style={{
                    background: "white",
                    color: "var(--mantine-primary-color-filled)",
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
                  Vytvořit moje doporučení
                </Button>
              </Anchor>

              <Text size="sm" c={"white"} className="!ml-16">
                Zabere přibližně 5-10 minut
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
              src="/stock_1.jpeg"
              alt="Healthcare professionals meeting with patient"
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
