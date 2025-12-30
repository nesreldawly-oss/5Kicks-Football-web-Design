import { useState, useEffect } from "react";
import { Upload, CircleCheck, CircleAlert, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Screen, Tournament, Team } from "../types";
import { joinTournamentApi, getMyTeamsApi } from "../services/api";

type PaymentScreenProps = {
  tournament: Tournament | null;
  onNavigate: (screen: Screen, data?: any) => void;
};

type RosterPlayer = {
  name: string;
  number: number;
};

export default function PaymentScreen({ tournament, onNavigate }: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState("instapay");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  // Roster State
  const [roster, setRoster] = useState<RosterPlayer[]>([
    { name: "", number: 0 },
    { name: "", number: 0 },
    { name: "", number: 0 },
    { name: "", number: 0 },
    { name: "", number: 0 },
  ]);

  useEffect(() => {
    // Load user's teams to select which one to register
    getMyTeamsApi()
      .then(data => {
        setTeams(data);
        if (data.length > 0) setSelectedTeamId(data[0].id?.toString() || "");
      })
      .catch(() => console.error("Failed to load teams"));
  }, []);

  // When team changes, try to load existing roster or reset
  useEffect(() => {
    if (selectedTeamId) {
      const team = teams.find(t => t.id?.toString() === selectedTeamId);
      if (team && team.roster && team.roster.length > 0) {
        setRoster(team.roster);
      } else {
        // Reset to 5 empty slots if no existing roster
        setRoster([
          { name: "", number: 0 },
          { name: "", number: 0 },
          { name: "", number: 0 },
          { name: "", number: 0 },
          { name: "", number: 0 },
        ]);
      }
    }
  }, [selectedTeamId, teams]);


  if (!tournament) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleRosterChange = (index: number, field: keyof RosterPlayer, value: string | number) => {
    const newRoster = [...roster];
    newRoster[index] = { ...newRoster[index], [field]: value };
    setRoster(newRoster);
  };

  const addPlayer = () => {
    setRoster([...roster, { name: "", number: 0 }]);
  };

  const removePlayer = (index: number) => {
    if (roster.length <= 5) {
      alert("Minimum 5 players required");
      return;
    }
    const newRoster = roster.filter((_, i) => i !== index);
    setRoster(newRoster);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!selectedTeamId) {
      setError("Please select a team to register.");
      setLoading(false);
      return;
    }

    // Validate Roster
    if (roster.length < 5) {
      setError("You must have at least 5 players.");
      setLoading(false);
      return;
    }
    const invalidPlayer = roster.find(p => !p.name.trim() || !p.number);
    if (invalidPlayer) {
      setError("All players must have a name and a jersey number.");
      setLoading(false);
      return;
    }


    try {
      // In a real app, upload screenshot first, then join.
      // Pass the roster to the API
      await joinTournamentApi(tournament.id!, parseInt(selectedTeamId), roster);

      setSubmitted(true);
      setTimeout(() => {
        onNavigate("home");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to register team. Check if already registered.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-24 w-24 rounded-full bg-accent mx-auto mb-6 flex items-center justify-center">
            <CircleCheck size={48} className="text-accent-foreground" />
          </div>
          <h2 className="mb-3">Payment & Registration Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your team has been registered for {tournament.name}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => onNavigate("tournamentDetails", { tournament })}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Tournament
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="mb-8">Complete Registration</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Team Selection */}
              <div className="space-y-2">
                <Label>Select Team to Register</Label>
                {teams.length > 0 ? (
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select your team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id?.toString() || ""}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Card className="p-4 bg-destructive/10 text-destructive">
                    You don't have any teams using this account. Please create a team first in "My Teams".
                  </Card>
                )}
              </div>

              {/* Roster Section - REQUIREMENT: Make name and number required before payment */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Team Roster (Minimum 5)</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addPlayer}>
                    <Plus size={14} className="mr-1" /> Add Player
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Please enter the Full Name and Jersey Number.</p>

                <div className="space-y-2">
                  {roster.map((player, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="flex items-center text-xs text-muted-foreground">{index + 1}.</span>
                      <Input
                        placeholder="Player Name"
                        value={player.name}
                        onChange={(e) => handleRosterChange(index, 'name', e.target.value)}
                        className="flex-1"
                        required
                      />
                      <Input
                        type="number"
                        placeholder="#"
                        value={player.number || ''}
                        onChange={(e) => handleRosterChange(index, 'number', parseInt(e.target.value))}
                        className="w-20"
                        required
                      />
                      {roster.length > 5 && (
                        <button type="button" onClick={() => removePlayer(index)} className="text-destructive hover:bg-destructive/10 p-2 rounded">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              <div className="pt-4 border-t border-border">
                <Label className="mb-4 block">Select Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <Card className="p-5 mb-4">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value="instapay" id="instapay" />
                      <Label htmlFor="instapay" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>InstaPay</span>
                          <span className="text-sm text-muted-foreground">Instant transfer</span>
                        </div>
                      </Label>
                    </div>
                  </Card>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Your Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+20 123 456 7890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshot">Upload Payment Screenshot</Label>
                <Card className="p-8 border-dashed cursor-pointer hover:bg-secondary/50 transition-colors">
                  <label htmlFor="screenshot" className="cursor-pointer block">
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <div className="flex flex-col items-center text-center">
                      <Upload size={32} className="text-primary mb-2" />
                      <p className="text-sm">Click to Upload</p>
                      {screenshot && <p className="text-xs text-primary mt-1">{screenshot.name}</p>}
                    </div>
                  </label>
                </Card>
              </div>

              {error && (
                <div className="bg-destructive/10 p-3 rounded-lg flex items-center gap-2 text-destructive text-sm">
                  <CircleAlert size={16} />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading || teams.length === 0}>
                {loading ? "Registering..." : "Submit Payment & Register"}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">Tournament: {tournament.name}</p>
              <p className="text-lg font-bold mt-2">{tournament.registrationFee} EGP</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}