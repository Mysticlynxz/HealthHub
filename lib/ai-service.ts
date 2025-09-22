import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface MentalHealthResponse {
  response: string
  escalationNeeded: boolean
  resources?: string[]
}

export interface SymptomAnalysis {
  actions: Array<{
    type: "self-care" | "gp" | "urgent" | "emergency"
    title: string
    description: string
    priority: "low" | "medium" | "high" | "critical"
    timeframe: string
  }>
  escalationNeeded: boolean
  disclaimer: string
}

export interface DietPlan {
  meals: Array<{
    name: string
    type: "breakfast" | "lunch" | "dinner" | "snack"
    calories: number
    protein: number
    carbs: number
    fat: number
    ingredients: string[]
    localFoods: string[]
    swapOptions: Array<{
      name: string
      calories: number
      protein: number
      carbs: number
      fat: number
      ingredients: string[]
      localFoods: string[]
    }>
    culturalVariant?: string
  }>
  dailyCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  localFocus?: string
  culturalContext?: string
}

export async function generateMentalHealthResponse(
  userMessage: string,
  conversationHistory: string[] = [],
): Promise<MentalHealthResponse> {
  try {
    const emotionalStates = {
      tired: [
        "tired",
        "exhausted",
        "drained",
        "worn out",
        "sleepy",
        "fatigue",
        "weary",
        "burnt out",
        "depleted",
        "running on empty",
        "no energy",
        "wiped out",
      ],
      stressed: [
        "stressed",
        "overwhelmed",
        "pressure",
        "anxious",
        "worried",
        "tense",
        "frazzled",
        "on edge",
        "wound up",
        "under pressure",
        "swamped",
        "stretched thin",
      ],
      calm: [
        "calm",
        "peaceful",
        "relaxed",
        "content",
        "serene",
        "tranquil",
        "centered",
        "balanced",
        "at ease",
        "composed",
        "steady",
        "grounded",
      ],
      overwhelmed: [
        "overwhelmed",
        "too much",
        "can't handle",
        "drowning",
        "suffocating",
        "buried",
        "swamped",
        "crushed",
        "breaking point",
        "at my limit",
      ],
      sad: [
        "sad",
        "down",
        "depressed",
        "blue",
        "upset",
        "hurt",
        "heartbroken",
        "devastated",
        "grief",
        "mourning",
        "heavy",
        "empty",
        "numb",
      ],
      angry: [
        "angry",
        "mad",
        "frustrated",
        "irritated",
        "furious",
        "annoyed",
        "rage",
        "livid",
        "steaming",
        "fed up",
        "boiling",
        "seething",
      ],
      happy: [
        "happy",
        "good",
        "great",
        "wonderful",
        "excited",
        "joyful",
        "elated",
        "thrilled",
        "delighted",
        "cheerful",
        "upbeat",
        "fantastic",
      ],
      lonely: [
        "lonely",
        "alone",
        "isolated",
        "disconnected",
        "empty",
        "abandoned",
        "forgotten",
        "invisible",
        "cut off",
        "withdrawn",
        "solitary",
      ],
      confused: [
        "confused",
        "lost",
        "don't know",
        "uncertain",
        "mixed up",
        "unclear",
        "puzzled",
        "bewildered",
        "torn",
        "conflicted",
        "unsure",
      ],
      hopeful: [
        "hopeful",
        "optimistic",
        "looking forward",
        "positive",
        "encouraged",
        "motivated",
        "inspired",
        "determined",
        "confident",
        "bright",
      ],
      grateful: [
        "grateful",
        "thankful",
        "blessed",
        "appreciative",
        "fortunate",
        "lucky",
        "counting blessings",
        "abundance",
        "rich",
        "fulfilled",
      ],
    }

    let detectedEmotion = "neutral"
    for (const [emotion, keywords] of Object.entries(emotionalStates)) {
      if (keywords.some((keyword) => userMessage.toLowerCase().includes(keyword))) {
        detectedEmotion = emotion
        break
      }
    }

    const context = `You are Maya, a warm, empathetic mental health companion trained in active listening and emotional support. 

    The user seems to be feeling: ${detectedEmotion}
    Conversation depth: ${conversationHistory.length} exchanges

    Core principles:
    - Show genuine empathy and validation for all emotions
    - Use reflective listening techniques ("It sounds like you're feeling...")
    - Ask thoughtful follow-up questions to encourage deeper sharing
    - Acknowledge the person's strength in reaching out
    - Offer gentle, actionable suggestions when appropriate
    - Use warm, conversational language that feels human and caring
    - Remember context from the conversation to show you're truly listening
    - Provide 5+ different response variations to avoid repetition
    
    Enhanced emotional intelligence guidelines with varied responses:
    
    For TIRED/EXHAUSTED users (rotate between these approaches):
    1. Validate exhaustion: "That sounds absolutely draining. It takes real strength to keep going when you're running on empty."
    2. Explore causes: "Exhaustion can be so overwhelming. What's been taking the most out of you lately?"
    3. Gentle care: "Your body and mind are telling you something important right now. How have you been caring for yourself?"
    4. Energy patterns: "I hear how tired you are. Have you noticed any patterns in when you feel most drained?"
    5. Rest validation: "Sometimes being tired is our body's way of asking for what it needs. What would true rest look like for you?"
    6. Strength recognition: "Even feeling this exhausted, you're still here sharing with me. That shows incredible resilience."
    Follow-ups: "Would you like me to suggest some gentle ways to recharge?" / "Do you want to talk about what's been draining your energy?" / "What's one small thing that might help you feel a bit more rested?"
    
    For STRESSED/OVERWHELMED users (rotate approaches):
    1. Pressure acknowledgment: "That sounds like an enormous amount of pressure. No wonder you're feeling overwhelmed."
    2. Breaking it down: "When everything feels like too much, sometimes it helps to look at one piece at a time. What feels most urgent right now?"
    3. Breathing space: "It sounds like you need a moment to breathe. You're carrying so much right now."
    4. Strength in struggle: "Managing all of this stress shows how capable you are, even when it doesn't feel that way."
    5. Permission to feel: "It's completely understandable to feel overwhelmed with everything you're dealing with."
    6. Present moment: "Right now, in this moment, you're safe and you're talking to someone who cares. That's something."
    Follow-ups: "Would it help to talk through what's feeling most overwhelming?" / "Do you want me to guide you through a quick calming technique?" / "What's one thing you could let go of, even temporarily?"
    
    For CALM/PEACEFUL users (celebrate and explore):
    1. Celebration: "I can feel the peace in your words, and it's beautiful. I'm so glad you're experiencing this calm."
    2. Curiosity: "This peaceful feeling is precious. What do you think has contributed to feeling so centered today?"
    3. Savoring: "It's wonderful when we can pause and really notice these moments of calm. How does it feel in your body?"
    4. Gratitude: "Thank you for sharing this peaceful moment with me. It's a gift to witness your serenity."
    5. Wisdom: "You've found something that works for you. What wisdom would you share about finding this peace?"
    6. Presence: "There's something so grounding about the way you're describing this calm. You're really present right now."
    Follow-ups: "What's helping you feel so centered today?" / "Would you like to explore ways to maintain this peaceful feeling?" / "What does this calm teach you about what you need?"
    
    For SAD/DOWN users (deep empathy and presence):
    1. Witnessing: "I can feel the weight of sadness in your words, and I want you to know I'm here with you in this."
    2. Validation: "Sadness is such a deep, important emotion. It shows how much you care and feel."
    3. No rushing: "There's no need to rush through this feeling. Sometimes sadness needs to be felt and honored."
    4. Strength in vulnerability: "It takes courage to share when you're feeling this low. Thank you for trusting me with this."
    5. Gentle presence: "I'm sitting here with you in this difficult moment. You don't have to carry this alone."
    6. Hope without dismissing: "This sadness is real and valid, and so is your capacity to move through it, in your own time."
    Follow-ups: "I'm here with you in this difficult moment. Would it help to talk about what's contributing to these feelings?" / "Do you want me to suggest some gentle self-care ideas?" / "What would comfort look like for you right now?"
    
    Continue this pattern for all emotions with 5-6 varied approaches each...
    
    Crisis detection (enhanced):
    - If mentions of self-harm, suicide, or crisis: respond with immediate care and concern
    - Acknowledge their courage in sharing something so difficult
    - Emphasize their value and that help is available
    - Gently guide toward professional resources
    
    Response style:
    - Keep responses 2-4 sentences, warm and conversational
    - Use "I" statements to show personal engagement
    - ALWAYS end with a gentle follow-up question or supportive prompt
    - Avoid clinical language - speak like a caring friend
    - Vary your language significantly - use different phrases for similar emotions
    - Show you remember previous parts of the conversation
    
    Previous conversation context: ${conversationHistory.slice(-6).join(" → ")}
    Current message: "${userMessage}"
    
    Respond as Maya with genuine warmth, empathy, and a helpful follow-up prompt:`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: context,
      maxTokens: 300,
      temperature: 0.9, // Increased temperature for maximum response variety
    })

    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end it all",
      "hurt myself",
      "self-harm",
      "cutting",
      "don't want to live",
      "better off dead",
      "can't go on",
      "no point",
      "give up",
      "overdose",
      "jump",
      "hanging",
      "worthless",
      "burden",
      "hopeless",
    ]

    const escalationNeeded = crisisKeywords.some((keyword) => userMessage.toLowerCase().includes(keyword.toLowerCase()))

    const crisisResources = escalationNeeded
      ? [
          "I'm really concerned about you right now, and I want you to know that your life has value. Please reach out to the Crisis Text Line: Text HOME to 741741",
          "You don't have to go through this alone. The National Suicide Prevention Lifeline is available 24/7: Call or text 988",
          "If you're in immediate danger, please call 911 or go to your nearest emergency room. Your safety matters.",
        ]
      : undefined

    return {
      response: text,
      escalationNeeded,
      resources: crisisResources,
    }
  } catch (error) {
    console.error("AI service error:", error)
    const fallbackResponses = [
      "I'm here with you right now, and I want you to know that your feelings matter. Sometimes when technology gets in the way, the most important thing is just knowing someone cares. What's one thing that's on your heart today?",
      "Even though I'm having trouble connecting right now, I want you to know that you're not alone. Your courage in reaching out means everything. Can you tell me what's been weighing on your mind?",
      "Technology might be acting up, but my care for you is constant. You took a brave step by sharing, and that matters deeply. What would be most helpful to talk about right now?",
      "I may be having connection issues, but I'm still here with you in spirit. Your feelings are valid and important. What's something you'd like me to know about how you're doing?",
      "Sometimes the most meaningful connections happen even when technology fails us. I'm grateful you're here, and I want to listen. What's been on your mind lately?",
    ]

    return {
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      escalationNeeded: false,
    }
  }
}

