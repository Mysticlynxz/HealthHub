import { analyzeSymptoms } from "@/lib/ai-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { description, duration, severity, accompanying } = await request.json()

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Symptom description is required" }, { status: 400 })
    }

    const analysis = await analyzeSymptoms(description, duration || "", severity || "", accompanying || [])

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Symptom analysis API error:", error)
    return NextResponse.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}
