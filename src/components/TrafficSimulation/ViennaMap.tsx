
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { FC } from 'react';

// Fix for default Leaflet icon path issue with Webpack/Next.js
// These lines are crucial for the default marker icon to show up correctly.
// Make sure the version in the unpkg URL matches your installed Leaflet version if you change it.
if (typeof window !== 'undefined') {
  // Check if we're in a browser environment before trying to manipulate L
  // This check might be redundant with "use client" but adds an extra layer of safety
  // especially if this file were ever imported in a context Next.js tries to SSR.
  try {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  } catch (e) {
    console.error("Leaflet icon setup error:", e);
    // Fallback or further error handling if needed
  }
}


interface ViennaMapProps {
  // Props for zoom levels, traffic data overlays, etc., will be added later
}

export const ViennaMap: FC<ViennaMapProps> = () => {
  const viennaPosition: L.LatLngExpression = [48.2082, 16.3738]; // Coordinates for Vienna

  // The MapContainer is designed to only render on the client-side.
  // The "use client" directive at the top of the file is essential.
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
