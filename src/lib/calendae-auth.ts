import { useEffect, useRef, useState } from "react";
import { useCurrentUserState, type AppUser } from "@/lib/auth/use-current-user";

const OFF_KEY = "calendae-login-off";

export function calendaeLoginOff() {
  try {
    return localStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
}

export function setCalendaeLoginOff(off: boolean) {
  try {
    if (off) localStorage.setItem(OFF_KEY, "1");
    else localStorage.removeItem(OFF_KEY);
    window.dispatchEvent(new Event("calendae-login"));
  } catch {
    /* ignore */
  }
}

function isGateUser(user: AppUser | null) {
  if (!user) return false;
  const email = (user.primaryEmail ?? "").toLowerCase();
  const name = (user.displayName ?? "").toLowerCase();
  return email.includes("grok") || name.includes("grok") || user.id === "preview-user";
}

export function useCalendaeSession() {
  const { user, isPending } = useCurrentUserState();
  const [off, setOff] = useState(false);
  const stable = useRef<AppUser | null>(null);

  useEffect(() => {
    setOff(calendaeLoginOff());
    const sync = () => setOff(calendaeLoginOff());
    window.addEventListener("calendae-login", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("calendae-login", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const signedIn = Boolean(user) && !off && !isGateUser(user);
  if (signedIn && user) {
    if (!stable.current || stable.current.id !== user.id) stable.current = user;
  } else if (!isPending) {
    stable.current = null;
  }

  return {
    user: stable.current,
    isPending: isPending && !stable.current,
    signedIn: Boolean(stable.current),
  };
}
