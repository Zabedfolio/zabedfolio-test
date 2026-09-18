import { GeistMono, GeistSans } from "geist/font";
import { Pacifico } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico"
});

export const metadata = {
  metadataBase: new URL("https://zabedfolio.vercel.app"),
  title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
  description:
    "Portfolio of Zabed Mahmud, a frontend developer building Next.js experiences with sharp interaction design and production-ready execution.",
  keywords: ["frontend developer", "react", "nextjs", "portfolio", "bangladesh"],
  openGraph: {
    title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js, Tailwind CSS, Framer Motion, and Radix UI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js and Framer Motion."
  },
  robots: "index, follow"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${pacifico.variable}`}
    >
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}