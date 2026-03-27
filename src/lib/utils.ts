import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS class names with clsx and tailwind-merge.
 * Resolves conflicts by applying the last conflicting class.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

