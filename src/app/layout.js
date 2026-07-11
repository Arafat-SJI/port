import { Inter, JetBrains_Mono } from "next/font/google";
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-ui-theme="default"
      data-font-pack="inter"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=document.documentElement,k=["portfolio-extensions-v5","portfolio-extensions-v4","portfolio-extensions-v3","portfolio-extensions-v2"],r=null;for(var i=0;i<k.length;i++){r=localStorage.getItem(k[i]);if(r)break;}if(!r){h.dataset.uiTheme="default";h.dataset.fontPack="inter";return;}var s=JSON.parse(r),t="default";if(s.activeThemeSource==="macintosh-theme"){t="macos";h.dataset.macVariant=s.macVariant||"sonoma";h.dataset.glassUi="true";h.dataset.macWallpaper="true";}else if(s.activeThemeSource==="theme-pack"){t=s.packTheme||"default";}h.dataset.uiTheme=t;h.dataset.fontPack=s.activeTypography?s.fontPack||"inter":"inter";}catch(e){}})();`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-on-background selection:bg-primary selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
