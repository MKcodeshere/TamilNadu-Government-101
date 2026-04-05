"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface EntityCardProps {
  icon: string;
  title: BilingualText;
  subtitle?: string;
  stat?: string;
  statLabel?: BilingualText;
  color: string;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function EntityCard({
  icon,
  title,
  subtitle,
  stat,
  statLabel,
  color,
  href,
  onClick,
  children,
  size = "md",
}: EntityCardProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: "p-3 gap-2",
    md: "p-4 gap-3",
    lg: "p-5 gap-3",
  };

  const content = (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className={`group flex flex-col ${sizeClasses[size]} rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-colors cursor-pointer`}
      style={{ borderTopColor: color, borderTopWidth: "3px" }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={size === "lg" ? "text-2xl" : "text-lg"}>{icon}</span>
          <div>
            <h3
              className={`font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] ${
                size === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
              }`}
            >
              {t(title)}
            </h3>
            {subtitle && (
              <p className="text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
            )}
          </div>
        </div>
        {stat && (
          <div className="text-right">
            <span className="text-lg font-bold" style={{ color }}>
              {stat}
            </span>
            {statLabel && (
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                {t(statLabel)}
              </p>
            )}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
