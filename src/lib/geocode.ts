export interface GeocodeResult {
  lat: number;
  lng: number;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
}

/**
 * Resolve lat/lng from a street address via Nominatim structured search.
 * @see https://nominatim.org/release-docs/latest/api/Search/
 */
export async function geocodeAddress(parts: {
  street?: string;
  city: string;
  state: string;
}): Promise<GeocodeResult> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  const street = parts.street?.trim();
  if (street) url.searchParams.set("street", street);
  url.searchParams.set("city", parts.city.trim());
  url.searchParams.set("state", parts.state.trim());
  url.searchParams.set("country", "USA");
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const results = (await response.json()) as NominatimSearchResult[];
  if (!results.length) {
    throw new Error(
      "Could not find that address on the map. Check the street, city, and state.",
    );
  }

  const lat = Number(results[0].lat);
  const lng = Number(results[0].lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Geocoding returned an invalid location");
  }

  return { lat, lng };
}
