
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

interface ViennaMapProps {
  // Props for zoom levels, traffic data overlays, etc., will be added later
}

export const ViennaMap: FC<ViennaMapProps> = () => {
  const viennaPosition: L.LatLngExpression = [48.2082, 16.3738];
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // This effect runs after the component mounts on the client-side.

    // Fix for default Leaflet icon path issue with Webpack/Next.js
    // Guarded to prevent re-application on HMR or Strict Mode re-runs.
    if (!(L.Icon.Default.prototype as any)._iconUrlWasFixed) {
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        (L.Icon.Default.prototype as any)._iconUrlWasFixed = true; // Mark as fixed
      } catch (e) {
        console.error("Leaflet icon setup error:", e);
      }
    }

    setIsMapReady(true); // Signal that client-side setup is complete and MapContainer can render.

    // Cleanup function: This is crucial for HMR and StrictMode.
    // It ensures the Leaflet map instance is destroyed when the component unmounts or re-runs in StrictMode.
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // We don't set isMapReady to false here, as the component instance is being destroyed.
      // A new instance will re-initialize isMapReady to false.
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount.

  if (!isMapReady) {
    // Render a placeholder or null while waiting for the client-side effect to run.
    // This prevents MapContainer from attempting to initialize prematurely.
    // The parent (SimulationViewCard) already has a loading indicator for the dynamic import.
    return <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg shadow-md border"><p>Loading map...</p></div>;
  }

  return (
    <MapContainer
        center={viennaPosition}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg shadow-md border"
        whenCreated={map => {
          mapInstanceRef.current = map;
        }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={viennaPosition}>
        <Popup>
          Vienna, Austria. <br /> Traffic simulation center.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
