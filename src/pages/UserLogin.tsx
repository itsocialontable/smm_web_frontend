import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import { saveSession, BASE_URL } from "@/lib/api";
import { Eye, EyeOff} from "lucide-react";

type UserRole = "SMM" | "Graphic Designer" | "Client";

const API_KEY =
  import.meta.env.VITE_API_KEY || "sf_live_a7k92mXpQ3nR8vTz5wYdJ6bLcU1eHi4o";

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("SMM");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);

    try {
     const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        const msg = json?.message || json?.msg || json?.error || `Login failed (${res.status})`;
        toast.error(msg);
        setLoading(false);
        return;
      }

      // Backend response: { success, token, data: { user } }
      const token: string = json?.token || json?.data?.token || json?.data?.user?.token;
      const user = json?.data?.user || json?.data || json?.user || {};
      const userName: string = user?.name || user?.email || email.trim();
      const userId: string = user?._id || user?.id || "";

      if (!token) {
        toast.error("Token nahi mila — backend response check karo");
        setLoading(false);
        return;
      }

      // Save proper session with real token
      saveSession({ token, email: email.trim(), userId });
      localStorage.setItem("socialflow_role", role);
      localStorage.setItem("socialflow_user_name", userName);

      setLoading(false);
      toast.success(`Welcome, ${userName}!`);

      if (role === "Client") navigate("/client-dashboard");
      else if (role === "SMM") navigate("/smm-dashboard");
      else navigate("/gd-dashboard");

    } catch (err) {
      toast.error("Network error — backend se connect nahi ho pa raha");
      setLoading(false);
    }
  };

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: "Client", label: "Client" },
    { value: "SMM", label: "SMM Executive" },
    { value: "Graphic Designer", label: "Graphic Designer" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">User Login</h1>
          <p className="text-slate-400 text-sm text-center mb-6">
            Login with credentials provided by Admin
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm">Email Address</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400"
              />
            </div>



<div>
  <Label className="text-slate-300 text-sm">Password</Label>

  <div className="relative mt-1">
    <Input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-blue-400 pr-10"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      {showPassword ? (
        <Eye size={18} />
      ) : (
        <EyeOff size={18} />
      )}
    </button>
  </div>
</div>
            <div>
              <Label className="text-slate-300 text-sm">Select Your Role</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      role === opt.value
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* <p className="text-xs text-center mt-5 text-white">
            Your login credentials are provided by your Admin. Contact them if you don't have access.
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
