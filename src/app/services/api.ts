import { db } from '../db/db';
import * as bcrypt from 'bcryptjs';
import type { User, Tournament, Team, Message } from '../types';

// Types re-export
export type { User, Tournament, Team, Message };

export type AuthResponse = {
    token: string;
    userId: number;
    fullName: string;
    email: string;
    role: string;
};

export type ProfileResponse = {
    user: User;
    tournaments?: Tournament[];
};

// --- Helper Helpers ---

function mapDbUser(user: any): User {
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
    };
}

function mapDbTournament(t: any): Tournament {
    return {
        ...t, // Assume most fields match
        id: t.id // Ensure ID exists and is number (it is in Dexie)
    };
}

function mapDbTeam(t: any): Team {
    return {
        ...t,
        id: t.id
    };
}


// --- API Functions (Local DB) ---

export const signup = async (userData: { fullName: string, email: string, password: string }) => {
    // Check if email exists
    const existing = await db.users.where('email').equals(userData.email).first();
    if (existing) {
        throw new Error("Email already registered");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);

    const userId = await db.users.add({
        email: userData.email,
        passwordHash: hash,
        fullName: userData.fullName,
        role: userData.email === 'nesreldawly@gmail.com' ? 'admin' : 'user',
        stats: {
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            winRate: 0,
            yellowCards: 0,
            redCards: 0
        }
    });

    const user = await db.users.get(userId);
    if (!user) throw new Error("Registration failed");

    return {
        token: `fake-jwt-token-${userId}`,
        userId: user.id!,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };
};

