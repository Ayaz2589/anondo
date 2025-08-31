"use client";

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, getGoogleMapsUrl } from "@/lib/google-maps";
import { MapPin, ExternalLink } from "lucide-react";

interface GoogleMapPreviewProps {
  lat: number;
  lng: number;
  address: string;
  locationName?: string;
  className?: string;
  height?: string;
  showOpenButton?: boolean;
}

export default function GoogleMapPreview({
  lat,
  lng,
  address,
  locationName,
  className = "",
  height = "200px",
  showOpenButton = true,
}: GoogleMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Google Maps API
        await loadGoogleMaps();

        if (!mapRef.current) return;

        // Create map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: "cooperative",
        });

        // Add marker
        new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: locationName || address,
        });

        setMap(mapInstance);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize Google Map:", err);
        setError("Failed to load map");
        setIsLoading(false);
      }
    };

    if (lat && lng) {
      initializeMap();
    }
  }, [lat, lng, address, locationName]);

  const handleOpenInGoogleMaps = () => {
    const url = getGoogleMapsUrl(address, lat, lng);
    window.open(url, "_blank");
  };

  if (error) {
    return (
      <div
        className={`bg-gray-100 rounded-lg p-4 ${className}`}
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">{error}</p>
            {showOpenButton && (
              <button
                onClick={handleOpenInGoogleMaps}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mx-auto"
              >
                <ExternalLink className="h-3 w-3" />
                Open in Google Maps
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} style={{ height }} className="w-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {showOpenButton && !isLoading && !error && (
        <button
          onClick={handleOpenInGoogleMaps}
          className="absolute top-2 right-2 bg-white shadow-md rounded-md p-2 hover:bg-gray-50 transition-colors"
          title="Open in Google Maps"
        >
          <ExternalLink className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {(locationName || address) && !isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2">
          <p className="text-sm font-medium truncate">
            {locationName || address}
          </p>
        </div>
      )}
    </div>
  );
}
