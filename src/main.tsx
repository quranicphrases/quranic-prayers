import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { LanguageProvider } from "./contexts/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <Suspense
        fallback={
          <div className="app-layout">
            <div className="main-content">
              <header className="app-header">
                <h1>Quranic Prayers</h1>
                <p className="subtitle">Loading prayers…</p>
              </header>
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </LanguageProvider>
  </StrictMode>,
);
/**
 * TODO: data json files
 *  verify word by word translations
 *  reuse word by word texts to create normal text to reduce file size
 *  duplcate prayers (45 & 47)
 *  improve description with help of reflections and tafsir from quran.com
 *  remove non prayer texts from the verses
 *  remove unused fields from the data json file
 * TODO: for seo generate and add relevant keywords from data json file
 */