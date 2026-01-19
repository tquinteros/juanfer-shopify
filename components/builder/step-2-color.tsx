'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ColorOption, AVAILABLE_COLORS } from './types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface Step2ColorProps {
    selectedColor: ColorOption | null;
    onNext: (color: ColorOption) => void;
    onBack: () => void;
}

export function Step2Color({ selectedColor, onNext, onBack }: Step2ColorProps) {
    const [selected, setSelected] = useState<ColorOption | null>(selectedColor);

    const handleNext = () => {
        if (selected) {
            onNext(selected);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Choose Your Color</h2>
                <p className="text-muted-foreground">
                    Select the perfect color for your microcement finish
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {AVAILABLE_COLORS.map((color) => (
                    <Card
                        key={color.id}
                        className={cn(
                            "cursor-pointer transition-all hover:shadow-lg",
                            selected?.id === color.id && "ring-2 ring-primary shadow-lg"
                        )}
                        onClick={() => setSelected(color)}
                    >
                        <CardContent className="p-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={color.image}
                                    alt={color.label}
                                    fill
                                    className="object-cover"
                                />
                                {selected?.id === color.id && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">{color.label}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={onBack} variant="outline" size="lg">
                    Back
                </Button>
                <Button onClick={handleNext} size="lg" disabled={!selected} className="min-w-32">
                    Next
                </Button>
            </div>
        </div>
    );
}

