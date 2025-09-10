"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, User, Bell, Bot, Shield, Trash2 } from "lucide-react"

interface SettingsData {
  profile: {
    alias: string
    handle: string
    email: string
  }
  privacy: {
    profileVisibility: "public" | "followers" | "private"
    showFeaturedPod: boolean
    showBadges: boolean
  }
  notifications: {
    monthlyReview: boolean
    goalMilestones: boolean
    challengeUpdates: boolean
    socialActivity: boolean
    emailDigest: boolean
  }
  agent: {
    name: string
    riskLevel: "cautious" | "normal" | "aggressive"
    bufferAmount: string
    autoApply: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      alias: "Sarah Chen",
      handle: "savingsstar",
      email: "sarah@example.com",
    },
    privacy: {
      profileVisibility: "public",
      showFeaturedPod: true,
      showBadges: true,
    },
    notifications: {
      monthlyReview: true,
      goalMilestones: true,
      challengeUpdates: false,
      socialActivity: true,
      emailDigest: false,
    },
    agent: {
      name: "Sage",
      riskLevel: "normal",
      bufferAmount: "100",
      autoApply: false,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      })
      setIsLoading(false)
    }, 1000)
  }

  const updateProfile = (field: keyof SettingsData["profile"], value: string) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value },
    })
  }

  const updatePrivacy = (field: keyof SettingsData["privacy"], value: any) => {
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [field]: value },
    })
  }

  const updateNotifications = (field: keyof SettingsData["notifications"], value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    })
  }

  const updateAgent = (field: keyof SettingsData["agent"], value: any) => {
    setSettings({
      ...settings,
      agent: { ...settings.agent, [field]: value },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <Settings className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alias">Display Name</Label>
              <Input
                id="alias"
                value={settings.profile.alias}
                onChange={(e) => updateProfile("alias", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="handle">Username</Label>
              <Input
                id="handle"
                value={settings.profile.handle}
                onChange={(e) => updateProfile("handle", e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="visibility">Profile Visibility</Label>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value: "public" | "followers" | "private") => updatePrivacy("profileVisibility", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="followers">Followers only</SelectItem>
                  <SelectItem value="private">Private - Just me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Featured Pod Progress</Label>
                <p className="text-sm text-muted-foreground">Display your featured pod percentage on profile</p>
              </div>
              <Switch
                checked={settings.privacy.showFeaturedPod}
                onCheckedChange={(checked) => updatePrivacy("showFeaturedPod", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Badges</Label>
                <p className="text-sm text-muted-foreground">Display earned badges on your profile</p>
              </div>
              <Switch
                checked={settings.privacy.showBadges}
                onCheckedChange={(checked) => updatePrivacy("showBadges", checked)}
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Privacy by design:</strong> We never show actual dollar amounts publicly. Only percentages and
                normalized progress are visible to others.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Monthly Subscription Review</Label>
                <p className="text-sm text-muted-foreground">Get notified when your agent finds subscription issues</p>
              </div>
              <Switch
                checked={settings.notifications.monthlyReview}
                onCheckedChange={(checked) => updateNotifications("monthlyReview", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Goal Milestones</Label>
                <p className="text-sm text-muted-foreground">Celebrate when you reach savings milestones</p>
              </div>
              <Switch
                checked={settings.notifications.goalMilestones}
                onCheckedChange={(checked) => updateNotifications("goalMilestones", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Challenge Updates</Label>
                <p className="text-sm text-muted-foreground">Updates about your active challenges</p>
              </div>
              <Switch
                checked={settings.notifications.challengeUpdates}
                onCheckedChange={(checked) => updateNotifications("challengeUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Social Activity</Label>
                <p className="text-sm text-muted-foreground">Likes, follows, and community updates</p>
              </div>
              <Switch
                checked={settings.notifications.socialActivity}
                onCheckedChange={(checked) => updateNotifications("socialActivity", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Email Digest</Label>
                <p className="text-sm text-muted-foreground">Summary of your progress and community highlights</p>
              </div>
              <Switch
                checked={settings.notifications.emailDigest}
                onCheckedChange={(checked) => updateNotifications("emailDigest", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Agent Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Agent ({settings.agent.name})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agentName">Agent Name</Label>
              <Input id="agentName" value={settings.agent.name} onChange={(e) => updateAgent("name", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select
                value={settings.agent.riskLevel}
                onValueChange={(value: "cautious" | "normal" | "aggressive") => updateAgent("riskLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cautious">
                    <div>
                      <div className="font-medium">Cautious</div>
                      <div className="text-xs text-muted-foreground">Conservative suggestions, larger buffer</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="normal">
                    <div>
                      <div className="font-medium">Normal</div>
                      <div className="text-xs text-muted-foreground">Balanced approach to savings</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="aggressive">
                    <div>
                      <div className="font-medium">Aggressive</div>
                      <div className="text-xs text-muted-foreground">Maximize savings, smaller buffer</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="buffer">Safety Buffer</Label>
              <Input
                id="buffer"
                type="number"
                value={settings.agent.bufferAmount}
                onChange={(e) => updateAgent("bufferAmount", e.target.value)}
                placeholder="100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum amount to keep available for unexpected expenses
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Apply Suggestions</Label>
                <p className="text-sm text-muted-foreground">
                  Let your agent automatically apply safe-to-save suggestions
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  Recommended: Off
                </Badge>
              </div>
              <Switch
                checked={settings.agent.autoApply}
                onCheckedChange={(checked) => updateAgent("autoApply", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
