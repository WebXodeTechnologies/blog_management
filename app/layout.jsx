import {
  Orbitron,
  Bricolage_Grotesque,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import ToastProvider from "@/providers/toast-provider";
import QueryProvider from "@/providers/query-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Digital & Cyber Tech Headings (Only for H1, Branding & CTAs)
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// Section Headings (H2, H3, H4, H5, H6)
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Clean UI Body Sans (P, Body, Inputs, Buttons)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Code & Terminal Mono
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "TEXORA — Developer Publishing & Community SaaS",
    template: "%s | TEXORA",
  },
  description:
    "Unified multi-tenant publishing, karma discussions, and real-time developer rooms.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${bricolage.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-blue-600 selection:text-white">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <QueryProvider>
            {children}
            <ToastProvider />
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
