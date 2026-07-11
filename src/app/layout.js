import { Toaster } from "react-hot-toast";
import "./globals.css";
export const metadata = {
  title: "Nexa - Commerce Intelligence",
  description: "Premium commerce dashboard UI",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
