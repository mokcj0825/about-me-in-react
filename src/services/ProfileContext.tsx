import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { getProfile, ProfileResponse, Profile } from './get-profile';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

/**
 * ProfileProvider - Provides profile data to all child components
 * Fetches the profile once on mount and caches it
 */
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: ProfileResponse = await getProfile();
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Now fetchProfile is stable due to useCallback

  const value: ProfileContextType = useMemo(() => ({
    profile,
    loading,
    error,
    refetch: fetchProfile,
  }), [profile, loading, error, fetchProfile]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * useProfile - Hook to access profile data from any component
 * @returns ProfileContextType with profile data, loading state, error, and refetch function
 * @throws Error if used outside of ProfileProvider
 */
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

