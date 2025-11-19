import { Dumbbell, User, LogOut, ListChecks, Home, Database, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  const isActive = (path: string) => location.pathname === path;

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-semibold text-base sm:text-lg hidden xs:inline">DadosDeTreino.pt</span>
              <span className="font-semibold text-base sm:text-lg xs:hidden">DDT.pt</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-1">
              <Link to="/">
                <Button variant={isActive("/") ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Início
                </Button>
              </Link>
              <Link to="/workouts">
                <Button variant={isActive("/workouts") ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <ListChecks className="h-4 w-4" />
                  Treinos
                </Button>
              </Link>
              <Link to="/data">
                <Button variant={isActive("/data") ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <Database className="h-4 w-4" />
                  Dados
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  <Link to="/" onClick={handleMobileNavClick}>
                    <Button
                      variant={isActive("/") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Início
                    </Button>
                  </Link>
                  <Link to="/workouts" onClick={handleMobileNavClick}>
                    <Button
                      variant={isActive("/workouts") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <ListChecks className="h-4 w-4" />
                      Treinos
                    </Button>
                  </Link>
                  <Link to="/data" onClick={handleMobileNavClick}>
                    <Button
                      variant={isActive("/data") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Database className="h-4 w-4" />
                      Dados
                    </Button>
                  </Link>
                  <div className="border-t my-4"></div>
                  <div className="px-2 py-1">
                    <p className="text-sm font-medium">Minha Conta</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Link to="/profile" onClick={handleMobileNavClick}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Perfil
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      handleMobileNavClick();
                      signOut();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:flex">
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Minha Conta</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
