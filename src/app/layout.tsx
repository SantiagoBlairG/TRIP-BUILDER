import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { AppShell } from "@/components/navigation/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Roam — A little room for adventure",
    template: "%s | Roam",
  },
  description:
    "A visual workspace for your next great trip. Build a route, collect ideas, and make room for adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${instrument.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
