'use client';

import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface ThemeCustomizerProps {
  birthdayId: string;
  onClose: () => void;
}

export default function ThemeCustomizer({ birthdayId, onClose }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme();

  const handleColorChange = (property: 'backgroundColor' | 'color', value: string) => {
    setTheme(birthdayId, { ...theme, [property]: value });
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-80">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Customize Theme</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <Input
                        id="bg-color"
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="p-1 h-10"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <Input
                        id="text-color"
                        type="color"
                        value={theme.color}
                        onChange={(e) => handleColorChange('color', e.target.value)}
                        className="p-1 h-10"
                    />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
