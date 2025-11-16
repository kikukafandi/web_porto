import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Header } from "@/components/Header";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Tirta \"Kikuk\" Afandi — Portfolio",
  description: "Personal portfolio and blog by Tirta Kikuk Afandi, Backend Engineer specializing in scalable systems and clean code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome Icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body className="font-sans text-gray-200 antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* RESPONSIVE NAVBAR */}
            <Header />

            {/* MAIN CONTENT */}
            <main className="flex-1">
              {children}
            </main>

            {/* CONDITIONAL FOOTER - Only shows on public pages */}
            <ConditionalFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}