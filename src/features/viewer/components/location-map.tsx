"use client";

import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

type LocationMapProps = {
  location: string;
};

// Zoom level constants
const DEFAULT_ZOOM = 13;

// Default map center (Lisbon, Portugal)
const DEFAULT_CENTER = { lat: 38.7223, lng: -9.1393 };

// Use a public, non-sensitive map ID for styling (no API key needed for map ID)
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

export const LocationMap = ({ location }: LocationMapProps) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!location) {
      return;
    }

    // Geocode using our server-side API endpoint
    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `/api/geocode?address=${encodeURIComponent(location)}`
        );

        if (!response.ok) {
          console.error("Geocoding failed:", await response.text());
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
          if (maxDiff < 0.01)
            calculatedZoom = 18; // Street level
          else if (maxDiff < 0.1)
            calculatedZoom = 16; // Neighborhood
          else if (maxDiff < 0.5)
            calculatedZoom = 13; // City
          else calculatedZoom = 10; // Region

          setZoom(calculatedZoom);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    geocodeLocation();
  }, [location]);

  return (
    <div className="h-96 w-full overflow-hidden rounded-lg border border-border">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          clickableIcons={true}
          defaultCenter={center}
          defaultZoom={zoom}
          disableDefaultUI={false}
          fullscreenControl={true}
          gestureHandling="greedy"
          key={`${center.lat}-${center.lng}`}
          mapId={MAP_ID}
          mapTypeControl={true}
          streetViewControl={true}
          zoomControl={true}
        >
          {markerPosition && <AdvancedMarker position={markerPosition} />}
        </Map>
      </APIProvider>
    </div>
  );
};
