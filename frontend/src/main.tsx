import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
				<Toaster position="top-right" toastOptions={{ style: { background: "#0f172a", color: "#fef3c7", border: "1px solid rgba(251,191,36,0.2)" } }} />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
