import { useEffect, useState } from "react";
import { Pencil, Trophy, Target, Users, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Screen, Tournament, Team } from "../types";
import { getProfileApi, getUserTournamentsApi, getMyTeamsApi, type ProfileResponse, type User } from "../services/api";

type ProfileScreenProps = {
  user: User | null;
  onNavigate: (screen: Screen, data?: any) => void;
  onLogout: () => void;
};

export default function ProfileScreen({ user, onNavigate, onLogout }: ProfileScreenProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [userTournaments, setUserTournaments] = useState<Tournament[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const baseUser: User | null = profile?.user ?? user;

  useEffect(() => {
    if (!user) return;

    // Load Profile
    getProfileApi()
      .then((data) => setProfile(data))
      .catch((e) => console.log(e));

    // Load Tournaments I am in
    getUserTournamentsApi(user.id)
      .then(data => setUserTournaments(data))
      .catch(e => console.error("Failed to load user tournaments", e));

    // Load My Teams
    getMyTeamsApi()
      .then(data => setUserTeams(data))
      .catch(e => console.error("Failed to load user teams", e));

  }, [user]);

  if (!baseUser) return null;

  const achievements = [
    { id: 1, title: "Top Scorer", icon: Trophy, color: "text-yellow-600" },
    { id: 2, title: "Fair Play Award", icon: Target, color: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h2 className="mb-2">My Profile</h2>
        <p className="text-muted-foreground">Manage your account and view your stats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card className="p-8 shadow-md">
            <div className="flex items-start gap-6 mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-3xl text-primary-foreground">
                  {baseUser.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="mb-2">{baseUser.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-3">{baseUser.email}</p>
                {baseUser.position && (
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="px-3 py-1">{baseUser.position}</Badge>
                    <Badge variant="secondary" className="px-3 py-1">#{baseUser.jerseyNumber}</Badge>
                    <Badge variant={baseUser.role === 'admin' ? 'default' : 'outline'} className="px-3 py-1">{baseUser.role}</Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
                <Pencil size={16} className="mr-2" />
                Edit Profile
              </Button>
              <Button variant="destructive" onClick={onLogout} className="rounded-lg shadow-md">
                Logout
              </Button>
            </div>
          </Card>

          {/* Career Statistics */}
          {baseUser.stats && (
            <div>
              <h4 className="mb-4">Career Statistics</h4>
              <Card className="p-8">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                      <Users size={24} className="text-primary" />
                    </div>
                    <p className="text-3xl mb-2">{baseUser.stats.matchesPlayed}</p>
                    <p className="text-sm text-muted-foreground">Matches</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                      <Target size={24} className="text-primary" />
                    </div>
                    <p className="text-3xl mb-2">{baseUser.stats.goals}</p>
                    <p className="text-sm text-muted-foreground">Goals</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-xl bg-secondary mx-auto mb-3 flex items-center justify-center">
                      <Trophy size={24} className="text-primary" />
                    </div>
                    <p className="text-3xl mb-2">{baseUser.stats.assists}</p>
                    <p className="text-sm text-muted-foreground">Assists</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl mb-2">{baseUser.stats.winRate}%</p>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-2 text-yellow-600">{baseUser.stats.yellowCards}</p>
                    <p className="text-sm text-muted-foreground">Yellow Cards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl mb-2 text-destructive">{baseUser.stats.redCards}</p>
                    <p className="text-sm text-muted-foreground">Red Cards</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column - Achievements, Tournaments & TEAMS */}
        <div className="space-y-6">
          {/* Achievements */}
          <div>
            <h4 className="mb-4">Achievements</h4>
            <div className="space-y-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={achievement.id}
                    className="p-5 flex items-center gap-4"
                  >
                    <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className={achievement.color} />
                    </div>
                    <p className="text-sm">{achievement.title}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* My Teams - NEW */}
          <div>
            <h4 className="mb-4">My Teams</h4>
            <div className="space-y-3">
              {userTeams.length === 0 && (
                <div className="text-center p-4 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                  <p className="text-sm text-muted-foreground mb-2">No teams created</p>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('myTeams')}>Create Team</Button>
                </div>
              )}
              {userTeams.map(team => (
                <Card key={team.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{team.name}</p>
                      <p className="text-xs text-muted-foreground">{team.playerCount} Players</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Registered Tournaments */}
          <div>
            <h4 className="mb-4">My Tournaments</h4>
            <div className="space-y-3">
              {userTournaments.length === 0 && <p className="text-sm text-muted-foreground">No tournaments yet.</p>}
              {userTournaments.map((tournament) => (
                <Card key={tournament.id} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onNavigate("tournamentDetails", { tournament })}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-2">{tournament.name}</p>
                      <Badge
                        variant={
                          tournament.status === "live" ? "destructive" :
                            tournament.status === "completed" ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {tournament.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}