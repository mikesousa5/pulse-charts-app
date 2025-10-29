import { Database, Download, Smartphone, Watch, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";

const importSources = [
  {
    name: "Garmin Connect",
    icon: Watch,
    description: "Importa treinos e atividades do Garmin",
    color: "text-blue-600",
  },
  {
    name: "Apple Saúde",
    icon: Smartphone,
    description: "Sincroniza dados de saúde do iPhone",
    color: "text-gray-800",
  },
  {
    name: "Samsung Health",
    icon: Activity,
    description: "Importa dados do Samsung Fitness",
    color: "text-blue-500",
  },
  {
    name: "Ficheiro CSV",
    icon: Database,
    description: "Carrega dados de um ficheiro CSV",
    color: "text-green-600",
  },
];

const Data = () => {
  const { toast } = useToast();

  const handleImport = (source: string) => {
    toast({
      title: "Importação iniciada",
      description: `A preparar importação de dados de ${source}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Área de Dados</h1>
          <p className="text-muted-foreground">Importa e gere os teus dados de fitness</p>
        </div>

        {/* Import Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Importar Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {importSources.map((source) => {
              const Icon = source.icon;
              return (
                <Card key={source.name} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${source.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{source.name}</CardTitle>
                        <CardDescription>{source.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
                      onClick={() => handleImport(source.name)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Importar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Data Summary */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Resumo de Dados</h2>
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Importação</CardTitle>
              <CardDescription>Histórico de dados importados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-semibold text-foreground">Total de Workouts</p>
                    <p className="text-sm text-muted-foreground">Dados locais e importados</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">24</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p className="font-semibold text-foreground">Última Importação</p>
                    <p className="text-sm text-muted-foreground">Sincronização mais recente</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Nenhuma ainda</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Data;
