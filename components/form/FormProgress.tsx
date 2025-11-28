import { Box, Group, Title, Text, Progress } from "@mantine/core";
import { useMultiStepFormContext } from "@/contexts/MultiStepFormContext";

interface FormProgressProps {
  title?: string;
}

export function FormProgress({
  title = "Health Assessment",
}: FormProgressProps) {
  const { activeStep, totalSteps } = useMultiStepFormContext();
  const progress = ((activeStep + 1) / totalSteps) * 100;

  return (
    <Box>
      <Group justify="space-between" mb="xs">
        <Title order={2}>{title}</Title>
        <Text size="sm" c="dimmed" fw={500}>
          Step {activeStep + 1} of {totalSteps}
        </Text>
      </Group>
      <Progress value={progress} size="sm" radius="xl" />
    </Box>
  );
}

