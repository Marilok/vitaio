"use client";

import { colorsTuple, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  /** Your theme customization here */
  fonts: {
    body: "Arial, sans-serif",
    // headings: { fontFamily: "Matter, sans-serif" },
  },
  primaryColor: "mou-orange",
  secondaryColor: "mou-blue",
  colors: {
    "mou-orange": colorsTuple("#f04600"),
    "mou-blue": [
      "#e5f9ff",
      "#d0eeff",
      "#9fdafd",
      "#6dc6fb",
      "#47b5fa",
      "#34aafa",
      "#27a5fb",
      "#1990e0",
      "#007fc8",
      "#006fb2",
    ],
    "mou-yellow": colorsTuple("#ffd500"),
    "mou-green": colorsTuple("#008638"),
    "mou-beige": colorsTuple("#fbeabc"),
    "mou-purple": colorsTuple("#e6007c"),
    "mou-azure": colorsTuple("#53c0d7"),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );
}
