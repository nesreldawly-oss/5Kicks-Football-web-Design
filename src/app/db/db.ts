import Dexie, { type Table } from 'dexie';
import * as bcrypt from 'bcryptjs';

// --- Types ---

export interface User {
  id?: number;
  email: string;
  passwordHash: string; // Storing hashed passwords, even locally, is good practice
  fullName: string;
  role: 'admin' | 'user';
  // Profile stats
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
}

export interface Tournament {
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
}

export interface Team {
  id?: number;
  name: string;
  ownerId: number; // User who created the team
  playerCount: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsScored: number;
  goalsConceded: number;
  tournamentId?: number; // Current tournament they are in
  location?: string;
  description?: string;
  contactEmail?: string;
  phoneNumber?: string;
  level?: "Beginner" | "Amateur" | "Competitive" | "Pro";
  primaryColor?: string;
  roster?: { name: string; number: number; position?: string }[];
}

export interface Message {
  id?: number;
  senderId: number;
  senderName: string;
  text: string;
  timestamp: number;
  channelId: string; // "admin" or "team_{teamId}"
}

// --- Database Class ---

export class MyDatabase extends Dexie {
  users!: Table<User>;
  tournaments!: Table<Tournament>;
  teams!: Table<Team>;
  messages!: Table<Message>;

  constructor() {
    super('5KicksDB');
    this.version(1).stores({
      users: '++id, &email, role', // &email means unique index
      tournaments: '++id, status',
      teams: '++id, ownerId, tournamentId',
      messages: '++id, channelId, senderId'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    // Seed Admin User
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('abdo0990', salt);

    await this.users.add({
      email: 'nesreldawly@gmail.com',
      passwordHash: hash,
      fullName: 'Nasr Eldawly', // Assuming naming convention
      role: 'admin',
      stats: {
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        winRate: 0,
        yellowCards: 0,
        redCards: 0
      }
    });

    // Seed Demo User
    const userHash = await bcrypt.hash('user123', salt);
    await this.users.add({
      email: 'demo@user.com',
      passwordHash: userHash,
      fullName: 'Demo Player',
      role: 'user',
      position: 'Forward',
      jerseyNumber: 10,
      stats: {
        matchesPlayed: 15,
        goals: 12,
        assists: 5,
        winRate: 60,
        yellowCards: 1,
        redCards: 0
      }
    });

    console.log("Database seeded with Admin user.");
  }
}

export const db = new MyDatabase();
