import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface RoleSelectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export function RoleSelectionCard({ 
  title, 
  description, 
  icon: Icon, 
  selected, 
  onClick 
}: RoleSelectionCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
        selected 
          ? 'ring-2 ring-primary shadow-elegant bg-gradient-accent' 
          : 'shadow-card hover:shadow-elegant'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`inline-flex p-4 rounded-full mb-4 ${
          selected ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
        }`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}