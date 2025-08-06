import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: 'Task Manager',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-900 text-gray-100 atialiased bg-[url(/background.png)] bg-cover bg-center bg-fixed">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
