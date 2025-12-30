import { House, Users, Trophy, User } from "lucide-react";
import { Screen } from "../types";

type BottomNavProps = {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
};

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: "nav-home", screen: "home" as Screen, icon: House, label: "Home" },
    { id: "nav-teams", screen: "myTeams" as Screen, icon: Users, label: "Teams" },
    { id: "nav-tournaments", screen: "home" as Screen, icon: Trophy, label: "Tournaments" },
    { id: "nav-profile", screen: "profile" as Screen, icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.screen)}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}