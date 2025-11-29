"use client";

import { Box, Container, Group } from "@mantine/core";
import Image from "next/image";

export function Header() {
  return (
    <Box
      component="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderBottom: "1px solid var(--mantine-color-gray-3)",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container size="xl" style={{ height: "80px" }}>
        <Group h="100%" justify="space-between" align="center">
          <Image
            src="/logo.png"
            alt="MOU Logo"
            width={120}
            height={50}
            priority
            style={{
              objectFit: "contain",
            }}
          />
        </Group>
      </Container>
    </Box>
  );
}
