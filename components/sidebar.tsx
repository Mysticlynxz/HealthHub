"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Heart, Apple, Stethoscope, Menu, X, Shield, Home } from "lucide-react"

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const modules = [
    {
      id: "home",
      name: "Home",
      icon: Home,
      description: "Welcome & Overview",
    },
    {
      id: "mental-health",
      name: "Mental Health",
      icon: Heart,
      description: "Check-in & Resources",
    },
    {
      id: "diet-planner",
      name: "Diet Planner",
      icon: Apple,
      description: "Personalized Plans",
    },
    {
      id: "symptom-explainer",
      name: "Symptom Guide",
      icon: Stethoscope,
      description: "Safe Guidance",
    },
  ]

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-sidebar-primary" />
            <h1 className="text-lg font-semibold text-sidebar-foreground">HealthHub</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id

          return (
            <Button
              key={module.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-auto p-3",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center",
              )}
              onClick={() => onModuleChange(module.id)}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{module.name}</div>
                  <div className="text-xs opacity-70">{module.description}</div>
                </div>
              )}
            </Button>
          )
        })}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 bg-sidebar-accent border-sidebar-border">
            <div className="text-xs text-sidebar-accent-foreground">
              <p className="font-medium mb-1">Important Notice</p>
              <p className="opacity-80">
                This platform provides general guidance only and is not a substitute for professional medical advice.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
