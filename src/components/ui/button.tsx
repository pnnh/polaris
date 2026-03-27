"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * shadcn/ui Button — RSC-compatible (interactive boundary is here via "use client").
 * Color tokens reference the project's existing CSS variables so the component
 * automatically adapts to light/dark theme via body.darkTheme.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium " +
    "transition-colors cursor-pointer " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                /** Filled primary — matches MUI variant="contained" */
                default:
                    "bg-[var(--primary-color)] text-white hover:opacity-90 active:opacity-80",
                /** Destructive / danger — red, replaces MUI styled(Button) with red[500] */
                destructive:
                    "bg-[var(--error-color)] text-white hover:opacity-90 active:opacity-80",
                /** Bordered — matches MUI variant="outlined" */
                outline:
                    "border border-[var(--primary-color)] bg-transparent text-[var(--primary-color)] " +
                    "hover:bg-[var(--action-hover-color)]",
                /** Secondary */
                secondary:
                    "bg-[var(--secondary-color)] text-white hover:opacity-80",
                /** Text / ghost — matches MUI variant="text" (MUI default) */
                ghost:
                    "text-[var(--text-primary-color)] hover:bg-[var(--action-hover-color)]",
                /** Underline link style */
                link:
                    "text-[var(--primary-color)] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                /** Matches MUI size="small" */
                sm: "h-7 rounded px-2.5 text-xs",
                /** Matches MUI size="large" */
                lg: "h-11 rounded-md px-8",
                /** Square icon-only button */
                icon: "h-8 w-8 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    /**
     * When true, renders the button as its first child element (Radix Slot).
     * Use this to render an <a> tag while keeping button styles:
     *   <Button asChild><a href="/path">Link</a></Button>
     */
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }

