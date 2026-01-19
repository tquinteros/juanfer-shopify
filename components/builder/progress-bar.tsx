'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    onStepClick: (step: number) => void;
}

const STEP_LABELS = ['Area', 'Color', 'Finish', 'Summary'];

export function ProgressBar({ currentStep, totalSteps, onStepClick }: ProgressBarProps) {
    return (
        <div className="w-full mb-8">
            {/* Progress bar line */}
            <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-border" />
                <div 
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
                
                {/* Steps */}
                <div className="relative flex justify-between">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;
                        const isClickable = stepNumber < currentStep;

                        return (
                            <button
                                key={stepNumber}
                                onClick={() => isClickable && onStepClick(stepNumber)}
                                disabled={!isClickable}
                                className={cn(
                                    "flex flex-col items-center gap-2 group",
                                    isClickable && "cursor-pointer"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2",
                                        isCompleted && "bg-primary border-primary text-primary-foreground",
                                        isCurrent && "bg-background border-primary text-primary ring-4 ring-primary/20",
                                        !isCompleted && !isCurrent && "bg-background border-border text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isCurrent && "text-foreground",
                                        isCompleted && "text-foreground",
                                        !isCompleted && !isCurrent && "text-muted-foreground"
                                    )}
                                >
                                    {STEP_LABELS[index]}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

