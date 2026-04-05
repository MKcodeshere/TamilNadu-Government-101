"use client";

import { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface DetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: BilingualText;
  description?: BilingualText;
  children: ReactNode;
}

export function DetailPanel({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DetailPanelProps) {
  const { t } = useLanguage();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

        {/* Panel */}
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[var(--color-border)]
            bg-[var(--color-surface)] shadow-xl
            transition-panel
            data-[state=open]:animate-in data-[state=open]:slide-in-from-right
            data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right
            flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-6 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold text-[var(--color-text)] leading-snug">
                {t(title)}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {t(description)}
                </Dialog.Description>
              )}
            </div>

            <Dialog.Close asChild>
              <button
                className="shrink-0 rounded-md p-1.5 text-[var(--color-text-secondary)]
                  hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5
                  transition-colors duration-150"
                aria-label="Close panel"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
