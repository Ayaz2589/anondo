"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { getGoogleMapsUrl } from "@/lib/google-maps";

interface ClickableAddressProps {
  address: string;
  locationName?: string;
  lat?: number;
  lng?: number;
  className?: string;
  showIcon?: boolean;
  showExternalIcon?: boolean;
}

export default function ClickableAddress({
  address,
  locationName,
  lat,
  lng,
  className = "",
  showIcon = true,
  showExternalIcon = true,
}: ClickableAddressProps) {
  const handleClick = () => {
    const url = getGoogleMapsUrl(address, lat, lng);
    window.open(url, "_blank");
  };

  if (!address) return null;

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-left hover:text-blue-600 transition-colors group ${className}`}
      title="Open in Google Maps"
    >
      {showIcon && (
        <MapPin className="h-4 w-4 text-gray-500 group-hover:text-blue-600 flex-shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        {locationName && (
          <div className="font-medium text-sm truncate">{locationName}</div>
        )}
        <div
          className={`text-sm text-gray-600 group-hover:text-blue-600 truncate ${
            locationName ? "" : "font-medium"
          }`}
        >
          {address}
        </div>
      </div>
      {showExternalIcon && (
        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
      )}
    </button>
  );
}
