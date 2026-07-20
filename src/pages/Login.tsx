import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { apiLogin, apiResendOtp, saveSession } from "@/lib/api";

type Step = "credentials" | "otp";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("credentials");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: send credentials → server sends OTP
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    const { error } = await apiLogin(email.trim(), password);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("OTP sent to your email!");
    setStep("otp");
  };

  // Step 2: verify OTP → navigate to dashboard
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);

    // Simulate OTP verification (replace with real API call when backend ready)
    await new Promise(res => setTimeout(res, 600));

    // Save a dummy session token for now
    saveSession({
      token: "demo_token_" + Date.now(),
      email: email.trim(),
      userId: "demo_user",
    });

    setLoading(false);
    toast.success("Welcome back!");

    // Redirect admin emails to admin dashboard
    if (email.trim().includes("admin")) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    const { error } = await apiResendOtp(email.trim());
    setResending(false);
    if (error) toast.error(error);
    else toast.success("OTP resent to your email.");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="container py-6"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 shadow-elevated">

          {step === "credentials" ? (
            <>
              <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Log in to your SocialFlow Pro workspace.
              </p>
              <form onSubmit={handleCredentials} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Continue
                </Button>
              </form>
              <p className="text-sm text-center mt-6 text-muted-foreground">
                New here?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MailCheck className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-1 text-center">Check your email</h1>
              <p className="text-sm text-muted-foreground mb-1 text-center">
                We sent a 6-digit OTP to
              </p>
              <p className="text-sm font-medium text-center mb-6">{email}</p>

              <form onSubmit={handleOtp} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify & Log in
                </Button>
              </form>

              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  {resending ? "Resending…" : "Resend OTP"}
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => { setStep("credentials"); setOtp(""); }}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  ← Change email / password
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
