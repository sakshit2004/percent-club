import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to landing
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">How It Works</h1>
      <ol className="space-y-4 list-decimal pl-6 text-muted-foreground max-w-2xl">
        <li>Create your first Pod and set a target and date.</li>
        <li>Pick Challenges to automate contributions toward that Pod.</li>
        <li>Let the AI agent find extra savings and opportunities.</li>
        <li>Track progress, share milestones, and adjust as you go.</li>
      </ol>
    </div>
  )
}
