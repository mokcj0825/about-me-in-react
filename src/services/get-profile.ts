// Profile API Service

export interface Profile {
  id: string;
  name: string;
  bio: string;
  updatedAt: string;
  title: string;
}

export interface ProfileResponse {
  profile: Profile;
}

/**
 * Fetches the user profile from the API
 * @returns Promise<ProfileResponse> The profile data
 * @throws Error if the API request fails
 */
export async function getProfile(): Promise<ProfileResponse> {
  try {
    const response = await fetch('https://api.cjmok.com/get-profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProfileResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
}

