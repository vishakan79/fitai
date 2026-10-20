import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

/**
 * Modal built on the native <dialog> element, which gives us focus trapping,
 * Escape-to-close and an inert background for free.
 */
export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) dismisses the dialog.
        if (e.target === ref.current) onClose()
      }}
      className={cn(
        'm-auto w-[min(92vw,32rem)] rounded-3xl border border-line-strong bg-card p-0 text-ink',
        'shadow-2xl backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="dialog-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description && (
              <p id="dialog-description" className="mt-1 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children && <div className="mt-5">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </dialog>
  )
}
