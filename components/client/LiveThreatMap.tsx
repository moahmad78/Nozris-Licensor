'use client';

import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const randomMarkers = () => {
    return Array.from({ length: 5 }).map(() => ({
        name: "Blocked Attack",
        coordinates: [
            Math.random() * 360 - 180,
            Math.random() * 160 - 80
        ]
    }));
};

export default function LiveThreatMap() {
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const { getLiveThreats } = await import('@/app/actions/analytics');
                const result = await getLiveThreats();
                if (result.success && result.data.length > 0) {
                    // For demo purposes, if no coordinates, we might randomize or map.
                    // Real implementations would need a GeoIP lookup on the server.
                    // Mapping logic:
                    const mapped = result.data.map((log: any) => ({
                        name: log.ip,
                        coordinates: [
                            // Simple hash-based coordinate simulation since we lack GeoIP DB
                            (parseInt(log.ip.split('.')[0]) || 0) * 1.5 - 100,
                            (parseInt(log.ip.split('.')[1]) || 0) * 0.5 + 20
                        ]
                    }));
                    setMarkers(mapped);
                } else {
                    // Fallback to simulation if no real data
                    setMarkers(randomMarkers());
                }
            } catch (e) {
                console.error("Failed to fetch threats", e);
            }
        };

        fetchThreats();
        const interval = setInterval(fetchThreats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[300px] overflow-hidden rounded-3xl bg-slate-900 shadow-inner relative">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Global Threat Interception
                </h3>
            </div>
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1e293b"
                                stroke="#334155"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#334155", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>
                {markers.map(({ name, coordinates }, i) => (
                    <Marker key={i} coordinates={coordinates}>
                        <circle r={4} fill="#F00" stroke="#FFF" strokeWidth={2} className="animate-ping opacity-75" />
                        <circle r={2} fill="#F00" />
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
