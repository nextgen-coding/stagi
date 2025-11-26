'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data - In production, this would come from React Query
const mockInternships = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "ngintern",
    department: "Engineering",
    location: "Remote",
    duration: "3 months",
    description: "Join our frontend team to build cutting-edge web applications using React, TypeScript, and Next.js.",
    tags: ["React", "TypeScript", "UI/UX"]
  },
  {
    id: "2",
    title: "Product Design Intern",
    company: "ngintern",
    department: "Design",
    location: "Hybrid",
    duration: "6 months",
    description: "Work alongside our design team to create beautiful, user-centric products that solve real problems.",
    tags: ["Figma", "UI/UX", "Prototyping"]
  },
  {
    id: "3",
    title: "Data Science Intern",
    company: "ngintern",
    department: "Analytics",
    location: "On-site",
    duration: "4 months",
    description: "Analyze large datasets and build machine learning models to drive business insights and decisions.",
    tags: ["Python", "ML", "SQL"]
  },
  {
    id: "4",
    title: "Backend Engineer Intern",
    company: "ngintern",
    department: "Engineering",
    location: "Remote",
    duration: "3 months",
    description: "Build scalable APIs and microservices using Node.js, PostgreSQL, and cloud infrastructure.",
    tags: ["Node.js", "PostgreSQL", "AWS"]
  },
  {
    id: "5",
    title: "Marketing Intern",
    company: "ngintern",
    department: "Marketing",
    location: "Hybrid",
    duration: "3 months",
    description: "Help us grow our brand through creative campaigns, content marketing, and social media.",
    tags: ["Content", "Social Media", "SEO"]
  },
  {
    id: "6",
    title: "Mobile Developer Intern",
    company: "ngintern",
    department: "Engineering",
    location: "Remote",
    duration: "4 months",
    description: "Build native mobile applications for iOS and Android using React Native and modern development tools.",
    tags: ["React Native", "Mobile", "TypeScript"]
  }
]

export function OpenPositionsSection() {
  return (
    <section id="internships" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Open Internships
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore exciting internship opportunities across our company. Your career journey starts here.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {mockInternships.map((internship) => (
            <Card 
              key={internship.id} 
              className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{internship.department}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {internship.duration}
                  </div>
                </div>
                <CardTitle className="text-xl">{internship.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center">
                    <Building2 className="mr-1 h-3 w-3" />
                    {internship.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    {internship.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {internship.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {internship.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/internship/${internship.id}`} className="w-full">
                  <Button className="w-full gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/internships">
            <Button size="lg" variant="outline" className="gap-2">
              View All Internships
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
