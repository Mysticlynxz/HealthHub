import { generatePersonalizedDietPlan } from "@/lib/ai-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { age, weight, height, activityLevel, conditions, allergies, preferences, goals } = await request.json()

    if (!age || !weight || !height) {
      return NextResponse.json({ error: "Age, weight, and height are required" }, { status: 400 })
    }

    const dietPlan = await generatePersonalizedDietPlan(
      Number.parseInt(age),
      Number.parseInt(weight),
      Number.parseInt(height),
      activityLevel || "moderate",
      conditions || [],
      allergies || [],
      preferences || [],
      goals || [],
    )

    return NextResponse.json(dietPlan)
  } catch (error) {
    console.error("Diet plan API error:", error)
    return NextResponse.json({ error: "Failed to generate diet plan" }, { status: 500 })
  }
}
