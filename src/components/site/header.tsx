"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TopNotice } from "./top-notice";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Como funciona", href: "/como-funciona" },
    {
      label: "Soluções",
      href: "#",
      dropdown: [
        { label: "Dentista OS™", href: "/solucoes/dentista-os" },
      ],
    },
    { label: "Para quem", href: "/para-quem" },
    { label: "Insights", href: "/insights" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopNotice />
      <nav className="container mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-semibold text-foreground"
          >
            LK Digital
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger className="text-sm font-medium text-foreground hover:text-accent transition-colors outline-none">
                      {item.label}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.href} asChild>
                          <Link href={dropdownItem.href}>
                            {dropdownItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button
                aria-label="Open menu"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {navItems.map((item) => {
                  if (item.dropdown) {
                    return (
                      <div key={item.label} className="flex flex-col gap-2">
                        <div className="text-sm font-medium text-foreground">
                          {item.label}
                        </div>
                        <Separator />
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm text-muted-foreground hover:text-accent transition-colors pl-4"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

