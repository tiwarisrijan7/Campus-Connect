import {
  College,
  Club,
  Event,
  UserProfile,
  CollaborationRequest,
  CollaborationStatus,
  EventRegistration,
  ReportItem,
} from '../types/database';
import {
  INITIAL_COLLEGES,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_COLLABORATIONS,
  DEMO_USERS,
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  CLUBS: 'campusconnect_clubs_v1',
  EVENTS: 'campusconnect_events_v1',
  COLLABS: 'campusconnect_collabs_v1',
  PROFILES: 'campusconnect_profiles_v1',
  CURRENT_USER_ID: 'campusconnect_current_user_id_v1',
  REGISTRATIONS: 'campusconnect_registrations_v1',
  REPORTS: 'campusconnect_reports_v1',
};

// In-memory fallback dictionary for non-browser or test environments
const inMemoryStore: Record<string, string> = {};

function getStore(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      return localStorage;
    }
  } catch {
    // Ignore and fallback to in-memory
  }
  return null;
}

// Helper for local storage retrieval
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const store = getStore();
    const raw = store ? store.getItem(key) : inMemoryStore[key];
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    const store = getStore();
    const serialized = JSON.stringify(value);
    if (store) {
      store.setItem(key, serialized);
    }
    inMemoryStore[key] = serialized;
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// Initialize seed data if not present
export function initializeStorage(): void {
  if (!getFromStorage<any>(STORAGE_KEYS.CLUBS, null)) {
    saveToStorage(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
  }
  if (!getFromStorage<any>(STORAGE_KEYS.EVENTS, null)) {
    saveToStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  if (!getFromStorage<any>(STORAGE_KEYS.COLLABS, null)) {
    saveToStorage(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
  }
  if (!getFromStorage<any>(STORAGE_KEYS.PROFILES, null)) {
    saveToStorage(STORAGE_KEYS.PROFILES, DEMO_USERS);
  }
  if (!getFromStorage<any>(STORAGE_KEYS.CURRENT_USER_ID, null)) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USERS[0].id); // Alex Chen by default
  }
  if (!getFromStorage<any>(STORAGE_KEYS.REGISTRATIONS, null)) {
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, []);
  }
  if (!getFromStorage<any>(STORAGE_KEYS.REPORTS, null)) {
    saveToStorage(STORAGE_KEYS.REPORTS, []);
  }
}

// Ensure initialization runs
initializeStorage();

