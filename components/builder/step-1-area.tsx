'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Home } from 'lucide-react';

interface Step1AreaProps {
    floorArea: number;
    wallArea: number;
    onNext: (floorArea: number, wallArea: number) => void;
}

export function Step1Area({ floorArea: initialFloor, wallArea: initialWall, onNext }: Step1AreaProps) {
    const [floorArea, setFloorArea] = useState(initialFloor.toString());
    const [wallArea, setWallArea] = useState(initialWall.toString());
    const [errors, setErrors] = useState<{ floor?: string; wall?: string }>({});

    const handleNext = () => {
        const floor = parseFloat(floorArea) || 0;
        const wall = parseFloat(wallArea) || 0;

        const newErrors: { floor?: string; wall?: string } = {};

        if (floor <= 0 && wall <= 0) {
            newErrors.floor = 'Please enter area for floor or walls';
            newErrors.wall = 'Please enter area for floor or walls';
        }

        if (floor < 0) {
            newErrors.floor = 'Floor area cannot be negative';
        }

        if (wall < 0) {
            newErrors.wall = 'Wall area cannot be negative';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onNext(floor, wall);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Calculate Your Microcement Kit</h2>
                <p className="text-muted-foreground">
                    Enter the area you want to cover to get the perfect kit for your project
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Home className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Floor Area</CardTitle>
                                <CardDescription>Square meters of floor</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="floor">Floor m²</Label>
                            <div className="relative">
                                <Input
                                    id="floor"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={floorArea}
                                    onChange={(e) => {
                                        setFloorArea(e.target.value);
                                        setErrors({});
                                    }}
                                    className={errors.floor ? 'border-destructive' : ''}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                    m²
                                </span>
                            </div>
                            {errors.floor && (
                                <p className="text-sm text-destructive">{errors.floor}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Wall Area</CardTitle>
                                <CardDescription>Square meters of walls</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="wall">Wall m²</Label>
                            <div className="relative">
                                <Input
                                    id="wall"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={wallArea}
                                    onChange={(e) => {
                                        setWallArea(e.target.value);
                                        setErrors({});
                                    }}
                                    className={errors.wall ? 'border-destructive' : ''}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                    m²
                                </span>
                            </div>
                            {errors.wall && (
                                <p className="text-sm text-destructive">{errors.wall}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} size="lg" className="min-w-32">
                    Next
                </Button>
            </div>
        </div>
    );
}

