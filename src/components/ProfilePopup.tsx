import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  CreditCard,
  HelpCircle,
  Puzzle,
  FlaskConical,
  UserPlus,
  LogOut,
  Zap,
} from "lucide-react";

interface ProfilePopupProps {
  onClose: () => void;
}

const ProfilePopup = ({ onClose }: ProfilePopupProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    signOut();
    navigate("/");
    onClose();
  };

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: null, label: "Channels", path: "/dashboard/accounts" },
    { icon: CreditCard, label: "Plans and Billing", path: "/dashboard/settings?tab=billing" },
    { icon: HelpCircle, label: "Help & Support", path: null, hasArrow: true },
  ];

  const moreItems = [
    { icon: Puzzle, label: "Apps & Integrations", path: null, hasArrow: true },
    { icon: FlaskConical, label: "Beta Features", path: null, badge: "Off" },
    { icon: UserPlus, label: "Refer a Friend", path: null },
  ];

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 w-72 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden"
    >
      {/* User info */}
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">{user?.email}</p>
        <p className="text-sm font-semibold mt-1">My Organization</p>
        <p className="text-xs text-muted-foreground">Free plan · 0 channels</p>
        <Button
          size="sm"
          className="w-full mt-3 gap-2"
          onClick={() => go("/dashboard/settings?tab=billing")}
        >
          <Zap className="w-3.5 h-3.5" />
          Upgrade Plan
        </Button>
      </div>

      <Separator />

      {/* Main menu */}
      <div className="py-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && go(item.path)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent transition-colors text-left"
          >
            <span className="flex items-center gap-3">
              {item.icon ? (
                <item.icon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <span className="w-4 h-4 inline-flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-muted-foreground">
                    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </span>
              )}
              {item.label}
            </span>
            {item.hasArrow && (
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <Separator />

      {/* More menu */}
      <div className="py-1">
        {moreItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path && go(item.path)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-accent transition-colors text-left"
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </span>
            {item.hasArrow && (
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <Separator />

      {/* Log out */}
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors text-left text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>

      <Separator />

      {/* Footer: org info */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">My Organization</p>
          <p className="text-xs text-muted-foreground">Free Plan</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
