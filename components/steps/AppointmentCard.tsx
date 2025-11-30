"use client";

import React, { useCallback, useMemo } from "react";
import { Card, Checkbox, Group, Anchor, Box, Text } from "@mantine/core";
import {
  IconExternalLink,
  IconExclamationMark,
  IconStarFilled,
} from "@tabler/icons-react";
import { FormData } from "@/types/form";
import { getScreeningPrice } from "@/utils/screeningPrice";

/**
 * Appointment data structure
 */
interface AppointmentData {
  id: number;
  name: string;
  description?: string;
  type: string;
  url?: string;
  price?: number;
  category?: string;
  priority?: number;
}

/**
 * Priority thresholds for determining badge display
 */
interface PriorityThresholds {
  high: number;
  low: number;
}

/**
 * Props for the AppointmentCard component
 */
interface AppointmentCardProps {
  /** Appointment data to display */
  appointment: AppointmentData;
  /** Whether this appointment is selected */
  isSelected: boolean;
  /** Form data used for price calculations */
  formData: FormData;
  /** Callback when appointment selection is toggled */
  onToggleSelection: (appointmentId: number) => void;
  /** Priority thresholds for badge display */
  priorityThresholds: PriorityThresholds;
}

/**
 * Priority badge types
 */
type PriorityLevel = "high" | "medium" | "none";

/**
 * Badge configuration for different priority levels
 */
const PRIORITY_BADGE_CONFIG = {
  high: {
    color: "red",
    label: "Silně doporučeno",
    icon: IconExclamationMark,
  },
  medium: {
    color: "orange",
    label: "Doporučeno",
    icon: IconStarFilled,
  },
} as const;

/**
 * Determines priority level based on priority value and thresholds
 */
function getPriorityLevel(
  priority: number,
  thresholds: PriorityThresholds
): PriorityLevel {
  if (priority >= thresholds.high) return "high";
  if (priority >= thresholds.low) return "medium";
  return "none";
}

/**
 * Gets border color based on selection state and priority
 */
function getBorderColor(
  isSelected: boolean,
  priorityLevel: PriorityLevel
): string {
  if (isSelected) {
    switch (priorityLevel) {
      case "high":
        return "var(--mantine-color-red-6)";
      case "medium":
        return "var(--mantine-color-mou-orange-6)";
      default:
        return "var(--mantine-primary-color-filled)";
    }
  }

  // For non-selected cards, use lighter border to not compete with left badge
  switch (priorityLevel) {
    case "high":
      return "var(--mantine-color-red-2)";
    case "medium":
      return "var(--mantine-color-mou-orange-2)";
    default:
      return "var(--mantine-color-gray-3)";
  }
}

/**
 * Gets background color based on selection state and priority
 */
function getBackgroundColor(
  isSelected: boolean,
  priorityLevel: PriorityLevel
): string {
  if (!isSelected) return "white";

  switch (priorityLevel) {
    case "high":
      return "var(--mantine-color-red-0)";
    case "medium":
      return "var(--mantine-color-mou-orange-0)";
    default:
      return "var(--mantine-primary-color-light)";
  }
}

/**
 * Priority badge component
 */
interface PriorityBadgeProps {
  priorityLevel: PriorityLevel;
}

function PriorityBadge({ priorityLevel }: PriorityBadgeProps) {
  if (priorityLevel === "none") {
    return null;
  }

  const config = PRIORITY_BADGE_CONFIG[priorityLevel];
  const IconComponent = config.icon;

  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: 0,
        bottom: 0,
        width: "24px",
        backgroundColor: `var(--mantine-color-${config.color}-6)`,
        zIndex: 1,
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
          whiteSpace: "nowrap",
          transformOrigin: "center",
          width: "max-content",
        }}
      >
        <Group gap={4} align="center">
          <IconComponent size={12} color="white" />
          <Text
            size="xs"
            fw={600}
            c="white"
            style={{
              fontSize: "10px",
              letterSpacing: "0.5px",
            }}
          >
            {config.label.toUpperCase()}
          </Text>
        </Group>
      </Box>
    </Box>
  );
}

