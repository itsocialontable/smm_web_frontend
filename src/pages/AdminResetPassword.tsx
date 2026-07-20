import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { apiAdminResetPassword } from "@/lib/api";

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = "", otp = "" } = (location.state as { email?: string; otp?: string }) || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email || !otp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-2">Link expired</h1>
          <p className="text-slate-400 text-sm mb-6">Please start the password reset process again.</p>
          <Link to="/admin-forgot-password">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Go to Forgot Password</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }

    setLoading(true);
   const { error, data } = await apiAdminResetPassword(email, confirm, password);
    setLoading(false);

    if (error) { toast.error(error); return; }

    toast.success(data?.message || "Password reset successfully! Please log in.");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">Set New Password</h1>
          <p className="text-slate-400 text-sm text-center mb-6">
            For: <span className="text-white font-medium">{email}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm">New Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                autoComplete="new-password"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Confirm Password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
                autoComplete="new-password"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>

          <p className="text-sm text-center mt-5 text-slate-400">
            <Link to="/admin-login" className="text-purple-400 hover:underline">← Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;
