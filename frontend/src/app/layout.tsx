import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Proveedores } from "@/components/proveedores";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: "Origen", template: "%s · Origen" },
  description: "Cada lote de alimentos con su historia, firmada por quien lo movió.",
};

export const viewport: Viewport = {
  themeColor: "#f2f4ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}>
      <body>
        <Proveedores>{children}</Proveedores>
      </body>
    </html>
  );
}
