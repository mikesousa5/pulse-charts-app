import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const WorkoutCard = ({ title, description, icon: Icon, onClick }: WorkoutCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <Icon className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button variant="outline" className="w-full mt-2">
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
