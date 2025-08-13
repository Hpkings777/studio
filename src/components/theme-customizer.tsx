'use client';

import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ThemeCustomizerProps {
  birthdayId: string;
}

export default function ThemeCustomizer({ birthdayId }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme();

  const handleColorChange = (property: 'backgroundColor' | 'color', value: string) => {
    setTheme(birthdayId, { ...theme, [property]: value });
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Card className="w-80">
            <CardHeader>
                <CardTitle>Customize Theme</CardTitle>
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
