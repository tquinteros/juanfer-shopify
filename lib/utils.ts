import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @param url
 * @param currentOrigin
 * @returns
 */
export function formatMenuUrl(url: string, currentOrigin?: string): { href: string; isExternal: boolean } {
  if (url.startsWith('/')) {
    return { href: url, isExternal: false };
  }

  try {
    const urlObj = new URL(url);
    
    if (currentOrigin) {
      try {
        const currentUrlObj = new URL(currentOrigin);
        const isInternal = 
          urlObj.hostname === currentUrlObj.hostname || 
          urlObj.hostname === `www.${currentUrlObj.hostname}` ||
          currentUrlObj.hostname === `www.${urlObj.hostname}`;

        if (isInternal) {
          const pathname = urlObj.pathname;
          const search = urlObj.search;
          return { href: `${pathname}${search}`, isExternal: false };
        }
      } catch {
      }
    }

    const pathname = urlObj.pathname;
    if (pathname && !pathname.startsWith('http')) {
      const search = urlObj.search;
      return { href: `${pathname}${search}`, isExternal: false };
    }

    return { href: url, isExternal: true };
  } catch {
    return { href: url.startsWith('/') ? url : `/${url}`, isExternal: false };
  }
}
