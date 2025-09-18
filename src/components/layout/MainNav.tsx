
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/levels",
      label: "Levels",
    },
    
  ]

  const navClass = cn(
    "flex items-center space-x-4 lg:space-x-6",
    isMobile && "flex-col space-x-0 space-y-4 items-start"
  );

  return (
    <nav className={navClass}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith(item.href)
              ? "text-primary"
              : "text-muted-foreground",
            isMobile && "text-lg"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
