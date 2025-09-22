"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Apple,
  User,
  Utensils,
  Activity,
  Target,
  CheckCircle,
  RefreshCw,
  Clock,
  Flame,
  Droplets,
  Heart,
} from "lucide-react"
import { generatePersonalizedDietPlan } from "@/lib/ai-service"

interface HealthProfile {
  age: string
  weight: string
  height: string
  activityLevel: string
  goal: string
  dietType: string
  preferences: string
  restrictions: string
  conditions: string[]
  allergies: string[]
  dietaryPreferences: string[]
  goals: string[]
}

interface MealPlan {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: string[]
  instructions: string[]
  localFoods: string[]
  image: string
  swapOptions?: Array<{
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    ingredients: string[]
    localFoods: string[]
    image: string
  }>
  culturalVariant?: string
}

interface WorkoutPlan {
  id: string
  name: string
  duration: number
  intensity: "low" | "medium" | "high"
  exercises: string[]
  calories: number
}

export function DietPlannerModule() {
  const [activeTab, setActiveTab] = useState("profile")
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "",
    dietType: "",
    preferences: "",
    restrictions: "",
    conditions: [],
    allergies: [],
    dietaryPreferences: [],
    goals: [],
  })
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedMeals, setExpandedMeals] = useState<Set<string>>(new Set())
  const [selectedMealAlternatives, setSelectedMealAlternatives] = useState<Record<string, number>>({})

  const mealPlans: MealPlan[] = [
    {
      id: "1",
      name: "Mediterranean Breakfast Bowl",
      type: "breakfast",
      calories: 350,
      protein: 15,
      carbs: 45,
      fat: 12,
      ingredients: ["Greek yogurt", "Berries", "Nuts", "Honey", "Oats"],
      instructions: ["Mix yogurt with oats", "Top with berries and nuts", "Drizzle with honey"],
      localFoods: ["Local honey", "Regional berries", "Farm yogurt"],
      image: "/healthy-breakfast-bowl-with-berries-and-yogurt.jpg",
      swapOptions: [
        {
          id: "1a",
          name: "Avocado Toast with Local Bread",
          calories: 320,
          protein: 12,
          carbs: 38,
          fat: 18,
          ingredients: ["Whole grain bread", "Avocado", "Tomatoes", "Olive oil"],
          localFoods: ["Artisan bread", "Farm tomatoes", "Local olive oil"],
          image: "/avocado-toast-tomatoes.png",
        },
        {
          id: "1b",
          name: "Regional Grain Porridge",
          calories: 290,
          protein: 14,
          carbs: 52,
          fat: 8,
          ingredients: ["Local grains", "Seasonal fruit", "Nuts", "Cinnamon"],
          localFoods: ["Heritage grains", "Seasonal berries", "Local nuts"],
          image: "/grain-porridge-with-fruit.jpg",
        },
        {
          id: "1c",
          name: "Farm Fresh Egg Scramble",
          calories: 280,
          protein: 22,
          carbs: 15,
          fat: 18,
          ingredients: ["Free-range eggs", "Vegetables", "Herbs", "Local cheese"],
          localFoods: ["Farm eggs", "Garden vegetables", "Local cheese"],
          image: "/scrambled-eggs-with-vegetables.jpg",
        },
      ],
      culturalVariant: "Mediterranean-inspired with local ingredients",
    },
    {
      id: "2",
      name: "Market Fresh Lunch Bowl",
      type: "lunch",
      calories: 520,
      protein: 35,
      carbs: 40,
      fat: 18,
      ingredients: ["Local protein", "Quinoa", "Seasonal vegetables", "Herbs"],
      instructions: ["Prepare protein", "Cook quinoa", "Roast vegetables", "Combine with herbs"],
      localFoods: ["Fresh market vegetables", "Local protein", "Regional grains"],
      image: "/grilled-salmon-with-quinoa-and-vegetables.jpg",
      swapOptions: [
        {
          id: "2a",
          name: "Regional Soup with Artisan Bread",
          calories: 480,
          protein: 28,
          carbs: 55,
          fat: 16,
          ingredients: ["Seasonal vegetables", "Local broth", "Legumes", "Herbs"],
          localFoods: ["Farm vegetables", "Local bakery bread", "Regional legumes"],
          image: "/vegetable-soup-with-bread.jpg",
        },
        {
          id: "2b",
          name: "Seasonal Salad with Local Protein",
          calories: 450,
          protein: 32,
          carbs: 25,
          fat: 24,
          ingredients: ["Mixed greens", "Local protein", "Seasonal vegetables", "Nuts"],
          localFoods: ["Farm greens", "Regional protein", "Local nuts"],
          image: "/fresh-salad-with-protein.jpg",
        },
        {
          id: "2c",
          name: "Traditional Grain Bowl",
          calories: 500,
          protein: 30,
          carbs: 52,
          fat: 18,
          ingredients: ["Ancient grains", "Roasted vegetables", "Local protein", "Seeds"],
          localFoods: ["Heritage grains", "Seasonal produce", "Local seeds"],
          image: "/grain-bowl-with-roasted-vegetables.jpg",
        },
      ],
    },
    {
      id: "3",
      name: "Traditional Local Dinner",
      type: "dinner",
      calories: 380,
      protein: 28,
      carbs: 42,
      fat: 14,
      ingredients: ["Regional protein", "Local vegetables", "Traditional grains", "Herbs"],
      instructions: ["Prepare protein", "Steam vegetables", "Cook grains", "Season with herbs"],
      localFoods: ["Locally sourced protein", "Seasonal produce", "Regional grains"],
      image: "/colorful-vegetable-stir-fry-with-tofu.jpg",
      swapOptions: [
        {
          id: "3a",
          name: "Local Fish with Seasonal Vegetables",
          calories: 420,
          protein: 32,
          carbs: 35,
          fat: 16,
          ingredients: ["Fresh local fish", "Seasonal vegetables", "Herbs", "Lemon"],
          localFoods: ["Day-boat fish", "Garden vegetables", "Local herbs"],
          image: "/grilled-fish-with-vegetables.jpg",
        },
        {
          id: "3b",
          name: "Regional Vegetarian Stew",
          calories: 360,
          protein: 18,
          carbs: 58,
          fat: 12,
          ingredients: ["Local legumes", "Seasonal vegetables", "Herbs", "Spices"],
          localFoods: ["Farm legumes", "Market vegetables", "Local spices"],
          image: "/vegetarian-stew-with-legumes.jpg",
        },
        {
          id: "3c",
          name: "Traditional Protein with Local Sides",
          calories: 460,
          protein: 35,
          carbs: 38,
          fat: 20,
          ingredients: ["Regional protein", "Local starches", "Seasonal vegetables"],
          localFoods: ["Local meat/protein", "Farm vegetables", "Regional starches"],
          image: "/traditional-protein-with-vegetables.jpg",
        },
      ],
    },
  ]

  const workoutPlans: WorkoutPlan[] = [
    {
      id: "1",
      name: "Morning Cardio",
      duration: 30,
      intensity: "medium",
      exercises: ["Brisk walking", "Light jogging", "Stretching"],
      calories: 200,
    },
    {
      id: "2",
      name: "Strength Training",
      duration: 45,
      intensity: "high",
      exercises: ["Push-ups", "Squats", "Planks", "Resistance bands"],
      calories: 300,
    },
  ]

  const conditions = [
    "Diabetes",
    "Hypertension",
    "High Cholesterol",
    "Heart Disease",
    "Obesity",
    "Celiac Disease",
    "IBS",
    "None",
  ]

  const allergies = ["Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy", "Fish", "None"]

  const dietaryPreferences = ["Vegetarian", "Vegan", "Keto", "Mediterranean", "Low-carb", "High-protein", "Balanced"]

  const goals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Building",
    "Heart Health",
    "Blood Sugar Control",
    "General Wellness",
  ]

  const goalOptions = [
    "Weight Loss",
    "Weight Gain",
    "Weight Maintenance",
    "Muscle Building",
    "Increased Energy",
    "Heart Health",
    "Blood Sugar Control",
    "General Wellness",
  ]

  const dietTypeOptions = [
    "Vegetarian",
    "Vegan",
    "Non-vegetarian",
    "Pescatarian",
    "Diabetic-friendly",
    "Hypertension-friendly",
    "Mediterranean",
    "Low-carb",
    "Keto",
    "Balanced",
  ]

  const handleConditionChange = (condition: string, checked: boolean) => {
    setHealthProfile((prev) => ({
      ...prev,
      conditions: checked ? [...prev.conditions, condition] : prev.conditions.filter((c) => c !== condition),
    }))
  }

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setHealthProfile((prev) => ({
      ...prev,
      allergies: checked ? [...prev.allergies, allergy] : prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    setHealthProfile((prev) => ({
      ...prev,
      dietaryPreferences: checked
        ? [...prev.dietaryPreferences, preference]
        : prev.dietaryPreferences.filter((p) => p !== preference),
    }))
  }

  const handleGoalChange = (goal: string, checked: boolean) => {
    setHealthProfile((prev) => ({
      ...prev,
      goals: checked ? [...prev.goals, goal] : prev.goals.filter((g) => g !== goal),
    }))
  }

  const generatePlan = async () => {
    setIsGenerating(true)
    try {
      const dietPlan = await generatePersonalizedDietPlan(
        healthProfile.goal,
        healthProfile.dietType,
        healthProfile.preferences,
        healthProfile.restrictions,
        Number.parseInt(healthProfile.age),
        Number.parseFloat(healthProfile.weight),
        Number.parseFloat(healthProfile.height),
        healthProfile.activityLevel,
        healthProfile.conditions,
      )

      setHasGeneratedPlan(true)
      setActiveTab("meal-plan")
    } catch (error) {
      console.error("Error generating plan:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleMealAlternatives = (mealId: string) => {
    const newExpanded = new Set(expandedMeals)
    if (newExpanded.has(mealId)) {
      newExpanded.delete(mealId)
    } else {
      newExpanded.add(mealId)
    }
    setExpandedMeals(newExpanded)
  }

  const selectMealAlternative = (mealId: string, alternativeIndex: number) => {
    setSelectedMealAlternatives((prev) => ({
      ...prev,
      [mealId]: alternativeIndex,
    }))
  }

  const getCurrentMeal = (meal: MealPlan) => {
    const selectedIndex = selectedMealAlternatives[meal.id]
    if (selectedIndex !== undefined && meal.swapOptions && meal.swapOptions[selectedIndex]) {
      const alternative = meal.swapOptions[selectedIndex]
      return {
        ...meal,
        name: alternative.name,
        calories: alternative.calories,
        protein: alternative.protein,
        carbs: alternative.carbs,
        fat: alternative.fat,
        ingredients: alternative.ingredients,
        localFoods: alternative.localFoods,
        image: alternative.image,
      }
    }
    return meal
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 rounded-2xl -z-10"></div>
        <div className="relative py-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 shadow-lg">
              <Apple className="h-10 w-10 text-green-500 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Diet & Lifestyle Planner
          </h1>
          <p className="text-muted-foreground text-lg mt-2 max-w-2xl mx-auto leading-relaxed">
            Get personalized nutrition and exercise plans tailored to your health conditions and goals.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="meal-plan"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Meal Plan</span>
          </TabsTrigger>
          <TabsTrigger
            value="exercise"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Exercise</span>
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                Health Profile
              </CardTitle>
              <CardDescription>Tell us about yourself to get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="Enter your age"
                    value={healthProfile.age}
                    onChange={(e) => setHealthProfile((prev) => ({ ...prev, age: e.target.value }))}
                    className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    placeholder="Enter your weight"
                    value={healthProfile.weight}
                    onChange={(e) => setHealthProfile((prev) => ({ ...prev, weight: e.target.value }))}
                    className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    placeholder="Enter your height"
                    value={healthProfile.height}
                    onChange={(e) => setHealthProfile((prev) => ({ ...prev, height: e.target.value }))}
                    className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select
                  value={healthProfile.activityLevel}
                  onValueChange={(value) => setHealthProfile((prev) => ({ ...prev, activityLevel: value }))}
                >
                  <SelectTrigger className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (2x/day or intense exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primary Goal *</Label>
                <Select
                  value={healthProfile.goal}
                  onValueChange={(value) => setHealthProfile((prev) => ({ ...prev, goal: value }))}
                >
                  <SelectTrigger className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300">
                    <SelectValue placeholder="What's your main health goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalOptions.map((goal) => (
                      <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, "-")}>
                        {goal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Diet Type *</Label>
                <Select
                  value={healthProfile.dietType}
                  onValueChange={(value) => setHealthProfile((prev) => ({ ...prev, dietType: value }))}
                >
                  <SelectTrigger className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300">
                    <SelectValue placeholder="What type of diet do you follow?" />
                  </SelectTrigger>
                  <SelectContent>
                    {dietTypeOptions.map((diet) => (
                      <SelectItem key={diet} value={diet.toLowerCase().replace(/\s+/g, "-")}>
                        {diet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferences">Food Preferences *</Label>
                <Input
                  id="preferences"
                  placeholder="e.g., loves spicy food, prefers Italian cuisine, enjoys fresh salads..."
                  value={healthProfile.preferences}
                  onChange={(e) => setHealthProfile((prev) => ({ ...prev, preferences: e.target.value }))}
                  className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground">
                  Tell us about your favorite foods, cuisines, and meal preferences
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restrictions">Restrictions & Allergies *</Label>
                <Input
                  id="restrictions"
                  placeholder="e.g., gluten-free, lactose intolerant, nut allergy, no shellfish..."
                  value={healthProfile.restrictions}
                  onChange={(e) => setHealthProfile((prev) => ({ ...prev, restrictions: e.target.value }))}
                  className="bg-gradient-to-r from-background/80 to-background/60 border-2 focus:border-green-300 transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground">
                  List any food allergies, intolerances, or dietary restrictions
                </p>
              </div>

              <div className="space-y-3">
                <Label>Health Conditions</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {conditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={healthProfile.conditions.includes(condition)}
                        onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Food Allergies</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allergies.map((allergy) => (
                    <div key={allergy} className="flex items-center space-x-2">
                      <Checkbox
                        id={allergy}
                        checked={healthProfile.allergies.includes(allergy)}
                        onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                      />
                      <Label htmlFor={allergy} className="text-sm">
                        {allergy}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Dietary Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dietaryPreferences.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={preference}
                        checked={healthProfile.dietaryPreferences.includes(preference)}
                        onCheckedChange={(checked) => handlePreferenceChange(preference, checked as boolean)}
                      />
                      <Label htmlFor={preference} className="text-sm">
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Health Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {goals.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={healthProfile.goals.includes(goal)}
                        onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                      />
                      <Label htmlFor={goal} className="text-sm">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={generatePlan}
                disabled={
                  isGenerating ||
                  !healthProfile.age ||
                  !healthProfile.weight ||
                  !healthProfile.goal ||
                  !healthProfile.dietType ||
                  !healthProfile.preferences ||
                  !healthProfile.restrictions
                }
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Your Personalized Plan...
                  </>
                ) : (
                  "Generate Personalized Plan"
                )}
              </Button>

              {(!healthProfile.goal ||
                !healthProfile.dietType ||
                !healthProfile.preferences ||
                !healthProfile.restrictions) && (
                <p className="text-xs text-muted-foreground text-center">
                  Please fill in all required fields (*) to generate your personalized plan
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-6">
          {!hasGeneratedPlan ? (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">Complete your health profile first to generate a meal plan.</p>
                <Button
                  onClick={() => setActiveTab("profile")}
                  className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-[1.02]"
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-green-500" />
                    Your Personalized Meal Plan
                  </CardTitle>
                  <CardDescription>
                    Tailored to your health conditions and dietary preferences with multiple options per meal
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                      <div className="text-3xl font-bold text-green-600">1,850</div>
                      <div className="text-sm text-muted-foreground font-medium">Daily Calories</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl">
                      <div className="text-3xl font-bold text-green-500">120g</div>
                      <div className="text-sm text-muted-foreground font-medium">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl">
                      <div className="text-3xl font-bold text-blue-500">200g</div>
                      <div className="text-sm text-muted-foreground font-medium">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl">
                      <div className="text-3xl font-bold text-orange-500">65g</div>
                      <div className="text-sm text-muted-foreground font-medium">Fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mealPlans.map((meal, index) => {
                  const currentMeal = getCurrentMeal(meal)
                  const isExpanded = expandedMeals.has(meal.id)

                  return (
                    <Card
                      key={meal.id}
                      className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={currentMeal.image || "/placeholder.svg"}
                          alt={currentMeal.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <Badge className="absolute top-3 left-3 capitalize bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                          {meal.type}
                        </Badge>
                        {selectedMealAlternatives[meal.id] !== undefined && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                            Alternative {selectedMealAlternatives[meal.id] + 1}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                        <CardTitle className="text-xl font-bold">{currentMeal.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 bg-white/60 dark:bg-black/30 px-3 py-1 rounded-full">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{currentMeal.calories} cal</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 dark:bg-black/30 px-3 py-1 rounded-full">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">20 min</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg">
                            <div className="font-bold text-green-600 flex items-center justify-center gap-1 text-lg">
                              <Heart className="h-4 w-4" />
                              {currentMeal.protein}g
                            </div>
                            <div className="text-muted-foreground font-medium">Protein</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg">
                            <div className="font-bold text-blue-600 flex items-center justify-center gap-1 text-lg">
                              <Activity className="h-4 w-4" />
                              {currentMeal.carbs}g
                            </div>
                            <div className="text-muted-foreground font-medium">Carbs</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg">
                            <div className="font-bold text-orange-600 flex items-center justify-center gap-1 text-lg">
                              <Droplets className="h-4 w-4" />
                              {currentMeal.fat}g
                            </div>
                            <div className="text-muted-foreground font-medium">Fat</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-green-700 dark:text-green-300">
                            Local Ingredients:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentMeal.localFoods.map((food, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 hover:scale-105 transition-transform duration-200"
                              >
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-background/80 to-background/60 hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/20 dark:hover:to-emerald-950/20 border-2 hover:border-green-300 transition-all duration-300"
                          >
                            View Recipe
                          </Button>
                          {meal.swapOptions && meal.swapOptions.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleMealAlternatives(meal.id)}
                              className="bg-gradient-to-r from-background/80 to-background/60 hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/20 dark:hover:to-emerald-950/20 border-2 hover:border-green-300 transition-all duration-300"
                              title={isExpanded ? "Hide alternatives" : "Show alternatives"}
                            >
                              <RefreshCw
                                className={`h-4 w-4 ${isExpanded ? "rotate-180" : ""} transition-transform duration-300`}
                              />
                            </Button>
                          )}
                        </div>

                        {isExpanded && meal.swapOptions && (
                          <div className="space-y-4 pt-4 border-t border-green-200 dark:border-green-800 animate-in slide-in-from-top-2 duration-500">
                            <h4 className="font-semibold text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                              <RefreshCw className="h-4 w-4" />
                              Alternative Options:
                            </h4>
                            <div className="space-y-3">
                              {meal.swapOptions.map((option, index) => (
                                <div
                                  key={option.id}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                                    selectedMealAlternatives[meal.id] === index
                                      ? "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 shadow-lg"
                                      : "border-border hover:border-green-300 bg-gradient-to-r from-background/50 to-background/30"
                                  }`}
                                  onClick={() => selectMealAlternative(meal.id, index)}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <h5 className="font-semibold text-sm">{option.name}</h5>
                                    <div className="text-xs text-muted-foreground font-medium bg-white/60 dark:bg-black/30 px-2 py-1 rounded-full">
                                      {option.calories} cal
                                    </div>
                                  </div>
                                  <div className="flex gap-4 text-xs text-muted-foreground mb-3 font-medium">
                                    <span className="bg-green-100 dark:bg-green-950/30 px-2 py-1 rounded">
                                      P: {option.protein}g
                                    </span>
                                    <span className="bg-blue-100 dark:bg-blue-950/30 px-2 py-1 rounded">
                                      C: {option.carbs}g
                                    </span>
                                    <span className="bg-orange-100 dark:bg-orange-950/30 px-2 py-1 rounded">
                                      F: {option.fat}g
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {option.localFoods.slice(0, 2).map((food, foodIndex) => (
                                      <Badge
                                        key={foodIndex}
                                        variant="outline"
                                        className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                                      >
                                        {food}
                                      </Badge>
                                    ))}
                                    {option.localFoods.length > 2 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                                      >
                                        +{option.localFoods.length - 2} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="exercise" className="space-y-6">
          {!hasGeneratedPlan ? (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Complete your health profile first to get exercise recommendations.
                </p>
                <Button onClick={() => setActiveTab("profile")} className="mt-4">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutPlans.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {workout.name}
                      <Badge
                        variant={
                          workout.intensity === "high"
                            ? "destructive"
                            : workout.intensity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {workout.intensity}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {workout.duration} minutes • Burns ~{workout.calories} calories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Exercises:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {workout.exercises.map((exercise, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">Start Workout</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Meals logged</span>
                    <span>18/21</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workouts completed</span>
                    <span>4/5</span>
                  </div>
                  <Progress value={80} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Water intake</span>
                    <span>6/8 glasses</span>
                  </div>
                  <Progress value={75} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">72kg</div>
                    <div className="text-sm text-muted-foreground">Current Weight</div>
                    <div className="text-xs text-green-600">-2kg this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">22.5</div>
                    <div className="text-sm text-muted-foreground">BMI</div>
                    <div className="text-xs text-green-600">Normal range</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Today", activity: "Logged breakfast and lunch", type: "meal" },
                  { date: "Yesterday", activity: "Completed 30-min cardio workout", type: "exercise" },
                  { date: "2 days ago", activity: "Reached daily water goal", type: "hydration" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 rounded-full bg-primary/10">
                      {item.type === "meal" && <Utensils className="h-4 w-4 text-primary" />}
                      {item.type === "exercise" && <Activity className="h-4 w-4 text-primary" />}
                      {item.type === "hydration" && <Droplets className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.activity}</div>
                      <div className="text-xs text-muted-foreground">{item.date}</div>
                    </div>
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
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            <strong>Disclaimer:</strong> This diet and lifestyle planner provides general guidance only and is not a
            substitute for professional medical or nutritional advice. Always consult with healthcare professionals
            before making significant changes to your diet or exercise routine, especially if you have existing health
            conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
