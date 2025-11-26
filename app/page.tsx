'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, MapPin, Clock, Briefcase, Linkedin, Play, Sparkles, TrendingUp, GraduationCap, Rocket, ArrowRight, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

// Gradient Flare Component - Pure Blue Theme
const GradientFlare = ({ className = "", variant = "primary" }: { className?: string, variant?: "primary" | "secondary" | "accent" }) => {
  const colors = {
    primary: "from-blue-600/40 via-sky-500/30 to-cyan-400/20",
    secondary: "from-sky-500/35 via-blue-600/25 to-indigo-500/20",
    accent: "from-cyan-400/30 via-blue-500/25 to-sky-600/20"
  }
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className={`absolute w-[700px] h-[700px] bg-gradient-to-br ${colors[variant]} rounded-full blur-[120px] opacity-70`} />
    </div>
  )
}

interface Internship {
  id: string
  title: string
  department: string
  description: string
  location: string | null
  duration: string | null
  isOpen: boolean
}

// Extract unique departments from internships
const getDepartments = (internships: Internship[]): string[] => {
  const departments = [...new Set(internships.map(i => i.department).filter(Boolean))]
  return ['All', ...departments]
}

export default function Home() {
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchInternships() {
      try {
        const res = await fetch('/api/internships?limit=6')
        const data = await res.json()
        setFeaturedInternships(data.internships || [])
      } catch (error) {
        console.error('Failed to fetch internships:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInternships()
  }, [])

  const heroColumns = [
    [
      { src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Interns celebrating", height: "h-[200px]" },
      { src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Top view planning", height: "h-[150px]" }
    ],
    [
      { src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Strategy workshop", height: "h-[260px]" }
    ],
    [
      { src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Happy team", height: "h-[320px]" }
    ],
    [
      { src: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Product presentation", height: "h-[220px]" },
      { src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Design sync", height: "h-[150px]" }
    ],
    [
      { src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Brainstorm session", height: "h-[260px]" },
      { src: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=640", alt: "Workshop", height: "h-[130px]" }
    ]
  ]

  const teamMembers = [
    { name: "Sarah Chen", role: "AI Research Lead", image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Marcus Johnson", role: "Engineering Manager", image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Emily Rodriguez", role: "Product Designer", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "David Kim", role: "ML Engineer", image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ]

  // Dynamic departments from internships
  const departments = getDepartments(featuredInternships)
  
  // Filter internships based on active filter
  const filteredInternships = activeFilter === 'All' 
    ? featuredInternships 
    : featuredInternships.filter(i => i.department === activeFilter)

  const navLinks = [
    { label: 'Internships', href: '/internships/browse', primary: true },
    { label: 'Team', href: '#team' },
    { label: 'Careers', href: '#careers' },
    { label: 'About', href: '#about' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 text-slate-900 dark:text-white overflow-hidden relative">
      {/* Background Gradient Flares */}
      <GradientFlare className="-top-32 -right-32" variant="primary" />
      <GradientFlare className="top-[40%] -left-64" variant="secondary" />
      <GradientFlare className="top-[70%] right-0" variant="accent" />
      <GradientFlare className="bottom-0 left-1/3" variant="primary" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Stagi
            </span>
          </Link>
          
          {/* Desktop Navigation - Centered */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all border-0">
                Get started!
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/50 dark:border-blue-700/30 text-slate-600 dark:text-slate-300 text-xs font-medium mb-5 shadow-sm">
              <span>Why and what is</span>
              <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-semibold">
                Stagi v1.0
                <Sparkles className="w-3 h-3 text-blue-500" />
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1]">
              We are embarking on a
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">profound mission</span>
            </h1>
            
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 max-w-xl mx-auto">
              Started as a dream to empower product development workflows.
              It's a haven where experience and functionality converge.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/internships/browse">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full px-6 h-11 font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                  All available positions
                </Button>
              </Link>
              <Link href="#team">
                <Button variant="outline" className="rounded-full px-6 h-11 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Our social media
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Collage Grid - Zantic Style */}
          <div className="relative max-w-6xl mx-auto px-4 mt-10">
            <div className="flex flex-wrap lg:flex-nowrap items-end justify-center gap-4 lg:gap-6">
              {heroColumns.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className="flex flex-col gap-4 w-[48%] min-w-[140px] sm:w-[160px] lg:w-[170px]"
                >
                  {column.map((image, imageIndex) => (
                    <div
                      key={imageIndex}
                      className={`${image.height} rounded-[26px] overflow-hidden shadow-2xl shadow-slate-900/40 bg-slate-200 dark:bg-slate-800 transition-transform duration-500 hover:-translate-y-1`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Base glow to mimic Zantic reflection */}
            <div className="pointer-events-none absolute inset-x-10 -bottom-6 h-20 bg-gradient-to-t from-white/60 via-white/10 to-transparent dark:from-slate-950/70 dark:via-slate-950/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Crafting dreams with a creative approach",
                description: "We believe in nurturing talent through hands-on experience with real AI products."
              },
              {
                title: "Transformative journeys for a timeless experience",
                description: "Our internship programs are designed to accelerate your growth in artificial intelligence."
              },
              {
                title: "Unleashing innovation, nurturing excellence",
                description: "Work alongside industry experts and build skills that define the future of technology."
              }
            ].map((feature, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Intern With Us Section */}
      <section id="team" className="py-14 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-4 border border-blue-200/50 dark:border-blue-700/30">
              <Sparkles className="w-4 h-4" />
              <span>Your Growth Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              We invest in <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">your future</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              More than just an internship — it's a launchpad for your career. We're committed to helping you grow, learn, and succeed.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Card 1 - Growth Investment */}
            <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                We Invest in You
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Dedicated mentorship, hands-on training, and real projects that build your portfolio. Your growth is our priority.
              </p>
            </div>

            {/* Card 2 - Job Opportunities */}
            <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Path to Employment
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Top performers get offered part-time or full-time positions. Show us what you can do and earn your place on the team.
              </p>
            </div>

            {/* Card 3 - Student Friendly */}
            <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Student Friendly
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Flexible hours that work around your classes. We understand student life and support your academic success.
              </p>
            </div>

            {/* Card 4 - Real Experience */}
            <div className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-900/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                <Rocket className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Real Experience
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Work on production-level AI projects that make a real impact. No coffee runs — just meaningful work from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Team Section */}
      <section className="py-14 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30 text-slate-600 dark:text-slate-400 text-xs font-medium mb-3">
                <span>People behind</span>
                <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-semibold">
                  Stagi v1.0
                  <Sparkles className="w-3 h-3 text-blue-500" />
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 dark:text-white mb-4">
                The squad that built Stagi from the ground up
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                We are always looking for passionate, dynamic, and talented individuals to join our distributed team all around the world.
              </p>
              
              {/* Stats */}
              <div className="flex gap-12">
                <div>
                  <div className="text-4xl font-medium text-slate-900 dark:text-white">150+</div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Talented and active employees</p>
                </div>
                <div>
                  <div className="text-4xl font-medium text-slate-900 dark:text-white">20+</div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Countries where employees work</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Team celebration"
                  className="w-full h-full object-cover"
                />
                {/* Play button */}
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full text-slate-900 dark:text-white text-sm font-semibold hover:bg-white dark:hover:bg-slate-900 hover:scale-105 transition-all shadow-xl">
                    <Play className="w-4 h-4 fill-current" />
                    Play video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-14 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30 text-slate-600 dark:text-slate-400 text-xs font-medium mb-3">
              <span>Careers at</span>
              <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-semibold">
                Stagi v1.0
                <Sparkles className="w-3 h-3 text-blue-500" />
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 dark:text-white mb-4">
              When only the best talent will do, magic happens
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              We are always looking for passionate, dynamic, and talented individuals to join our distributed team all around the world.
            </p>
          </div>
          
          {/* Department Filters - Centered above cards */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-full">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveFilter(dept)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeFilter === dept
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 dark:border-slate-800 border-t-blue-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship) => (
                  <Link 
                    key={internship.id} 
                    href={`/internships/${internship.id}`}
                    className="group"
                  >
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {internship.title}
                          </h3>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            Posted recently · {internship.isOpen ? 'Accepting applications' : 'Closed'}
                          </p>
                        </div>
                        {internship.location && (
                          <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 text-xs font-medium whitespace-nowrap">
                            {internship.location}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                        {internship.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          Internship
                        </span>
                        {internship.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {internship.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                [
                  { title: "AI Research Intern", location: "Remote, Global", description: "Join our AI research team to work on cutting-edge machine learning models." },
                  { title: "Frontend Developer", location: "On-site, NYC", description: "Build beautiful user interfaces for our AI-powered products." },
                  { title: "ML Engineer Intern", location: "Hybrid, London", description: "Work on production ML systems that serve millions of users." },
                  { title: "Product Design Intern", location: "Remote, Asia", description: "Design intuitive experiences for complex AI applications." },
                  { title: "Backend Developer", location: "On-site, SF", description: "Build scalable infrastructure for our AI platform." },
                  { title: "Data Science Intern", location: "Remote, EU", description: "Analyze data and build models to drive business decisions." },
                ].map((job, i) => (
                  <Link 
                    key={i} 
                    href="/internships/browse"
                    className="group"
                  >
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            Posted recently · Accepting applications
                          </p>
                        </div>
                        <Badge className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 text-xs font-medium whitespace-nowrap">
                          {job.location}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          Internship
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          3-6 months
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Load more */}
          <div className="flex justify-center mt-6">
            <Link href="/internships/browse">
              <Button variant="outline" className="rounded-full px-8 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                Load more
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-slate-900 dark:via-blue-950/50 dark:to-slate-900 overflow-hidden">
        {/* CTA Background Flare */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to start your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI journey</span>?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Join thousands of ambitious students and graduates who are shaping the next generation of intelligent systems.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full px-8 h-12 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all">
                Start Your Application
              </Button>
            </Link>
            <Link href="/internships/browse">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-blue-400/30 text-white hover:bg-blue-500/10 hover:border-blue-400/50 transition-all">
                Browse Internships
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                  S
                </div>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  Stagi
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">
                Building the next generation of AI talent. Join an innovative startup and accelerate your career.
              </p>
              <div className="flex gap-3">
                <a href="#" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href="/internships/browse" className="hover:text-slate-900 dark:hover:text-white transition-colors">Browse Internships</Link></li>
                <li><Link href="/sign-up" className="hover:text-slate-900 dark:hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="#team" className="hover:text-slate-900 dark:hover:text-white transition-colors">Our Team</Link></li>
                <li><Link href="#careers" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-900">
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              © 2025 Stagi Enterprises LTD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

