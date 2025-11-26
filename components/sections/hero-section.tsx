'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[500px] w-[500px] -translate-x-[30%] rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="absolute right-[50%] top-[30%] h-[400px] w-[400px] translate-x-[30%] rounded-full bg-gradient-to-l from-pink-600/20 to-orange-600/20 blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur-sm px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">Internal Internship Portal</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            <span className="block">Join Our Team as an</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Intern
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
            Welcome to our internal internship management system. Browse available internships, 
            submit your application, and track your progress all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="#internships">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Browse Opportunities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t">
            <div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold mb-1">
                15<span className="text-blue-600">+</span>
              </div>
              <div className="text-sm text-muted-foreground">Open Internships</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold mb-1">
                50<span className="text-purple-600">+</span>
              </div>
              <div className="text-sm text-muted-foreground">Interns Hired</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold mb-1">
                8<span className="text-pink-600">+</span>
              </div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold mb-1">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-sm text-muted-foreground">Growing Team</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
