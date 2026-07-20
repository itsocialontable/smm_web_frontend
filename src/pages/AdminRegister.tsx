import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiAdminRegister } from "@/lib/api";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
   const { data, error } = await apiAdminRegister(form.name.trim(), form.email.trim(), form.password, form.confirm);
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(data?.message || "Admin account created! Please login.");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
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
          <h1 className="text-2xl font-bold text-white text-center mb-1">Create Admin Account</h1>
          <p className="text-slate-400 text-sm text-center mb-6">Set up your admin workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-300 text-sm">Full Name</Label>
              <Input value={form.name} onChange={set("name")} placeholder="Agency Admin" required
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400" />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Email Address</Label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="admin@agency.com" required
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400" />
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Password</Label>
              <div className="relative mt-1">
                <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Min. 6 characters" required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400 pr-10" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-slate-300 text-sm">Confirm Password</Label>
              <Input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Re-enter password" required
                className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-purple-400" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold mt-2">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center mt-5 text-slate-400">
            Already have an account?{" "}
            <Link to="/admin-login" className="text-purple-400 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
