
"use client";

import { KeyRound, Eye, EyeOff, Edit3, Shuffle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface KeyDisplayProps {
  sharedKey: string;
  onSetSharedKey: (newKey: string) => void;
}

export function KeyDisplay({ sharedKey, onSetSharedKey }: KeyDisplayProps) {
  const [showKey, setShowKey] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const { toast } = useToast();

  const handleSetKeyClick = () => {
    if (!newKeyInput.trim()) {
      toast({
        title: "Input Missing",
        description: "Please enter a new key.",
        variant: "destructive",
      });
      return;
    }
    onSetSharedKey(newKeyInput);
    // setNewKeyInput(''); // Optionally clear after setting
  };

  const handleRandomizeKeyClick = () => {
    const randomKey = Array(16)
      .fill(null)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    setNewKeyInput(''); // Clear the input field
    onSetSharedKey(randomKey);
    toast({
        title: "Key Randomized",
        description: "A new random secret key has been generated and set."
    })
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-headline flex items-center">
            <KeyRound className="h-5 w-5 mr-2 text-primary" />
            Shared Secret Key
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)} aria-label={showKey ? "Hide key" : "Show key"}>
            {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">
            This key is used for encryption and decryption. Changing it will clear current messages.
          </p>
          <div className="mt-2 p-2 bg-muted rounded-md font-mono text-sm break-all">
            {showKey ? sharedKey : '••••••••••••••••'}
          </div>
        </div>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Enter new secret key or randomize"
            value={newKeyInput}
            onChange={(e) => setNewKeyInput(e.target.value)}
            aria-label="New secret key input"
          />
          <div className="flex space-x-2">
            <Button onClick={handleSetKeyClick} className="flex-1" variant="brand">
              <Edit3 className="mr-2 h-4 w-4" />
              Set New Key
            </Button>
            <Button onClick={handleRandomizeKeyClick} variant="outline" className="flex-1">
              <Shuffle className="mr-2 h-4 w-4" />
              Randomize Key
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

    