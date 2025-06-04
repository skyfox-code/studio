
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gauge } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3">
            <Gauge className="text-primary h-10 w-10" />
            <h1 className="text-4xl font-headline font-bold text-foreground">FuzzyStat</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-lg">Intelligent Thermostat Control, Simplified.</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div>
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
              Experience Smart Climate Control
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover FuzzyStat, a demonstration of how fuzzy logic can create a more intuitive and efficient thermostat. 
              Adjust settings, observe the system&apos;s reasoning, and see intelligent temperature regulation in action.
            </p>
            <Link href="/fuzzystat" passHref>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                Launch FuzzyStat Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
             <p className="mt-6 text-sm text-muted-foreground">
              Dive into the interactive demo to see how it works!
            </p>
          </div>
          <div className="flex justify-center items-center p-4">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Illustration of a modern smart thermostat interface"
              width={600}
              height={450}
              className="rounded-xl shadow-2xl object-cover"
              data-ai-hint="thermostat technology interface"
              priority
            />
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground border-t">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} FuzzyStat. Smart. Simple. Efficient.</p>
        </div>
      </footer>
    </div>
  );
}
