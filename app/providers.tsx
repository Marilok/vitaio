"use client";

import { colorsTuple, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  /** Your theme customization here */
  primaryColor: "mou-orange",
  colors: {
    "mou-orange": colorsTuple("#f04600"),
    "mou-blue": colorsTuple("#007fc8"),
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
