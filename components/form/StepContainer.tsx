import { Box, Transition } from "@mantine/core";
import { ReactNode } from "react";
import { useMultiStepFormContext } from "@/contexts/MultiStepFormContext";

interface StepContainerProps {
  children: ReactNode;
  minHeight?: number;
}

export function StepContainer({ children }: StepContainerProps) {
  const { direction } = useMultiStepFormContext();

  return (
    <Box style={{ position: "relative", minHeight: 300 }}>
      <Transition
        mounted={true}
        transition={direction === "forward" ? "slide-left" : "slide-right"}
        duration={300}
        timingFunction="ease"
      >
        {(styles) => <Box style={styles}>{children}</Box>}
      </Transition>
    </Box>
  );
}
