import type { Metadata } from "next";
import { LanguageProvider } from "./ui/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petdev Codex Pets",
  description: "A playful multi-pet catalog and installer for Codex desktop pets."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
