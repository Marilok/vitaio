"use client";
import "dayjs/locale/cs";
import { DatesProvider } from "@mantine/dates";

import { colorsTuple, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  /** Your theme customization here */
  fonts: {
    body: "Arial, sans-serif",
    // headings: { fontFamily: "Matter, sans-serif" },
  },
  cursorType: "pointer",

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
    "mou-green": [
      "#ebfff3",
      "#d5fee6",
      "#a4fdc9",
      "#73fdaa",
      "#4ffd90",
      "#3efd7f",
      "#35fe76",
      "#2be264",
      "#1ec958",
      "#008638",
    ],
    "mou-beige": colorsTuple("#fbeabc"),
    "mou-purple": [
      "#ffe8f8",
      "#ffcfea",
      "#ff9cd1",
      "#fe65b8",
      "#fd39a2",
      "#fd1f94",
      "#fe108e",
      "#e6007c",
      "#cb006d",
      "#b2005e",
    ],
    "mou-azure": colorsTuple("#53c0d7"),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: "cs" }}>
        <Notifications />
        {children}
      </DatesProvider>
    </MantineProvider>
  );
}
