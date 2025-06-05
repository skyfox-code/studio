
"use client";

import Image from 'next/image';
import type { FC } from 'react';

interface ViennaMapProps {
  // Props for zoom levels, traffic data overlays, etc., will be added later
}

export const ViennaMap: FC<ViennaMapProps> = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[calc(100%-4rem)] bg-muted rounded-lg overflow-hidden shadow-md border relative">
      <Image
        src="https://placehold.co/1200x800.png"
        alt="Placeholder for Interactive Map of Vienna"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
        data-ai-hint="Vienna city map outline"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-xl font-semibold text-muted-foreground p-4 bg-background/80 rounded-md">
          Interactive Map Placeholder
        </p>
      </div>
      {/* This div will later be replaced by an actual map component
          (e.g., <MapContainer> from react-leaflet or a Mapbox component) */}
    </div>
  );
};
