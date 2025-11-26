import Link from "next/link"
import { Briefcase, GraduationCap, Users, CheckCircle, Star, TrendingUp } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex flex-row flex-wrap bg-white dark:bg-slate-950 overflow-hidden">
      {/* Left Side - Auth Form */}
      <div className="flex flex-col h-full w-full flex-[1_1_440px] lg:flex-[1.15]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              S
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Stagi
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-14 xl:px-20 pb-6">
          <div className="max-w-[420px] w-full mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 lg:p-8 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span>© 2025 Stagi Enterprises LTD.</span>
          <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Right Side - Marketing Panel */}
      <div className="flex flex-col h-full w-full flex-[1_1_360px] lg:flex-[0.85] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-4 right-0 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-purple-500/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[320px] h-[320px] bg-blue-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center p-5 lg:p-6 xl:p-8">
          <div className="max-w-sm xl:max-w-md">
            {/* Main Heading */}
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 lg:mb-3 leading-tight">
              Launch your internship career with confidence.
            </h2>
            <p className="text-blue-100 text-sm lg:text-base mb-4 lg:mb-5 leading-relaxed">
              Track applications, prep for interviews, and turn recruiter replies into signed offers.
            </p>

            {/* Dashboard Preview Cards */}
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-2.5 lg:p-3 xl:p-4 transform -rotate-1 hover:rotate-0 transition-all duration-500">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-2 lg:mb-3">
                  <div className="bg-white/10 rounded-lg p-2 lg:p-2.5 xl:p-3">
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                      <span className="text-[9px] lg:text-[10px] text-blue-200">Applied</span>
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl font-bold text-white">32</p>
                    <div className="mt-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 lg:p-2.5 xl:p-3">
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                      <span className="text-[9px] lg:text-[10px] text-blue-200">Interviews</span>
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl font-bold text-white">68%</p>
                    <div className="mt-1 flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-0.5 bg-purple-400/50 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 lg:p-2.5 xl:p-3">
                    <div className="flex items-center gap-1 mb-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                      <span className="text-[9px] lg:text-[10px] text-blue-200">Offers</span>
                    </div>
                    <p className="text-base lg:text-lg xl:text-xl font-bold text-white">6</p>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border-[3px] border-green-400 border-t-purple-400 border-r-blue-400" />
                      <span className="text-[10px] text-green-300">+18%</span>
                    </div>
                  </div>
                </div>

                {/* Applications Table Preview */}
                <div className="bg-white/5 rounded-lg p-2 lg:p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[10px] lg:text-xs font-semibold text-white">Recent Wins</h4>
                    <span className="text-[9px] lg:text-[10px] text-blue-200">View all</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { company: 'Stellar Labs', role: 'Product Intern', status: 'Interview', color: 'blue' },
                      { company: 'NeoBank', role: 'Data Intern', status: 'Offer Signed', color: 'green' },
                    ].map((app, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-white/10 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                            <Briefcase className="w-3 h-3 text-blue-200" />
                          </div>
                          <div>
                            <p className="text-[10px] lg:text-xs font-medium text-white">{app.company}</p>
                            <p className="text-[9px] lg:text-[10px] text-blue-200">{app.role}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] lg:text-[10px] px-1.5 py-0.5 rounded-full ${
                          app.color === 'green' ? 'bg-green-400/20 text-green-300' :
                          app.color === 'blue' ? 'bg-blue-400/20 text-blue-300' :
                          'bg-yellow-400/20 text-yellow-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 bg-white rounded-lg shadow-lg p-1.5 lg:p-2 transform rotate-6 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[9px] lg:text-[10px] text-slate-500">Offer Rate</p>
                    <p className="text-xs lg:text-sm font-bold text-slate-900">54%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 bg-white rounded-lg shadow-lg p-1.5 lg:p-2 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[9px] lg:text-[10px] text-slate-500">Interns</p>
                    <p className="text-xs lg:text-sm font-bold text-slate-900">2.8k</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-4 lg:mt-6 flex items-center gap-3 lg:gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-[1.5px] border-blue-700 flex items-center justify-center text-[8px] lg:text-[9px] text-white font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] lg:text-xs text-blue-100">2k+ students</span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-2.5 h-2.5 lg:w-3 lg:h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-[10px] lg:text-xs text-blue-100 ml-0.5">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
