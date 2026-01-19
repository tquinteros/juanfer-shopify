'use client';

import { useState } from 'react';
import { BuilderData, ColorOption } from './types';
import { ProgressBar } from './progress-bar';
import { Step1Area } from './step-1-area';
import { Step2Color } from './step-2-color';
import { Step3Finish } from './step-3-finish';
import { Step4Summary } from './step-4-summary';
import { useProductByHandleServer } from '@/components/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface MicrocementBuilderProps {
    productHandle: string;
}

const TOTAL_STEPS = 4;

export function MicrocementBuilder({ productHandle }: MicrocementBuilderProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [builderData, setBuilderData] = useState<BuilderData>({
        floorArea: 0,
        wallArea: 0,
        color: null,
        finish: null,
    });

    const { data: productData, isLoading } = useProductByHandleServer({
        handle: productHandle,
    });

    const handleStep1Next = (floorArea: number, wallArea: number) => {
        setBuilderData((prev) => ({
            ...prev,
            floorArea,
            wallArea,
        }));
        setCurrentStep(2);
    };

    const handleStep2Next = (color: ColorOption) => {
        setBuilderData((prev) => ({
            ...prev,
            color,
        }));
        setCurrentStep(3);
    };

    const handleStep3Next = (finish: 'matte' | 'satin') => {
        setBuilderData((prev) => ({
            ...prev,
            finish,
        }));
        setCurrentStep(4);
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1));
    };

    const handleStepClick = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart logic
        toast.success('Kit added to cart!', {
            description: `${builderData.floorArea + builderData.wallArea} m² kit with ${builderData.color?.label} color`,
        });
        console.log('Adding to cart:', builderData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    const productName = productData?.productByHandle?.title || 'Microcement Kit';

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    onStepClick={handleStepClick}
                />

                {/* <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">{productName}</h1>
                    <p className="text-muted-foreground">
                        Build your custom microcement kit in {TOTAL_STEPS} easy steps
                    </p>
                </div> */}

                <div className="mt-8">
                    {currentStep === 1 && (
                        <Step1Area
                            floorArea={builderData.floorArea}
                            wallArea={builderData.wallArea}
                            onNext={handleStep1Next}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2Color
                            selectedColor={builderData.color}
                            onNext={handleStep2Next}
                            onBack={handleBack}
                        />
                    )}

                    {currentStep === 3 && (
                        <Step3Finish
                            selectedFinish={builderData.finish}
                            onNext={handleStep3Next}
                            onBack={handleBack}
                        />
                    )}

                    {currentStep === 4 && (
                        <Step4Summary
                            data={builderData}
                            productName={productName}
                            onBack={handleBack}
                            onAddToCart={handleAddToCart}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

