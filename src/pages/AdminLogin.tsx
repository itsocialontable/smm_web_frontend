import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { apiAdminLogin, saveAdminSession } from "@/lib/api";
import { Eye, EyeOff} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);

    const { data, error } = await apiAdminLogin(email.trim(), password);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    // Save admin session — token can be at data.token or nested
    const token = (data as any)?.token || (data as any)?.accessToken || "";
    const adminInfo = (data as any)?.admin || {};
    const name = adminInfo?.name || (data as any)?.name || "Admin";
    const adminId = adminInfo?._id || adminInfo?.id || (data as any)?._id || undefined;

    if (!token) {
      toast.error("Login failed — no token received. Please try again.");
      return;
    }

    saveAdminSession({ token, email: email.trim(), name, adminId });
    localStorage.setItem("socialflow_role", "admin");

    toast.success(`Welcome back, ${name}!`);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">Admin Login</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Sign in to your admin workspace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@agency.com"
                required
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400"
              />
            </div>
          <div>
  <Label htmlFor="password" className="text-slate-300 text-sm">
    Password
  </Label>

  <div className="relative mt-1">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400 pr-10"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      {showPassword ? (
        <Eye className="w-5 h-5" />
      ) : (
        <EyeOff className="w-5 h-5" />
      )}
    </button>
  </div>
</div>

            {/* <div className="text-right">
              <Link to="/admin-forgot-password" className="text-xs text-purple-400 hover:underline">
                Forgot Password?
              </Link>
            </div> */}

            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In as Admin
            </Button>
          </form>

       
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
