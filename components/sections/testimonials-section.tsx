'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer Intern",
    company: "ngintern",
    image: "SC",
    content: "The internship management system made it so easy to apply and track my application. I got feedback within a week and started my role shortly after!",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Design Intern",
    company: "ngintern",
    image: "MR",
    content: "The application process was straightforward and transparent. I always knew where I stood in the process. Great experience!",
    rating: 5
  },
  {
    name: "Emily Thompson",
    role: "Data Science Intern",
    company: "ngintern",
    image: "ET",
    content: "Being able to see all available internships and track my applications in one place was incredibly helpful. The HR team was very responsive!",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              our interns
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our interns have to say about the process.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-semibold text-white">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">
              One company, many opportunities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            <div className="text-2xl font-bold">Engineering</div>
            <div className="text-2xl font-bold">Design</div>
            <div className="text-2xl font-bold">Marketing</div>
            <div className="text-2xl font-bold">Analytics</div>
          </div>
        </div>
      </div>
    </section>
  )
}
