export type Screen =
    | "login"
    | "signup"
    | "home"
    | "tournamentDetails"
    | "tournamentLocation"
    | "myTeams"
    | "profile"
    | "payment"
    | "chat"
    | "admin";

export type User = {
    id: number;
    email: string;
    fullName: string;
    role: 'admin' | 'user';
    position?: string;
    jerseyNumber?: number;
    stats?: {
        matchesPlayed: number;
        goals: number;
        assists: number;
        winRate: number;
        yellowCards: number;
        redCards: number;
    };
};

export type Tournament = {
    id?: number;
    name: string;
    status: "registration_open" | "upcoming" | "live" | "completed";
    startDate: string;
    endDate: string;
    location: string;
    locationDetails: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number };
    };
    teamsRegistered: number;
    maxTeams: number;
    prizePool: number;
    registrationFee: number;
    about: string;
    rules: string[];
};

export type Team = {
    id?: number;
    name: string;
    playerCount: number;
    wins: number;
    draws: number;
    losses: number;
    points: number;
    goalsScored: number;
    goalsConceded: number;
    location?: string;
    description?: string;
    contactEmail?: string;
    phoneNumber?: string;
    level?: "Beginner" | "Amateur" | "Competitive" | "Pro";
    primaryColor?: string;
    roster?: { name: string; number: number; position?: string }[];
};

export type Message = {
    id?: number;
    senderId: number;
    senderName: string;
    text: string;
    timestamp: number;
    channelId: string; // "admin" or "team_{teamId}"
};
