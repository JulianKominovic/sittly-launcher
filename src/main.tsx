import App from "./App";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container as HTMLElement); // createRoot(container!) if you use TypeScript
root.render(<App />);
