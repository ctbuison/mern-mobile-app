const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_URL is missing. Create a .env file in the project root (Module 6, Phase 1).'
  );
}

export const API_URL = apiUrl;