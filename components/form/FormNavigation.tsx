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
        Zpět
      </Button>

      {isLastStep ? (
        <Button onClick={onSubmit} size="md" loading={isSubmitting}>
          Odeslat dotazník a doporučit prohlídky
        </Button>
      ) : (
        <Button onClick={nextStep} size="md">
          Další krok
        </Button>
      )}
    </Group>
  );
}
