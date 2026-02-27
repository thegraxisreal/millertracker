"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the map with no SSR (Leaflet requires browser APIs)
const TrackerMap = dynamic(() => import("@/components/TrackerMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0f1117]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm tracking-widest uppercase">
          Acquiring signal…
        </span>
      </div>
    </div>
  ),
});

const LAT = 43.3096383;
const LNG = -73.6606558;

function useLastUpdated() {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsAgo((prev) => {
        if (prev >= 29) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (secondsAgo === 0) return "just now";
  if (secondsAgo === 1) return "1 second ago";
  return `${secondsAgo} seconds ago`;
}

function SignalBars({ bars }: { bars: number }) {
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map((b) => (
        <div
          key={b}
          className={`w-1 rounded-sm transition-all ${
            b <= bars ? "bg-green-400" : "bg-gray-600"
          }`}
          style={{ height: `${b * 25}%` }}
        />
      ))}
    </div>
  );
}

function BatteryIcon({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative w-6 h-3 border border-gray-400 rounded-sm">
        <div
          className={`absolute inset-y-0.5 left-0.5 rounded-sm ${
            level > 30 ? "bg-green-400" : "bg-red-400"
          }`}
          style={{ width: `${(level / 100) * 80}%` }}
        />
      </div>
      <div className="w-0.5 h-1.5 bg-gray-400 rounded-r-sm" />
      <span className="text-xs text-gray-400">{level}%</span>
    </div>
  );
}

export default function Home() {
  const lastUpdated = useLastUpdated();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0f1117]">
      {/* Full-screen map */}
      <div className="absolute inset-0 z-0">
        <TrackerMap />
      </div>

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-3">
          {/* Pulsing red dot */}
          <span
            className="pulse-dot inline-block w-3 h-3 rounded-full bg-red-500 flex-shrink-0"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-white font-semibold text-base sm:text-lg leading-tight tracking-tight">
              Mr. Miller
            </h1>
            <p className="text-gray-400 text-[11px] sm:text-xs tracking-widest uppercase">
              Live Location
            </p>
          </div>
        </div>

        {/* Tracking Active badge */}
        <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-[11px] sm:text-xs font-medium tracking-wide uppercase">
            Tracking Active
          </span>
        </div>
      </div>

      {/* Bottom info panel */}
      {mounted && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
          <div className="max-w-sm mx-auto">
            {/* Coordinates card */}
            <div className="bg-[#1a1d27]/90 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4 shadow-2xl">
              {/* Top row: coords + signal */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-medium">
                    Coordinates
                  </p>
                  <div className="space-y-0.5">
                    <p className="text-white font-mono text-sm font-semibold">
                      {LAT.toFixed(7)}° N
                    </p>
                    <p className="text-white font-mono text-sm font-semibold">
                      {Math.abs(LNG).toFixed(7)}° W
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 pt-1">
                  <SignalBars bars={4} />
                  <BatteryIcon level={87} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700/50 mb-3" />

              {/* Bottom row: last updated + accuracy */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-400 text-xs">
                    Updated{" "}
                    <span className="text-white font-medium">{lastUpdated}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-gray-400 text-xs">
                    ±{" "}
                    <span className="text-blue-300 font-medium">8 m</span>{" "}
                    accuracy
                  </span>
                </div>
              </div>
            </div>

            {/* Safe area spacer for phones */}
            <div className="h-2 sm:h-0" />
          </div>
        </div>
      )}

      {/* Zoom controls — override default Leaflet position */}
      <style>{`
        .leaflet-top.leaflet-left {
          top: auto;
          bottom: 160px;
          left: 16px;
        }
        .leaflet-control-zoom {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom a {
          background: rgba(26, 29, 39, 0.9) !important;
          border: 1px solid rgba(75, 85, 99, 0.6) !important;
          color: white !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
          border-radius: 8px !important;
          margin-bottom: 4px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(55, 65, 81, 0.95) !important;
        }
        .leaflet-bottom.leaflet-right {
          display: none;
        }
      `}</style>
    </div>
  );
}
