import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase.init";

let authRestore: Promise<void> | null = null;

function waitForAuthRestore() {
  if (auth.currentUser) return Promise.resolve();

  authRestore ??= new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      unsubscribe();
      resolve();
    });
  });

  return authRestore;
}

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  await waitForAuthRestore();
  const token = await auth.currentUser?.getIdToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
