'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Timer, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SortingAlgorithm {
  name: string;
  id: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  description: string;
}

interface BenchmarkResult {
  algorithmId: string;
  algorithmName: string;
  arraySize: number;
  duration: number;
  isSorted: boolean;
  rank?: number;
}

const algorithms: SortingAlgorithm[] = [
  {
    name: 'Quick Sort',
    id: 'quicksort',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    description: 'Efficient divide-and-conquer algorithm with good average performance'
  },
  {
    name: 'Merge Sort',
    id: 'mergesort',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    description: 'Stable sorting algorithm with guaranteed O(n log n) performance'
  },
  {
    name: 'Heap Sort',
    id: 'heapsort',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    description: 'In-place sorting algorithm using a binary heap data structure'
  },
  {
    name: 'Bubble Sort',
    id: 'bubblesort',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Simple comparison-based algorithm, inefficient for large datasets'
  },
  {
    name: 'Insertion Sort',
    id: 'insertionsort',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Efficient for small datasets and partially sorted arrays'
  },
  {
    name: 'Selection Sort',
    id: 'selectionsort',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Simple in-place comparison-based sorting algorithm'
  }
];

const arraySizeOptions = [
  { label: 'Small (1K)', value: 1000 },
  { label: 'Medium (10K)', value: 10000 },
  { label: 'Large (50K)', value: 50000 },
  { label: 'Very Large (100K)', value: 100000 }
];

// Sorting algorithm implementations
const sortingImplementations = {
  quicksort: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...sortingImplementations.quicksort(left), ...middle, ...sortingImplementations.quicksort(right)];
  },
  
  mergesort: (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = sortingImplementations.mergesort(arr.slice(0, mid));
    const right = sortingImplementations.mergesort(arr.slice(mid));
    
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  },
  
  heapsort: (arr: number[]): number[] => {
    const sorted = [...arr];
    const heapify = (n: number, i: number) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n && sorted[left] > sorted[largest]) largest = left;
      if (right < n && sorted[right] > sorted[largest]) largest = right;
      
      if (largest !== i) {
        [sorted[i], sorted[largest]] = [sorted[largest], sorted[i]];
        heapify(n, largest);
      }
    };
    
    for (let i = Math.floor(sorted.length / 2) - 1; i >= 0; i--) {
      heapify(sorted.length, i);
    }
    
    for (let i = sorted.length - 1; i > 0; i--) {
      [sorted[0], sorted[i]] = [sorted[i], sorted[0]];
      heapify(i, 0);
    }
    
    return sorted;
  },
  
  bubblesort: (arr: number[]): number[] => {
    const sorted = [...arr];
    const n = sorted.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (sorted[j] > sorted[j + 1]) {
          [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
        }
      }
    }
    return sorted;
  },
  
  insertionsort: (arr: number[]): number[] => {
    const sorted = [...arr];
    for (let i = 1; i < sorted.length; i++) {
      const key = sorted[i];
      let j = i - 1;
      while (j >= 0 && sorted[j] > key) {
        sorted[j + 1] = sorted[j];
        j--;
      }
      sorted[j + 1] = key;
    }
    return sorted;
  },
  
  selectionsort: (arr: number[]): number[] => {
    const sorted = [...arr];
    for (let i = 0; i < sorted.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < sorted.length; j++) {
        if (sorted[j] < sorted[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [sorted[i], sorted[minIdx]] = [sorted[minIdx], sorted[i]];
      }
    }
    return sorted;
  }
};

function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 1000000) + 1);
}

function isArraySorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)} μs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(3)} s`;
}

export default function SortingBenchmarkPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('');
  const [arraySize, setArraySize] = useState<number>(10000);
  const [benchmarking, setBenchmarking] = useState<boolean>(false);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>('');

  const runSingleBenchmark = useCallback(async (algorithmId: string, data: number[]): Promise<BenchmarkResult> => {
    const algorithm = algorithms.find(a => a.id === algorithmId)!;
    const start = performance.now();
    
    const sortedData = sortingImplementations[algorithmId as keyof typeof sortingImplementations](data);
    
    const end = performance.now();
    const duration = end - start;
    
    return {
      algorithmId,
      algorithmName: algorithm.name,
      arraySize: data.length,
      duration,
      isSorted: isArraySorted(sortedData)
    };
  }, []);

  const runBenchmark = useCallback(async (single = false) => {
    setBenchmarking(true);
    setProgress(0);
    setResults([]);
    
    const data = generateRandomArray(arraySize);
    const algorithmsToTest = single && selectedAlgorithm 
      ? [selectedAlgorithm] 
      : algorithms.map(a => a.id);
    
    const newResults: BenchmarkResult[] = [];
    
    for (let i = 0; i < algorithmsToTest.length; i++) {
      const algorithmId = algorithmsToTest[i];
      const algorithm = algorithms.find(a => a.id === algorithmId)!;
      
      setCurrentAlgorithm(algorithm.name);
      setProgress(((i + 1) / algorithmsToTest.length) * 100);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const result = await runSingleBenchmark(algorithmId, [...data]);
        newResults.push(result);
      } catch (error) {
        console.error(`Error benchmarking ${algorithm.name}:`, error);
      }
    }
    
    // Sort results by duration and add ranks
    newResults.sort((a, b) => a.duration - b.duration);
    newResults.forEach((result, index) => {
      result.rank = index + 1;
    });
    
    setResults(newResults);
    setBenchmarking(false);
    setCurrentAlgorithm('');
  }, [selectedAlgorithm, arraySize, runSingleBenchmark]);

  const getRankEmoji = (rank: number | undefined) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Showcase
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="text-primary h-10 w-10" />
            <div>
              <h1 className="text-4xl font-headline font-bold text-foreground">Sorting Benchmark</h1>
              <p className="text-muted-foreground text-lg">
                Compare the performance of different sorting algorithms with various dataset sizes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Benchmark Controls
                </CardTitle>
                <CardDescription>
                  Configure your benchmark parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Array Size</label>
                  <Select value={arraySize.toString()} onValueChange={(value) => setArraySize(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {arraySizeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Single Algorithm Test</label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map(algorithm => (
                        <SelectItem key={algorithm.id} value={algorithm.id}>
                          {algorithm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={() => runBenchmark(true)} 
                    disabled={!selectedAlgorithm || benchmarking}
                    className="w-full"
                    variant="outline"
                  >
                    Test Single Algorithm
                  </Button>
                  <Button 
                    onClick={() => runBenchmark(false)} 
                    disabled={benchmarking}
                    className="w-full"
                  >
                    Compare All Algorithms
                  </Button>
                </div>

                {benchmarking && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                    {currentAlgorithm && (
                      <p className="text-sm text-muted-foreground">
                        Testing: {currentAlgorithm}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="results" className="space-y-4">
              <TabsList>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Benchmark Results
                    </CardTitle>
                    <CardDescription>
                      Performance comparison of sorting algorithms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          {results.map((result) => (
                            <div 
                              key={result.algorithmId} 
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">
                                  {getRankEmoji(result.rank)}
                                </span>
                                <div>
                                  <h3 className="font-medium">{result.algorithmName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {result.arraySize.toLocaleString()} elements
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-mono font-medium">
                                  {formatDuration(result.duration)}
                                </p>
                                <Badge variant={result.isSorted ? "default" : "destructive"}>
                                  {result.isSorted ? "✓ Sorted" : "✗ Failed"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        {results.length > 1 && (
                          <div className="mt-6 p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Performance Insights</h4>
                            <p className="text-sm text-muted-foreground">
                              🚀 <strong>{results[0]?.algorithmName}</strong> was the fastest, 
                              completing in {formatDuration(results[0]?.duration || 0)}
                              {results.length > 1 && (
                                <span>
                                  {' '}({(((results[results.length - 1]?.duration || 0) / (results[0]?.duration || 1))).toFixed(1)}x faster than {results[results.length - 1]?.algorithmName})
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No benchmark results yet. Run a test to see performance data.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="algorithms">
                <Card>
                  <CardHeader>
                    <CardTitle>Algorithm Complexity</CardTitle>
                    <CardDescription>
                      Big O notation for each sorting algorithm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {algorithms.map((algorithm) => (
                        <div key={algorithm.id} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{algorithm.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {algorithm.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Best:</span> 
                              <code className="ml-2 bg-muted px-1 rounded">{algorithm.complexity.best}</code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Average:</span> 
                              <code className="ml-2 bg-muted px-1 rounded">{algorithm.complexity.average}</code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Worst:</span> 
                              <code className="ml-2 bg-muted px-1 rounded">{algorithm.complexity.worst}</code>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Space:</span> 
                              <code className="ml-2 bg-muted px-1 rounded">{algorithm.complexity.space}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}