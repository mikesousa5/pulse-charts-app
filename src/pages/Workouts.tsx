import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Calendar, Weight, Repeat, Timer, MapPin, Zap } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

type Workout = Tables<"workouts">;

const muscleGroupLabels = {
  bicep: "Bíceps",
  tricep: "Tríceps",
  costas: "Costas",
  abdominais: "Abdominais",
  pernas: "Pernas",
  gemeos: "Gémeos",
};

export default function Workouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        // Se a tabela não existe ainda, apenas use array vazio
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.warn("Tabela 'workouts' ainda não existe. Aplique a migração no Supabase.");
          setWorkouts([]);
        } else {
          throw error;
        }
      } else {
        setWorkouts(data || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar treinos",
        description: error.message,
      });
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workoutToDelete) return;

    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutToDelete);

      if (error) throw error;

      toast({
        title: "Treino eliminado",
        description: "O treino foi eliminado com sucesso.",
      });

      setWorkouts(workouts.filter((w) => w.id !== workoutToDelete));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao eliminar treino",
        description: error.message,
      });
    } finally {
      setDeleteDialogOpen(false);
      setWorkoutToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setWorkoutToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">A carregar treinos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Os Meus Treinos</h1>
          <p className="text-muted-foreground mt-2">
            Gere todos os seus treinos registados
          </p>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Ainda não tens treinos registados. Começa a adicionar treinos na página inicial!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <Card key={workout.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">
                        {workout.type === "gym" ? workout.exercise : "Corrida"}
                      </CardTitle>
                      {workout.muscle_group && (
                        <CardDescription className="mt-1">
                          {muscleGroupLabels[workout.muscle_group]}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          toast({
                            title: "Em breve",
                            description: "Funcionalidade de edição em desenvolvimento",
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 sm:h-8 sm:w-8 text-destructive hover:text-destructive touch-manipulation"
                        onClick={() => confirmDelete(workout.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(workout.date), "PPP", { locale: pt })}
                      </span>
                    </div>

                    {workout.type === "gym" && (
                      <>
                        {workout.sets && workout.reps && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Repeat className="h-4 w-4" />
                            <span>
                              {workout.sets} séries x {workout.reps} repetições
                            </span>
                          </div>
                        )}
                        {workout.weight && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Weight className="h-4 w-4" />
                            <span>{workout.weight} kg</span>
                          </div>
                        )}
                      </>
                    )}

                    {workout.type === "run" && (
                      <>
                        {workout.distance && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{workout.distance} km</span>
                          </div>
                        )}
                        {workout.pace && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <span>{workout.pace} /km</span>
                          </div>
                        )}
                      </>
                    )}

                    {workout.duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>{workout.duration} minutos</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser revertida. O treino será permanentemente eliminado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
