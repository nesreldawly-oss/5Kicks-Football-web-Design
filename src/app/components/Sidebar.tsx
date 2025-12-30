import { House, Users, Trophy, User, ShieldAlert, MessageSquare, LogOut } from "lucide-react";
import type { Screen } from "../types";


type SidebarProps = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
};

export default function Sidebar({ currentScreen, onNavigate, onLogout, userName, userRole }: SidebarProps) {
  const navItems = [
    { id: "nav-home", screen: "home" as Screen, icon: House, label: "Home" },
    { id: "nav-tournaments", screen: "home" as Screen, icon: Trophy, label: "Tournaments" },
    { id: "nav-teams", screen: "myTeams" as Screen, icon: Users, label: "My Teams" },
    { id: "nav-chat", screen: "chat" as Screen, icon: MessageSquare, label: "Messages" },
    { id: "nav-profile", screen: "profile" as Screen, icon: User, label: "Profile" },
  ];

  // Always show admin dashboard link (requested behavior: "make it clear")
  navItems.push({ id: "nav-admin", screen: "admin" as Screen, icon: ShieldAlert, label: "Admin Dashboard" });

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-border bg-white flex justify-center">
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">5Kicks</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            // Hack for "Tournaments" link pointing to home as placeholder in original code
            // If screen matches, set active
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.screen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-primary text-primary-foreground shadow-md transform scale-105"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:transform hover:scale-102"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {userName && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/50">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${userRole === 'admin' ? 'bg-purple-600' : 'bg-primary'}`}>
              <User size={20} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole || 'Player'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}