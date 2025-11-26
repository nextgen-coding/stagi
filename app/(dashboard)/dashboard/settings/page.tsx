import { getCurrentUserWithStats } from "@/app/actions/users"
import { UserSettingsContent } from "./settings-content"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export default async function UserSettingsPage() {
  const result = await getCurrentUserWithStats()
  
  if (!result.success || !result.data) {
    redirect('/sign-in')
  }
  
  return <UserSettingsContent user={result.data} />
}
