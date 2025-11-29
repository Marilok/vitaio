import type { Metadata } from "next";
import { ColorSchemeScript } from "@mantine/core";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preventee | MOU",
  description:
    "Přes Preventee získáte personalizovaný návrh preventivních vyšetření a objednáte se jednoduše, rychle a online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ColorSchemeScript defaultColorScheme="light" />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
