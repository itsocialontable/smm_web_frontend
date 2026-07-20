import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users } from "lucide-react";

const Landing = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "user">("admin");
  const navigate = useNavigate();

  return (
    <div className="mainpage min-h-screen bg-gradient-to-br flex flex-col items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        {/* <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <Logo />
          </div>
        </div> */}

        <div className="text-center mb-8">
          <h1 className="welcome text-white mb-2">Welcome to GC360</h1>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex bg-white/10 rounded-xl p-1 mb-6 gap-1">
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "admin"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === "user"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              User
            </button>
          </div>

          {activeTab === "admin" ? (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-400/30">
                  <ShieldCheck className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">Admin Portal</h2>
                <p className="text-white text-xs mt-1">Manage clients, teams, and workspace settings</p>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold"
                onClick={() => navigate("/admin-login")}
              >
                Admin Login
              </Button>
              <p className="text-center text-white text-xs text-slate-500 py-2">
                Credentials are provided by your system administrator
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">User Portal</h2>
                <p className="text-white text-xs mt-1">Login as Client, SMM Executive, or Graphic Designer</p>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                onClick={() => navigate("/user-login")}
              >
                User Login
              </Button>
              <p className="text-center text-white text-xs text-slate-500 py-2">
                Credentials are provided by your Admin
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-white pt-4">
         Powered By Growthcraft360
        </p>
      </div>
    </div>
  );
};

export default Landing;
