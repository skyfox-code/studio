
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Unlock } from 'lucide-react';

interface UserPanelProps {
  title: string;
  inputLabel: string;
  inputValue: string;
  onInputChange?: (value: string) => void;
  isInputDisabled?: boolean;
  actionButtonLabel: string;
  onActionButtonClick: () => void;
  isActionButtonDisabled?: boolean;
  outputLabel: string;
  outputValue: string;
  outputPlaceholder?: string;
  Icon: FC<{className?: string}>;
  actionIcon?: 'lock' | 'unlock' | 'send';
}

export function UserPanel({
  title,
  inputLabel,
  inputValue,
  onInputChange,
  isInputDisabled = false,
  actionButtonLabel,
  onActionButtonClick,
  isActionButtonDisabled = false,
  outputLabel,
  outputValue,
  outputPlaceholder = "Output will appear here...",
  Icon,
  actionIcon,
}: UserPanelProps) {
  
  const renderActionIcon = () => {
    if (actionIcon === 'lock') return <Lock className="mr-2 h-4 w-4" />;
    if (actionIcon === 'unlock') return <Unlock className="mr-2 h-4 w-4" />;
    if (actionIcon === 'send') return <ArrowRight className="mr-2 h-4 w-4" />;
    return null;
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${title.toLowerCase()}-input`}>{inputLabel}</Label>
          <Textarea
            id={`${title.toLowerCase()}-input`}
            value={inputValue}
            onChange={onInputChange ? (e) => onInputChange(e.target.value) : undefined}
            readOnly={!onInputChange || isInputDisabled}
            placeholder={onInputChange ? "Type your message here..." : "Waiting for message..."}
            className="mt-1 min-h-[100px]"
            disabled={isInputDisabled}
          />
        </div>

        <Button 
          onClick={onActionButtonClick} 
          className="w-full"
          disabled={isActionButtonDisabled}
        >
          {renderActionIcon()}
          {actionButtonLabel}
        </Button>

        <div>
          <Label htmlFor={`${title.toLowerCase()}-output`}>{outputLabel}</Label>
          <Textarea
            id={`${title.toLowerCase()}-output`}
            value={outputValue}
            readOnly
            placeholder={outputPlaceholder}
            className="mt-1 min-h-[100px] bg-muted/50 font-mono"
          />
        </div>
      </CardContent>
    </Card>
  );
}
