import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RX Context Guard",
  description: "Protective boundary workspace for AI-assisted project work",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