export const StorageService = {
  // COLLEGES
  async getColleges(): Promise<College[]> {
    return INITIAL_COLLEGES;
  },

  // CLUBS
  async getClubs(): Promise<Club[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('clubs').select('*');
      if (!error && data && data.length > 0) return data as Club[];
    }
    return getFromStorage<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
  },

  async getClubById(id: string): Promise<Club | null> {
    const clubs = await this.getClubs();
    return clubs.find((c) => c.id === id) || null;
  },

  async createClub(club: Omit<Club, 'id' | 'createdAt'>): Promise<Club> {
    const newClub: Club = {
      ...club,
      id: `club-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('clubs').insert([newClub]);
    }

    const clubs = getFromStorage<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    clubs.unshift(newClub);
    saveToStorage(STORAGE_KEYS.CLUBS, clubs);
    return newClub;
  },

  async updateClub(updatedClub: Club): Promise<Club> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('clubs').update(updatedClub).eq('id', updatedClub.id);
    }

    const clubs = getFromStorage<Club[]>(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    const index = clubs.findIndex((c) => c.id === updatedClub.id);
    if (index !== -1) {
      clubs[index] = updatedClub;
      saveToStorage(STORAGE_KEYS.CLUBS, clubs);
    }
    return updatedClub;
  },

  // EVENTS
  async getEvents(): Promise<Event[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('events').select('*');
      if (!error && data && data.length > 0) return data as Event[];
    }
    return getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  async getEventById(id: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find((e) => e.id === id) || null;
  },

  async createEvent(event: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>): Promise<Event> {
    const newEvent: Event = {
      ...event,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('events').insert([newEvent]);
    }

    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    events.unshift(newEvent);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  async registerForEvent(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const registrations = getFromStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const existing = registrations.find((r) => r.eventId === eventId && r.userId === userId);

    if (existing) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId,
      registeredAt: new Date().toISOString(),
    };
    registrations.push(newReg);
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Increment registeredCount on event
    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      ev.registeredCount += 1;
      saveToStorage(STORAGE_KEYS.EVENTS, events);
    }

    return { success: true, message: 'Successfully registered for event!' };
  },

  async getUserRegistrations(userId: string): Promise<string[]> {
    const registrations = getFromStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    return registrations.filter((r) => r.userId === userId).map((r) => r.eventId);
  },

  // COLLABORATION REQUESTS
  async getCollaborationRequests(): Promise<CollaborationRequest[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.from('collaboration_requests').select('*');
      if (!error && data && data.length > 0) return data as CollaborationRequest[];
    }
    return getFromStorage<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
  },

  async createCollaborationRequest(
    req: Omit<CollaborationRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<{ success: boolean; request?: CollaborationRequest; error?: string }> {
    const collabs = getFromStorage<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);

    // Duplicate check: Prevent sending when there's an active pending request between the same two clubs
    const existing = collabs.find(
      (c) =>
        c.initiatorClubId === req.initiatorClubId &&
        c.targetClubId === req.targetClubId &&
        c.status === 'pending'
    );

    if (existing) {
      return {
        success: false,
        error: 'A pending collaboration request is already active between these two clubs.',
      };
    }

    const newReq: CollaborationRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('collaboration_requests').insert([newReq]);
    }

    collabs.unshift(newReq);
    saveToStorage(STORAGE_KEYS.COLLABS, collabs);

    return { success: true, request: newReq };
  },

  async updateCollaborationStatus(
    requestId: string,
    status: CollaborationStatus,
    rejectionReason?: string
  ): Promise<CollaborationRequest | null> {
    const collabs = getFromStorage<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
    const item = collabs.find((c) => c.id === requestId);
    if (!item) return null;

    item.status = status;
    item.updatedAt = new Date().toISOString();
    if (rejectionReason) {
      item.rejectionReason = rejectionReason;
    }

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('collaboration_requests')
        .update({ status, rejectionReason, updatedAt: item.updatedAt })
        .eq('id', requestId);
    }

    saveToStorage(STORAGE_KEYS.COLLABS, collabs);
    return item;
  },

  // USERS & PROFILES
  async getAllProfiles(): Promise<UserProfile[]> {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, DEMO_USERS);
  },

  async getProfileById(userId: string): Promise<UserProfile | null> {
    const profiles = await this.getAllProfiles();
    return profiles.find((p) => p.id === userId) || null;
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const profiles = await this.getAllProfiles();
    const idx = profiles.findIndex((p) => p.id === profile.id);
    if (idx !== -1) {
      profiles[idx] = profile;
    } else {
      profiles.push(profile);
    }
    saveToStorage(STORAGE_KEYS.PROFILES, profiles);
    return profile;
  },

  getCurrentUserId(): string {
    return getFromStorage<string>(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USERS[0].id);
  },

  setCurrentUserId(id: string): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, id);
  },

  async getCurrentUser(): Promise<UserProfile> {
    const currentId = this.getCurrentUserId();
    const profile = await this.getProfileById(currentId);
    return profile || DEMO_USERS[0];
  },

  getDemoUsers(): UserProfile[] {
    return DEMO_USERS;
  },

  // REPORTS & MODERATION
  async getReports(): Promise<ReportItem[]> {
    return getFromStorage<ReportItem[]>(STORAGE_KEYS.REPORTS, []);
  },

  async createReport(report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>): Promise<ReportItem> {
    const reports = await this.getReports();
    const newReport: ReportItem = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    saveToStorage(STORAGE_KEYS.REPORTS, reports);
    return newReport;
  },

  async resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<void> {
    const reports = await this.getReports();
    const item = reports.find((r) => r.id === reportId);
    if (item) {
      item.status = status;
      saveToStorage(STORAGE_KEYS.REPORTS, reports);
    }
  },

  // RESET TO FACTORY DEMO STATE
  resetAllData(): void {
    saveToStorage(STORAGE_KEYS.CLUBS, INITIAL_CLUBS);
    saveToStorage(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    saveToStorage(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
    saveToStorage(STORAGE_KEYS.PROFILES, DEMO_USERS);
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, DEMO_USERS[0].id);
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, []);
    saveToStorage(STORAGE_KEYS.REPORTS, []);
  },
};
