"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HomeModule } from "@/components/home-module"
import { MentalHealthModule } from "@/components/mental-health-module"
import { DietPlannerModule } from "@/components/diet-planner-module"
import { SymptomExplainerModule } from "@/components/symptom-explainer-module"

export default function HealthPortal() {
  const [activeModule, setActiveModule] = useState("home")

  const renderModule = () => {
    switch (activeModule) {
      case "home":
        return <HomeModule onModuleChange={setActiveModule} />
      case "mental-health":
        return <MentalHealthModule />
      case "diet-planner":
        return <DietPlannerModule />
      case "symptom-explainer":
        return <SymptomExplainerModule />
      default:
        return <HomeModule onModuleChange={setActiveModule} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">{renderModule()}</div>
      </main>
    </div>
  )
}
