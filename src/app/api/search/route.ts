import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/textsearch/json?query=${encodeURIComponent(query + " 飲食店")}&type=restaurant|cafe|bar&language=ja&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    const data = await res.json();

    const results = (data.results || []).slice(0, 5).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      rating: place.rating || 0,
      user_ratings_total: place.user_ratings_total || 0,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      types: place.types || [],
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
