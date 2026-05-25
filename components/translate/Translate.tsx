"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __gtReady?: boolean;
    __applyTranslate?: (lang: string) => void;
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  // Patch DOM methods to handle NotFoundError from Google Translate conflicts
  useEffect(() => {
    const origRemove = Node.prototype.removeChild;
    const origAppend = Node.prototype.appendChild;
    const origInsert = Node.prototype.insertBefore;

    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      try {
        return origRemove.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.appendChild = function <T extends Node>(child: T): T {
      try {
        return origAppend.call(this, child) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return child;
        throw e;
      }
    };

    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      ref: Node | null,
    ): T {
      try {
        return origInsert.call(this, newNode, ref) as T;
      } catch (e: any) {
        if (e.name === "NotFoundError") return newNode;
        throw e;
      }
    };
    // No cleanup needed — safe to leave patched
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    // Create container if needed
    let container = document.getElementById("google-translate-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "google-translate-container";
      document.body.insertBefore(container, document.body.firstChild);
    }

    // Skip if script already loaded
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      try {
        if (!window.google?.translate?.TranslateElement) return;
        const target = document.getElementById("google_translate_element");
        if (!target) return;
        target.innerHTML = "";
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr",
            autoDisplay: false,
          },
          "google_translate_element",
        );
        window.__gtReady = true;
        console.log("Google Translate initialized");
      } catch (error) {
        console.debug("[Google Translate] Initialization error", error);
      }
    };

    window.__applyTranslate = (targetLang: string) => {
      console.log(`[Google Translate] Switching to: ${targetLang}`);
      const setCookie = (lang: string) => {
        const domain = window.location.hostname.split(".").slice(-2).join(".");
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        const expires = date.toUTCString();
        document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; SameSite=Lax`;
        if (domain.includes(".")) {
          document.cookie = `googtrans=/en/${lang}; expires=${expires}; path=/; domain=.${domain}; SameSite=Lax`;
        }
      };
      setCookie(targetLang);

      const tryChange = () => {
        const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (combo) {
          if (combo.value !== targetLang) {
            console.log("[Google Translate] Setting value and triggering change...");
            combo.value = targetLang;
            combo.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return true;
        }
        return false;
      };

      // Persistent retry
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const found = tryChange();
        if ((found && attempts > 5) || attempts > 20) {
          clearInterval(interval);
          if (attempts > 20 && !found) {
            console.warn("[Google Translate] Failed to find widget after 20 attempts");
          }
        }
      }, 300);
    };

    // Ensure default language cookie is set to French before script loads
    if (!document.cookie.includes("googtrans=")) {
      const domain = window.location.hostname.split(".").slice(-2).join(".");
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      const expires = date.toUTCString();
      document.cookie = `googtrans=/en/fr; expires=${expires}; path=/; SameSite=Lax`;
      if (domain.includes(".")) {
        document.cookie = `googtrans=/en/fr; expires=${expires}; path=/; domain=.${domain}; SameSite=Lax`;
      }
    }

    // Load the script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} className="notranslate" />
      <style dangerouslySetInnerHTML={{
        __html: `
                /* Hide Google Translate Banner and Header */
                iframe.goog-te-banner-frame,
                .goog-te-banner-frame,
                .goog-te-banner,
                iframe.goog-te-banner-frame.skiptranslate {
                    display: none !important;
                    visibility: hidden !important;
                }

                html {
                    top: 0px !important;
                    border-top: 0px none !important;
                    padding-top: 0px !important;
                }

                body {
                    top: 0px !important;
                    padding-top: 0px !important;
                    margin-top: 0px !important;
                }

                /* Hide Google Translate Tooltip / Balloon Popups */
                .goog-te-balloon-frame,
                #goog-gt-tt,
                #goog-gt-tt.goog-tooltip,
                .goog-tooltip,
                .goog-tooltip:hover {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }

                /* Disable Google Translate hover highlight style */
                .goog-text-highlight {
                    background-color: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    pointer-events: none !important;
                }

                /* Hide reCAPTCHA badge and potential overlays */
                .grecaptcha-badge,
                div.grecaptcha-logo,
                iframe[title*="reCAPTCHA"],
                div[style*="visibility: visible"][style*="z-index: 2000000000"],
                div[style*="visibility: visible"][style*="z-index: 2147483647"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `}} />
    </>
  );
}
