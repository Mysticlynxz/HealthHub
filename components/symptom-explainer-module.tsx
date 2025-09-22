"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Stethoscope,
  Search,
  Droplets,
  UserCheck,
  Building2,
  Phone,
  AlertTriangle,
  ExternalLink,
  Clock,
  Activity,
} from "lucide-react"

interface SymptomInput {
  description: string
  duration: string
  severity: string
  accompanying: string[]
}

interface ActionCard {
  id: string
  type: "self-care" | "gp" | "urgent" | "emergency"
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  timeframe: string
  priority: "low" | "medium" | "high" | "critical"
}

interface ResourceLink {
  title: string
  organization: string
  url: string
  description: string
}

export function SymptomExplainerModule() {
  const [activeTab, setActiveTab] = useState("input")
  const [symptomInput, setSymptomInput] = useState<SymptomInput>({
    description: "",
    duration: "",
    severity: "",
    accompanying: [],
  })
  const [actionCards, setActionCards] = useState<ActionCard[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  const durations = [
    "Less than 1 hour",
    "1-6 hours",
    "6-24 hours",
    "1-3 days",
    "3-7 days",
    "1-4 weeks",
    "More than 1 month",
  ]

  const severities = [
    "Mild (doesn't interfere with daily activities)",
    "Moderate (some interference with activities)",
    "Severe (significant interference with activities)",
    "Very severe (unable to perform normal activities)",
  ]

  const commonSymptoms = [
    "Fever",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Headache",
    "Dizziness",
    "Fatigue",
    "Shortness of breath",
    "Chest pain",
    "Abdominal pain",
    "Joint pain",
    "Skin rash",
  ]

  const resources: ResourceLink[] = [
    {
      title: "NHS Health Information",
      organization: "National Health Service",
      url: "https://www.nhs.uk",
      description: "Comprehensive health information and symptom checker",
    },
    {
      title: "WHO Health Topics",
      organization: "World Health Organization",
      url: "https://www.who.int",
      description: "Global health information and guidelines",
    },
    {
      title: "CDC Health Information",
      organization: "Centers for Disease Control",
      url: "https://www.cdc.gov",
      description: "Disease prevention and health promotion resources",
    },
    {
      title: "Crisis Text Line",
      organization: "Crisis Support",
      url: "https://www.crisistextline.org",
      description: "24/7 crisis support via text message",
    },
  ]

  const analyzeSymptoms = () => {
    if (!symptomInput.description.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const generatedActions = generateActionCards(symptomInput)
      setActionCards(generatedActions)
      setHasResults(true)
      setIsAnalyzing(false)
      setActiveTab("results")
    }, 2000)
  }

  const generateActionCards = (input: SymptomInput): ActionCard[] => {
    const cards: ActionCard[] = []

    // Always include hydration for most symptoms
    if (input.description.toLowerCase().includes("dizzy") || input.description.toLowerCase().includes("headache")) {
      cards.push({
        id: "hydration",
        type: "self-care",
        icon: Droplets,
        title: "Try hydration first",
        description: "Drink water slowly. Dehydration can cause dizziness and headaches.",
        timeframe: "Next 30 minutes",
        priority: "low",
      })
    }

    // GP recommendation for persistent symptoms
    if (input.duration === "1-4 weeks" || input.duration === "More than 1 month") {
      cards.push({
        id: "gp",
        type: "gp",
        icon: UserCheck,
        title: "Book a GP appointment",
        description: "Persistent symptoms should be evaluated by a healthcare professional.",
        timeframe: "Within 1-2 weeks",
        priority: "medium",
      })
    }

    // Emergency indicators
    if (
      input.description.toLowerCase().includes("chest pain") ||
      input.description.toLowerCase().includes("shortness of breath") ||
      input.severity === "Very severe (unable to perform normal activities)"
    ) {
      cards.push({
        id: "emergency",
        type: "emergency",
        icon: Building2,
        title: "Go to ER immediately",
        description: "These symptoms may indicate a serious condition requiring immediate medical attention.",
        timeframe: "Right now",
        priority: "critical",
      })
    }

    // Default GP recommendation if no specific actions
    if (cards.length === 0) {
      cards.push({
        id: "general-gp",
        type: "gp",
        icon: UserCheck,
        title: "Consider seeing a GP",
        description: "A healthcare professional can properly assess your symptoms and provide appropriate guidance.",
        timeframe: "Within a few days",
        priority: "medium",
      })
    }

    // Always add rest recommendation for moderate to severe symptoms
    if (input.severity.includes("Moderate") || input.severity.includes("Severe")) {
      cards.push({
        id: "rest",
        type: "self-care",
        icon: Activity,
        title: "Get adequate rest",
        description: "Allow your body time to recover. Avoid strenuous activities.",
        timeframe: "Ongoing",
        priority: "low",
      })
    }

    return cards
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 dark:bg-red-950/20 border-red-200 dark:border-red-800"
      case "high":
        return "bg-orange-100 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-green-100 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "self-care":
        return "💧"
      case "gp":
        return "👩‍⚕️"
      case "urgent":
        return "⏰"
      case "emergency":
        return "🏥"
      default:
        return "ℹ️"
    }
  }

  const handleAccompanyingSymptom = (symptom: string, checked: boolean) => {
    setSymptomInput((prev) => ({
      ...prev,
      accompanying: checked ? [...prev.accompanying, symptom] : prev.accompanying.filter((s) => s !== symptom),
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20 rounded-2xl -z-10"></div>
        <div className="relative py-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 shadow-lg">
              <Stethoscope className="h-10 w-10 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Symptom Guidance
          </h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto leading-relaxed">
            Get general guidance for your symptoms. Remember, this is not medical advice - always consult healthcare
            professionals for proper diagnosis.
          </p>
        </div>
      </div>

      {/* Safety Alert */}
      <Alert className="border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50/80 to-red-100/60 dark:from-red-950/40 dark:to-red-950/30 shadow-lg">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>Emergency Warning:</strong> If you're experiencing severe chest pain, difficulty breathing, loss of
          consciousness, severe bleeding, or signs of stroke, call emergency services (911) immediately.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl">
          <TabsTrigger
            value="input"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Describe Symptoms</span>
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Guidance</span>
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Tell us about your symptoms
              </CardTitle>
              <CardDescription>
                Describe what you're experiencing. Be as specific as possible about your symptoms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Symptom Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe your symptom</label>
                <Textarea
                  placeholder="Example: I feel dizzy when I stand up, and it's been happening for the past few days..."
                  value={symptomInput.description}
                  onChange={(e) => setSymptomInput((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-24 bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-blue-300 transition-all duration-300"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">How long have you had this symptom?</label>
                <Select
                  value={symptomInput.duration}
                  onValueChange={(value) => setSymptomInput((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-blue-300 transition-all duration-300">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">How severe is the symptom?</label>
                <Select
                  value={symptomInput.severity}
                  onValueChange={(value) => setSymptomInput((prev) => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-blue-300 transition-all duration-300">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severities.map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        {severity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Accompanying Symptoms */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Any accompanying symptoms? (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={symptom}
                        checked={symptomInput.accompanying.includes(symptom)}
                        onChange={(e) => handleAccompanyingSymptom(symptom, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={analyzeSymptoms}
                disabled={isAnalyzing || !symptomInput.description.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Search className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing symptoms...
                  </>
                ) : (
                  "Get Guidance"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {!hasResults ? (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Describe your symptoms first to get personalized guidance.</p>
                <Button
                  onClick={() => setActiveTab("input")}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-[1.02]"
                >
                  Describe Symptoms
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-teal-950/30 p-8 rounded-xl border shadow-lg">
                <h2 className="text-3xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  📋 Recommended Actions
                </h2>
                <p className="text-center text-muted-foreground text-lg leading-relaxed">
                  Based on your symptoms, here are some general guidance steps. This is not medical advice.
                </p>
                <div className="mt-6 text-center">
                  <Badge variant="outline" className="bg-white/70 dark:bg-black/30 text-lg px-4 py-2 shadow-md">
                    {actionCards.length} recommendation{actionCards.length !== 1 ? "s" : ""} found
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <Activity className="h-6 w-6 text-blue-500" />
                  Your Action Plan
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  {actionCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                      <Card
                        key={card.id}
                        className={`${getPriorityColor(card.priority)} border-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden min-h-[200px]`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />

                        <CardHeader className="pb-4 relative">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold text-2xl shadow-xl">
                                {index + 1}
                              </div>
                              <div className="p-4 rounded-full bg-white/90 dark:bg-black/50 shadow-lg">
                                <Icon className="h-8 w-8 text-gray-700 dark:text-gray-200" />
                              </div>
                              <div>
                                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-gray-900 dark:text-gray-100">
                                  <span className="text-3xl">{getTypeIcon(card.type)}</span>
                                  {card.title}
                                </CardTitle>
                                <div className="flex items-center gap-4 mt-3">
                                  <Badge
                                    variant={
                                      card.priority === "critical"
                                        ? "destructive"
                                        : card.priority === "high"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-base font-bold px-4 py-2 shadow-md"
                                  >
                                    {card.priority.toUpperCase()} PRIORITY
                                  </Badge>
                                  <span className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 bg-white/80 dark:bg-black/40 px-4 py-2 rounded-full shadow-md">
                                    <Clock className="h-5 w-5" />
                                    {card.timeframe}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="relative">
                          <p className="text-gray-900 dark:text-gray-100 font-bold text-xl leading-relaxed mb-6 bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl border-2 border-white/80 dark:border-gray-700/80 shadow-lg">
                            {card.description}
                          </p>
                          {card.type === "emergency" && (
                            <Button
                              variant="destructive"
                              size="lg"
                              className="w-full mt-4 text-xl font-bold py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              <Phone className="h-6 w-6 mr-3" />
                              Call Emergency Services - 911
                            </Button>
                          )}
                          {card.type === "gp" && (
                            <Button
                              variant="outline"
                              size="lg"
                              className="w-full mt-4 bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 border-3 border-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xl font-bold py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              <UserCheck className="h-6 w-6 mr-3" />
                              Contact Healthcare Provider
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Safety Reminder */}
              <Alert className="shadow-lg bg-gradient-to-r from-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This guidance is for general information only. If your symptoms worsen,
                  persist, or you're concerned, please contact a healthcare professional or emergency services.
                </AlertDescription>
              </Alert>
            </>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-t-lg">
              <CardTitle>Trusted Health Resources</CardTitle>
              <CardDescription>
                Reliable sources for health information and professional medical guidance
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                        {resource.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="mt-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30"
                      >
                        {resource.organization}
                      </Badge>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{resource.description}</p>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-background/80 to-background/60 hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/20 dark:hover:to-cyan-950/20 border-2 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Emergency Contacts */}
          <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/40 dark:to-red-900/30 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-t-lg">
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Emergency Services", number: "911", description: "Life-threatening emergencies" },
                  { title: "Poison Control", number: "1-800-222-1222", description: "Poisoning emergencies" },
                  { title: "Crisis Support", number: "988", description: "Mental health crisis" },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="text-center p-4 border border-red-200 dark:border-red-800 rounded-xl bg-gradient-to-r from-red-50/50 to-red-100/30 dark:from-red-900/30 dark:to-red-900/20 hover:shadow-md transition-all duration-300"
                  >
                    <div className="font-semibold text-red-800 dark:text-red-200">{contact.title}</div>
                    <div className={`${contact.number === "911" ? "text-3xl" : "text-xl"} font-bold text-red-600 my-2`}>
                      {contact.number}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">{contact.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Main Disclaimer */}
      <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-2 text-xs text-amber-700 dark:text-amber-300">
            <p>
              <strong>Medical Disclaimer:</strong> This symptom guidance tool provides general information only and is
              not intended as medical advice, diagnosis, or treatment. It should not replace professional medical
              consultation.
            </p>
            <p>
              <strong>Always seek professional medical advice if:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You have serious or persistent symptoms</li>
              <li>Your condition is worsening</li>
              <li>You have any doubts about your health</li>
              <li>You need a proper medical diagnosis</li>
            </ul>
            <p>
              <strong>In case of emergency:</strong> Call 911 or go to your nearest emergency room immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
