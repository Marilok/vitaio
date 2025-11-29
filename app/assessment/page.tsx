import { MultiStepFormWithVectors } from "@/components/MultiStepForm";
import { Container } from "@mantine/core";

export default function AssessmentPage() {
  return (
    <Container
      style={{
        minWidth: "100%",
        minHeight: "calc(100vh - 80px)", // Account for header height
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
