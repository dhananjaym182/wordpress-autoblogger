"use client"

import { useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

export type BrandLogoVariant = "minimal" | "icon" | "wordmark"
export type BrandLogoMode = "light" | "dark" | "auto"

type BrandLogoProps = {
  variant: BrandLogoVariant
  size?: number
  mode?: BrandLogoMode
  withText?: boolean
  className?: string
  label?: string
  decorative?: boolean
}

const logoAssetMap: Record<BrandLogoVariant, Record<Exclude<BrandLogoMode, "auto">, string>> = {
  minimal: {
    light: "/brand/logo-minimal-light.svg",
    dark: "/brand/logo-minimal-dark.svg",
  },
  icon: {
    light: "/brand/logo-icon-light.svg",
    dark: "/brand/logo-icon-dark.svg",
  },
  wordmark: {
    light: "/brand/logo-wordmark-light.svg",
    dark: "/brand/logo-wordmark-dark.svg",
  },
}

const variantAspectRatio: Record<BrandLogoVariant, number> = {
  minimal: 1,
  icon: 3.33,
  wordmark: 4.28,
}

function BrandTextFallback({
  variant,
  size,
  withText,
  className,
  decorative,
  label,
}: {
  variant: BrandLogoVariant
  size: number
  withText: boolean
  className?: string
  decorative: boolean
  label: string
}) {
  const showText = variant !== "minimal" || withText

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
    >
      <span
        className="inline-flex items-center justify-center rounded-md bg-primary font-semibold text-primary-foreground"
        style={{ width: size, height: size, fontSize: Math.max(11, Math.floor(size * 0.42)) }}
      >
        A
      </span>
      {showText ? (
        <span className="text-sm font-semibold tracking-tight text-foreground">AutoBlogger</span>
      ) : null}
    </span>
  )
}

export function BrandLogo({
  variant,
  size = 32,
  mode = "auto",
  withText = false,
  className,
  label = "AutoBlogger",
  decorative = false,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme()
  const [failedSource, setFailedSource] = useState<string | null>(null)

  const resolvedMode: Exclude<BrandLogoMode, "auto"> =
    mode === "auto" ? (resolvedTheme === "dark" ? "dark" : "light") : mode

  const source = logoAssetMap[variant][resolvedMode]
  const width = Math.round(size * variantAspectRatio[variant])

  const imageError = failedSource === source

  if (!source || imageError) {
    return (
      <BrandTextFallback
        variant={variant}
        size={size}
        withText={withText}
        className={className}
        decorative={decorative}
        label={label}
      />
    )
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-hidden={decorative || undefined}>
      <Image
        src={source}
        width={width}
        height={size}
        alt={decorative ? "" : label}
        aria-hidden={decorative || undefined}
        priority
        unoptimized
        onError={() => setFailedSource(source)}
        style={{ width: "auto", height: size }}
      />
      {variant === "minimal" && withText ? (
        <span className="text-sm font-semibold tracking-tight text-foreground">AutoBlogger</span>
      ) : null}
    </span>
  )
}
