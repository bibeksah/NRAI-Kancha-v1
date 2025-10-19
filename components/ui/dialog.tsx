import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-background/90 backdrop-blur-md animate-fade-in"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        ref={ref}
        className={cn(
          "relative z-50 w-full max-w-lg bg-card rounded-3xl shadow-strong border border-border/50 p-6 sm:p-8 animate-scale-in",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
Dialog.displayName = "Dialog"

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left mb-6", className)}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl sm:text-2xl font-bold leading-tight tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm sm:text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-3 mt-6", className)}
    {...props}
  />
))
DialogFooter.displayName = "DialogFooter"

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
