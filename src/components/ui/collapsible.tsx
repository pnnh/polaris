"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * Collapsible root — wraps Radix UI CollapsiblePrimitive.Root.
 * Mark as 'use client' so server components can still import it;
 * the interactivity boundary is encapsulated here, enabling RSC usage.
 */
const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

