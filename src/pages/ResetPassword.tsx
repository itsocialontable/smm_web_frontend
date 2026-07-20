import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { apiResetPassword } from "@/lib/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // email and otp come from ForgotPassword page via navigate state
  const { email = "", otp = "" } = (location.state as { email?: string; otp?: string }) || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  // Guard: if someone lands here without proper state, send them back
  if (!email || !otp) {
    return (
      <div className="min-h-screen bg-gradient-soft flex flex-col">
        <div className="container py-6"><Logo /></div>
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md p-8 shadow-elevated text-center">
            <h1 className="text-2xl font-bold mb-2">Link expired</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Please start the password reset process again.
            </p>
            <Link to="/forgot-password">
              <Button className="w-full">Go to Forgot Password</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await apiResetPassword(email, password, confirm);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Password reset successfully! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="container py-6"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 shadow-elevated">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1 text-center">Set new password</h1>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            For account: <span className="font-medium text-foreground">{email}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Letters, numbers, symbols — all allowed.
              </p>
            </div>
            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset password
            </Button>
          </form>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              ← Back to login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
