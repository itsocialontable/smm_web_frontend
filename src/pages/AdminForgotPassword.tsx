import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldCheck, MailCheck, ArrowLeft } from "lucide-react";
import { apiAdminSendResetOtp, apiAdminVerifyResetOtp, apiAdminResendResetOtp } from "@/lib/api";

type Step = "email" | "otp";

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await apiAdminSendResetOtp(email.trim());
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Reset OTP sent to your email!");
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    const { error } = await apiAdminVerifyResetOtp(email.trim(), otp.trim());
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("OTP verified! Set your new password.");
    navigate("/admin-reset-password", { state: { email: email.trim(), otp: otp.trim() } });
  };

  const handleResend = async () => {
    setResending(true);
    const { error } = await apiAdminResendResetOtp(email.trim());
    setResending(false);
    if (error) toast.error(error);
    else toast.success("OTP resent to your email.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => navigate("/admin-login")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          {step === "email" ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                  <ShieldCheck className="w-7 h-7 text-purple-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-1">Reset Admin Password</h1>
              <p className="text-slate-400 text-sm text-center mb-6">Enter your email and we'll send a reset OTP.</p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm">Email Address</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@agency.com"
                    required
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send OTP
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                  <MailCheck className="w-7 h-7 text-purple-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-1">Enter OTP</h1>
              <p className="text-slate-400 text-sm text-center mb-1">OTP sent to</p>
              <p className="text-white text-sm font-semibold text-center mb-6">{email}</p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm">Reset OTP</Label>
                  <Input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400 text-center text-lg tracking-widest"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Verify OTP
                </Button>
              </form>

              <div className="mt-4 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-purple-400 hover:underline disabled:opacity-50"
                >
                  {resending ? "Resending…" : "Resend OTP"}
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); }}
                  className="text-xs text-slate-400 hover:underline"
                >
                  ← Change email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
