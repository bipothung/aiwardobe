import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Smart Wardrobe",
  description: "Your AI-powered virtual wardrobe and stylist",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
