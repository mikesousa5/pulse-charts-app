import { useState, useEffect } from "react";
import { Activity, Dumbbell, Footprints, TrendingUp, Flame } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WorkoutCard } from "@/components/WorkoutCard";
import { RecentWorkout } from "@/components/RecentWorkout";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Workout = Tables<"workouts">;

const MUSCLE_GROUP_COLORS = {
  bicep: "#3b82f6",
  tricep: "#8b5cf6",
  costas: "#10b981",
  abdominais: "#f59e0b",
  pernas: "#ef4444",
  gemeos: "#ec4899",
};

const muscleGroupLabels: Record<string, string> = {
  bicep: "Bíceps",
  tricep: "Tríceps",
  costas: "Costas",
  abdominais: "Abdominais",
  pernas: "Pernas",
  gemeos: "Gémeos",
};

const Index = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Error fetching workouts:", error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const getMuscleGroupData = () => {
    const counts: Record<string, number> = {};

    workouts.forEach((workout) => {
      if (workout.muscle_group) {
        counts[workout.muscle_group] = (counts[workout.muscle_group] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: muscleGroupLabels[key] || key,
      value,
      color: MUSCLE_GROUP_COLORS[key as keyof typeof MUSCLE_GROUP_COLORS] || "#6366f1",
    }));
  };

  const totalWorkouts = workouts.length;
  const totalDistance = workouts
    .filter((w) => w.type === "run" && w.distance)
    .reduce((sum, w) => sum + (w.distance || 0), 0);

  const totalCalories = workouts
    .filter((w) => w.calories)
    .reduce((sum, w) => sum + (w.calories || 0), 0);

  const recentWorkouts = workouts.slice(0, 5).map((workout) => ({
    type: workout.type as "gym" | "run",
    title: workout.type === "gym" ? (workout.exercise || "Treino") : "Corrida",
    date: new Date(workout.date).toLocaleDateString("pt-PT"),
    duration: `${workout.duration} min`,
    distance: workout.distance ? `${workout.distance} km` : undefined,
    calories: `${workout.calories || 0} kcal`,
  }));

  const getPeriodLabel = () => {
    switch (period) {
      case "monthly":
        return "Atividade Mensal";
      case "yearly":
        return "Atividade Anual";
      default:
        return "Atividade Semanal";
    }
  };

  const muscleGroupData = getMuscleGroupData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">DadosDeTreino.pt</h1>
          <p className="text-muted-foreground">Gere os teus treinos e acompanha o teu progresso</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Treinos"
            value={totalWorkouts.toString()}
            icon={Activity}
            trend={totalWorkouts > 0 ? `${totalWorkouts} treinos` : "Sem dados"}
          />
          <StatCard
            title="Distância Total"
            value={`${totalDistance.toFixed(1)} km`}
            icon={TrendingUp}
            trend={totalDistance > 0 ? "Corrida" : "Sem dados"}
          />
          <StatCard
            title="Calorias Queimadas"
            value={totalCalories.toString()}
            icon={Flame}
            trend={totalCalories > 0 ? "Total estimado" : "Sem dados"}
          />
        </div>

        {/* Add Workout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <WorkoutCard
            title="Treino de Ginásio"
            description="Regista o teu treino de força e resistência"
            icon={Dumbbell}
            onClick={() => setDialogOpen(true)}
          />
          <WorkoutCard
            title="Sessão de Corrida"
            description="Adiciona a tua corrida ou caminhada"
            icon={Footprints}
            onClick={() => setDialogOpen(true)}
          />
        </div>

        {/* Muscle Group Chart */}
        {muscleGroupData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Grupos Musculares Trabalhados</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={muscleGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={window.innerWidth < 640 ? 70 : 100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {muscleGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Workouts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Treinos Recentes</h2>
          <div className="space-y-3">
            {recentWorkouts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Ainda não tens treinos registados</p>
            ) : (
              recentWorkouts.map((workout, index) => (
                <RecentWorkout key={index} {...workout} />
              ))
            )}
          </div>
        </div>

        {/* Add Workout Dialog */}
        <AddWorkoutDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onWorkoutAdded={fetchWorkouts}
        />
      </div>
    </div>
  );
};

export default Index;
