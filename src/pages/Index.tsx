import { useState } from "react";
import { Activity, Dumbbell, Footprints, TrendingUp, Flame } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WorkoutCard } from "@/components/WorkoutCard";
import { RecentWorkout } from "@/components/RecentWorkout";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Seg", workouts: 2 },
  { day: "Ter", workouts: 1 },
  { day: "Qua", workouts: 3 },
  { day: "Qui", workouts: 2 },
  { day: "Sex", workouts: 1 },
  { day: "Sáb", workouts: 2 },
  { day: "Dom", workouts: 1 },
];

const monthlyData = [
  { day: "Sem 1", workouts: 12 },
  { day: "Sem 2", workouts: 15 },
  { day: "Sem 3", workouts: 10 },
  { day: "Sem 4", workouts: 14 },
];

const yearlyData = [
  { day: "Jan", workouts: 45 },
  { day: "Fev", workouts: 52 },
  { day: "Mar", workouts: 48 },
  { day: "Abr", workouts: 55 },
  { day: "Mai", workouts: 50 },
  { day: "Jun", workouts: 58 },
  { day: "Jul", workouts: 62 },
  { day: "Ago", workouts: 60 },
  { day: "Set", workouts: 54 },
  { day: "Out", workouts: 48 },
  { day: "Nov", workouts: 0 },
  { day: "Dez", workouts: 0 },
];

const recentWorkouts = [
  {
    type: "gym" as const,
    title: "Treino de Peito",
    date: "Hoje, 18:30",
    duration: "45 min",
    calories: "320 kcal",
  },
  {
    type: "run" as const,
    title: "Corrida Matinal",
    date: "Ontem, 07:00",
    duration: "30 min",
    distance: "5.2 km",
    calories: "280 kcal",
  },
  {
    type: "gym" as const,
    title: "Treino de Pernas",
    date: "2 dias atrás",
    duration: "60 min",
    calories: "420 kcal",
  },
];

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const getChartData = () => {
    switch (period) {
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Fitness Tracker</h1>
          <p className="text-muted-foreground">Gere os teus workouts e acompanha o teu progresso</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total de Workouts"
            value="24"
            icon={Activity}
            trend="+12% vs. semana passada"
          />
          <StatCard
            title="Distância Total"
            value="52.4 km"
            icon={TrendingUp}
            trend="+8.3 km esta semana"
          />
          <StatCard
            title="Calorias Queimadas"
            value="3,240"
            icon={Flame}
            trend="+420 kcal"
          />
        </div>

        {/* Add Workout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <WorkoutCard
            title="Workout de Ginásio"
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

        {/* Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{getPeriodLabel()}</CardTitle>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="hsl(var(--primary))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Workouts Recentes</h2>
          <div className="space-y-3">
            {recentWorkouts.map((workout, index) => (
              <RecentWorkout key={index} {...workout} />
            ))}
          </div>
        </div>

        {/* Add Workout Dialog */}
        <AddWorkoutDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    </div>
  );
};

export default Index;
