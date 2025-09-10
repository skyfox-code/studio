
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

// ViennaMapProps can be extended later if needed
interface ViennaMapProps {}

export const ViennaMap: FC<ViennaMapProps> = () => {
  const viennaPosition: L.LatLngExpression = [48.2082, 16.3738];
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track client-side readiness

  useEffect(() => {
    // This effect runs after the component mounts on the client-side.
    setIsClient(true); // Signal that client-side setup is complete.

    // Fix for default Leaflet icon path issue
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

    // Cleanup function: This is crucial for HMR and StrictMode.
    // It ensures the Leaflet map instance is destroyed when the component unmounts or re-runs in StrictMode.
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount.

  if (!isClient) {
    // Render null or a minimal placeholder while waiting for the client-side effect to run.
    // The parent component (SimulationViewCard) uses dynamic import with a loading fallback,
    // so this primarily helps manage StrictMode's double invocation.
    return null;
  }

  return (
    <MapContainer
        // Using isClient.toString() as a key ensures that when isClient flips from false to true,
        // React treats this as a completely new MapContainer instance, unmounting any old one
        // and mounting a fresh one. This is very effective for libraries with complex DOM lifecycles
        // in React StrictMode.
        key={isClient.toString()}
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
