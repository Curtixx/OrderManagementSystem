import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/nav-bar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sitema de Pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <NavBar />
        <div className="min-h-screen w-full">
          <div className="flex flex-col">
            <main className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </main>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
