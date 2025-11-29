import { MultiStepForm } from "@/components/MultiStepForm";
import { AnimatedVectors } from "@/components/AnimatedVectors";
import { Container } from "@mantine/core";

export default function AssessmentPage() {
  return (
    <Container
      style={{
        minHeight: "100vh",
        minWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-primary-color-light)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AnimatedVectors />
      <Container size="xl" py="xl">
        <MultiStepForm />
      </Container>
    </Container>
  );
}
