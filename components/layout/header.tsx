'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Briefcase } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ngintern
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link 
            href="#features" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Features
          </Link>
          <Link 
            href="#internships" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Open Internships
          </Link>
          <Link 
            href="#about" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link 
              href="#features" 
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#internships" 
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Open Internships
            </Link>
            <Link 
              href="#about" 
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="#contact" 
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
