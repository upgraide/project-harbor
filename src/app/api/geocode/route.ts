import { NextResponse } from "next/server";

export const runtime = "nodejs";

type GeocodeResult = {
  lat: number;
  lng: number;
  formatted_address: string;
  bounds?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  geometry_type?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_API;

  if (!apiKey) {
    console.error("GOOGLE_API environment variable is not set");
    return NextResponse.json(
      { error: "Geocoding service not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Geocoding error:", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || "Geocoding failed" },
        { status: 400 }
      );
    }

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const geocodeResult: GeocodeResult = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
        geometry_type: result.geometry.location_type,
      };

      // Include bounds if available
      if (result.geometry.bounds) {
        geocodeResult.bounds = {
          northeast: {
            lat: result.geometry.bounds.northeast.lat,
            lng: result.geometry.bounds.northeast.lng,
          },
          southwest: {
            lat: result.geometry.bounds.southwest.lat,
            lng: result.geometry.bounds.southwest.lng,
          },
        };
      } else if (result.geometry.viewport) {
        // Fallback to viewport if bounds not available
        geocodeResult.bounds = {
          northeast: {
            lat: result.geometry.viewport.northeast.lat,
            lng: result.geometry.viewport.northeast.lng,
          },
          southwest: {
            lat: result.geometry.viewport.southwest.lat,
            lng: result.geometry.viewport.southwest.lng,
          },
        };
      }

      return NextResponse.json(geocodeResult);
    }

    return NextResponse.json(
      { error: "No results found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
