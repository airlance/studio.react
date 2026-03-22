import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureGoogleFontsLoaded } from "@/config/email-fonts";

ensureGoogleFontsLoaded();

createRoot(document.getElementById("root")!).render(<App />);
