import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zarco - E-commerce Moderno",
  description:
    "Sua nova experiência em compras online. Descubra produtos incríveis com os melhores preços no Zarco.",
  keywords: [
    "e-commerce",
    "compras online",
    "produtos",
    "zarco",
    "loja virtual",
  ],
  authors: [{ name: "Zarco Team" }],
  creator: "Zarco",
  publisher: "Zarco",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://zarco.com",
    title: "Zarco - E-commerce Moderno",
    description:
      "Sua nova experiência em compras online. Descubra produtos incríveis com os melhores preços.",
    siteName: "Zarco",
    images: [
      {
        url: "/zarcologo.png",
        width: 1200,
        height: 630,
        alt: "Zarco Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zarco - E-commerce Moderno",
    description:
      "Sua nova experiência em compras online. Descubra produtos incríveis com os melhores preços.",
    images: ["/zarcologo.png"],
  },
  icons: {
    icon: [
      {
        url: "/zarcologo.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/zarcologo.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/zarcologo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/zarcologo.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/zarcologo.png" />
        <link rel="apple-touch-icon" href="/zarcologo.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/zarcologo.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
