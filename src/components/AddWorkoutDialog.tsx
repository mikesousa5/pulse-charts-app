import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutAdded?: () => void;
}

type MuscleGroup = "bicep" | "tricep" | "costas" | "abdominais" | "pernas" | "gemeos";

interface ExerciseType {
  id: string;
  name: string;
  muscle_group: MuscleGroup | null;
}

const muscleGroupLabels: Record<MuscleGroup, string> = {
  bicep: "Bíceps",
  tricep: "Tríceps",
  costas: "Costas",
  abdominais: "Abdominais",
  pernas: "Pernas",
  gemeos: "Gémeos",
};

export const AddWorkoutDialog = ({ open, onOpenChange, onWorkoutAdded }: AddWorkoutDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [comboOpen, setComboOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [loading, setLoading] = useState(false);

  const [gymForm, setGymForm] = useState({
    exercise: "",
    muscleGroup: "" as MuscleGroup | "",
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

  useEffect(() => {
    if (open && user) {
      fetchExerciseTypes();
    }
  }, [open, user]);

  const fetchExerciseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from("exercise_types")
        .select("*")
        .order("name");

      if (error) throw error;
      setExerciseTypes(data || []);
    } catch (error: any) {
      console.error("Error fetching exercise types:", error);
    }
  };

  const handleGymSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Find or create exercise type
      let exerciseTypeId: string | null = null;

      if (gymForm.exercise) {
        const existingType = exerciseTypes.find(
          (et) => et.name.toLowerCase() === gymForm.exercise.toLowerCase()
        );

        if (existingType) {
          exerciseTypeId = existingType.id;

          // Update muscle group if it changed
          if (gymForm.muscleGroup && existingType.muscle_group !== gymForm.muscleGroup) {
            await supabase
              .from("exercise_types")
              .update({ muscle_group: gymForm.muscleGroup })
              .eq("id", existingType.id);
          }
        } else {
          // Create new exercise type
          const { data: newType, error: typeError } = await supabase
            .from("exercise_types")
            .insert({
              user_id: user.id,
              name: gymForm.exercise,
              muscle_group: gymForm.muscleGroup || null,
            })
            .select()
            .single();

          if (typeError) throw typeError;
          exerciseTypeId = newType.id;
        }
      }

      // Create workout
      const { error } = await supabase.from("workouts").insert({
        user_id: user.id,
        type: "gym",
        exercise: gymForm.exercise,
        exercise_type_id: exerciseTypeId,
        muscle_group: gymForm.muscleGroup || null,
        sets: parseInt(gymForm.sets),
        reps: parseInt(gymForm.reps),
        weight: parseFloat(gymForm.weight),
        duration: parseInt(gymForm.duration),
        date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Treino de Ginásio Adicionado!",
        description: `${gymForm.exercise} - ${gymForm.sets}x${gymForm.reps} @ ${gymForm.weight}kg`,
      });

      onOpenChange(false);
      setGymForm({ exercise: "", muscleGroup: "", sets: "", reps: "", weight: "", duration: "" });
      setSelectedExercise("");

      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar treino",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: user.id,
        type: "run",
        distance: parseFloat(runForm.distance),
        duration: parseInt(runForm.duration),
        pace: runForm.pace,
        date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Corrida Adicionada!",
        description: `${runForm.distance}km em ${runForm.duration} minutos`,
      });

      onOpenChange(false);
      setRunForm({ distance: "", duration: "", pace: "" });

      if (onWorkoutAdded) {
        onWorkoutAdded();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar corrida",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectExercise = (exerciseName: string) => {
    setSelectedExercise(exerciseName);
    setGymForm({ ...gymForm, exercise: exerciseName });

    // Auto-fill muscle group if available
    const exerciseType = exerciseTypes.find((et) => et.name === exerciseName);
    if (exerciseType && exerciseType.muscle_group) {
      setGymForm({ ...gymForm, exercise: exerciseName, muscleGroup: exerciseType.muscle_group });
    }
    setComboOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Treino</DialogTitle>
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
                <Popover open={comboOpen} onOpenChange={setComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboOpen}
                      className="w-full justify-between"
                    >
                      {selectedExercise || "Selecione ou digite um exercício..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Procurar exercício..."
                        value={gymForm.exercise}
                        onValueChange={(value) => setGymForm({ ...gymForm, exercise: value })}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="p-2">
                            <p className="text-sm text-muted-foreground">Nenhum exercício encontrado.</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Digite o nome e pressione Enter para adicionar novo.
                            </p>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {exerciseTypes.map((exercise) => (
                            <CommandItem
                              key={exercise.id}
                              value={exercise.name}
                              onSelect={() => selectExercise(exercise.name)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedExercise === exercise.name ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{exercise.name}</span>
                                {exercise.muscle_group && (
                                  <span className="text-xs text-muted-foreground">
                                    {muscleGroupLabels[exercise.muscle_group]}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleGroup">Grupo Muscular</Label>
                <Select
                  value={gymForm.muscleGroup}
                  onValueChange={(value) => setGymForm({ ...gymForm, muscleGroup: value as MuscleGroup })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo muscular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bicep">Bíceps</SelectItem>
                    <SelectItem value="tricep">Tríceps</SelectItem>
                    <SelectItem value="costas">Costas</SelectItem>
                    <SelectItem value="abdominais">Abdominais</SelectItem>
                    <SelectItem value="pernas">Pernas</SelectItem>
                    <SelectItem value="gemeos">Gémeos</SelectItem>
                  </SelectContent>
                </Select>
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
                    step="0.5"
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A guardar..." : "Guardar Treino"}
              </Button>
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A guardar..." : "Guardar Corrida"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
