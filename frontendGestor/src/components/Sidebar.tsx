import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  ArrowLeftRight,
  FolderKanban,
  Building2,
  FileBarChart2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/operations', label: 'Operações', icon: ArrowLeftRight },
    { to: '/categories', label: 'Categorias', icon: FolderKanban },
    { to: '/banks', label: 'Bancos', icon: Building2 },
    { to: '/reports', label: 'Relatórios', icon: FileBarChart2 },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ to: '/admin', label: 'Administração', icon: ShieldCheck });
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-card/90 border border-border text-foreground md:hidden shadow-lg backdrop-blur-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-card/85 backdrop-blur-xl border-r border-border/80 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pt-2 md:pt-0">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Controlfy
                </h1>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">
                  Gestão Financeira
                </p>
              </div>
            </Link>
            <button
              className="md:hidden p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative",
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="pt-4 border-t border-border/60 space-y-3">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/60 transition-colors group"
          >
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border text-foreground group-hover:border-primary/50 transition-colors">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-foreground">
                {user?.name || 'Usuário'}
              </p>
              <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                {user?.role || 'FREE'}
              </Badge>
            </div>
          </Link>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair da conta</span>
          </Button>
        </div>
      </aside>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
