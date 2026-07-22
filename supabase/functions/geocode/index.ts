import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeocodeRequest {
  street?: string;
  city: string;
  state: string;
  zip?: string;
}

interface GeocodioResult {
  location: {
    lat: number;
    lng: number;
  };
}

interface GeocodioResponse {
  results: GeocodioResult[];
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  let parts: GeocodeRequest;
  try {
    parts = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const apiKey = Deno.env.get("GEOCODIO_API_KEY");
  if (!apiKey) {
    return jsonResponse({ error: "Geocoding is not configured" }, 500);
  }

  const url = new URL("https://api.geocod.io/v2/geocode");
  const street = parts.street?.trim();
  if (street) url.searchParams.set("street", street);
  url.searchParams.set("city", parts.city.trim());
  url.searchParams.set("state_province", parts.state.trim());
  if (parts.zip?.trim()) url.searchParams.set("postal_code", parts.zip.trim());
  url.searchParams.set("country", "USA");
  url.searchParams.set("limit", "1");
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return jsonResponse(
      { error: `Geocoding failed (${response.status})` },
      response.status,
    );
  }

  const data = (await response.json()) as GeocodioResponse;
  if (!data.results.length) {
    return jsonResponse(
      {
        error:
          "Could not find that address on the map. Check the street, city, and state.",
      },
      404,
    );
  }

  const { lat, lng } = data.results[0].location;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return jsonResponse(
      { error: "Geocoding returned an invalid location" },
      500,
    );
  }

  return jsonResponse({ lat, lng });
});
