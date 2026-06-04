import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pngtostl.net"),
  title: {
    default: "PNG to STL Converter",
    template: "%s | PNG to STL Converter",
  },
  description: "PNG to STL converter for makers, hobbyists, and 3D printing workflows.",
  alternates: {
    languages: {
      en: "/",
      zh: "/zh",
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
