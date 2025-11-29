"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { MultiStepFormContext } from "@/contexts/MultiStepFormContext";

interface VectorTransform {
  x: number;
  y: number;
}

interface VectorState {
  M: VectorTransform;
  O: VectorTransform;
  U: VectorTransform;
}

// Define positions and colors for each step (clockwise rotation)
// Color cycle: orange -> blue -> green -> pink -> orange
// Step 0: M(top-left), O(top-right), U(bottom-right)
// Step 1: M(top-right), O(bottom-right), U(bottom-left)
// Step 2: M(bottom-right), O(bottom-left), U(top-left)
// Step 3: M(bottom-left), O(top-left), U(top-right)
// Step 4: Back to start

interface VectorColors {
  M: string;
  O: string;
  U: string;
}

const STEP_POSITIONS: VectorState[] = [
  // Step 0
  { M: { x: -45, y: -45 }, O: { x: 45, y: -45 }, U: { x: 45, y: 45 } },
  // Step 1
  { M: { x: 45, y: -45 }, O: { x: 45, y: 45 }, U: { x: -45, y: 45 } },
  // Step 2
  { M: { x: 45, y: 45 }, O: { x: -45, y: 45 }, U: { x: -45, y: -45 } },
  // Step 3
  { M: { x: -45, y: 45 }, O: { x: -45, y: -45 }, U: { x: 45, y: -45 } },
  // Step 4
  { M: { x: -45, y: -45 }, O: { x: 45, y: -45 }, U: { x: 45, y: 45 } },
];

const STEP_COLORS: VectorColors[] = [
  // Step 0: orange
  { M: "hue-rotate(0deg)", O: "hue-rotate(0deg)", U: "hue-rotate(0deg)" },
  // Step 1: blue
  { M: "hue-rotate(200deg)", O: "hue-rotate(200deg)", U: "hue-rotate(200deg)" },
  // Step 2: green
  { M: "hue-rotate(120deg)", O: "hue-rotate(120deg)", U: "hue-rotate(120deg)" },
  // Step 3: pink
  { M: "hue-rotate(320deg)", O: "hue-rotate(320deg)", U: "hue-rotate(320deg)" },
  // Step 4: back to orange
  { M: "hue-rotate(0deg)", O: "hue-rotate(0deg)", U: "hue-rotate(0deg)" },
];

// Background colors to match vector colors
const BACKGROUND_COLORS = [
  "#FFF5F0", // Light orange
  "#F0F5FF", // Light blue
  "#F0FFF5", // Light green
  "#ffe8f8", // Light pink
  "#FFF5F0", // Back to light orange
];

export function AnimatedVectors() {
  const context = useContext(MultiStepFormContext);
  const [currentPositions, setCurrentPositions] = useState<VectorState>(
    STEP_POSITIONS[0]
  );
  const [currentColors, setCurrentColors] = useState<VectorColors>(
    STEP_COLORS[0]
  );

  // Get activeStep from context if available, otherwise default to 0
  const activeStep = context?.activeStep ?? 0;

  useEffect(() => {
    const targetPositions = STEP_POSITIONS[activeStep] || STEP_POSITIONS[0];
    const targetColors = STEP_COLORS[activeStep] || STEP_COLORS[0];
    const targetBackgroundColor =
      BACKGROUND_COLORS[activeStep] || BACKGROUND_COLORS[0];

    setCurrentPositions(targetPositions);
    setCurrentColors(targetColors);

    // Update the page background color with smooth transition
    document.body.style.transition =
      "background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    document.body.style.backgroundColor = targetBackgroundColor;
  }, [activeStep]);

  // Cleanup: Reset to original background when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.transition = "";
    };
  }, []);

  const createVectorStyle = (transform: VectorTransform, filter: string) => ({
    zIndex: -1,
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    marginLeft: "-150px",
    marginTop: "-150px",
    transform: `translate(calc(${transform.x}vw), calc(${transform.y}vh))`,
    filter: filter,
    transition:
      "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  });

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <Image
        src="./M.svg"
        alt="Vitaio Logo M"
        width={300}
        height={300}
        style={createVectorStyle(currentPositions.M, currentColors.M)}
      />
      <Image
        src="./O.svg"
        alt="Vitaio Logo O"
        width={300}
        height={300}
        style={createVectorStyle(currentPositions.O, currentColors.O)}
      />
      <Image
        src="./U.svg"
        alt="Vitaio Logo U"
        width={300}
        height={300}
        style={createVectorStyle(currentPositions.U, currentColors.U)}
      />
    </div>
  );
}
