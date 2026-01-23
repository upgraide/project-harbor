"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

type LocationMapPreviewProps = {
  location: string;
  onGeocodeError?: () => void;
  onGeocodeSuccess?: () => void;
};

// Zoom level constants
const DEFAULT_ZOOM = 13;

// Default map center (Lisbon, Portugal)
const DEFAULT_CENTER = { lat: 38.7223, lng: -9.1393 };

// Use a public, non-sensitive map ID for styling
const MAP_ID = "roadmap";

type GeocodeResult = {
  lat: number;
  lng: number;
  formatted_address: string;
  bounds?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
};

export const LocationMapPreview = ({
  location,
  onGeocodeError,
  onGeocodeSuccess,
}: LocationMapPreviewProps) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      return;
    }

    // Geocode using our server-side API endpoint
    const geocodeLocation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/geocode?address=${encodeURIComponent(location)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Location not found. Please check the address.");
          setIsLoading(false);
          onGeocodeError?.();
          return;
        }

        const data = (await response.json()) as GeocodeResult;
        const newCenter = { lat: data.lat, lng: data.lng };

        setCenter(newCenter);
        setMarkerPosition(newCenter);

        // Calculate zoom based on bounds if available
        if (data.bounds) {
          const latDiff = Math.abs(
            data.bounds.northeast.lat - data.bounds.southwest.lat
          );
          const lngDiff = Math.abs(
            data.bounds.northeast.lng - data.bounds.southwest.lng
          );
          const maxDiff = Math.max(latDiff, lngDiff);

          // Determine appropriate zoom level
          let calculatedZoom = DEFAULT_ZOOM;
          if (maxDiff < 0.01) calculatedZoom = 18; // Street level
          else if (maxDiff < 0.1) calculatedZoom = 16; // Neighborhood
          else if (maxDiff < 0.5) calculatedZoom = 13; // City
          else calculatedZoom = 10; // Region

          setZoom(calculatedZoom);
        }

        setIsLoading(false);
        onGeocodeSuccess?.();
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Failed to load map. Please try again.");
        setIsLoading(false);
        onGeocodeError?.();
      }
    };

    geocodeLocation();
  }, [location, onGeocodeError, onGeocodeSuccess]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-destructive text-sm">
          <AlertCircle className="size-4" />
          <p>{error}</p>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border border-border bg-muted p-4">
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      )}
      <div className="h-96 w-full rounded-lg border border-border overflow-hidden">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <Map
            key={`${center.lat}-${center.lng}`}
            mapId={MAP_ID}
            defaultCenter={center}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            streetViewControl={true}
            fullscreenControl={true}
            clickableIcons={true}
          >
            {markerPosition && <AdvancedMarker position={markerPosition} />}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};
