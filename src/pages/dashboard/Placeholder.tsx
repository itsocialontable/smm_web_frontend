import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const Placeholder = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-6 md:p-8 max-w-7xl mx-auto">
    <h1 className="text-2xl font-bold mb-2">{title}</h1>
    <p className="text-sm text-muted-foreground mb-6">{desc}</p>
    <Card className="p-12 text-center">
      <Construction className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-semibold mb-1">Coming in Phase 2</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">This module is part of the next milestone. Ask GC360 to build it next when you're ready.</p>
    </Card>
  </div>
);

export default Placeholder;
