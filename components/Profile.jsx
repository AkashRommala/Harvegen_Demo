'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FiUser, FiMail, FiCalendar, FiAward, FiBook, FiZap, FiCpu, FiCheckCircle, FiClock, FiDownload, FiEdit2, FiTrendingUp, FiTarget, FiStar, FiArrowRight, FiCamera } from 'react-icons/fi'
import { useUser } from '../context/UserContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

function Profile() {
  const { user, updateUser } = useUser()
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const [userStats, setUserStats] = useState({
    name: user?.name || 'Embedded Engineer',
    email: user?.email || 'engineer@example.com',
    joinDate: 'January 2024',
    completedProjects: 12,
    tutorialsCompleted: 8,
    totalLearningTime: '45 hours',
    currentStreak: 7,
    level: 'Intermediate',
    badges: 15,
    avatar: user?.avatar || null
  })

  // Update userStats when user context changes
  useEffect(() => {
    if (user) {
      setUserStats(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }))
    }
  }, [user])

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        updateUser({ avatar: reader.result })
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const [progressData, setProgressData] = useState([
    { category: 'STM32', progress: 75, total: 100, color: 'from-blue-400 to-blue-600', icon: FiCpu },
    { category: 'Arduino', progress: 90, total: 100, color: 'from-green-400 to-green-600', icon: FiZap },
    { category: 'FreeRTOS', progress: 45, total: 100, color: 'from-purple-400 to-purple-600', icon: FiTrendingUp },
    { category: 'IoT', progress: 60, total: 100, color: 'from-emerald-400 to-emerald-600', icon: FiTarget }
  ])

  const [recentActivity, setRecentActivity] = useState([
    { action: 'Completed', item: 'GPIO: Input, Output & EXTI Interrupts', time: '2 hours ago', type: 'tutorial' },
    { action: 'Started', item: 'Smart Irrigation System', time: '1 day ago', type: 'project' },
    { action: 'Downloaded', item: 'STM32 Schematics Pack', time: '3 days ago', type: 'resource' },
    { action: 'Completed', item: 'UART: From Config to Circular Buffers', time: '1 week ago', type: 'tutorial' }
  ])

  const [achievements, setAchievements] = useState([
    { title: 'First Steps', desc: 'Complete your first tutorial', earned: true, icon: FiBook, color: 'from-green-400 to-green-600' },
    { title: 'Project Builder', desc: 'Complete 5 projects', earned: true, icon: FiZap, color: 'from-blue-400 to-blue-600' },
    { title: 'MCU Master', desc: 'Learn 3 different microcontrollers', earned: false, icon: FiCpu, color: 'from-gray-400 to-gray-600' },
    { title: 'Week Streak', desc: 'Learn for 7 consecutive days', earned: true, icon: FiCalendar, color: 'from-orange-400 to-orange-600' },
    { title: 'Resource Collector', desc: 'Download 10 resources', earned: false, icon: FiDownload, color: 'from-gray-400 to-gray-600' }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-20 md:pb-10 pt-16">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Avatar with edit button */}
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 overflow-hidden">
                {userStats.avatar ? (
                  <img src={userStats.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FiUser className="w-14 h-14 md:w-16 md:h-16 text-white" />
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-lg hover:scale-110 transition-transform"
              >
                <FiCamera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            
            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{userStats.name}</h1>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <FiStar className="w-3 h-3 mr-1" />
                  {userStats.level}
                </Badge>
              </div>
              <p className="text-white/80 text-base md:text-lg mb-4">{userStats.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  {userStats.joinDate}
                </span>
                <span className="flex items-center gap-2">
                  <FiAward className="w-4 h-4" />
                  {userStats.badges} badges
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Projects', value: userStats.completedProjects, icon: FiZap, gradient: 'from-emerald-400 to-emerald-600' },
            { label: 'Tutorials', value: userStats.tutorialsCompleted, icon: FiBook, gradient: 'from-blue-400 to-blue-600' },
            { label: 'Hours', value: userStats.totalLearningTime, icon: FiClock, gradient: 'from-purple-400 to-purple-600' },
            { label: 'Streak', value: `${userStats.currentStreak} days`, icon: FiCheckCircle, gradient: 'from-orange-400 to-orange-600' }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Progress & Activity */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Learning Progress */}
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <FiTrendingUp className="text-primary-600" />
                      Learning Progress
                    </CardTitle>
                    <CardDescription>Track your progress across different embedded systems topics</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {progressData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{item.category}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiClock className="text-primary-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest learning milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'tutorial' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'project' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'tutorial' ? <FiBook className="w-5 h-5" /> :
                         activity.type === 'project' ? <FiZap className="w-5 h-5" /> :
                         <FiDownload className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">{activity.action} {activity.item}</p>
                        <p className="text-xs md:text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    {activity.type === 'tutorial' && (
                      <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Achievements */}
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiAward className="text-primary-600" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock milestones as you learn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:scale-[1.02] cursor-pointer ${
                    achievement.earned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                  }`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      achievement.earned 
                        ? `bg-gradient-to-br ${achievement.color} text-white` 
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{achievement.desc}</p>
                    </div>
                    {achievement.earned && (
                      <Badge className="bg-green-500 text-white text-xs flex-shrink-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-none shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FiTarget className="text-primary-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tutorials">
                  <Button variant="default" className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl h-12">
                    <FiBook className="w-5 h-5 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white h-12">
                    <FiZap className="w-5 h-5 mr-2" />
                    View Projects
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-12">
                    <FiDownload className="w-5 h-5 mr-2" />
                    Download Resources
                    <FiArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile