// Custom auth hook — uses our own backend, NOT Supabase auth
import { useState, useEffect, useCallback } from "react";
import { getSession, clearSession, type AppSession } from "./api";

export function useAuth() {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  return {
    session,
    user: session
      ? { email: session.email, id: session.userId, token: session.token }
      : null,
    loading,
    signOut,
    refreshSession,
  };
}
