"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Trophy,
  Star,
  Zap,
  Heart,
  Flame,
  Settings,
  Shield,
  Bell,
  Globe,
  Edit3,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { useSessionWallet } from "@/app/StellarWalletProvider"
import SlimSelect from 'slim-select'
import 'slim-select/styles'

export default function ProfilePage() {
  const { socialMetadata } = useSessionWallet();
  const [isEditing, setIsEditing] = useState(false)

  // Use real data if available, otherwise fallback
  const [name, setName] = useState(socialMetadata?.name || "Stellar Explorer")
  const [email, setEmail] = useState(socialMetadata?.email || "explorer@stellar.org")
  const [bio, setBio] = useState("Passionate about Web3 and blockchain technology. Learning every day!")

  // Update state when socialMetadata loads
  useEffect(() => {
    if (socialMetadata?.name) setName(socialMetadata.name);
    if (socialMetadata?.email) setEmail(socialMetadata.email);
  }, [socialMetadata]);

  // SlimSelect integration
  const languageSelectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (languageSelectRef.current) {
      new SlimSelect({
        select: languageSelectRef.current,
        settings: {
          showSearch: false,
        }
      })
    }
  }, []);

  const userStats = {
    level: 3,
    xp: 1250,
    nextLevelXp: 1500,
    streak: 7,
    hearts: 5,
    totalLessons: 24,
    completedLessons: 18,
    achievements: 8,
    rank: 42,
  }

  const recentAchievements = [
    { name: "First Steps", description: "Complete your first lesson", earned: true, icon: "🎯", date: "2 days ago" },
    { name: "Week Warrior", description: "Maintain a 7-day streak", earned: true, icon: "🔥", date: "Today" },
    { name: "Security Expert", description: "Master wallet security", earned: true, icon: "🛡️", date: "1 week ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#EECB01]/10">
      {/* Header */}
      <header className="bg-white border-b border-[#EECB01]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-[#8E7CE5]">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Dashboard</span>
                </Button>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[#333333] font-sans">Profile</h1>
                <p className="text-sm text-gray-600">Manage your account and view progress</p>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-[#8E7CE5] text-[#8E7CE5] bg-transparent"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-[#EECB01]/20 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#EECB01] to-[#8E7CE5] rounded-full flex items-center justify-center overflow-hidden">
                    {socialMetadata?.avatar ? (
                      <img src={socialMetadata.avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#8E7CE5] hover:bg-[#8E7CE5]/90"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {isEditing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-center font-bold text-xl"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-[#333333]">{name}</h2>
                  )}
                  <Badge className="bg-[#8E7CE5] text-white">Level {userStats.level} • Stellar Novice</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#333333] font-medium">Email</Label>
                  {isEditing ? (
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#333333] font-medium">Bio</Label>
                  {isEditing ? (
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2 border rounded-md resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">{bio}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined December 2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-2 border-[#8E7CE5]/20 mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-[#333333] flex items-center">
                  <Zap className="w-5 h-5 text-[#EECB01] mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Hearts</span>
                  </div>
                  <span className="font-semibold">{userStats.hearts}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Streak</span>
                  </div>
                  <span className="font-semibold">{userStats.streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-[#8E7CE5]" />
                    <span className="text-sm">Rank</span>
                  </div>
                  <span className="font-semibold">#{userStats.rank}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card className="border-2 border-[#EECB01]/20">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Star className="w-6 h-6 text-[#EECB01] mr-2" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-[#333333]">Level {userStats.level}</div>
                      <div className="text-sm text-gray-600">Stellar Novice</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#8E7CE5]">{userStats.xp} XP</div>
                      <div className="text-sm text-gray-500">
                        {userStats.nextLevelXp - userStats.xp} XP to next level
                      </div>
                    </div>
                  </div>
                  <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="border-2 border-[#8E7CE5]/20">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Trophy className="w-6 h-6 text-[#8E7CE5] mr-2" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#333333] mb-1">{userStats.completedLessons}</div>
                    <div className="text-sm text-gray-600">Lessons Completed</div>
                    <div className="text-xs text-gray-500">of {userStats.totalLessons} total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#333333] mb-1">{userStats.achievements}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                    <div className="text-xs text-gray-500">badges earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#333333] mb-1">
                      {Math.round((userStats.completedLessons / userStats.totalLessons) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                    <div className="text-xs text-gray-500">overall progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-2 border-green-400/20">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Trophy className="w-6 h-6 text-green-600 mr-2" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-green-700">{achievement.name}</div>
                        <div className="text-sm text-green-600">{achievement.description}</div>
                      </div>
                      <div className="text-xs text-gray-500">{achievement.date}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 text-green-600 border-green-600 bg-transparent">
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-[#333333] flex items-center">
                  <Settings className="w-6 h-6 text-gray-600 mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-[#333333]">Notifications</div>
                        <div className="text-sm text-gray-600">Manage your notification preferences</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-[#333333]">Privacy & Security</div>
                        <div className="text-sm text-gray-600">Manage your privacy settings</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-[#333333]">Language & Region</div>
                        <div className="text-sm text-gray-600">
                          <select ref={languageSelectRef} className="w-full">
                            <option value="en">English (US)</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
