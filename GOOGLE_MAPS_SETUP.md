# Google Maps Integration Setup

## Overview

This project now includes Google Maps integration for event locations. Users can:

- Search for addresses using Google Places Autocomplete
- View event locations on interactive maps
- Click addresses to open in Google Maps

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API (optional, for additional features)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Configure Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Google Maps API (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"

# Add your other existing environment variables...
DATABASE_URL="postgresql://username:password@localhost:5432/anondo"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Run Database Migration

The new location fields have been added to the Event model:

```bash
# Migration has already been created and applied
# If you need to reset your database:
npx prisma migrate reset
npx prisma db push
```

### 4. Features

#### Event Creation/Editing

- Google Places Autocomplete for address input
- Map preview when location is selected
- Stores detailed location data (coordinates, formatted address, place ID)

#### Event Display

- Clickable addresses that open in Google Maps
- Interactive map previews on event details pages
- Backward compatibility with existing location data

#### Event Cards

- Clickable location links in event listings
- Clean address display with Google Maps integration

### 5. Development vs Production

**Development Mode:**

- If no API key is provided, the system gracefully falls back to manual text input
- Error messages guide users to set up the API key

**Production Mode:**

- Full Google Maps integration with autocomplete and map previews
- Enhanced user experience with interactive location features

### 6. Security Notes

- API key is exposed to the client (NEXT*PUBLIC*\*)
- Restrict your API key to your domain in Google Cloud Console
- Consider implementing usage quotas to prevent abuse
- Monitor API usage in Google Cloud Console

### 7. Troubleshooting

**"Failed to load location services":**

- Check if NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
- Verify API key has correct permissions
- Check browser console for detailed errors

**Maps not loading:**

- Ensure Maps JavaScript API is enabled
- Check API key restrictions
- Verify domain is whitelisted

**Autocomplete not working:**

- Ensure Places API is enabled
- Check API key permissions
- Verify network connectivity
