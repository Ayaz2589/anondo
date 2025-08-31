import { Loader } from '@googlemaps/js-api-loader';

// Google Maps configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'geometry'] as const,
};

// Initialize Google Maps loader
export const googleMapsLoader = new Loader({
  ...GOOGLE_MAPS_CONFIG,
  libraries: [...GOOGLE_MAPS_CONFIG.libraries]
});

// Helper function to load Google Maps API
export const loadGoogleMaps = async () => {
  if (!GOOGLE_MAPS_CONFIG.apiKey) {
    throw new Error('Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
  }
  
  try {
    await googleMapsLoader.load();
    return (window as any).google;
  } catch (error) {
    console.error('Failed to load Google Maps API:', error);
    throw error;
  }
};

// Helper function to generate Google Maps URL for directions
export const getGoogleMapsUrl = (address: string, lat?: number, lng?: number) => {
  if (lat && lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

// Helper function to format place details
export const formatPlaceDetails = (place: any) => {
  return {
    name: place.name || '',
    address: place.formatted_address || '',
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
    placeId: place.place_id || '',
  };
};
