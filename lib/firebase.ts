import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, Auth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC2SYuBMzIswEewxwoepOWYTk6SPTtdqvE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "orienco-rapid-delivery.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "orienco-rapid-delivery",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "orienco-rapid-delivery.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1027953631944",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1027953631944:web:4ca65774439f5dc519fbfd",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BYSX5HKS81",
};

export const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApp();
  }
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY and other Firebase environment variables in .env.local."
    );
  }
  return initializeApp(firebaseConfig);
};

export const getFirebaseAuth = (): Auth => {
  return getAuth(getFirebaseApp());
};

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

const signInWithProvider = async (provider: GoogleAuthProvider | OAuthProvider) => {
  const auth = getFirebaseAuth();

  if (typeof window === "undefined") {
    return await signInWithPopup(auth, provider);
  }

  let popupRef: Window | null = null;
  const originalOpen = window.open;

  window.open = function (...args) {
    const w = originalOpen.apply(this, args);
    popupRef = w;
    return w;
  };

  try {
    const popupPromise = signInWithPopup(auth, provider);

    const watcherPromise = new Promise<never>((_, reject) => {
      let intervalId: ReturnType<typeof setInterval> | null = null;
      let focusHandler: (() => void) | null = null;

      const cleanup = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        if (focusHandler) {
          window.removeEventListener("focus", focusHandler);
          focusHandler = null;
        }
      };

      const checkClosed = () => {
        try {
          if (popupRef && popupRef.closed) {
            cleanup();
            const err: any = new Error("Popup closed by user");
            err.code = "auth/popup-closed-by-user";
            reject(err);
          }
        } catch {
          // Ignore
        }
      };

      intervalId = setInterval(checkClosed, 250);

      focusHandler = () => {
        setTimeout(checkClosed, 100);
      };
      window.addEventListener("focus", focusHandler);

      popupPromise.finally(() => {
        cleanup();
      });
    });

    return await Promise.race([popupPromise, watcherPromise]);
  } finally {
    window.open = originalOpen;
  }
};

export const signInWithGooglePopup = async () => {
  return await signInWithProvider(googleProvider);
};

export const signInWithApplePopup = async () => {
  return await signInWithProvider(appleProvider);
};

export const getFcmToken = async (): Promise<string | undefined> => {
  try {
    if (typeof window === "undefined") return undefined;
    if (!("Notification" in window)) return undefined;

    const { getMessaging, getToken, isSupported } = await import("firebase/messaging");
    const supported = await isSupported().catch(() => false);
    if (!supported) return undefined;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return undefined;

    const messaging = getMessaging(getFirebaseApp());
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const currentToken = await getToken(messaging, vapidKey ? { vapidKey } : undefined);
    return currentToken || undefined;
  } catch (error) {
    console.warn("Unable to get FCM token:", error);
    return undefined;
  }
};
