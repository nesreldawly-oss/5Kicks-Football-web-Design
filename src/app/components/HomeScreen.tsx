import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Screen, Tournament } from "../types";
import { getTournamentsApi } from "../services/api";

type HomeScreenProps = {
  user: any;
  onNavigate: (screen: Screen, data?: any) => void;
};

export default function HomeScreen({ user, onNavigate }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTournamentsApi()
      .then((data) => {
        if (isMounted) {
          setTournaments(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load tournaments.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filterTournaments = (status?: string) => {
    if (!status || status === "all") return tournaments;
    return tournaments.filter((t) => {
      if (status === "open") return t.status === "registration_open";
      if (status === "upcoming") return t.status === "upcoming";
      if (status === "live") return t.status === "live";
      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      registration_open: { label: "Registration Open", className: "bg-accent text-accent-foreground" },
      upcoming: { label: "Upcoming", className: "bg-secondary text-secondary-foreground" },
      live: { label: "Live", className: "bg-destructive text-destructive-foreground" },
    };
    return variants[status] || variants.registration_open;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-8 py-10 rounded-2xl mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Welcome back,</p>
            <h2 className="text-3xl">{user?.name}</h2>
            <p className="text-sm opacity-75 mt-1">Ready for your next match?</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow"
              onClick={() => onNavigate("myTeams")}
            >
              <Users size={18} className="mr-2" />
              My Teams
            </Button>
          </div>
        </div>
      </div>

      {/* Tournaments Section */}
      <div>
        <h3 className="mb-6">Browse Tournaments</h3>

        {loading && <p className="text-sm text-muted-foreground mb-4">Loading tournaments...</p>}
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full max-w-2xl grid grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterTournaments(activeTab).map((tournament) => {
                const statusBadge = getStatusBadge(tournament.status);
                return (
                  <Card
                    key={tournament.id}
                    className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                    onClick={() => onNavigate("tournamentDetails", { tournament })}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="mb-3 group-hover:text-primary transition-colors">{tournament.name}</h4>
                        <Badge className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span>{tournament.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        <span>{tournament.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <span>
                          {tournament.teamsRegistered}/{tournament.maxTeams} Teams
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy size={16} className="text-primary" />
                        <span>{tournament.prizePool.toLocaleString()} EGP Prize Pool</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          Registration Fee:
                        </span>
                        <span className="text-sm font-semibold">
                          {tournament.registrationFee} EGP
                        </span>
                      </div>
                      <Button size="sm" className="w-full rounded-lg group-hover:shadow-lg transition-all">
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}