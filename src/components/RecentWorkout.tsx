import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Footprints, Pencil, Trash2 } from "lucide-react";

interface RecentWorkoutProps {
  id?: string | number;
  type: "gym" | "run";
  title: string;
  date: string;
  duration: string;
  distance?: string;
  calories: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RecentWorkout = ({
  type,
  title,
  date,
  duration,
  distance,
  calories,
  onEdit,
  onDelete
}: RecentWorkoutProps) => {
  const Icon = type === "gym" ? Dumbbell : Footprints;

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1 flex-1">
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
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-2 ml-4">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8"
                  title="Editar workout"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  title="Eliminar workout"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
