'use client';

import { useLanguage } from '@/lib/contexts/language-context';

export function LoadingOverlay() {
  const { isLoading } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );
}

