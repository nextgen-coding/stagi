import { SignOutButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export default function SignOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardContent className="pt-8 pb-8 px-8 text-center space-y-6">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              S
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Stagi
            </span>
          </Link>

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
            <LogOut className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Sign Out
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <SignOutButton redirectUrl="/sign-in">
              <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Yes, Sign Out
              </Button>
            </SignOutButton>
            
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="w-full h-11 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-4">
            © 2025 Stagi Enterprises LTD.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
