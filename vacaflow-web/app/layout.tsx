import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VacaFlow",
  description: "Absence request management for IGS Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full">{children}</body>
    </html>
  );
}
