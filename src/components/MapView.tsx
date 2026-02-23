"use client";

import { useEffect, useRef } from "react";

interface MapMarker {
  lat: number;
  lng: number;
  name: string;
  isMyStore: boolean;
  rating?: number;
}

interface MapViewProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
  radius?: number; // メートル
}

// 半径に応じたズームレベルを計算
function getZoomForRadius(radius: number): number {
  if (radius <= 500) return 16;
  if (radius <= 1000) return 15;
  if (radius <= 2000) return 14;
  if (radius <= 5000) return 13;
  return 12;
}

export default function MapView({ center, markers, radius = 2000 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    const initMap = () => {
      if (!mapRef.current) return;

      const zoom = getZoomForRadius(radius);

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // 半径サークル描画
      new google.maps.Circle({
        map,
        center,
        radius,
        fillColor: "#F97316",
        fillOpacity: 0.05,
        strokeColor: "#F97316",
        strokeOpacity: 0.3,
        strokeWeight: 1.5,
      });

      markers.forEach((marker) => {
        const m = new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          title: marker.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: marker.isMyStore ? 12 : 8,
            fillColor: marker.isMyStore ? "#F97316" : "#9CA3AF",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          zIndex: marker.isMyStore ? 10 : 1,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: 'Noto Sans JP', sans-serif; padding: 4px 0;">
              <div style="font-weight: 600; font-size: 14px; color: ${marker.isMyStore ? "#F97316" : "#57534e"};">
                ${marker.isMyStore ? "\u{1F4CD} " : ""}${marker.name}
              </div>
              ${marker.rating ? `<div style="font-size: 12px; color: #a8a29e; margin-top: 2px;">\u2605 ${marker.rating}</div>` : ""}
            </div>
          `,
        });

        m.addListener("click", () => {
          infoWindow.open(map, m);
        });

        if (marker.isMyStore) {
          infoWindow.open(map, m);
        }
      });
    };

    if (existingScript || typeof google !== "undefined") {
      if (typeof google !== "undefined" && google.maps) {
        initMap();
      } else {
        existingScript?.addEventListener("load", initMap);
      }
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ja`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [center, markers, radius]);

  return (
    <div className="map-container rounded-2xl overflow-hidden shadow-md border border-primary-100">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
