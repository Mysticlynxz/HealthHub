"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Apple, Stethoscope, Shield } from "lucide-react"

interface HomeModuleProps {
  onModuleChange: (module: string) => void
}

export function HomeModule({ onModuleChange }: HomeModuleProps) {
  const features = [
    {
      id: "mental-health",
      title: "Mental Health Check-in",
      description: "Supportive mood tracking and reflective resources for your wellbeing",
      icon: Heart,
      color: "text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      id: "diet-planner",
      title: "Diet & Lifestyle Planner",
      description: "Personalized nutrition plans tailored to your health conditions",
      icon: Apple,
      color: "text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      id: "symptom-explainer",
      title: "Symptom Guidance",
      description: "Safe, general guidance for understanding health symptoms",
      icon: Stethoscope,
      color: "text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
  ]

  const stats = [
    { label: "Trusted by", value: "10K+", subtext: "users worldwide" },
    { label: "Available", value: "24/7", subtext: "support resources" },
    { label: "Privacy", value: "100%", subtext: "secure & confidential" },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-balance">Your Trusted Health & Wellness Companion</h1>
        <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
          Comprehensive tools for mental health check-ins, personalized nutrition planning, and safe symptom guidance -
          all in one secure platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card
              key={feature.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => onModuleChange(feature.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Safety Notice */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <Shield className="h-5 w-5" />
            Safety & Privacy First
          </CardTitle>
        </CardHeader>
        <CardContent className="text-amber-700 dark:text-amber-300">
          <ul className="space-y-2 text-sm">
            <li>• All information is kept strictly confidential and secure</li>
            <li>• Our guidance is for educational purposes only - not medical advice</li>
            <li>• Always consult healthcare professionals for medical concerns</li>
            <li>• Emergency services: Call 911 or your local emergency number</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
