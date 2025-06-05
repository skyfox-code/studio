
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Gauge, LayoutGrid, ShieldCheck, Map } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App Showcase | Firebase Studio',
  description: 'Explore a collection of interactive demo applications built with Next.js.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto">
          <div className="flex items-center space-x-3">
            <LayoutGrid className="text-primary h-10 w-10" />
            <h1 className="text-4xl font-headline font-bold text-foreground">App Showcase</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-lg">
            Welcome! Explore interactive demo applications built with Next.js and Firebase Studio.
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-primary mb-8">
            Available Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Gauge className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl font-semibold">FuzzyStat</CardTitle>
                </div>
                <CardDescription className="text-base">
                  An intelligent thermostat demo using fuzzy logic to optimize temperature settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-md">
                  <Image
                    src="https://placehold.co/600x375.png"
                    alt="FuzzyStat Thermostat Interface Preview"
                    width={600}
                    height={375}
                    className="object-cover w-full h-full"
                    data-ai-hint="thermostat dashboard graph"
                    priority
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Dive into an interactive experience where you can adjust settings, observe the system's reasoning, and see intelligent temperature regulation in action.
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href="/fuzzystat" passHref className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md py-3">
                    Launch FuzzyStat
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl font-semibold">Secure Message Demo</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Learn how end-to-end encryption protects your messages from sender to receiver.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-md">
                  <Image
                    src="https://placehold.co/600x375.png"
                    alt="Secure Message Encryption Preview"
                    width={600}
                    height={375}
                    className="object-cover w-full h-full"
                    data-ai-hint="encryption security lock"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Input a message, see it "encrypted", and then "decrypt" it to understand the basic principles of E2EE.
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href="/secure-message" passHref className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md py-3">
                    Launch Secure Message
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Map className="h-8 w-8 text-accent" />
                  <CardTitle className="text-2xl font-semibold">Vienna Traffic Sim</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Simulate traffic patterns in Vienna based on time of day and random events.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-md">
                  <Image
                    src="https://placehold.co/600x375.png"
                    alt="Vienna Traffic Simulation Preview"
                    width={600}
                    height={375}
                    className="object-cover w-full h-full"
                    data-ai-hint="city map traffic"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Observe how traffic density changes during different parts of the day and manage simulation controls.
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href="/traffic-simulation" passHref className="w-full">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-md py-3">
                    Launch Traffic Sim
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-sm text-muted-foreground border-t">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Firebase Studio Demos. Explore and Learn.</p>
        </div>
      </footer>
    </div>
  );
}
