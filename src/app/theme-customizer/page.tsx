
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Utility to convert hex to HSL string "H S% L%"
function hexToHsl(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

// Utility to convert HSL string "H S% L%" to hex
function hslToHex(hsl: string): string {
    const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
    const s_norm = s / 100;
    const l_norm = l / 100;
    const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l_norm - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else if (h >= 300 && h < 360) { [r, g, b] = [c, 0, x]; }
    
    const toHex = (c: number) => Math.round((c + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}


export default function ThemeCustomizerPage() {
  const { toast } = useToast();

  const getInitialColor = (variableName: string, defaultHex: string): string => {
    if (typeof window === 'undefined') {
      return defaultHex;
    }
    const style = getComputedStyle(document.documentElement);
    const hslColor = style.getPropertyValue(variableName).trim();
    return hslColor ? hslToHex(hslColor) : defaultHex;
  };
  
  const [primaryColor, setPrimaryColor] = useState('#64B5F6');
  const [accentColor, setAccentColor] = useState('#FFB74D');
  const [backgroundColor, setBackgroundColor] = useState('#F0F4F8');
  const [buttonColor, setButtonColor] = useState('#FFB74D');
  
  const [defaultColors, setDefaultColors] = useState({ primary: '', accent: '', background: '', button: '' });


  useEffect(() => {
    // We must wait for the component to mount to access computed styles
    const primary = getInitialColor('--primary', '#64B5F6');
    const accent = getInitialColor('--accent', '#FFB74D');
    const background = getInitialColor('--background', '#F0F4F8');
    const button = getInitialColor('--button', '#FFB74D');

    setPrimaryColor(primary);
    setAccentColor(accent);
    setBackgroundColor(background);
    setButtonColor(button);

    // Store the initial server-rendered colors as defaults
    setDefaultColors({ primary, accent, background, button });
  }, []);

  const updateColorVariable = (variableName: string, hexColor: string) => {
    const hslColor = hexToHsl(hexColor);
    if (hslColor) {
      document.documentElement.style.setProperty(variableName, hslColor);
      if (variableName === '--button') {
        const [h, s, l] = hslColor.split(' ').map(str => parseInt(str.replace('%', '')));
        const foregroundL = l > 50 ? 10 : 98; // Simple foreground logic: dark text on light bg, light text on dark bg.
        document.documentElement.style.setProperty('--button-foreground', `${h} 80% ${foregroundL}%`);
      }
    }
  };

  useEffect(() => updateColorVariable('--primary', primaryColor), [primaryColor]);
  useEffect(() => updateColorVariable('--ring', primaryColor), [primaryColor]);
  useEffect(() => updateColorVariable('--accent', accentColor), [accentColor]);
  useEffect(() => updateColorVariable('--background', backgroundColor), [backgroundColor]);
  useEffect(() => updateColorVariable('--button', buttonColor), [buttonColor]);

  const handleReset = () => {
    setPrimaryColor(defaultColors.primary);
    setAccentColor(defaultColors.accent);
    setBackgroundColor(defaultColors.background);
    setButtonColor(defaultColors.button);
    toast({
      title: "Theme Reset",
      description: "Colors have been reset to their default values.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <header className="absolute top-0 left-0 w-full py-6 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-block">
                <div className="flex items-center space-x-3 cursor-pointer group">
                <Palette className="h-10 w-10 text-primary group-hover:text-accent transition-colors" />
                <h1 className="text-4xl font-headline font-bold text-foreground group-hover:text-accent transition-colors">
                    Theme Customizer
                </h1>
                </div>
            </Link>
        </header>

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Customize Your Theme</CardTitle>
          <CardDescription>
            Pick new colors to see the application theme update in real-time. Changes are temporary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="primaryColor" className="text-lg">Primary Color</Label>
            <div className="relative">
                <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1 appearance-none bg-transparent border-2 border-primary rounded-md cursor-pointer"
                />
                <span className="font-mono text-sm absolute left-full ml-3 top-1/2 -translate-y-1/2 text-muted-foreground">{primaryColor.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="accentColor" className="text-lg">Accent Color</Label>
            <div className="relative">
                <Input
                    id="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-16 h-10 p-1 appearance-none bg-transparent border-2 border-accent rounded-md cursor-pointer"
                />
                 <span className="font-mono text-sm absolute left-full ml-3 top-1/2 -translate-y-1/2 text-muted-foreground">{accentColor.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="buttonColor" className="text-lg">Button Color</Label>
            <div className="relative">
                 <Input
                    id="buttonColor"
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-16 h-10 p-1 appearance-none bg-transparent border-2 border-border rounded-md cursor-pointer"
                    style={{borderColor: buttonColor}}
                />
                <span className="font-mono text-sm absolute left-full ml-3 top-1/2 -translate-y-1/2 text-muted-foreground">{buttonColor.toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="backgroundColor" className="text-lg">Background Color</Label>
            <div className="relative">
                 <Input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 p-1 appearance-none bg-transparent border-2 border-border rounded-md cursor-pointer"
                />
                <span className="font-mono text-sm absolute left-full ml-3 top-1/2 -translate-y-1/2 text-muted-foreground">{backgroundColor.toUpperCase()}</span>
            </div>
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
          </Button>
        </CardContent>
      </Card>
       <div className="mt-8 text-center text-slate-500 text-sm">
            <Link href="/" className="hover:text-primary underline">
                &larr; Back to App Showcase
            </Link>
        </div>
    </div>
  );
}
