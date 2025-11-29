import { MultiStepFormWithVectors } from "@/components/MultiStepForm";
import { Container } from "@mantine/core";

export default function AssessmentPage() {
  return (
    <Container
      style={{
        minWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MultiStepFormWithVectors />
    </Container>
  );
}
