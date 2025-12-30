import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import logoImage from "../../assets/logo.png";

type AppHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function AppHeader({ title, showBackButton, onBack }: AppHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
              <ArrowLeft size={20} />
            </Button>
          )}
          {title ? (
            <h2 className="text-lg">{title}</h2>
          ) : (
            <div className="bg-white rounded-lg px-3 py-1">
              <img 
                src={logoImage} 
                alt="5Kicks Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}