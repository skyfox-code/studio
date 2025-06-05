
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface ViennaMapProps {
  // Props for zoom levels, traffic data overlays, etc., will be added later
}

export const ViennaMap: FC<ViennaMapProps> = () => {
  const [isClient, setIsClient] = useState(false);
  const viennaPosition: L.LatLngExpression = [48.2082, 16.3738]; // Coordinates for Vienna

  useEffect(() => {
    // This effect runs once after the component mounts on the client-side.
    setIsClient(true);

    // Fix for default Leaflet icon path issue with Webpack/Next.js
    // This code should run only once on the client, after the initial mount.
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
  }, []); // Empty dependency array ensures this runs once on mount

  // The MapContainer is designed to only render on the client-side.
  // The "use client" directive at the top of the file is essential.
  // We also ensure it only renders after isClient is true.
  if (!isClient) {
    // The dynamic import in the parent component already provides a loading state.
    // Returning null here will keep that loading state visible until isClient is true.
    return null;
  }

  return (
    <MapContainer
        center={viennaPosition}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg shadow-md border" // Ensures map fills its container
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
