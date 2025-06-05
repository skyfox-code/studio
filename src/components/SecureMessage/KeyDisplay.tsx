
"use client";

import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface KeyDisplayProps {
  sharedKey: string;
}

export function KeyDisplay({ sharedKey }: KeyDisplayProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold font-headline flex items-center">
          <KeyRound className="h-5 w-5 mr-2 text-primary" />
          Shared Secret Key
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setShowKey(!showKey)} aria-label={showKey ? "Hide key" : "Show key"}>
          {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This key is used by both sender and receiver for encryption and decryption. In a real E2EE system, key exchange is a critical and complex process.
        </p>
        <div className="mt-2 p-2 bg-muted rounded-md font-mono text-sm break-all">
          {showKey ? sharedKey : '••••••••••••••••'}
        </div>
      </CardContent>
    </Card>
  );
}
