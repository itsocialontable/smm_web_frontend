import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Building2 } from "lucide-react";
import { z } from "zod";
import { apiRegister } from "@/lib/api";

const schema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(80),
    email: z.string().trim().email("Invalid email").max(255),
    mobileNumber: z
      .string()
      .trim()
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number too long")
      .regex(/^\+?[0-9]+$/, "Invalid mobile number"),
    password: z.string().min(8, "Password must be at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "admin";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const isAdmin = role === "admin";
  const roleLabel = isAdmin ? "Admin" : "Agency Admin";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await apiRegister(
      form.name,
      form.email,
      form.password,
      form.confirmPassword,
      form.mobileNumber,
    );
    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Account created! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="container py-6"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 shadow-elevated">
          {/* Role Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isAdmin ? "bg-gradient-hero" : "bg-gradient-to-br from-purple-500 to-pink-500"}`}>
              {isAdmin
                ? <ShieldCheck className="w-5 h-5 text-white" />
                : <Building2 className="w-5 h-5 text-white" />}
            </div>
            <div>
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                {roleLabel}
              </Badge>
              <p className="text-xs text-muted-foreground mt-0.5">Registering as {roleLabel}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Start scheduling in under 60 seconds.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                placeholder="+91XXXXXXXXXX"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat your password"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create {roleLabel} account
            </Button>
          </form>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
          <p className="text-sm text-center mt-2 text-muted-foreground">
            Wrong role?{" "}
            <Link
              to={`/register?role=${isAdmin ? "agency_admin" : "admin"}`}
              className="text-primary font-medium hover:underline"
            >
              Register as {isAdmin ? "Agency Admin" : "Admin"}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
