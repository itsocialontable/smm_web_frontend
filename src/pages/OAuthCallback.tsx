import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiSocialConnect } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const calledRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting your account...");

  useEffect(() => {
    const handleCallback = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        // ── TOKEN: directly localStorage se lo, useAuth() pe depend mat karo
        // useAuth() async hai — pehle render mein null hota hai
        let userToken = "";
        try {
          const raw = localStorage.getItem("sf_session");
          if (raw) {
            const parsed = JSON.parse(raw);
            userToken = parsed?.token || "";
          }
        } catch {}

        console.log("[OAuthCallback] Token from localStorage:", userToken ? userToken.substring(0, 40) + "..." : "EMPTY — localStorage mein sf_session nahi mila");

        if (!userToken) {
          setStatus("error");
          setMessage("Login session nahi mila — please login karke dobara try karo");
          toast.error("Session nahi mila — please login again");
          setTimeout(() => navigate("/user-login"), 2500);
          return;
        }

        // ── URL PARAMS
        const code         = searchParams.get("code");
        const oauthToken   = searchParams.get("oauth_token");
        const oauthVerifier = searchParams.get("oauth_verifier");
        const error        = searchParams.get("error");
        const errorDesc    = searchParams.get("error_description");
        const stateParam   = searchParams.get("state");

        // ── ERROR FROM PROVIDER
        if (error) {
          setStatus("error");
          setMessage(errorDesc || "Authorization failed");
          toast.error(errorDesc || "Authorization failed");
          setTimeout(() => navigate("/smm-dashboard", { state: { view: "channels" } }), 2000);
          return;
        }

        // ── PLATFORM DETECT
        // atob/decode use mat karo — state JWT hai, decode karne se backend reject karta hai
        let platform =
          searchParams.get("platform") ||
          localStorage.getItem("oauth_platform") ||
          "";

        localStorage.removeItem("oauth_platform");
        platform = platform.toLowerCase().trim();

        const backendPlatform = platform;

        console.log("[OAuthCallback] Platform:", platform);
        console.log("[OAuthCallback] Code:", code ? code.substring(0, 20) + "..." : "MISSING");

        if (!platform) {
          setStatus("error");
          setMessage("Platform detect nahi hua — please dobara try karo");
          toast.error("Unknown platform in callback");
          setTimeout(() => navigate("/smm-dashboard", { state: { view: "channels" } }), 2000);
          return;
        }

        if (!code && !oauthToken) {
          setStatus("error");
          setMessage("Authorization code missing");
          toast.error("Code missing in callback");
          return;
        }

        // ── BACKEND CALL
        // state: URL se jo aaya (Google ne diya) wahi sahi hai
        // agar URL mein state nahi hai to localStorage se lo (backup)
        const finalState = stateParam || localStorage.getItem("oauth_state") || "";
        localStorage.removeItem("oauth_state");

        // ✅ FIX: clientId localStorage se lo — backend pe SMM ke liye MANDATORY hai
        const oauthClientId = localStorage.getItem("oauth_client_id") || "";
        localStorage.removeItem("oauth_client_id");
        console.log("[OAuthCallback] clientId:", oauthClientId || "EMPTY");

        console.log("[OAuthCallback] platform:", platform);
        console.log("[OAuthCallback] state:", finalState ? finalState.substring(0,30)+"..." : "EMPTY");

        setMessage(`${platform} account save ho raha hai...`);

        const { data, error: apiError } = await apiSocialConnect(
          userToken,
          backendPlatform,
          code || "",
          finalState,
          oauthVerifier || undefined,
          oauthClientId || undefined   // ✅ FIX: clientId backend ko pass karo
        );

        if (apiError) {
          setStatus("error");
          const msg =
            apiError.includes("401") || apiError.toLowerCase().includes("unauthorized")
              ? "Token invalid — please logout karke dobara login karo"
              : apiError;
          setMessage(msg);
          toast.error(msg);
          setTimeout(() => navigate("/smm-dashboard", { state: { view: "channels" } }), 2500);
          return;
        }

        // ── SUCCESS
        setStatus("success");
        setMessage(data?.message || `${platform} successfully connected!`);
        toast.success(data?.message || `${platform} connected!`);
        setTimeout(() => navigate("/smm-dashboard", { state: { view: "channels" } }), 1500);

      } catch (err) {
        console.error("[OAuthCallback] Error:", err);
        setStatus("error");
        setMessage("Something went wrong — please try again");
        toast.error("OAuth callback failed");
        setTimeout(() => navigate("/smm-dashboard", { state: { view: "channels" } }), 2500);
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);   // ← empty array: sirf ek baar chale, user state pe depend mat karo

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          {status === "loading" && <Loader2 className="w-10 h-10 animate-spin text-primary" />}
          {status === "success" && <CheckCircle2 className="w-10 h-10 text-green-500" />}
          {status === "error"   && <XCircle className="w-10 h-10 text-red-500" />}
          <p className="text-sm font-medium text-center">{message}</p>
          {status !== "loading" && (
            <p className="text-xs text-muted-foreground">Redirecting...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
