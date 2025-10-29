import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface AddWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWorkoutDialog = ({ open, onOpenChange }: AddWorkoutDialogProps) => {
  const { toast } = useToast();
  const [gymForm, setGymForm] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
  });

  const [runForm, setRunForm] = useState({
    distance: "",
    duration: "",
    pace: "",
  });

  const handleGymSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Workout de Ginásio Adicionado!",
      description: `${gymForm.exercise} - ${gymForm.sets}x${gymForm.reps} @ ${gymForm.weight}kg`,
    });
    onOpenChange(false);
    setGymForm({ exercise: "", sets: "", reps: "", weight: "", duration: "" });
  };

  const handleRunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Corrida Adicionada!",
      description: `${runForm.distance}km em ${runForm.duration} minutos`,
    });
    onOpenChange(false);
    setRunForm({ distance: "", duration: "", pace: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Workout</DialogTitle>
          <DialogDescription>
            Regista o teu treino de ginásio ou corrida
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="gym" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gym">Ginásio</TabsTrigger>
            <TabsTrigger value="run">Corrida</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gym">
            <form onSubmit={handleGymSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Exercício</Label>
                <Input
                  id="exercise"
                  placeholder="ex: Supino"
                  value={gymForm.exercise}
                  onChange={(e) => setGymForm({ ...gymForm, exercise: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Séries</Label>
                  <Input
                    id="sets"
                    type="number"
                    placeholder="3"
                    value={gymForm.sets}
                    onChange={(e) => setGymForm({ ...gymForm, sets: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Repetições</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="12"
                    value={gymForm.reps}
                    onChange={(e) => setGymForm({ ...gymForm, reps: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="80"
                    value={gymForm.weight}
                    onChange={(e) => setGymForm({ ...gymForm, weight: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={gymForm.duration}
                    onChange={(e) => setGymForm({ ...gymForm, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Guardar Treino</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="run">
            <form onSubmit={handleRunSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="distance">Distância (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={runForm.distance}
                  onChange={(e) => setRunForm({ ...runForm, distance: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="run-duration">Duração (minutos)</Label>
                <Input
                  id="run-duration"
                  type="number"
                  placeholder="30"
                  value={runForm.duration}
                  onChange={(e) => setRunForm({ ...runForm, duration: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pace">Ritmo (min/km)</Label>
                <Input
                  id="pace"
                  placeholder="5:30"
                  value={runForm.pace}
                  onChange={(e) => setRunForm({ ...runForm, pace: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Guardar Corrida</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
