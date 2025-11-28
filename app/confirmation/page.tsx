import {
  Container,
  Paper,
  Stack,
  Title,
  Text,
  Button,
  Group,
  ThemeIcon,
  Alert,
  Code,
} from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";

interface ConfirmationPageProps {
  email?: string;
  appointmentCount?: number;
}

export default function ConfirmationPage({
  email = TEXTS.defaultEmail,
  appointmentCount = 1,
}: ConfirmationPageProps) {
  return (
    <Container
      size="sm"
      py="xl"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper shadow="md" p="xl" radius="md" w="100%">
        <Stack align="center" gap="lg">
          {/* Checkmark Icon */}
          <ThemeIcon size={80} radius="xl" color="green" variant="light">
            <IconCheck size={50} />
          </ThemeIcon>

          {/* Confirmation Title */}
          <Title order={1} ta="center" c="dark">
            {appointmentCount !== 1
              ? TEXTS.appointmentsConfirmed
              : TEXTS.appointmentConfirmed}
          </Title>

          <Text ta="center" c="dimmed">
            {TEXTS.confirmationMessage}{" "}
            <span style={{ fontWeight: 700 }}>{email}</span>
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}

// Czech translations
const TEXTS = {
  defaultEmail: "vaše emailová adresa",
  appointmentConfirmed: "Termín potvrzen!",
  appointmentsConfirmed: "Termíny potvrzeny!",
  confirmationMessage:
    "Potvrzovací email se všemi detaily termínu, instrukcemi pro přípravu a informacemi o místě byl odeslán na:",
};
