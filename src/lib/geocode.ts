import { supabase } from "./supabase";

export async function geocodeAddress(parts: {
  street?: string;
  city: string;
  state: string;
  zip?: string;
}): Promise<{ lat: number; lng: number }> {
  const { data, error } = await supabase.functions.invoke("geocode", {
    body: parts,
  });

  if (error) {
    throw new Error("Could not look up that address. Try again.");
  }

  if (data?.error) {
    throw new Error(data.error as string);
  }

  const { lat, lng } = data as { lat: number; lng: number };
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new Error("Geocoding returned an invalid location");
  }

  return { lat, lng };
}
