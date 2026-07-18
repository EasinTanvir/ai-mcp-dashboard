import { Toaster } from "react-hot-toast";
import "./globals.css";
import AssistantPanel from "@/components/dashboard/AssistantPanel";

export const metadata = {
  title: "Nexa Commerce Shop",
  description: "Premium commerce dashboard UI",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />{" "}
        <div className="fixed bottom-5 right-5 z-30">
          <AssistantPanel />
        </div>
      </body>
    </html>
  );
};
export default RootLayout;
