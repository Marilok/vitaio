import { MultiStepForm } from "@/components/MultiStepForm";
import { Container } from "@mantine/core";

export default function AssessmentPage() {
  return (
    <Container
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-primary-color-light)",
      }}
    >
      <Container size="xl" py="xl">
        <MultiStepForm />
      </Container>
    </Container>
  );
}
