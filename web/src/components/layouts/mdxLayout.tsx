import type { Metadata } from "next";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import Sidebar from "@/components/docs/sidebar.mdx";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../../app/globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Inssman: Open-Source: Modify HTTP Request",
  description: `Browser extension to intercept HTTP(S) Request, Modify Headers, Log headers, Change Response,
  Block Request, Redirect, Custom HTML/CSS/JS/JSON`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={inter.className}>
      <div className="text-neutral-400">
        <Header />
        <div className="flex flex-row mt-16">
          <div className="w-[20%] min-h-screen pl-3 pt-5 border-r border-neutral-200/20">
            <Sidebar pathname={pathname} />
          </div>
          <main className="w-[80%] pl-3 pt-4">
            <div className="w-[70%] mx-auto">{children}</div>
          </main>
        </div>
        <Footer />
      </div>
      {/* @ts-ignore */}
      <GoogleAnalytics gtmId="G-9EJZ6QBWPD" />
    </div>
  );
}