/**
 * Price display component
 */
interface PriceDisplayProps {
  appointment: AppointmentData;
  formData: FormData;
}

function PriceDisplay({ appointment, formData }: PriceDisplayProps) {
  const screeningPrice = useMemo(
    () => getScreeningPrice(appointment.id, formData),
    [appointment.id, formData]
  );

  if (screeningPrice.isFree) {
    return (
      <Text size="lg" fw={700} c="green">
        ZDARMA
      </Text>
    );
  }

  if (appointment.price) {
    return (
      <Text size="lg" fw={600} c="blue">
        {appointment.price.toLocaleString("cs-CZ")} Kč
      </Text>
    );
  }

  return null;
}

/**
 * AppointmentCard component for displaying appointment information with selection capability
 */
export function AppointmentCard({
  appointment,
  isSelected,
  formData,
  onToggleSelection,
  priorityThresholds,
}: AppointmentCardProps) {
  const priority = appointment.priority ?? 0;

  const priorityLevel = useMemo(
    () => getPriorityLevel(priority, priorityThresholds),
    [priority, priorityThresholds]
  );

  const borderColor = useMemo(
    () => getBorderColor(isSelected, priorityLevel),
    [isSelected, priorityLevel]
  );

  const backgroundColor = useMemo(
    () => getBackgroundColor(isSelected, priorityLevel),
    [isSelected, priorityLevel]
  );

  const handleCardClick = useCallback(() => {
    onToggleSelection(appointment.id);
  }, [onToggleSelection, appointment.id]);

  const handleCheckboxClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const handleCheckboxChange = useCallback(() => {
    onToggleSelection(appointment.id);
  }, [onToggleSelection, appointment.id]);

  const handleAnchorClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return (
    <Card
      shadow="sm"
      padding="0"
      radius="md"
      withBorder
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderColor,
        borderWidth: 2,
        backgroundColor,
        position: "relative",
        width: "100%",
        minWidth: "280px",
        flex: "1 1 300px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onClick={handleCardClick}
    >
      <PriorityBadge priorityLevel={priorityLevel} />

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingLeft: priorityLevel !== "none" ? "36px" : "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <Group justify="space-between" align="flex-start" mb="0">
          <Box style={{ flex: 1 }}>
            <Text fw={700} size="md" mb="xs" style={{ marginTop: "4px" }}>
              {appointment.name}
            </Text>
          </Box>

          <Checkbox
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
            size="md"
          />
        </Group>

        {(() => {
          const screeningPrice = getScreeningPrice(appointment.id, formData);
          const description = appointment.description || "";
          const reason = screeningPrice.isFree ? screeningPrice.reason : "";

          // Combine description and reason if both exist
          let fullDescription = "";
          if (description && reason) {
            // Remove trailing period from description if it exists, then add reason
            const cleanDescription = description.replace(/\.$/, "");
            const cleanReason = reason.replace(/\.$/, "");
            fullDescription = `${cleanDescription}. ${cleanReason}.`;
          } else if (reason) {
            // Only reason exists
            const cleanReason = reason.replace(/\.$/, "");
            fullDescription = `${cleanReason}.`;
          } else if (description) {
            // Only description exists
            fullDescription = description;
          }

          return fullDescription ? (
            <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.4 }}>
              {fullDescription}
            </Text>
          ) : null;
        })()}

        <Box
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            {appointment.url ? (
              <Anchor
                href={appointment.url}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                onClick={handleAnchorClick}
              >
                <Group gap="xs" align="center">
                  <Text size="sm">Dozvědět se více</Text>
                  <IconExternalLink size={14} />
                </Group>
              </Anchor>
            ) : (
              <Box style={{ height: "20px" }} /> // Placeholder for consistent spacing
            )}
          </Box>

          <Box style={{ textAlign: "right" }}>
            <PriceDisplay appointment={appointment} formData={formData} />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
