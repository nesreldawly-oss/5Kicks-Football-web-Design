import { Calendar, MapPin, Users, Trophy, DollarSign, Map, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card } from "./ui/card";
import { Screen, Tournament } from "../types";

type TournamentDetailsScreenProps = {
  tournament: Tournament | null;
  onNavigate: (screen: Screen, data?: any) => void;
};

export default function TournamentDetailsScreen({
  tournament,
  onNavigate,
}: TournamentDetailsScreenProps) {
  if (!tournament) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      registration_open: { label: "Registration Open", className: "bg-accent text-accent-foreground" },
      upcoming: { label: "Upcoming", className: "bg-secondary text-secondary-foreground" },
      live: { label: "Live", className: "bg-destructive text-destructive-foreground" },
    };
    return variants[status] || variants.registration_open;
  };

  const statusBadge = getStatusBadge(tournament.status);

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => onNavigate("home")} className="hover:bg-secondary">
          <ArrowLeft size={18} className="mr-2" />
          Back to Tournaments
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tournament Header */}
          <div className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground p-8 rounded-2xl shadow-lg">
            <h1 className="mb-4 text-3xl">{tournament.name}</h1>
            <Badge className="bg-accent text-accent-foreground px-4 py-1.5 text-sm">{statusBadge.label}</Badge>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Calendar size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p>{tournament.startDate}</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p>{tournament.location}</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Users size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teams</p>
                <p>
                  {tournament.teamsRegistered}/{tournament.maxTeams}
                </p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Trophy size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prize Pool</p>
                <p>{tournament.prizePool.toLocaleString()} EGP</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="w-full max-w-2xl grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card className="p-6">
                <h4 className="mb-3">About</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tournament.about}
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="mb-3">Venue</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  {tournament.locationDetails.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tournament.locationDetails.address}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="p-6">
                <h4 className="mb-4">Tournament Rules</h4>
                <ul className="space-y-4">
                  {tournament.rules.map((rule, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="text-primary flex-shrink-0 text-lg">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="matches">
              <Card className="p-12">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Match schedule will be announced soon
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-4">
          <Card className="p-6">
            <h4 className="mb-4">Registration</h4>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Fee per team</p>
              <p className="text-3xl">{tournament.registrationFee} EGP</p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full rounded-xl"
                onClick={() => onNavigate("payment", { tournament })}
              >
                <DollarSign size={18} className="mr-2" />
                Register Team
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => onNavigate("tournamentLocation", { tournament })}
              >
                <Map size={18} className="mr-2" />
                View on Map
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}