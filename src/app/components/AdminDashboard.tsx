import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTournamentApi, adminDeleteAnyApi, getTournamentsApi, getAllUsersApi, getAllTeamsApi, updateTournamentApi, updateUserApi } from "../services/api";
import type { Tournament, User, Team } from "../types";
import { Trash2, Edit, X, Save } from "lucide-react";

type Tab = 'create' | 'tournaments' | 'users' | 'teams';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>('create');
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const { register, handleSubmit, reset } = useForm<Tournament>();

    // Editing State
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        if (activeTab === 'tournaments' || activeTab === 'create') setTournaments(await getTournamentsApi());
        if (activeTab === 'users') setUsers(await getAllUsersApi());
        if (activeTab === 'teams') setTeams(await getAllTeamsApi());
    };

    const onSubmit = async (data: Tournament) => {
        try {
            // Default values for a new tournament
            const rawRules = (data.rules as any) as string || "";
            const rulesArray = rawRules.split('\n').filter(r => r.trim().length > 0);

            const newTournament = {
                ...data,
                status: data.status || "registration_open",
                teamsRegistered: 0,
                prizePool: Number(data.prizePool),
                registrationFee: Number(data.registrationFee),
                maxTeams: Number(data.maxTeams),
                locationDetails: {
                    name: data.location,
                    address: (data.locationDetails as any)?.address || "TBD",
                    coordinates: {
                        lat: parseFloat((data.locationDetails as any)?.coordinates?.lat) || 30.0444,
                        lng: parseFloat((data.locationDetails as any)?.coordinates?.lng) || 31.2357
                    }
                },
                rules: rulesArray.length > 0 ? rulesArray : ["Standard 5-a-side rules apply"]
            };

            await createTournamentApi(newTournament);
            alert("Tournament Created!");
            reset();
            loadData();
        } catch (e: any) {
            alert("Error creating tournament: " + e.message);
        }
    };

    const handleDelete = async (type: 'tournaments' | 'users' | 'teams', id: number) => {
        if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}? This cannot be undone.`)) return;
        await adminDeleteAnyApi(type, id);
        loadData();
    };

    // --- Specific Update Functions --

    const handleTournamentUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTournament || !editingTournament.id) return;

        await updateTournamentApi(editingTournament.id, editingTournament);
        setEditingTournament(null);
        loadData();
    };

    const handleUserUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !editingUser.id) return;

        await updateUserApi(editingUser.id, editingUser);
        setEditingUser(null);
        loadData();
    };

    const updateTournamentStatus = async (tournament: Tournament, newStatus: Tournament['status']) => {
        await updateTournamentApi(tournament.id!, { status: newStatus });
        loadData();
    }


    const TEMPLATES = {
        "custom": {
            name: "",
            location: "",
            rules: "",
            about: "",
            maxTeams: "",
            prizePool: "",
            registrationFee: "",
            locationDetails: { address: "" }
        },
        "5aside": {
            name: "Weekly 5-a-side Cup",
            location: "Cairo Stadium",
            rules: "5 players + 2 subs\n20 min halves\nNo sliding tackles\nYellow card = 2 min sin bin",
            about: "Standard weekly tournament for local teams. Great for casual yet competitive play.",
            maxTeams: 8,
            prizePool: 2000,
            registrationFee: 250,
            locationDetails: { address: "Nasr City, Cairo", coordinates: { lat: 30.0609, lng: 31.3285 } }
        },
        "weekend": {
            name: "Weekend Football Marathon",
            location: "Maadi Club",
            rules: "Knockout format\nPenalties if draw\n7 players max squad\nStrict fair play",
            about: "High intensity weekend tournament. Winner takes all!",
            maxTeams: 16,
            prizePool: 5000,
            registrationFee: 500,
            locationDetails: { address: "Maadi, Cairo", coordinates: { lat: 29.9602, lng: 31.2569 } }
        },
        "pro": {
            name: "Cairo Pro League",
            location: "New Cairo Sports City",
            rules: "FIFA Rules apply\nProfessional Refs\nFull kit required\n VAR (Experimental)",
            about: "The ultimate league for serious amateur teams. Scouting opportunities available.",
            maxTeams: 32,
            prizePool: 20000,
            registrationFee: 1500,
            locationDetails: { address: "New Cairo", coordinates: { lat: 30.0444, lng: 31.4656 } }
        }
    };

    const applyTemplate = (key: string) => {
        if (key === 'custom') {
            reset({ name: '' });
            return;
        }
        const t = TEMPLATES[key as keyof typeof TEMPLATES];
        reset({
            name: t.name,
            location: t.location,
            maxTeams: t.maxTeams as number,
            prizePool: t.prizePool as number,
            registrationFee: t.registrationFee as number,
            about: t.about,
            rules: (t.rules as any),
            locationDetails: {
                name: (t.locationDetails as any)?.name || t.location,
                address: (t.locationDetails as any)?.address,
                coordinates: {
                    lat: (t.locationDetails as any).coordinates?.lat,
                    lng: (t.locationDetails as any).coordinates?.lng
                }
            }
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <div className="flex space-x-2 bg-secondary/20 p-1 rounded-lg">
                    {(['create', 'tournaments', 'users', 'teams'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md transition-all ${activeTab === tab ? "bg-primary text-white shadow-lg" : "hover:bg-white/5"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* CREATE TAB */}
            {activeTab === 'create' && (
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create Special Tournament</h2>
                        <select
                            className="bg-background border border-input px-3 py-2 rounded-lg text-sm"
                            onChange={(e) => applyTemplate(e.target.value)}
                        >
                            <option value="custom">Load Template...</option>
                            <option value="5aside">5-a-Side Cup</option>
                            <option value="weekend">Weekend Marathon</option>
                            <option value="pro">Pro League</option>
                        </select>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input {...register("name", { required: true })} placeholder="Tournament Name" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                            <input {...register("location", { required: true })} placeholder="Location Name (e.g. Cairo Stadium)" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                            <input {...register("locationDetails.address")} placeholder="Address (e.g. 12 Nasr Rd)" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground ml-1">Start Date</label>
                                    <input type="date" {...register("startDate", { required: true })} className="w-full bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground ml-1">End Date</label>
                                    <input type="date" {...register("endDate", { required: true })} className="w-full bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                                </div>
                            </div>
                            <input type="number" {...register("maxTeams", { required: true })} placeholder="Max Teams" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                            <input type="number" {...register("prizePool", { required: true })} placeholder="Prize Pool ($)" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                            <input type="number" {...register("registrationFee", { required: true })} placeholder="Entry Fee ($)" className="bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none" />
                        </div>
                        <textarea {...register("about")} placeholder="Description / About" className="w-full bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none h-24" />
                        <textarea {...register("rules")} placeholder="Rules (one per line)" className="w-full bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none h-24" />

                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground ml-1">Initial Status</label>
                            <select {...register("status")} className="w-full bg-background border border-input px-4 py-3 rounded-lg focus:ring-2 ring-primary outline-none">
                                <option value="registration_open">Registration Open (Default)</option>
                                <option value="upcoming">Upcoming (Registration Closed)</option>
                                <option value="live">Live (Ongoing)</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all transform hover:scale-[1.01]">
                            Launch Tournament
                        </button>
                    </form>
                </div>
            )}

            {/* TOURNAMENTS MANAGEMENT TAB */}
            {activeTab === 'tournaments' && (
                <div className="space-y-4">
                    {tournaments.map(t => (
                        <div key={t.id} className="bg-card border border-border/50 p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4 group hover:border-primary/50 transition-all shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-xl">{t.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full border uppercase tracking-wider font-bold ${t.status === 'live' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                        t.status === 'completed' ? 'bg-muted text-muted-foreground border-border' :
                                            t.status === 'upcoming' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                'bg-green-500/10 text-green-500 border-green-500/20'
                                        }`}>
                                        {t.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{t.location} • {t.startDate}</p>
                                <p className="text-sm">Teams: {t.teamsRegistered}/{t.maxTeams}</p>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                {/* Status Controls */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => updateTournamentStatus(t, 'registration_open')}
                                        disabled={t.status === 'registration_open'}
                                        className="text-xs border border-border rounded px-2 py-1 hover:bg-accent disabled:opacity-50"
                                    >
                                        Open Reg
                                    </button>
                                    <button
                                        onClick={() => updateTournamentStatus(t, 'upcoming')}
                                        disabled={t.status === 'upcoming'}
                                        className="text-xs border border-border rounded px-2 py-1 hover:bg-accent disabled:opacity-50"
                                    >
                                        Close Reg
                                    </button>
                                    <button
                                        onClick={() => updateTournamentStatus(t, 'live')}
                                        disabled={t.status === 'live'}
                                        className="text-xs border border-destructive/30 rounded px-2 py-1 hover:bg-destructive/10 disabled:opacity-50 text-destructive"
                                    >
                                        Start (Live)
                                    </button>
                                    <button
                                        onClick={() => updateTournamentStatus(t, 'completed')}
                                        disabled={t.status === 'completed'}
                                        className="text-xs border border-border rounded px-2 py-1 hover:bg-accent disabled:opacity-50"
                                    >
                                        End
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingTournament(t)} className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 flex items-center justify-center gap-2">
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete('tournaments', t.id!)} className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* USERS MANAGEMENT TAB */}
            {activeTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <div key={user.id} className="bg-card border border-border/50 p-4 rounded-xl flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <p className="font-bold truncate">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-600' : 'bg-secondary'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-secondary/10 p-2 rounded-lg">
                                <div>
                                    <p className="opacity-50">Matches</p>
                                    <p className="font-bold">{user.stats?.matchesPlayed || 0}</p>
                                </div>
                                <div>
                                    <p className="opacity-50">Goals</p>
                                    <p className="font-bold">{user.stats?.goals || 0}</p>
                                </div>
                                <div className="text-destructive">
                                    <p className="opacity-50">Reds</p>
                                    <p className="font-bold">{user.stats?.redCards || 0}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-auto pt-2">
                                <button onClick={() => setEditingUser(user)} className="flex-1 py-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded">
                                    Edit Profile
                                </button>
                                <button onClick={() => handleDelete('users', user.id!)} className="px-2 py-1.5 text-xs bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded">
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TEAMS MANAGEMENT TAB */}
            {activeTab === 'teams' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map(team => (
                        <div key={team.id} className="bg-card border border-border/50 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{team.name}</h3>
                                <p className="text-xs text-muted-foreground">Players: {team.playerCount} • Pts: {team.points}</p>
                                {team.roster && <p className="text-xs text-primary mt-1">{team.roster.length} members on roster</p>}
                            </div>
                            <button onClick={() => handleDelete('teams', team.id!)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODALS --- */}

            {/* Edit Tournament Modal */}
            {editingTournament && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit Tournament</h2>
                            <button onClick={() => setEditingTournament(null)} className="p-2 hover:bg-secondary rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleTournamentUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Name</label>
                                    <input value={editingTournament.name} onChange={e => setEditingTournament({ ...editingTournament, name: e.target.value })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Location</label>
                                    <input value={editingTournament.location} onChange={e => setEditingTournament({ ...editingTournament, location: e.target.value })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-semibold">About</label>
                                    <textarea value={editingTournament.about} onChange={e => setEditingTournament({ ...editingTournament, about: e.target.value })} className="w-full bg-background border px-3 py-2 rounded-lg h-20" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Prize Pool</label>
                                    <input type="number" value={editingTournament.prizePool} onChange={e => setEditingTournament({ ...editingTournament, prizePool: parseInt(e.target.value) })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold">Max Teams</label>
                                    <input type="number" value={editingTournament.maxTeams} onChange={e => setEditingTournament({ ...editingTournament, maxTeams: parseInt(e.target.value) })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Edit User Profile</h2>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-secondary rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUserUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Full Name</label>
                                <input value={editingUser.fullName} onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'user' })}
                                    className="w-full bg-background border px-3 py-2 rounded-lg"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wider">Stats Override</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Goals</label>
                                        <input type="number" value={editingUser.stats?.goals} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats!, goals: parseInt(e.target.value) } })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Assists</label>
                                        <input type="number" value={editingUser.stats?.assists} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats!, assists: parseInt(e.target.value) } })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">Matches</label>
                                        <input type="number" value={editingUser.stats?.matchesPlayed} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats!, matchesPlayed: parseInt(e.target.value) } })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-destructive">Red Cards</label>
                                        <input type="number" value={editingUser.stats?.redCards} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats!, redCards: parseInt(e.target.value) } })} className="w-full bg-background border px-3 py-2 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl mt-4 flex items-center justify-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
