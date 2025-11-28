import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  List,
  ListItem,
  ThemeIcon,
  Code,
  Button,
  Anchor,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            Vítejte ve VitaIO
          </Title>
          <Text size="lg" c="dimmed" mb="md">
            Next.js aplikace s TypeScript, Tailwind CSS, Mantine UI, React Hook
            Form a Supabase
          </Text>
          <Anchor href="/assessment" underline="never">
            <Button size="lg">Začít zdravotní posouzení</Button>
          </Anchor>
        </div>
      </Stack>
    </Container>
  );
}
