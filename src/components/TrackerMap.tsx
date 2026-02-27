"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

const LAT = 43.3096383;
const LNG = -73.6606558;

// Fix for Leaflet default icon paths in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom sonar marker icon using a div
function createSonarIcon(): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <!-- Sonar rings -->
        <div class="sonar-ring sonar-ring-1" style="border-color: rgba(239,68,68,0.7);"></div>
        <div class="sonar-ring sonar-ring-2" style="border-color: rgba(239,68,68,0.5);"></div>
        <div class="sonar-ring sonar-ring-3" style="border-color: rgba(239,68,68,0.3);"></div>
        <!-- Center dot -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(239,68,68,0.9), 0 2px 6px rgba(0,0,0,0.5);
          z-index: 10;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
}

// Accuracy circle overlay
function AccuracyCircle() {
  const map = useMap();
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    const circle = L.circle([LAT, LNG], {
      radius: 30,
      color: "rgba(59, 130, 246, 0.6)",
      fillColor: "rgba(59, 130, 246, 0.1)",
      fillOpacity: 1,
      weight: 1.5,
    }).addTo(map);

    circleRef.current = circle;

    return () => {
      circle.remove();
    };
  }, [map]);

  return null;
}

export default function TrackerMap() {
  const sonarIcon = createSonarIcon();

  return (
    <MapContainer
      center={[LAT, LNG]}
      zoom={15}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      {/* ESRI World Imagery satellite tiles — no API key required */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
      <AccuracyCircle />
      <Marker position={[LAT, LNG]} icon={sonarIcon} />
    </MapContainer>
  );
}
