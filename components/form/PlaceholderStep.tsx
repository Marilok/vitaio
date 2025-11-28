import { Box, Title, Text } from "@mantine/core";

interface PlaceholderStepProps {
  stepNumber: number;
  description?: string;
  minHeight?: number;
}

export function PlaceholderStep({
  stepNumber,
  description = "content coming soon...",
  minHeight = 300,
}: PlaceholderStepProps) {
  return (
    <Box style={{ minHeight }}>
      <Title order={3} mb="md">
        Step {stepNumber}
      </Title>
      <Text c="dimmed">
        Step {stepNumber} {description}
      </Text>
    </Box>
  );
}

