import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tirta Kikuk Afandi - Backend Engineer Portfolio",
  description: "Personal portfolio and blog by Tirta Kikuk Afandi, Backend Engineer specializing in scalable systems and clean code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
