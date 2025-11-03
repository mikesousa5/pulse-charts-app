import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Workout {
  id: string | number;
  type: "gym" | "run";
  title: string;
  date: string;
  duration: string;
  distance?: string;
  calories: string;
}

interface EditWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: Workout | null;
  onSave: (updatedWorkout: Workout) => void;
}

export const EditWorkoutDialog = ({ open, onOpenChange, workout, onSave }: EditWorkoutDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    distance: "",
    calories: "",
  });

  useEffect(() => {
    if (workout) {
      setFormData({
        title: workout.title,
        duration: workout.duration.replace(" min", ""),
        distance: workout.distance?.replace(" km", "") || "",
        calories: workout.calories.replace(" kcal", ""),
      });
    }
  }, [workout]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!workout) return;

    const updatedWorkout: Workout = {
      ...workout,
      title: formData.title,
      duration: `${formData.duration} min`,
      distance: formData.distance ? `${formData.distance} km` : undefined,
      calories: `${formData.calories} kcal`,
    };

    onSave(updatedWorkout);
    toast({
      title: "Workout Atualizado!",
      description: `${formData.title} foi atualizado com sucesso.`,
    });
    onOpenChange(false);
  };

  if (!workout) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Workout</DialogTitle>
          <DialogDescription>
            Modifica os detalhes do teu {workout.type === "gym" ? "treino de ginásio" : "treino de corrida"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              placeholder="ex: Treino de Peito"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duração (min)</Label>
              <Input
                id="edit-duration"
                type="number"
                placeholder="45"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-calories">Calorias (kcal)</Label>
              <Input
                id="edit-calories"
                type="number"
                placeholder="320"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                required
              />
            </div>
          </div>

          {workout.type === "run" && (
            <div className="space-y-2">
              <Label htmlFor="edit-distance">Distância (km)</Label>
              <Input
                id="edit-distance"
                type="number"
                step="0.1"
                placeholder="5.2"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Guardar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
