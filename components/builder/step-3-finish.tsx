'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, Circle } from 'lucide-react';

interface Step3FinishProps {
    selectedFinish: 'matte' | 'satin' | null;
    onNext: (finish: 'matte' | 'satin') => void;
    onBack: () => void;
}

export function Step3Finish({ selectedFinish, onNext, onBack }: Step3FinishProps) {
    const [selected, setSelected] = useState<'matte' | 'satin' | null>(selectedFinish);

    const finishOptions = [
        {
            value: 'matte' as const,
            label: 'Matte',
            description: 'Elegant and subtle finish with no shine',
            icon: Circle,
        },
        {
            value: 'satin' as const,
            label: 'Satin',
            description: 'Smooth finish with a soft, subtle shine',
            icon: Sparkles,
        },
    ];

    const handleFinishSelect = (finish: 'matte' | 'satin') => {
        setSelected(finish);
        onNext(finish);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Select Your Finish</h2>
                <p className="text-muted-foreground">
                    Choose the perfect finish type for your microcement
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {finishOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selected === option.value;

                    return (
                        <Card
                            key={option.value}
                            className={cn(
                                "cursor-pointer transition-all hover:shadow-lg group",
                                isSelected && "ring-2 ring-primary shadow-lg"
                            )}
                            onClick={() => handleFinishSelect(option.value)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-3 rounded-lg transition-colors",
                                            isSelected ? "bg-primary" : "bg-primary/10"
                                        )}>
                                            <Icon className={cn(
                                                "w-6 h-6",
                                                isSelected ? "text-primary-foreground" : "text-primary"
                                            )} />
                                        </div>
                                        <CardTitle className="text-2xl">{option.label}</CardTitle>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {option.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={onBack} variant="outline" size="lg">
                    Back
                </Button>
            </div>
        </div>
    );
}

