import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Footprints } from "lucide-react";

interface RecentWorkoutProps {
  type: "gym" | "run";
  title: string;
  date: string;
  duration: string;
  distance?: string;
  calories: string;
}

export const RecentWorkout = ({ 
  type, 
  title, 
  date, 
  duration, 
  distance, 
  calories 
}: RecentWorkoutProps) => {
  const Icon = type === "gym" ? Dumbbell : Footprints;
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{title}</h4>
                <Badge variant="outline" className="text-xs">
                  {type === "gym" ? "Ginásio" : "Corrida"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{date}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{duration}</span>
                {distance && <span>• {distance}</span>}
                <span>• {calories}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
