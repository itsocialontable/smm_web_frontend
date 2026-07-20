import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => (
  <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b">
    <div className="container flex h-16 items-center justify-between">
      <Logo />
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition">Features</a>
        <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        <a href="#testimonials" className="hover:text-foreground transition">Customers</a>
      </nav>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
        <Button asChild size="sm" className="shadow-soft"><Link to="/register">Get started free</Link></Button>
      </div>
    </div>
  </header>
);
