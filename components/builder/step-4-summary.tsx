'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BuilderData } from './types';
import { Home, Building2, Palette, Sparkles, Package, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Step4SummaryProps {
    data: BuilderData;
    productName?: string;
    onBack: () => void;
    onAddToCart: () => void;
}

export function Step4Summary({ data, productName = 'Microcement Kit', onBack, onAddToCart }: Step4SummaryProps) {
    const totalArea = data.floorArea + data.wallArea;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Your Custom Kit Summary</h2>
                <p className="text-muted-foreground">
                    Review your selections before adding to cart
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Coverage Area
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.floorArea > 0 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Floor</span>
                                </div>
                                <span className="font-semibold">{data.floorArea} m²</span>
                            </div>
                        )}
                        {data.wallArea > 0 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Walls</span>
                                </div>
                                <span className="font-semibold">{data.wallArea} m²</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Total Coverage</span>
                            <span className="text-lg font-bold text-primary">{totalArea} m²</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary" />
                            Finish Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.color && (
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Color</div>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                                        <Image
                                            src={data.color.image}
                                            alt={data.color.label}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-semibold">{data.color.label}</span>
                                </div>
                            </div>
                        )}
                        <Separator />
                        {data.finish && (
                            <div>
                                <div className="text-sm text-muted-foreground mb-2">Finish Type</div>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="font-semibold capitalize">{data.finish}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Product Info Card */}
            <Card className="bg-primary/5">
                <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-1">{productName}</h3>
                            <CardDescription>
                                Custom kit configured for {totalArea} m² with {data.color?.label} color and {data.finish} finish
                            </CardDescription>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button onClick={onBack} variant="outline" size="lg">
                    Back
                </Button>
                <Button onClick={onAddToCart} size="lg" className="min-w-40">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}

