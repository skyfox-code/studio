
import { Map } from 'lucide-react';
import Link from 'next/link';

export function TrafficSimHeader() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="inline-block">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <Map className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />
          <h1 className="text-4xl font-headline font-bold text-foreground group-hover:text-accent transition-colors">
            Vienna Traffic Simulator
          </h1>
        </div>
      </Link>
    </header>
  );
}
