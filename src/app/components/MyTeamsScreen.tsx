import { useEffect, useState } from "react";
import { Plus, Users, TrendingUp, Target, Trash2, UserPlus, X, MapPin, Mail, FileText, Phone, Palette, Shield } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Screen, Team } from "../types";
import { createTeamApi, getMyTeamsApi } from "../services/api";

type MyTeamsScreenProps = {
  onNavigate: (screen: Screen, data?: any) => void;
};

export default function MyTeamsScreen({ }: MyTeamsScreenProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Team Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [level, setLevel] = useState<"Beginner" | "Amateur" | "Competitive" | "Pro">("Amateur");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [description, setDescription] = useState("");
  const [roster, setRoster] = useState<{ name: string; number: number; position?: string }[]>([]);

  // View Detail Modal State
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const loadTeams = () => {
    setLoading(true);
    setError(null);
    getMyTeamsApi()
      .then((data) => setTeams(data))
      .catch(() => setError("Failed to load teams."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("Team name is required!");
      return;
    }
    if (roster.length === 0) {
      alert("Please add at least one player to your roster!");
      return;
    }
    if (roster.some(p => !p.name.trim())) {
      alert("Please provide names for all players in the roster!");
      return;
    }
    setLoading(true);
    try {
      const ownerId = parseInt(localStorage.getItem("currentUserId") || "0");
      if (!ownerId) throw new Error("Not logged in");
      await createTeamApi({
        name: teamName,
        ownerId,
        roster,
        location,
        contactEmail,
        phoneNumber,
        level,
        primaryColor,
        description
      });
      setTeamName("");
      setLocation("");
      setContactEmail("");
      setPhoneNumber("");
      setLevel("Amateur");
      setPrimaryColor("#3b82f6");
      setDescription("");
      setRoster([]);
      setIsModalOpen(false);
      loadTeams();
    } catch {
      alert("Failed to create team. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = () => {
    setRoster([...roster, { name: "", number: roster.length + 1, position: "GK" }]);
  };

  const removePlayer = (index: number) => {
    setRoster(roster.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, field: "name" | "number" | "position", value: string | number) => {
    const newRoster = [...roster];
    newRoster[index] = { ...newRoster[index], [field]: value } as any;
    setRoster(newRoster);
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h2>My Teams</h2>
        <Button className="rounded-lg" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Create Team
        </Button>
      </div>

      {loading && teams.length === 0 && <p className="text-sm text-muted-foreground mb-4">Loading teams...</p>}
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner"
                  style={{ backgroundColor: team.primaryColor || "#3b82f6" }}
                >
                  <Shield size={28} className="text-white drop-shadow-md" />
                </div>
                <div>
                  <h4 className="mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                    {team.name}
                    <Badge variant="outline" className="text-[10px] h-4 px-1">{team.level || 'Amateur'}</Badge>
                  </h4>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users size={14} /> {team.playerCount} players
                    </p>
                    {team.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin size={12} /> {team.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {team.description && (
              <p className="text-sm text-balance mb-6 line-clamp-2 italic text-muted-foreground bg-accent/20 p-2 rounded-lg border-l-2" style={{ borderLeftColor: team.primaryColor }}>
                "{team.description}"
              </p>
            )}

            <div className="mt-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                  <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Wins</p>
                  <p className="text-lg font-bold text-primary">{team.wins}</p>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                  <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Draws</p>
                  <p className="text-lg font-bold">{team.draws}</p>
                </div>
                <div className="text-center p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors">
                  <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Losses</p>
                  <p className="text-lg font-bold text-destructive">{team.losses}</p>
                </div>
              </div>

              {/* Points & Goals */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp size={16} className="text-primary" />
                  <span className="text-muted-foreground">Pts:</span>
                  <span className="font-bold">{team.points}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target size={16} className="text-primary" />
                  <span className="text-muted-foreground">Goals:</span>
                  <span className="font-bold">{team.goalsScored}:{team.goalsConceded}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                onClick={() => setSelectedTeam(team)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {/* Create Team Card */}
        <Card
          className="p-6 border-dashed cursor-pointer hover:bg-secondary/50 hover:border-primary transition-all duration-300 hover:-translate-y-1 min-h-[350px] flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-4 hover:scale-110 transition-transform shadow-sm">
              <Plus size={32} className="text-primary" />
            </div>
            <h4 className="mb-2 font-bold">Create New Team</h4>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Start building your squad and register for tournaments
            </p>
          </div>
        </Card>
      </div>

      {/* Team Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-accent/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  <Plus className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Create New Team</h3>
                  <p className="text-xs text-muted-foreground">Build your squad and join tournaments</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleCreateTeam} className="flex-1 overflow-hidden flex flex-col">
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="teamName" className="flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      Team Name
                    </Label>
                    <Input
                      id="teamName"
                      placeholder="e.g. Cairo Eagles"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="h-12 text-lg font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      Home Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g. Nasr City, Cairo"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail" className="flex items-center gap-2">
                      <Mail size={16} className="text-primary" />
                      Contact Email
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="team@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone size={16} className="text-primary" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+20 1XX XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level" className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary" />
                      Team Level
                    </Label>
                    <select
                      id="level"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Amateur">Amateur</option>
                      <option value="Competitive">Competitive</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="flex items-center gap-2">
                      <Palette size={16} className="text-primary" />
                      Team Color
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-20 p-1 cursor-pointer"
                      />
                      <span className="text-xs text-muted-foreground font-mono uppercase">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description" className="flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      Team Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your team, philosophy, or history..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-bold">Official Roster</Label>
                      <p className="text-xs text-muted-foreground">Minimum one player required</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addPlayer} className="rounded-lg shadow-sm">
                      <UserPlus size={16} className="mr-2" />
                      Add Player
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {roster.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-muted rounded-2xl bg-accent/5">
                        <Users size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">No players added yet</p>
                      </div>
                    ) : (
                      roster.map((player, index) => (
                        <div key={index} className="flex gap-3 animate-in slide-in-from-left-2 duration-200 bg-secondary/20 p-3 rounded-xl border border-border">
                          <div className="flex-[2]">
                            <Input
                              placeholder="Player Name"
                              value={player.name}
                              onChange={(e) => updatePlayer(index, "name", e.target.value)}
                              required
                              className="bg-background"
                            />
                          </div>
                          <div className="w-20">
                            <Input
                              type="number"
                              placeholder="No."
                              value={player.number}
                              onChange={(e) => updatePlayer(index, "number", parseInt(e.target.value) || 0)}
                              required
                              className="bg-background"
                            />
                          </div>
                          <div className="flex-1">
                            <select
                              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={player.position}
                              onChange={(e) => updatePlayer(index, "position", e.target.value)}
                            >
                              <option value="GK">GK</option>
                              <option value="DEF">DEF</option>
                              <option value="MID">MID</option>
                              <option value="FWD">FWD</option>
                            </select>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removePlayer(index)}
                            className="rounded-lg"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-accent/30 flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-xl h-12"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-[2] rounded-xl shadow-lg h-12 text-base font-bold"
                  disabled={loading}
                >
                  {loading ? "Creating Squad..." : "Launch Team"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            <div
              className="p-8 border-b border-border flex items-center justify-between text-white"
              style={{ backgroundColor: selectedTeam.primaryColor || "#3b82f6" }}
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                  <Shield size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedTeam.name}</h2>
                  <div className="flex gap-3 items-center mt-1">
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none">{selectedTeam.level}</Badge>
                    {selectedTeam.location && (
                      <span className="text-sm font-medium flex items-center gap-1.5 opacity-90"><MapPin size={14} /> {selectedTeam.location}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTeam(null)}
                className="text-white hover:bg-white/20 rounded-full h-12 w-12"
              >
                <X size={24} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Info Column */}
                <div className="space-y-6 md:col-span-1">
                  <div>
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">About the Team</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground italic bg-secondary/30 p-5 rounded-2xl border border-border/50">
                      {selectedTeam.description || "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Contact & Info</h4>
                    <div className="space-y-2">
                      {selectedTeam.contactEmail && (
                        <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-xl border border-border/30">
                          <Mail size={16} className="text-primary flex-shrink-0" />
                          <span className="truncate">{selectedTeam.contactEmail}</span>
                        </div>
                      )}
                      {selectedTeam.phoneNumber && (
                        <div className="flex items-center gap-3 text-sm p-3 bg-secondary/20 rounded-xl border border-border/30">
                          <Phone size={16} className="text-primary flex-shrink-0" />
                          <span>{selectedTeam.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedTeam.location && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Home Ground Map</h4>
                      <div className="aspect-square rounded-2xl overflow-hidden border border-border shadow-inner bg-accent/5">
                        <iframe
                          title="Team Location"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedTeam.location)}&z=14&output=embed`}
                          allowFullScreen
                          loading="lazy"
                          className="grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Live Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10 shadow-sm">
                        <p className="text-[10px] text-muted-foreground mb-1 font-bold uppercase">Wins</p>
                        <p className="text-2xl font-black text-primary">{selectedTeam.wins}</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10 shadow-sm">
                        <p className="text-[10px] text-muted-foreground mb-1 font-bold uppercase">Points</p>
                        <p className="text-2xl font-black text-primary">{selectedTeam.points}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roster Column */}
                <div className="md:col-span-2 space-y-5">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Official Squad Roster</h4>
                    <Badge className="rounded-full px-3">{selectedTeam.playerCount} Active Members</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTeam.roster && selectedTeam.roster.length > 0 ? (
                      selectedTeam.roster.map((player, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all group cursor-default">
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg transition-colors shadow-sm"
                            style={{ backgroundColor: `${selectedTeam.primaryColor}15`, color: selectedTeam.primaryColor }}
                          >
                            {player.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{player.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider px-1.5 py-0.5 bg-secondary rounded">{player.position}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 sm:col-span-2 py-16 text-center bg-muted/10 border-2 border-dashed border-border rounded-3xl">
                        <Users className="mx-auto text-muted-foreground/20 mb-3" size={48} />
                        <p className="text-sm text-muted-foreground font-medium">This squad currently has no registered players.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-accent/30 flex justify-end">
              <Button
                onClick={() => setSelectedTeam(null)}
                className="rounded-xl px-10 h-12 font-bold shadow-lg"
              >
                Close Portal
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}