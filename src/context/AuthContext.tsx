import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Club } from '../types/database';
import { StorageService } from '../services/storage';
import { isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  userClubs: Club[];
  switchUser: (userId: string) => Promise<void>;
  updateCurrentProfile: (profile: UserProfile) => Promise<void>;
  isDemoMode: boolean;
  isBackendConnected: boolean;
  refreshUserData: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(StorageService.getDemoUsers()[0]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(StorageService.getDemoUsers());
  const [userClubs, setUserClubs] = useState<Club[]>([]);
  const isBackendConnected = isSupabaseConfigured();
  const isDemoMode = !isBackendConnected;

  const refreshUserData = async () => {
    const user = await StorageService.getCurrentUser();
    const profiles = await StorageService.getAllProfiles();
    const allClubs = await StorageService.getClubs();
    
    setCurrentUser(user);
    setAllUsers(profiles);
    
    // Clubs where the current user is the lead or a member
    const myClubs = allClubs.filter(
      (c) => c.leadUserId === user.id || (user.clubMemberships && user.clubMemberships.includes(c.id))
    );
    setUserClubs(myClubs);
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const switchUser = async (userId: string) => {
    StorageService.setCurrentUserId(userId);
    await refreshUserData();
  };

  const updateCurrentProfile = async (profile: UserProfile) => {
    const updated = await StorageService.updateProfile(profile);
    setCurrentUser(updated);
    await refreshUserData();
  };

  const signOut = () => {
    // In demo mode, fallback to student profile
    const student = allUsers.find((u) => u.role === 'student') || allUsers[0];
    switchUser(student.id);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        userClubs,
        switchUser,
        updateCurrentProfile,
        isDemoMode,
        isBackendConnected,
        refreshUserData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
