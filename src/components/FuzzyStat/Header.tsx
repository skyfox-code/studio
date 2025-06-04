import { Zap } from 'lucide-react';

export function FuzzyStatHeader() {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-3">
        <Zap className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-foreground">FuzzyStat</h1>
      </div>
    </header>
  );
}
