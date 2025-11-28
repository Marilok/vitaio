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
import { ExampleForm } from "@/components/ExampleForm";

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

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Tech Stack Included
          </Title>
          <List
            spacing="sm"
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
            }
          >
            <ListItem>
              <Text fw={500}>Next.js 16</Text> - React framework with App Router
            </ListItem>
            <ListItem>
              <Text fw={500}>TypeScript</Text> - Type-safe development
            </ListItem>
            <ListItem>
              <Text fw={500}>Tailwind CSS</Text> - Utility-first CSS framework
            </ListItem>
            <ListItem>
              <Text fw={500}>Mantine UI v7</Text> - Modern React component
              library
            </ListItem>
            <ListItem>
              <Text fw={500}>React Hook Form</Text> - Performant form validation
            </ListItem>
            <ListItem>
              <Text fw={500}>Supabase</Text> - Backend as a service (auth,
              database, storage)
            </ListItem>
          </List>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Getting Started
          </Title>
          <Stack gap="md">
            <div>
              <Text fw={500} mb="xs">
                1. Set up Supabase
              </Text>
              <Text size="sm" c="dimmed">
                Create a <Code>.env.local</Code> file and add your Supabase
                credentials:
              </Text>
              <Code block mt="xs">
                {`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
              </Code>
            </div>

            <div>
              <Text fw={500} mb="xs">
                2. Run the development server
              </Text>
              <Code>npm run dev</Code>
            </div>

            <div>
              <Text fw={500} mb="xs">
                3. Start building
              </Text>
              <Text size="sm" c="dimmed">
                Check out the example form below and explore the components in
                the <Code>/components</Code> directory.
              </Text>
            </div>
          </Stack>
        </Card>

        <ExampleForm />

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">
            Key Files
          </Title>
          <List spacing="xs">
            <ListItem>
              <Code>/app/providers.tsx</Code> - Mantine provider setup
            </ListItem>
            <ListItem>
              <Code>/lib/supabase/client.ts</Code> - Supabase client for browser
            </ListItem>
            <ListItem>
              <Code>/lib/supabase/server.ts</Code> - Supabase client for server
              components
            </ListItem>
            <ListItem>
              <Code>/middleware.ts</Code> - Authentication middleware
            </ListItem>
            <ListItem>
              <Code>/components/ExampleForm.tsx</Code> - Form example with all
              integrations
            </ListItem>
          </List>
        </Card>
      </Stack>
    </Container>
  );
}
