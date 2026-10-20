import type React from "react"
import "./shiny-button.css"

interface ShinyButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  testId?: string
}

export function ShinyButton({ children, href, onClick, className = "", testId }: ShinyButtonProps) {
  const inner = <span>{children}</span>
  if (href) {
    return (
      <a
        href={href}
        className={`shiny-cta ${className}`}
        onClick={onClick}
        data-testid={testId}
      >
        {inner}
      </a>
    )
  }
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick} data-testid={testId}>
      {inner}
    </button>
  )
}
