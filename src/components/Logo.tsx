import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`flex items-center gap-2 font-bold text-lg ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
      <Zap className="w-5 h-5 text-primary-foreground" fill="currentColor" />
    </div>
    <span>SocialFlow<span className="text-primary"> Pro</span></span>
  </Link>
);
