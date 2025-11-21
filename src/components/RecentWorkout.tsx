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
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{title}</h4>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {type === "gym" ? "Ginásio" : "Corrida"}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{date}</p>
              <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
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
