import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E2 Experiment Analysis Concepts",
  description:
    "A learnable guide to adjusted regression, CUPED, confidence intervals, and MLM for E2 switchback analysis.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
