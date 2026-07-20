import { Logo } from "@/components/Logo";

export const Footer = () => (
  <footer className="border-t bg-muted/30 mt-24">
    <div className="container py-12 grid md:grid-cols-4 gap-8">
      <div className="space-y-3">
        <Logo />
        <p className="text-sm text-muted-foreground">Publishing, analytics, and engagement for modern social teams.</p>
      </div>
      {[
        { title: "Product", items: ["Features", "Pricing", "Integrations", "Changelog"] },
        { title: "Company", items: ["About", "Customers", "Careers", "Contact"] },
        { title: "Resources", items: ["Help Center", "Blog", "Guides", "API"] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-semibold mb-3 text-sm">{col.title}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {col.items.map((i) => <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t">
      <div className="container py-6 text-xs text-muted-foreground flex justify-between">
        <span>© 2026 SocialFlow Pro. All rights reserved.</span>
        <span>Built for modern marketing teams.</span>
      </div>
    </div>
  </footer>
);
