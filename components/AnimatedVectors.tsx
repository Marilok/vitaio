'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { Transition } from '@mantine/core';
import { MultiStepFormContext } from '@/contexts/MultiStepFormContext';

interface VectorPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface VectorState {
  M: VectorPosition;
  O: VectorPosition;
  U: VectorPosition;
}

// Define positions for each step (clockwise rotation)
const STEP_POSITIONS: VectorState[] = [
  // Step 0: M(top-left), O(top-right), U(bottom-right)
  {
    M: { top: -100, left: -100 },
    O: { top: -100, right: -100 },
    U: { bottom: -100, right: -100 },
  },
  // Step 1: M(top-right), O(bottom-right), U(bottom-left)
  {
    M: { top: -100, right: -100 },
    O: { bottom: -100, right: -100 },
    U: { bottom: -100, left: -100 },
  },
  // Step 2: M(bottom-right), O(bottom-left), U(top-left)
  {
    M: { bottom: -100, right: -100 },
    O: { bottom: -100, left: -100 },
    U: { top: -100, left: -100 },
  },
  // Step 3: M(bottom-left), O(top-left), U(top-right)
  {
    M: { bottom: -100, left: -100 },
    O: { top: -100, left: -100 },
    U: { top: -100, right: -100 },
  },
  // Step 4: M(top-left), O(top-right), U(bottom-right) - back to start
  {
    M: { top: -100, left: -100 },
    O: { top: -100, right: -100 },
    U: { bottom: -100, right: -100 },
  },
];

export function AnimatedVectors() {
  const context = useContext(MultiStepFormContext);
  const [currentPositions, setCurrentPositions] = useState<VectorState>(STEP_POSITIONS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!context) return;

    const { activeStep } = context;
    const targetPositions = STEP_POSITIONS[activeStep] || STEP_POSITIONS[0];
    
    // Trigger transition
    setIsTransitioning(true);
    
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setCurrentPositions(targetPositions);
      setTimeout(() => setIsTransitioning(false), 350); // Slightly longer than transition duration
    }, 50);

    return () => clearTimeout(timer);
  }, [context?.activeStep]);

  const createVectorStyle = (position: VectorPosition) => ({
    zIndex: -1,
    position: 'absolute' as const,
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    ...position,
  });

  return (
    <>
      <Image
        src="./M.svg"
        alt="Vitaio Logo M"
        width={300}
        height={300}
        className="absolute"
        style={createVectorStyle(currentPositions.M)}
      />
      <Image
        src="./O.svg"
        alt="Vitaio Logo O"
        width={300}
        height={300}
        className="absolute"
        style={createVectorStyle(currentPositions.O)}
      />
      <Image
        src="./U.svg"
        alt="Vitaio Logo U"
        width={300}
        height={300}
        className="absolute"
        style={createVectorStyle(currentPositions.U)}
      />
    </>
  );
}