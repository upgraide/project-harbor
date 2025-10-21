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

// Map padding constants
const MAP_BOUNDS_PADDING = 50;

// Polygon styling constants
const POLYGON_COLOR = "#3b82f6";
const POLYGON_WEIGHT = 2;
const POLYGON_OPACITY = 0.7;
const POLYGON_FILL_OPACITY = 0.2;

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
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Multiple geometry types need to be handled
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
          `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(location)}&limit=1&polygon_geojson=1`
        );
        const data = (await response.json()) as Array<{
          lat: string;
          lon: string;
          display_name: string;
          boundingbox: [string, string, string, string];
          geojson?: {
            type: string;
            coordinates: unknown;
          };
        }>;

        if (data.length > 0) {
          const { lat, lon, display_name, geojson } = data[0];
          const coordinates = L.latLng(Number(lat), Number(lon));

          const map = mapInstanceRef.current as L.Map;

          // Remove existing markers and layers
          map.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
              map.removeLayer(layer);
            }
          });

          // If we have a polygon geometry, display it
          if (geojson && geojson.type === "Polygon") {
            const geoJsonFeature = {
              type: "Feature" as const,
              geometry: geojson,
              properties: {
                name: display_name,
              },
            };

            const geoJsonLayer = L.geoJSON(geoJsonFeature, {
              style: {
                color: POLYGON_COLOR,
                weight: POLYGON_WEIGHT,
                opacity: POLYGON_OPACITY,
                fillOpacity: POLYGON_FILL_OPACITY,
              },
            });

            geoJsonLayer.addTo(map);

            // Fit map to the bounds of the polygon
            const bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds, {
              padding: [MAP_BOUNDS_PADDING, MAP_BOUNDS_PADDING],
            });

            // Add a marker at the center
            L.marker(coordinates, { icon: defaultIcon })
              .bindPopup(display_name)
              .addTo(map);
          } else if (geojson && geojson.type === "MultiPolygon") {
            // Handle multipolygon (e.g., countries with multiple parts)
            const geoJsonFeature = {
              type: "Feature" as const,
              geometry: geojson,
              properties: {
                name: display_name,
              },
            };

            const geoJsonLayer = L.geoJSON(geoJsonFeature, {
              style: {
                color: POLYGON_COLOR,
                weight: POLYGON_WEIGHT,
                opacity: POLYGON_OPACITY,
                fillOpacity: POLYGON_FILL_OPACITY,
              },
            });

            geoJsonLayer.addTo(map);

            // Fit map to the bounds of the polygon
            const bounds = geoJsonLayer.getBounds();
            map.fitBounds(bounds, {
              padding: [MAP_BOUNDS_PADDING, MAP_BOUNDS_PADDING],
            });

            // Add a marker at the center
            L.marker(coordinates, { icon: defaultIcon })
              .bindPopup(display_name)
              .addTo(map);
          } else {
            // Fallback: use the bounding box to determine zoom and just show a marker
            const latRange = Math.abs(
              Number(data[0].boundingbox[1]) - Number(data[0].boundingbox[0])
            );
            const zoomLevel = getZoomLevelForBounds(latRange);

            map.setView(coordinates, zoomLevel);

            // Add marker
            L.marker(coordinates, { icon: defaultIcon })
              .bindPopup(display_name)
              .addTo(map);
          }
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
