import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Mona_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepWise",
  description: "An AI powered interview preparation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} antialiased pattern`}
      >
        {children}
      </body>
    </html>
  );
}
