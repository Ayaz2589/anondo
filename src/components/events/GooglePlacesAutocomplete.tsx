"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, formatPlaceDetails } from "@/lib/google-maps";

interface PlaceDetails {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function GooglePlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Enter location...",
  defaultValue = "",
  className = "",
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps API
        await loadGoogleMaps();

        if (!inputRef.current) return;

        // Create autocomplete instance
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["establishment", "geocode"],
            fields: ["name", "formatted_address", "geometry", "place_id"],
          }
        );

        // Add place changed listener
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (place && place.geometry) {
            const placeDetails = formatPlaceDetails(place);
            onPlaceSelect(placeDetails);
          }
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize Google Places Autocomplete:", err);
        setError(
          "Failed to load location services. Please enter address manually."
        );
        setIsLoading(false);
      }
    };

    initializeAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  if (error) {
    return (
      <div className="space-y-2">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
        <p className="text-sm text-amber-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Loading location services..." : placeholder}
        defaultValue={defaultValue}
        disabled={isLoading}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
