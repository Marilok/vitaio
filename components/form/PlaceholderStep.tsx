import { Box, Title, Text } from "@mantine/core";

interface PlaceholderStepProps {
  stepNumber: number;
  description?: string;
  minHeight?: number;
}

export function PlaceholderStep({
  stepNumber,
  description = "obsah připravujeme...",
  minHeight = 300,
}: PlaceholderStepProps) {
  return (
    <Box style={{ minHeight }}>
      <Title order={3} mb="md">
        Krok {stepNumber}
      </Title>
      <Text c="dimmed">
        Krok {stepNumber} {description}
      </Text>
    </Box>
  );
}