export const resetPasswordApi = async (email: string, newPassword: string) => {
    const user = await db.users.where('email').equals(email).first();
    if (!user) {
        throw new Error("No account found with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await db.users.update(user.id!, { passwordHash: hash });
    return true;
};

export const loginApi = async (credentials: { email: string, password: string }) => {
    const user = await db.users.where('email').equals(credentials.email).first();

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // AUTO-FIX: If this is the admin email, ensure they have admin role
    if (user.email === 'nesreldawly@gmail.com' && user.role !== 'admin') {
        await db.users.update(user.id!, { role: 'admin' });
        user.role = 'admin';
    }

    const response = {
        token: `fake-jwt-token-${user.id}`,
        userId: user.id!,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUserId', response.userId.toString());
    return response;
};

export const logoutApi = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserId');
};

export const getProfileApi = async (): Promise<ProfileResponse> => {
    const userIdStr = localStorage.getItem('currentUserId');
    if (!userIdStr) throw new Error("No session");

    const user = await db.users.get(parseInt(userIdStr));
    if (!user) throw new Error("User not found");

    return { user: mapDbUser(user) };
};

export const getTournamentsApi = async (): Promise<Tournament[]> => {
    const tournaments = await db.tournaments.toArray();
    return tournaments.map(mapDbTournament);
};

export const getMyTeamsApi = async (): Promise<Team[]> => {
    const userIdStr = localStorage.getItem('currentUserId');
    if (!userIdStr) return [];
    const teams = await db.teams.where('ownerId').equals(parseInt(userIdStr)).toArray();
    return teams.map(mapDbTeam);
};

export const createTeamApi = async (teamData: {
    name: string,
    ownerId: number,
    roster?: { name: string, number: number }[],
    location?: string,
    description?: string,
    contactEmail?: string,
    phoneNumber?: string,
    level?: string,
    primaryColor?: string
}) => {
    if (!teamData.name) throw new Error("Team name is required");

    const id = await db.teams.add({
        name: teamData.name,
        ownerId: teamData.ownerId,
        playerCount: teamData.roster?.length || 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goalsScored: 0,
        goalsConceded: 0,
        location: teamData.location || "",
        description: teamData.description || "",
        contactEmail: teamData.contactEmail || "",
        phoneNumber: teamData.phoneNumber || "",
        level: (teamData.level as any) || "Amateur",
        primaryColor: teamData.primaryColor || "#3b82f6",
        roster: teamData.roster || []
    });
    const team = await db.teams.get(id);
    return mapDbTeam(team);
};

// --- New Admin/Feature APIs ---

export const getAllUsersApi = async (): Promise<User[]> => {
    const users = await db.users.toArray();
    return users.map(mapDbUser);
};

export const getAllTeamsApi = async (): Promise<Team[]> => {
    const teams = await db.teams.toArray();
    return teams.map(mapDbTeam);
};

export const updateTournamentApi = async (id: number, data: Partial<Tournament>) => {
    await db.tournaments.update(id, data as any);
};

export const updateUserApi = async (id: number, data: Partial<User>) => {
    // If role is changing, we might need special handling, but direct update works for Dexie
    await db.users.update(id, data as any);
};

export const getUserTournamentsApi = async (userId: number): Promise<Tournament[]> => {
    // 1. Find all teams owned by user
    const teams = await db.teams.where('ownerId').equals(userId).toArray();
    // 2. Filter teams that are in a tournament
    const tournamentIds = teams.map(t => t.tournamentId).filter(id => id !== undefined) as number[];
    // 3. unique IDs
    const uniqueIds = [...new Set(tournamentIds)];
    // 4. Fetch tournaments
    const tournaments = await db.tournaments.bulkGet(uniqueIds);
    return tournaments.filter(t => t !== undefined) as Tournament[];
}

export const joinTournamentApi = async (tournamentId: number, teamId: number, roster?: { name: string, number: number }[]) => {
    const team = await db.teams.get(teamId);
    const tournament = await db.tournaments.get(tournamentId);

    if (!team || !tournament) throw new Error("Target not found");

    // Update team with tournament ID and Roster
    await db.teams.update(teamId, {
        tournamentId: tournamentId,
        roster: roster || []
    });
    // Update tournament count
    await db.tournaments.update(tournamentId, { teamsRegistered: tournament.teamsRegistered + 1 });

    return { success: true };
};

// --- Admin APIs ---

export const createTournamentApi = async (data: Partial<Tournament>) => {
    // We assume incoming data matches the shape we need, except ID
    // DB type might be slightly different but Dexie is flexible with 'add'
    // We need to ensure we don't pass 'id' if it's undefined/null? Dexie handles auto-inc.
    return await db.tournaments.add(data as any);
}

export const deleteTournamentApi = async (id: number) => {
    return await db.tournaments.delete(id);
}

// "Remove Anything" - Dangerous Admin Tool
export const adminDeleteAnyApi = async (table: 'users' | 'tournaments' | 'teams', id: number) => {
    if (table === 'users') return await db.users.delete(id);
    if (table === 'tournaments') return await db.tournaments.delete(id);
    if (table === 'teams') return await db.teams.delete(id);
}

// --- Chat APIs ---

export const sendMessageApi = async (messageData: { senderId: number, senderName: string, text: string, channelId: string }) => {
    const id = await db.messages.add({
        ...messageData,
        timestamp: Date.now()
    });
    return await db.messages.get(id);
};

export const getMessagesApi = async (channelId: string) => {
    return await db.messages.where('channelId').equals(channelId).sortBy('timestamp');
};

export const getChatChannelsApi = async (userId: number) => {
    // 1. Static channel for Admin Support
    const channels = [
        { id: 'admin', name: 'Admin Support', type: 'admin' }
    ];

    // 2. Dynamic channels for Team Chats (teams the user is in)
    // Use the logic from getUserTournamentsApi to find teams the user owns
    // In a more complex app, we'd check team membership, but here ownership is key
    const myTeams = await db.teams.where('ownerId').equals(userId).toArray();

    myTeams.forEach(team => {
        channels.push({
            id: `team_${team.id}`,
            name: `${team.name} Team Chat`,
            type: 'team'
        });
    });

    return channels;
};
