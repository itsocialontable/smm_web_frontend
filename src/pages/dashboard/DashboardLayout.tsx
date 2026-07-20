import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import {
  LayoutDashboard, PenSquare, Calendar, BarChart3,
  Users, Settings, Share2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProfilePopup from "@/components/ProfilePopup";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/compose", icon: PenSquare, label: "Create post" },
  { to: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/dashboard/accounts", icon: Share2, label: "Channels" },
  { to: "/dashboard/team", icon: Users, label: "Team" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar shrink-0">
        <div className="p-5 border-b"><Logo /></div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`
              }
            >
              <n.icon className="w-4 h-4" /> {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Profile area at bottom */}
        <div className="p-3 border-t relative">
          <button
            onClick={() => setPopupOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/60 transition text-left"
            aria-label="Open profile menu"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.email}</div>
              <div className="text-xs text-muted-foreground">Free plan</div>
            </div>
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform ${popupOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          {popupOpen && (
            <ProfilePopup onClose={() => setPopupOpen(false)} />
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
