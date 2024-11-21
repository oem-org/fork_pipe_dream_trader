import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { ReactQueryClientProvider } from '@/app/components/react-query-client-provider'
//antialiased smooths out the font
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
