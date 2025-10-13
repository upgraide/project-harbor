"use client";

import type { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

type LocationMapProps = {
  location: string;
  className?: string;
};

export const LocationMap = ({ location, className }: LocationMapProps) => {
  const [coordinates, setCoordinates] = useState<LatLngExpression | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Geocode the location to get coordinates
  useEffect(() => {
    const geocodeLocation = async () => {
      if (!location) {
        return;
      }

      setGeocoding(true);
      try {
        // Using Nominatim (OpenStreetMap's geocoding service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const lat = Number.parseFloat(data[0].lat);
          const lon = Number.parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
        }
      } catch {
        // Silently fail if geocoding fails
      } finally {
        setGeocoding(false);
      }
    };

    geocodeLocation();
  }, [location]);

  // Load map component dynamically
  useEffect(() => {
    setMapLoaded(true);
  }, []);

  if (!mapLoaded || geocoding || !coordinates) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className ?? ""}`}
      >
        <p className="text-muted-foreground text-sm">
          {geocoding ? "Loading map..." : "Location not available"}
        </p>
      </div>
    );
  }

  return (
    <MapComponent
      className={className}
      coordinates={coordinates}
      location={location}
    />
  );
};

type MapComponentProps = {
  coordinates: LatLngExpression;
  location: string;
  className?: string;
};

const MapComponent = ({
  coordinates,
  location,
  className,
}: MapComponentProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className ?? ""}`}
      >
        <p className="text-muted-foreground text-sm">Loading map...</p>
      </div>
    );
  }

  // Dynamic import to avoid SSR issues
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  const L = require("leaflet");

  // Standard Leaflet icon dimensions
  const ICON_WIDTH = 25;
  const ICON_HEIGHT = 41;
  const ICON_ANCHOR_X = 12;
  const ICON_ANCHOR_Y = 41;
  const POPUP_ANCHOR_X = 1;
  const POPUP_ANCHOR_Y = -34;
  const SHADOW_SIZE = 41;

  // Fix for default marker icon
  const DefaultIcon = L.icon({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [ICON_WIDTH, ICON_HEIGHT],
    iconAnchor: [ICON_ANCHOR_X, ICON_ANCHOR_Y],
    popupAnchor: [POPUP_ANCHOR_X, POPUP_ANCHOR_Y],
    shadowSize: [SHADOW_SIZE, SHADOW_SIZE],
  });

  return (
    <div className={className}>
      <MapContainer
        center={coordinates}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={DefaultIcon} position={coordinates}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