export async function analyzeSymptoms(
  symptomDescription: string,
  duration: string,
  severity: string,
  accompanying: string[],
): Promise<SymptomAnalysis> {
  try {
    const prompt = `As a medical information assistant, analyze these symptoms and provide safe, general guidance. 
    NEVER provide medical diagnosis. Always emphasize consulting healthcare professionals.
    
    Symptoms: ${symptomDescription}
    Duration: ${duration}
    Severity: ${severity}
    Accompanying symptoms: ${accompanying.join(", ")}
    
    Provide 2-4 action recommendations in this JSON format:
    {
      "actions": [
        {
          "type": "self-care|gp|urgent|emergency",
          "title": "Brief action title",
          "description": "Safe general guidance",
          "priority": "low|medium|high|critical",
          "timeframe": "When to take action"
        }
      ],
      "escalationNeeded": boolean,
      "disclaimer": "Safety disclaimer"
    }
    
    Emergency indicators: chest pain, severe breathing difficulty, loss of consciousness, severe bleeding.
    Always include GP consultation for persistent symptoms.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 400,
    })

    try {
      return JSON.parse(text)
    } catch {
      // Fallback if JSON parsing fails
      return {
        actions: [
          {
            type: "gp",
            title: "Consult a healthcare professional",
            description: "A medical professional can properly assess your symptoms and provide appropriate guidance.",
            priority: "medium",
            timeframe: "Within a few days",
          },
        ],
        escalationNeeded: false,
        disclaimer: "This is general information only, not medical advice.",
      }
    }
  } catch (error) {
    console.error("Symptom analysis error:", error)
    return {
      actions: [
        {
          type: "gp",
          title: "Consult a healthcare professional",
          description: "For proper symptom evaluation and medical guidance.",
          priority: "medium",
          timeframe: "As soon as convenient",
        },
      ],
      escalationNeeded: false,
      disclaimer: "This is general information only, not medical advice.",
    }
  }
}

export async function generatePersonalizedDietPlan(
  goal: string,
  dietType: string,
  preferences: string,
  restrictions: string,
  age: number,
  weight: number,
  height: number,
  activityLevel: string,
  conditions: string[],
): Promise<DietPlan> {
  try {
    const prompt = `Create a comprehensive personalized daily meal plan with MULTIPLE OPTIONS per meal based on these specific requirements:

    PRIMARY GOAL: ${goal}
    DIET TYPE: ${dietType}
    FOOD PREFERENCES: ${preferences}
    RESTRICTIONS/ALLERGIES: ${restrictions}
    
    Personal Details:
    - Age: ${age}, Weight: ${weight}kg, Height: ${height}cm
    - Activity: ${activityLevel}
    - Health conditions: ${conditions.join(", ")}
    
    CRITICAL REQUIREMENTS:
    1. Provide 3-5 DIFFERENT meal alternatives for each meal type (breakfast, lunch, dinner)
    2. Focus on LOCAL and CULTURALLY RELEVANT foods based on user preferences
    3. Include regional specialties and seasonal ingredients
    4. Avoid generic "superfoods" - use accessible, local market ingredients
    5. Consider cultural cuisine preferences mentioned in user preferences
    6. Provide variety in cooking methods, flavors, and textures
    
    For each main meal, include:
    - Primary recommended meal
    - 3-4 alternative options with full nutritional breakdown
    - Local ingredient substitutions
    - Cultural variations when relevant
    
    Return comprehensive JSON format:
    {
      "meals": [
        {
          "name": "Primary meal name",
          "type": "breakfast|lunch|dinner",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "ingredients": ["ingredient1", "ingredient2"],
          "localFoods": ["local alternative 1", "local alternative 2"],
          "swapOptions": [
            {
              "name": "Alternative meal 1",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "ingredients": ["ingredient1", "ingredient2"],
              "localFoods": ["local alternative 1", "local alternative 2"]
            },
            {
              "name": "Alternative meal 2",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "ingredients": ["ingredient1", "ingredient2"],
              "localFoods": ["local alternative 1", "local alternative 2"]
            }
          ],
          "culturalVariant": "Cultural context if relevant"
        }
      ],
      "dailyCalories": number,
      "macros": {"protein": number, "carbs": number, "fat": number},
      "localFocus": "explanation of local food choices",
      "culturalContext": "explanation of cultural food considerations"
    }`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 1200,
      temperature: 0.8, // Higher temperature for more variety
    })

    try {
      return JSON.parse(text)
    } catch {
      // Enhanced fallback with multiple options per meal
      return {
        meals: [
          {
            name: "Local Seasonal Breakfast Bowl",
            type: "breakfast",
            calories: 380,
            protein: 18,
            carbs: 45,
            fat: 14,
            ingredients: ["Local oats", "Regional yogurt", "Seasonal berries", "Local honey"],
            localFoods: ["Farm-fresh eggs", "Local dairy", "Seasonal fruit"],
            swapOptions: [
              {
                name: "Avocado Toast with Local Bread",
                calories: 350,
                protein: 12,
                carbs: 38,
                fat: 18,
                ingredients: ["Whole grain local bread", "Fresh avocado", "Local tomatoes"],
                localFoods: ["Artisan bread", "Farm tomatoes"],
              },
              {
                name: "Regional Grain Porridge",
                calories: 320,
                protein: 14,
                carbs: 52,
                fat: 8,
                ingredients: ["Local grains", "Seasonal fruit", "Nuts"],
                localFoods: ["Regional grains", "Local honey"],
              },
              {
                name: "Farm Fresh Egg Scramble",
                calories: 290,
                protein: 22,
                carbs: 15,
                fat: 18,
                ingredients: ["Free-range eggs", "Local vegetables", "Herbs"],
                localFoods: ["Farm eggs", "Garden vegetables"],
              },
            ],
          },
          {
            name: "Market Fresh Lunch Bowl",
            type: "lunch",
            calories: 520,
            protein: 32,
            carbs: 48,
            fat: 20,
            ingredients: ["Local protein source", "Regional grains", "Seasonal vegetables"],
            localFoods: ["Fresh market vegetables", "Local lean protein"],
            swapOptions: [
              {
                name: "Regional Soup with Local Bread",
                calories: 480,
                protein: 28,
                carbs: 55,
                fat: 16,
                ingredients: ["Seasonal vegetables", "Local broth", "Artisan bread"],
                localFoods: ["Farm vegetables", "Local bakery bread"],
              },
              {
                name: "Seasonal Salad with Local Protein",
                calories: 450,
                protein: 35,
                carbs: 25,
                fat: 24,
                ingredients: ["Mixed greens", "Local protein", "Seasonal vegetables"],
                localFoods: ["Farm greens", "Regional protein"],
              },
              {
                name: "Traditional Grain Bowl",
                calories: 500,
                protein: 30,
                carbs: 52,
                fat: 18,
                ingredients: ["Ancient grains", "Roasted vegetables", "Local protein"],
                localFoods: ["Heritage grains", "Seasonal produce"],
              },
            ],
          },
          {
            name: "Traditional Local Dinner",
            type: "dinner",
            calories: 450,
            protein: 28,
            carbs: 42,
            fat: 18,
            ingredients: ["Regional protein", "Local vegetables", "Traditional grains"],
            localFoods: ["Locally sourced protein", "Seasonal produce"],
            swapOptions: [
              {
                name: "Local Fish with Seasonal Vegetables",
                calories: 420,
                protein: 32,
                carbs: 35,
                fat: 16,
                ingredients: ["Fresh local fish", "Seasonal vegetables", "Herbs"],
                localFoods: ["Day-boat fish", "Garden vegetables"],
              },
              {
                name: "Regional Vegetarian Stew",
                calories: 380,
                protein: 18,
                carbs: 58,
                fat: 12,
                ingredients: ["Local legumes", "Seasonal vegetables", "Herbs"],
                localFoods: ["Farm legumes", "Market vegetables"],
              },
              {
                name: "Traditional Protein with Local Sides",
                calories: 480,
                protein: 35,
                carbs: 38,
                fat: 20,
                ingredients: ["Regional protein", "Local starches", "Seasonal vegetables"],
                localFoods: ["Local meat/protein", "Farm vegetables"],
              },
            ],
          },
        ],
        dailyCalories: 1350,
        macros: { protein: 78, carbs: 135, fat: 52 },
        localFocus: "Emphasizing seasonal, locally-sourced ingredients for better nutrition and sustainability",
        culturalContext: "Incorporating traditional and regional food preferences for familiar, enjoyable meals",
      }
    }
  } catch (error) {
    console.error("Diet plan generation error:", error)
    return {
      meals: [
        {
          name: "Balanced Local Meal",
          type: "breakfast",
          calories: 350,
          protein: 15,
          carbs: 45,
          fat: 12,
          ingredients: ["Local whole grains", "Regional protein", "Seasonal fruits"],
          localFoods: ["Farm-fresh produce", "Local dairy alternatives"],
          swapOptions: [
            {
              name: "Alternative Local Breakfast",
              calories: 330,
              protein: 14,
              carbs: 42,
              fat: 11,
              ingredients: ["Local ingredients", "Seasonal produce"],
              localFoods: ["Regional alternatives"],
            },
          ],
        },
      ],
      dailyCalories: 1800,
      macros: { protein: 90, carbs: 200, fat: 70 },
      localFocus: "Focus on accessible, local ingredients",
    }
  }
}
