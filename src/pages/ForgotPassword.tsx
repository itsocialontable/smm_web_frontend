import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { apiForgotPassword, apiVerifyResetOtp, apiResendResetOtp } from "@/lib/api";

type Step = "email" | "otp";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Step 1: send reset OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await apiForgotPassword(email.trim());
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Reset OTP sent to your email!");
    setStep("otp");
  };

  // Step 2: verify OTP → go to reset password page (carry email + otp)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    const { error } = await apiVerifyResetOtp(email.trim(), otp.trim());
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("OTP verified! Set your new password.");
    // Pass email + otp to reset page via state so it can call /reset-password
    navigate("/reset-password", { state: { email: email.trim(), otp: otp.trim() } });
  };

  const handleResend = async () => {
    setResending(true);
    const { error } = await apiResendResetOtp(email.trim());
    setResending(false);
    if (error) toast.error(error);
    else toast.success("OTP resent to your email.");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="container py-6"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 shadow-elevated">

          {step === "email" ? (
            <>
              <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send a reset OTP.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send OTP
                </Button>
              </form>
              <p className="text-sm text-center mt-6 text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  ← Back to login
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
              <h1 className="text-2xl font-bold mb-1 text-center">Enter reset OTP</h1>
              <p className="text-sm text-muted-foreground mb-1 text-center">
                OTP sent to
              </p>
              <p className="text-sm font-medium text-center mb-6">{email}</p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Reset OTP</Label>
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
                  Verify OTP
                </Button>
              </form>

              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  {resending ? "Resending…" : "Resend OTP"}
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); }}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  ← Change email
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
