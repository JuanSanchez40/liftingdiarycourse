"use client"

import { Menu } from "@base-ui/react/menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

const itemClass =
  "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <Menu.Root>
      <Menu.Trigger
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
        aria-label="Toggle theme"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={4} className="isolate z-50">
          <Menu.Popup className="min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden origin-(--transform-origin) data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Menu.Item className={itemClass} onClick={() => setTheme("light")}>
              <Sun className="size-4" />
              Light
            </Menu.Item>
            <Menu.Item className={itemClass} onClick={() => setTheme("dark")}>
              <Moon className="size-4" />
              Dark
            </Menu.Item>
            <Menu.Item className={itemClass} onClick={() => setTheme("system")}>
              <Monitor className="size-4" />
              System
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
