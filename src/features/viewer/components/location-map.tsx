"use client";

import { useEffect, useRef } from "react";

type LocationMapProps = {
  location: string;
};

// Marker icon configuration constants
const MARKER_ICON_SIZE = 25;
const MARKER_ICON_HEIGHT = 41;
const MARKER_ICON_ANCHOR_X = 12;
const MARKER_ICON_ANCHOR_Y = 41;
const MARKER_POPUP_ANCHOR_X = 1;
const MARKER_POPUP_ANCHOR_Y = -34;
const MARKER_SHADOW_SIZE = 41;

// Zoom level constants
const DEFAULT_ZOOM = 13;
const STREET_LEVEL_THRESHOLD = 0.01;
const STREET_LEVEL_ZOOM = 18;
const NEIGHBORHOOD_THRESHOLD = 0.1;
const NEIGHBORHOOD_ZOOM = 16;
const CITY_THRESHOLD = 0.5;
const CITY_ZOOM = 13;
const REGION_ZOOM = 10;

// Default map center
const DEFAULT_LAT = 51.505;
const DEFAULT_LON = -0.09;

// Nominatim API base URL
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

// OpenStreetMap tile layer URL
const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const getZoomLevelForBounds = (latRange: number): number => {
  if (latRange < STREET_LEVEL_THRESHOLD) {
    return STREET_LEVEL_ZOOM;
  }
  if (latRange < NEIGHBORHOOD_THRESHOLD) {
    return NEIGHBORHOOD_ZOOM;
  }
  if (latRange < CITY_THRESHOLD) {
    return CITY_ZOOM;
  }
  return REGION_ZOOM;
};

export const LocationMap = ({ location }: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (mapContainer.current === null || !location) {
      return;
    }

    // Dynamically import Leaflet only on client side
    const initializeMap = async () => {
      const { default: L } = await import("leaflet");

      // Set default icon
      const markerIconConfig = {
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [MARKER_ICON_SIZE, MARKER_ICON_HEIGHT],
        iconAnchor: [MARKER_ICON_ANCHOR_X, MARKER_ICON_ANCHOR_Y],
        popupAnchor: [MARKER_POPUP_ANCHOR_X, MARKER_POPUP_ANCHOR_Y],
        shadowSize: [MARKER_SHADOW_SIZE, MARKER_SHADOW_SIZE],
      } as const;

      const defaultIcon = L.icon(markerIconConfig as unknown as L.IconOptions);
      L.Marker.prototype.options.icon = defaultIcon;

      // Initialize map only once
      if (mapInstanceRef.current === null) {
        if (mapContainer.current === null) {
          return;
        }
        mapInstanceRef.current = L.map(mapContainer.current).setView(
          [DEFAULT_LAT, DEFAULT_LON],
          DEFAULT_ZOOM
        );

        L.tileLayer(OSM_TILE_URL, {
          attribution: OSM_ATTRIBUTION,
          maxZoom: 19,
        }).addTo(mapInstanceRef.current as L.Map);
      }

      // Geocode the location using OpenStreetMap Nominatim API
      try {
        const response = await fetch(
          `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(location)}&limit=1`
        );
        const data = (await response.json()) as Array<{
          lat: string;
          lon: string;
          display_name: string;
          boundingbox: [string, string, string, string];
        }>;

        if (data.length > 0) {
          const { lat, lon, display_name, boundingbox } = data[0];
          const coordinates = L.latLng(Number(lat), Number(lon));

          // Determine zoom level based on location type
          // More specific places (like streets) have smaller bounding boxes
          const latRange = Math.abs(
            Number(boundingbox[1]) - Number(boundingbox[0])
          );
          const zoomLevel = getZoomLevelForBounds(latRange);

          const map = mapInstanceRef.current as L.Map;
          map.setView(coordinates, zoomLevel);

          // Remove existing markers
          map.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Marker) {
              map.removeLayer(layer);
            }
          });

          // Add marker
          L.marker(coordinates, { icon: defaultIcon })
            .bindPopup(display_name)
            .addTo(map);
        }
      } catch {
        // Silently fail if geocoding doesn't work
      }
    };

    initializeMap();
  }, [location]);

  return (
    <div
      className="h-96 w-full rounded-lg border border-border"
      ref={mapContainer}
    />
  );
};
