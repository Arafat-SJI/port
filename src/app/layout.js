import { Inter, JetBrains_Mono } from "next/font/google";
import ThemeBootScript from "@/components/ThemeBootScript";
import { readUiExtensionsFromSupabase } from "@/lib/uiExtensionsServer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "arafat.workspace",
  description:
    "Arafat — Software Engineer building high-performance AI-driven experiences and scalable backend architectures.",
};

export default async function RootLayout({ children }) {
  const siteDefaults = await readUiExtensionsFromSupabase();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-ui-theme="default"
      data-font-pack="inter"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-on-background selection:bg-primary selection:text-on-primary">
        <ThemeBootScript siteDefaults={siteDefaults} />
        {children}
      </body>
    </html>
  );
}
