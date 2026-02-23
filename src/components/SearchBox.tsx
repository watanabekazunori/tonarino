"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PlaceCandidate {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  lat: number;
  lng: number;
  types: string[];
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<PlaceCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const searchPlaces = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setCandidates([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setCandidates(data.results || []);
        setShowDropdown(true);
      } catch {
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => searchPlaces(value), 400);
    setDebounceTimer(timer);
  };

  const handleSelect = (place: PlaceCandidate) => {
    setShowDropdown(false);
    setQuery(place.name);

    const params = new URLSearchParams({
      place_id: place.place_id,
      name: place.name,
      lat: String(place.lat),
      lng: String(place.lng),
      q: query,
      types: (place.types || []).join(","),
    });
    router.push(`/results?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (candidates.length > 0) {
      handleSelect(candidates[0]);
    } else {
      searchPlaces(query);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => candidates.length > 0 && setShowDropdown(true)}
            placeholder="お店の名前を入力してください"
            className="search-input w-full px-6 py-4 text-lg bg-white border-2 border-primary-200 rounded-2xl outline-none transition-all focus:border-primary-400 placeholder:text-stone-300"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-primary-100 p-4 text-center text-stone-400 z-50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin" />
            検索中...
          </div>
        </div>
      )}

      {showDropdown && candidates.length > 0 && !isLoading && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-primary-100 overflow-hidden z-50">
          <div className="px-4 py-2 text-xs text-stone-400 bg-warm-100 border-b border-primary-50">
            あなたのお店を選んでください
          </div>
          {candidates.map((place) => (
            <button
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors border-b border-stone-50 last:border-b-0"
            >
              <div className="font-medium text-stone-700">{place.name}</div>
              <div className="text-sm text-stone-400 mt-0.5">
                {place.formatted_address}
              </div>
              {place.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-secondary-500">
                    {"★".repeat(Math.round(place.rating))}
                  </span>
                  <span className="text-xs text-stone-400">
                    {place.rating} ({place.user_ratings_total}件)
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {showDropdown && candidates.length === 0 && !isLoading && query.length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-primary-100 p-5 text-center z-50">
          <p className="text-stone-500 text-sm font-medium mb-2">
            該当するお店が見つかりませんでした
          </p>
          <p className="text-stone-400 text-xs leading-relaxed">
            💡 「<span className="text-primary-500 font-medium">店名＋エリア名</span>」で検索するとヒットしやすくなります
            <br />
            例：「スターバックス 渋谷」「一蘭 新宿」
          </p>
        </div>
      )}
    </div>
  );
}
