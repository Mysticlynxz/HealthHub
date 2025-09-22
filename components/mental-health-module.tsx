"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  MessageCircle,
  BookOpen,
  Calendar,
  Send,
  Phone,
  ExternalLink,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Wind,
  Brain,
  Users,
  AlertTriangle,
} from "lucide-react"
import { generateMentalHealthResponse, type MentalHealthResponse } from "@/lib/ai-service"

interface MoodEntry {
  id: string
  date: string
  mood: "happy" | "neutral" | "sad"
  notes: string
  score: number
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: string
}

export function MentalHealthModule() {
  const [activeTab, setActiveTab] = useState("check-in")
  const [currentMood, setCurrentMood] = useState<"happy" | "neutral" | "sad" | null>(null)
  const [moodNotes, setMoodNotes] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi there, I'm Maya 💙 I'm here to listen and support you today. How are you feeling right now? There's no pressure to share more than you're comfortable with.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const [lastUserEmotion, setLastUserEmotion] = useState<string | null>(null)
  const [conversationDepth, setConversationDepth] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setConversationHistory((prev) => [...prev, newMessage])
    setConversationDepth((prev) => prev + 1)

    const currentMessage = newMessage
    setNewMessage("")
    setIsTyping(true)

    const typingDelay = Math.min(1000 + currentMessage.length * 30, 3000)

    try {
      const aiResponse: MentalHealthResponse = await generateMentalHealthResponse(currentMessage, conversationHistory)

      setTimeout(async () => {
        if (aiResponse.escalationNeeded) {
          setShowCrisisAlert(true)
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: aiResponse.response,
          timestamp: new Date().toISOString(),
        }

        setChatMessages((prev) => [...prev, aiMessage])

        if (aiResponse.resources) {
          setTimeout(() => {
            const resourceMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: "ai",
              content: `I want to make sure you have immediate support available:\n\n${aiResponse.resources.join("\n\n")}`,
              timestamp: new Date().toISOString(),
            }
            setChatMessages((prev) => [...prev, resourceMessage])
          }, 1500)
        }

        setIsTyping(false)
      }, typingDelay)
    } catch (error) {
      console.error("Error generating AI response:", error)
      setTimeout(() => {
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "I'm having a bit of trouble with my connection right now, but I want you to know I'm still here with you. Your feelings are valid, and I care about what you're going through. Can you tell me a little more about what's on your mind?",
          timestamp: new Date().toISOString(),
        }
        setChatMessages((prev) => [...prev, fallbackMessage])
        setIsTyping(false)
      }, typingDelay)
    }
  }

  const getMoodIcon = (mood: "happy" | "neutral" | "sad") => {
    switch (mood) {
      case "happy":
        return <Smile className="h-5 w-5 text-green-500" />
      case "neutral":
        return <Meh className="h-5 w-5 text-yellow-500" />
      case "sad":
        return <Frown className="h-5 w-5 text-red-500" />
    }
  }

  const saveMoodEntry = () => {
    if (!currentMood) return

    // In a real app, this would save to a database
    console.log("Saving mood entry:", { mood: currentMood, notes: moodNotes })

    // Add a supportive message to chat when mood is saved
    const moodMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "ai",
      content: `Thank you for sharing how you're feeling today. It takes courage to check in with yourself like this. ${
        currentMood === "sad"
          ? "I want you to know that difficult feelings are temporary, and you don't have to go through this alone."
          : currentMood === "neutral"
            ? "It's completely okay to feel 'just okay' sometimes. You're taking good care of yourself by staying aware of your emotions."
            : "I'm so glad you're having a good day! It's wonderful when you can recognize and celebrate these positive moments."
      } How are you taking care of yourself today?`,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, moodMessage])
    setCurrentMood(null)
    setMoodNotes("")
  }

  const moodHistory: MoodEntry[] = [
    { id: "1", date: "2024-01-15", mood: "happy", notes: "Great day at work", score: 8 },
    { id: "2", date: "2024-01-14", mood: "neutral", notes: "Feeling okay", score: 6 },
    { id: "3", date: "2024-01-13", mood: "sad", notes: "Stressful day", score: 4 },
    { id: "4", date: "2024-01-12", mood: "happy", notes: "Spent time with friends", score: 9 },
    { id: "5", date: "2024-01-11", mood: "neutral", notes: "Regular day", score: 7 },
  ]

  const resources = [
    {
      title: "Breathing Exercise",
      description: "5-minute guided breathing to reduce anxiety",
      icon: Wind,
      duration: "5 min",
      category: "Relaxation",
    },
    {
      title: "Mindfulness Meditation",
      description: "Simple meditation for present moment awareness",
      icon: Brain,
      duration: "10 min",
      category: "Mindfulness",
    },
    {
      title: "Gratitude Journal",
      description: "Daily practice to focus on positive aspects",
      icon: Heart,
      duration: "3 min",
      category: "Reflection",
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Technique to release physical tension",
      icon: Users,
      duration: "15 min",
      category: "Relaxation",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-purple-950/20 rounded-2xl -z-10"></div>
        <div className="relative py-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 shadow-lg">
              <Heart className="h-10 w-10 text-red-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Mental Health Check-in
          </h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto leading-relaxed">
            Take a moment for yourself. Track your mood, access resources, and have a supportive conversation with Maya.
          </p>
        </div>
      </div>

      {showCrisisAlert && (
        <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>I'm concerned about you right now.</strong> Your safety matters, and there are people who want to
            help.
            <div className="mt-2 space-x-2">
              <Button size="sm" variant="destructive">
                Call 988 Now
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCrisisAlert(false)}>
                I'm Safe
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl">
          <TabsTrigger
            value="check-in"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Check-in</span>
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">My Logs</span>
          </TabsTrigger>
          <TabsTrigger
            value="crisis"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Crisis Help</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="check-in" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-red-500" />
                Talk with Maya
              </CardTitle>
              <CardDescription>
                Have a supportive, empathetic conversation about whatever's on your mind
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-80 overflow-y-auto space-y-4 p-4 border rounded-xl bg-gradient-to-b from-muted/10 to-muted/30 backdrop-blur-sm">
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-500`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div
                        className={`max-w-sm px-4 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-br-md shadow-lg"
                            : "bg-gradient-to-r from-card to-card/80 border text-card-foreground rounded-bl-md shadow-lg backdrop-blur-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-gradient-to-r from-card to-card/80 border text-card-foreground px-4 py-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">Maya is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-3">
                  <Input
                    placeholder="Share what's on your mind... Maya is here to listen 💙"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={isTyping}
                    className="text-sm bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-red-300 transition-all duration-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={isTyping || !newMessage.trim()}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground text-center bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-2">
                  Maya responds with empathy and care. This is a safe space for your thoughts and feelings.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-t-lg">
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Select your current mood - Maya will respond with understanding and support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex justify-center gap-6">
                {[
                  {
                    mood: "happy" as const,
                    icon: Smile,
                    label: "Good",
                    color: "text-green-500",
                    bgColor: "bg-green-50 dark:bg-green-950/20",
                    hoverColor: "hover:bg-green-100 dark:hover:bg-green-950/30",
                  },
                  {
                    mood: "neutral" as const,
                    icon: Meh,
                    label: "Okay",
                    color: "text-yellow-500",
                    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
                    hoverColor: "hover:bg-yellow-100 dark:hover:bg-yellow-950/30",
                  },
                  {
                    mood: "sad" as const,
                    icon: Frown,
                    label: "Difficult",
                    color: "text-red-500",
                    bgColor: "bg-red-50 dark:bg-red-950/20",
                    hoverColor: "hover:bg-red-100 dark:hover:bg-red-950/30",
                  },
                ].map(({ mood, icon: Icon, label, color, bgColor, hoverColor }) => (
                  <Button
                    key={mood}
                    variant={currentMood === mood ? "default" : "outline"}
                    className={`flex flex-col items-center gap-3 h-24 w-24 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                      currentMood === mood
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105"
                        : `${bgColor} ${hoverColor} border-2`
                    }`}
                    onClick={() => setCurrentMood(mood)}
                  >
                    <Icon className={`h-7 w-7 ${currentMood === mood ? "text-white" : color}`} />
                    <span className="text-xs font-medium">{label}</span>
                  </Button>
                ))}
              </div>

              {currentMood && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <Textarea
                    placeholder="Tell me more about how you're feeling... Maya will respond with care and understanding (optional)"
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    className="min-h-24 bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-red-300 transition-all duration-300"
                  />
                  <Button
                    onClick={saveMoodEntry}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                  >
                    Share with Maya & Save Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-t-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-red-600 transition-colors duration-300">
                            {resource.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-950/30 dark:to-pink-950/30"
                            >
                              {resource.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-medium">{resource.duration}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-background/80 to-background/60 hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/20 dark:hover:to-pink-950/20 border-2 hover:border-red-300 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Enhanced logs tab with better styling */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-500" />
                Mood Trends
              </CardTitle>
              <CardDescription>Your mood patterns over the past week</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Average mood score</span>
                  <span className="font-medium text-red-600">6.8/10</span>
                </div>
                <Progress
                  value={68}
                  className="h-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30"
                />
                <div className="text-xs text-muted-foreground bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-3">
                  Based on your last 5 entries. Keep tracking to see longer trends!
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 rounded-t-lg">
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your mood check-ins from the past week</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {moodHistory.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-gradient-to-r hover:from-muted/20 hover:to-muted/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                        {getMoodIcon(entry.mood)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{entry.date}</div>
                        <div className="text-xs text-muted-foreground">{entry.notes}</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
                    >
                      {entry.score}/10
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced crisis tab with better styling */}
        <TabsContent value="crisis" className="space-y-6">
          <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/80 to-red-100/60 dark:from-red-950/40 dark:to-red-900/30 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-t-lg">
              <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Crisis Support Resources
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-300">
                If you're in crisis or having thoughts of self-harm, please reach out for immediate help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-4">
                {[
                  {
                    title: "Emergency Services",
                    description: "For immediate danger or medical emergency",
                    action: "Call 911",
                    variant: "destructive" as const,
                  },
                  {
                    title: "Crisis Text Line",
                    description: "24/7 crisis support via text",
                    action: "Text HOME to 741741",
                    variant: "outline" as const,
                  },
                  {
                    title: "National Suicide Prevention Lifeline",
                    description: "24/7 confidential support",
                    action: "Call 988",
                    variant: "outline" as const,
                  },
                ].map((resource, index) => (
                  <div
                    key={index}
                    className="p-4 border border-red-200 dark:border-red-800 rounded-xl bg-gradient-to-r from-red-50/50 to-red-100/30 dark:from-red-900/30 dark:to-red-900/20 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="font-semibold text-red-800 dark:text-red-200">{resource.title}</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">{resource.description}</p>
                    <Button
                      variant={resource.variant}
                      className={`w-full transition-all duration-300 hover:scale-[1.02] ${
                        resource.variant === "outline" ? "bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30" : ""
                      }`}
                    >
                      {resource.action}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-xs text-red-600 dark:text-red-400 p-4 bg-gradient-to-r from-red-100/80 to-red-200/60 dark:from-red-950/50 dark:to-red-800/40 rounded-xl">
                <p className="font-medium mb-2">Remember:</p>
                <ul className="space-y-1">
                  <li>• You are not alone in this</li>
                  <li>• Crisis feelings are temporary</li>
                  <li>• Professional help is available 24/7</li>
                  <li>• Your life has value and meaning</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/80 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 shadow-lg">
        <CardContent className="pt-6">
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            <strong>Disclaimer:</strong> This mental health check-in tool is for reflection and self-awareness purposes
            only. It is not a substitute for professional mental health care, diagnosis, or treatment. If you are
            experiencing a mental health crisis or having thoughts of self-harm, please contact emergency services or a
            mental health professional immediately.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
