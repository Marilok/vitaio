import { Button, Group } from "@mantine/core";
import { useMultiStepFormContext } from "@/contexts/MultiStepFormContext";

export function FormNavigation() {
  const {
    isFirstStep,
    isLastStep,
    prevStep,
    nextStep,
    onSubmit,
    isSubmitting,
  } = useMultiStepFormContext();

  return (
    <Group justify="space-between" mt="xl">
      <Button
        variant="default"
        onClick={prevStep}
        disabled={isFirstStep}
        size="md"
      >
        Previous
      </Button>

      {isLastStep ? (
        <Button onClick={onSubmit} size="md" loading={isSubmitting}>
          Submit Assessment
        </Button>
      ) : (
        <Button onClick={nextStep} size="md">
          Next
        </Button>
      )}
    </Group>
  );
}
