import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import { TopNavMenu } from "@/app/components/shared/navigation/top-nav/top-nav-menu";
//antialiased smooths out the font
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <TopNavMenu>
        {children}
        </TopNavMenu>
        </body>
    </html>
  );
}
