const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export async function searchPlaces(query: string) {
  const res = await fetch(
    `${BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&type=restaurant|cafe|bar&language=ja&key=${API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}

export async function getNearbyCompetitors(
  lat: number,
  lng: number,
  type: string = "restaurant",
  radius: number = 500
) {
  const typeMap: Record<string, string> = {
    居酒屋: "bar|restaurant",
    カフェ: "cafe",
    バー: "bar",
    ラーメン: "restaurant",
    その他: "restaurant",
  };

  const placeType = typeMap[type] || "restaurant";

  const res = await fetch(
    `${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&language=ja&key=${API_KEY}`
  );
  const data = await res.json();
  return (data.results || [])
    .filter(
      (p: any) => p.business_status === "OPERATIONAL" || !p.business_status
    )
    .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
}

export async function getPlaceDetails(placeId: string) {
  const res = await fetch(
    `${BASE_URL}/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,geometry,types,photos&language=ja&key=${API_KEY}`
  );
  const data = await res.json();
  return data.result;
}

export async function getPlaceReviews(placeId: string) {
  const details = await getPlaceDetails(placeId);
  return details?.reviews || [];
}
