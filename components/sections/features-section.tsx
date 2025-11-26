'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Rocket, 
  Search, 
  Users, 
  FileText, 
  Bell, 
  Shield,
  Zap,
  Heart,
  BarChart
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Easy Discovery",
    description: "Browse all available internships across our company departments with detailed descriptions.",
    color: "text-blue-600"
  },
  {
    icon: Rocket,
    title: "Quick Application",
    description: "Apply to internships with a streamlined process. Upload your resume once and apply to multiple roles.",
    color: "text-purple-600"
  },
  {
    icon: Bell,
    title: "Status Tracking",
    description: "Get real-time updates on your application status from submission to final decision.",
    color: "text-pink-600"
  },
  {
    icon: Users,
    title: "Team Integration",
    description: "Connect directly with team managers and get insights into our company culture and teams.",
    color: "text-orange-600"
  },
  {
    icon: FileText,
    title: "Centralized Management",
    description: "Track all your applications in one dashboard. See your progress and manage your profile.",
    color: "text-green-600"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security. Internal use only for our organization.",
    color: "text-red-600"
  },
  {
    icon: Zap,
    title: "Fast Responses",
    description: "Our HR team reviews applications promptly and provides feedback within days, not weeks.",
    color: "text-yellow-600"
  },
  {
    icon: BarChart,
    title: "Application Analytics",
    description: "View your application history and insights to improve your chances of success.",
    color: "text-indigo-600"
  },
  {
    icon: Heart,
    title: "Supportive Process",
    description: "Our HR team is here to help. Get guidance throughout your internship application journey.",
    color: "text-rose-600"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-muted/50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              join our team
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make your internship application process smooth and transparent.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted ${feature.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
