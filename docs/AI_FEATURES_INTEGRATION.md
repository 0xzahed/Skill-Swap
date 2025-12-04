# AI Features Integration Guide

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 3 - AI Integration

---

## Table of Contents

1. [Overview](#overview)
2. [AI Features Breakdown](#ai-features-breakdown)
3. [OpenAI API Setup](#openai-api-setup)
4. [Implementation Details](#implementation-details)
5. [Free Tier Optimization](#free-tier-optimization)
6. [Alternative AI Solutions](#alternative-ai-solutions)

---

## Overview

This document details the implementation of AI-powered features using free and low-cost APIs to enhance the SkillSwap platform with intelligent automation and personalization.

### Why AI Features?

- **Competitive Advantage:** Stand out from competitors
- **User Experience:** Personalized, intelligent assistance
- **Automation:** Reduce manual work for users and admins
- **Engagement:** Increase user interaction and retention
- **Cost-Effective:** Use free tiers and optimize usage

---

## AI Features Breakdown

### 🤖 **Feature 1: AI Chatbot Assistant**

**Purpose:** 24/7 customer support and platform guidance

**Location:**

- Floating chat button on all pages (bottom-right corner)
- Dedicated `/support` page with full chat interface

**Functionality:**

- Answer platform-related questions
- Help with navigation
- Explain booking process
- Provide skill recommendations
- Handle FAQs automatically

**User Flow:**

1. User clicks chat icon
2. Chat widget opens
3. User types question
4. AI responds with helpful answer
5. Option to escalate to human support

**Implementation File:** `src/Components/AIChatbot/AIChatbot.jsx`

**Backend Endpoint:** `POST /api/ai/chatbot`

**Example Conversations:**

```
User: "How do I book a session?"
AI: "Booking a session is easy! Just follow these steps:
     1. Browse skills on our homepage
     2. Click on a skill you're interested in
     3. Check the provider's availability
     4. Fill out the booking form
     5. Complete payment
     Would you like me to help you find a specific skill?"

User: "What payment methods do you accept?"
AI: "We accept all major credit cards (Visa, Mastercard, American Express)
     and PayPal. All payments are securely processed through Stripe."

User: "Can I cancel a booking?"
AI: "Yes! You can cancel up to 24 hours before your session for a full refund.
     Go to My Bookings → Select booking → Click Cancel.
     Would you like me to guide you through the cancellation process?"
```

---

### 🎯 **Feature 2: AI Skill Recommendation Engine**

**Purpose:** Personalized skill suggestions based on user behavior and preferences

**Location:**

- Homepage section: "Recommended for You"
- Profile page: "Skills You Might Like"
- After completing a booking: "Continue Learning"

**Functionality:**

- Analyze user's learning history
- Consider completed and in-progress skills
- Factor in browsing behavior
- Suggest complementary skills
- Create personalized learning paths

**User Flow:**

1. User logs in
2. System analyzes user data
3. AI generates recommendations
4. Displays personalized skill cards
5. User can bookmark or explore

**Implementation File:** `src/Pages/Recommendations.jsx`

**Backend Endpoint:** `POST /api/ai/recommend`

**Algorithm Factors:**

```javascript
{
  completedSkills: ["Python Basics", "Web Development"],
  currentInterests: ["Data Science", "Machine Learning"],
  browsingHistory: [skillIds],
  reviewedSkills: [skillIds],
  savedSkills: [skillIds],
  timeSpent: { [skillId]: minutes },
  userProfile: {
    goals: ["career change", "freelancing"],
    experience: "beginner",
    availability: "weekends"
  }
}
```

**Recommendation Output:**

```json
{
  "recommendations": [
    {
      "skillId": "12",
      "skillName": "Data Analytics with Python",
      "reason": "Perfect next step after Python Basics",
      "confidence": 0.92,
      "learningPath": ["Python Basics", "Data Analytics", "Machine Learning"]
    },
    {
      "skillId": "15",
      "skillName": "SQL for Data Science",
      "reason": "Complements your data science interests",
      "confidence": 0.87
    }
  ],
  "learningPaths": [
    {
      "pathName": "Become a Data Scientist",
      "skills": [1, 12, 15, 18, 22],
      "duration": "6 months",
      "level": "beginner to intermediate"
    }
  ]
}
```

---

### ✍️ **Feature 3: AI Course Description Generator**

**Purpose:** Help providers create compelling skill descriptions

**Location:**

- Provider dashboard: "Create New Skill" page
- Edit skill page with "Generate with AI" button

**Functionality:**

- Generate skill descriptions from basic input
- Create learning objectives
- Suggest course structure
- Optimize for searchability
- Multiple variations to choose from

**User Flow:**

1. Provider starts creating skill
2. Enters basic info (name, category, level)
3. Clicks "Generate Description with AI"
4. AI creates 3 variations
5. Provider selects and edits preferred version
6. Saves to skill listing

**Implementation File:** `src/Pages/Provider/CreateSkill.jsx`

**Backend Endpoint:** `POST /api/ai/generate-course`

**Input Example:**

```json
{
  "skillName": "Beginner Guitar Lessons",
  "category": "Music",
  "level": "beginner",
  "duration": "8 weeks",
  "keyTopics": ["basic chords", "strumming patterns", "song basics"],
  "targetAudience": "complete beginners"
}
```

**AI Output:**

```json
{
  "variations": [
    {
      "description": "Learn to play guitar from scratch in this comprehensive 8-week course. Master essential chords, strumming techniques, and play your first songs with confidence. Perfect for absolute beginners with no prior musical experience.",

      "longDescription": "Transform from a complete beginner to a confident guitar player in just 8 weeks! This hands-on course covers everything you need to start your musical journey...",

      "objectives": [
        "Play 10+ basic chords fluently",
        "Master 5 essential strumming patterns",
        "Perform 3 complete songs",
        "Read basic guitar tabs",
        "Develop proper finger positioning"
      ],

      "courseOutline": [
        {
          "week": 1,
          "title": "Getting Started & Basic Chords",
          "topics": ["Guitar anatomy", "Proper posture", "G, C, D chords"]
        },
        {
          "week": 2,
          "title": "Strumming Basics",
          "topics": ["Down strumming", "Timing", "Simple songs"]
        }
        // ... more weeks
      ],

      "prerequisites": "No prior experience needed! Just bring your guitar and enthusiasm.",

      "materials": [
        "Acoustic or electric guitar",
        "Guitar picks",
        "Tuner (app or device)",
        "Practice notebook"
      ]
    }
    // ... 2 more variations
  ]
}
```

---

### 📊 **Feature 4: AI Review Summarizer**

**Purpose:** Summarize multiple reviews into digestible insights

**Location:**

- Skill details page: "Review Summary" section
- Provider dashboard: "My Reviews Summary"

**Functionality:**

- Analyze all reviews for a skill
- Extract common themes
- Identify pros and cons
- Perform sentiment analysis
- Generate overall summary

**User Flow:**

1. User views skill with 50+ reviews
2. Sees "AI Summary" section at top
3. Reads condensed insights
4. Can expand to see full reviews
5. Better decision-making

**Implementation File:** `src/Components/ReviewSummary/ReviewSummary.jsx`

**Backend Endpoint:** `POST /api/ai/summarize-reviews`

**AI Output Example:**

```json
{
  "summary": "Students consistently praise the instructor's clear teaching style and patient approach. Most learners successfully played their first song within 3 weeks. A few noted that more advanced techniques could be covered.",

  "sentiment": {
    "overall": "positive",
    "score": 4.7,
    "distribution": {
      "positive": 87,
      "neutral": 10,
      "negative": 3
    }
  },

  "commonPros": [
    {
      "theme": "Teaching Quality",
      "mentions": 42,
      "examples": [
        "Very patient and explains clearly",
        "Breaks down complex concepts simply",
        "Great at addressing individual questions"
      ]
    },
    {
      "theme": "Progress Speed",
      "mentions": 38,
      "examples": [
        "Learned my first song in week 3!",
        "Made more progress than expected",
        "Fast but not overwhelming pace"
      ]
    }
  ],

  "commonCons": [
    {
      "theme": "Content Depth",
      "mentions": 8,
      "examples": [
        "Could cover more advanced techniques",
        "Wanted more theory lessons"
      ]
    }
  ],

  "keyInsights": [
    "94% of students achieved their learning goals",
    "Average practice time: 4 hours/week",
    "Most popular feature: step-by-step video guides",
    "98% would recommend to friends"
  ],

  "recommendedFor": [
    "Complete beginners with no music experience",
    "Adults wanting to learn a new hobby",
    "People who prefer structured learning"
  ],

  "notRecommendedFor": [
    "Those seeking advanced techniques",
    "Students wanting heavy music theory focus"
  ]
}
```

---

### 🔍 **Feature 5: Smart Search with NLP**

**Purpose:** Natural language search that understands intent

**Location:**

- Main search bar in navbar
- Dedicated `/search` page
- Advanced search filters

**Functionality:**

- Understand natural language queries
- Search beyond exact keywords
- Consider context and synonyms
- Provide relevant suggestions
- Learn from user behavior

**User Flow:**

1. User types natural language query
2. AI interprets search intent
3. Returns semantically relevant results
4. Offers query refinement suggestions
5. Learns from selection

**Implementation File:** `src/Components/SmartSearch/SmartSearch.jsx`

**Backend Endpoint:** `POST /api/ai/search`

**Example Queries & Results:**

**Query:** "I want to learn cooking for beginners on weekends"

```json
{
  "intent": {
    "skill": "cooking",
    "level": "beginner",
    "availability": "weekends"
  },
  "results": [
    {
      "skillId": "7",
      "skillName": "Cooking for Beginners",
      "relevanceScore": 0.95,
      "matchReasons": [
        "Exact match: cooking for beginners",
        "Available on weekends",
        "Highly rated for beginners"
      ]
    }
  ],
  "suggestions": [
    "Baking basics for beginners",
    "Meal prep fundamentals",
    "Quick dinner recipes"
  ],
  "didYouMean": null
}
```

**Query:** "how to make money online"

```json
{
  "intent": {
    "goal": "earn income",
    "method": "online",
    "category": ["freelancing", "digital marketing", "programming"]
  },
  "results": [
    {
      "skillId": "4",
      "skillName": "Digital Marketing Basics",
      "relevanceScore": 0.88,
      "matchReasons": [
        "Learn skills for online income",
        "High earning potential",
        "Freelancing opportunities mentioned"
      ]
    },
    {
      "skillId": "5",
      "skillName": "Introduction to Python",
      "relevanceScore": 0.82,
      "matchReasons": [
        "Programming skills in demand",
        "Remote work opportunities",
        "Freelance development path"
      ]
    }
  ],
  "suggestions": [
    "Freelancing essentials",
    "Social media marketing",
    "Web development",
    "E-commerce basics"
  ]
}
```

---

### 📅 **Feature 6: Smart Scheduling Assistant**

**Purpose:** AI-powered booking time suggestions

**Location:**

- Booking page: "Find Best Time" feature
- Reschedule modal

**Functionality:**

- Analyze provider availability
- Consider student's timezone
- Find optimal meeting times
- Suggest multiple options
- Handle conflicts intelligently

**User Flow:**

1. User wants to book a session
2. Clicks "Suggest Best Times"
3. AI analyzes both calendars
4. Shows 3-5 optimal time slots
5. User selects preferred time

**Implementation File:** `src/Pages/SkillDetails.jsx` (enhanced)

**Backend Endpoint:** `POST /api/ai/suggest-times`

**Input:**

```json
{
  "providerId": "abc123",
  "studentId": "xyz789",
  "skillId": "5",
  "preferences": {
    "preferredDays": ["monday", "wednesday", "friday"],
    "preferredTimes": "morning",
    "timezone": "America/New_York",
    "duration": 60
  },
  "dateRange": {
    "start": "2025-12-01",
    "end": "2025-12-15"
  }
}
```

**AI Output:**

```json
{
  "suggestedSlots": [
    {
      "date": "2025-12-02",
      "startTime": "09:00",
      "endTime": "10:00",
      "timezone": "America/New_York",
      "score": 0.95,
      "reasons": [
        "Matches your preferred morning time",
        "Monday is your preferred day",
        "Provider has high availability",
        "No conflicts in your calendar"
      ],
      "providerAvailability": "high",
      "alternativeTimes": ["10:00-11:00", "11:00-12:00"]
    },
    {
      "date": "2025-12-04",
      "startTime": "08:00",
      "endTime": "09:00",
      "score": 0.89,
      "reasons": [
        "Early morning slot (you're a morning person)",
        "Wednesday preference matched",
        "Provider's best teaching time"
      ]
    }
  ],
  "insights": {
    "bestDays": ["Monday", "Wednesday"],
    "bestTimes": "8:00 AM - 11:00 AM",
    "providerPeakPerformance": "Morning sessions",
    "tipToStudent": "Book morning sessions for better engagement"
  }
}
```

---

### 💬 **Feature 7: AI Message Smart Replies**

**Purpose:** Suggest quick, contextual message responses

**Location:**

- Chat interface between students and providers

**Functionality:**

- Analyze incoming message
- Generate 3 quick reply options
- Context-aware suggestions
- Professional tone
- Save typing time

**User Flow:**

1. User receives message
2. AI analyzes content
3. Shows 3 smart reply buttons
4. User clicks to send
5. Can edit before sending

**Implementation File:** `src/Components/Chat/MessageInput.jsx`

**Backend Endpoint:** `POST /api/ai/smart-replies`

**Example:**

**Incoming Message:** "Hi! Is this course suitable for someone with zero programming experience?"

**AI Smart Replies:**

```json
{
  "suggestions": [
    {
      "text": "Yes, absolutely! This course is designed specifically for complete beginners with no prior experience.",
      "tone": "enthusiastic",
      "type": "confirmation"
    },
    {
      "text": "Perfect timing! This is a beginner-friendly course. I'll guide you step by step from the very basics.",
      "tone": "welcoming",
      "type": "detailed"
    },
    {
      "text": "Great question! Yes, it's perfect for beginners. Would you like to know more about the curriculum?",
      "tone": "helpful",
      "type": "engaging"
    }
  ]
}
```

---

## OpenAI API Setup

### **Step 1: Get API Key**

1. Visit https://platform.openai.com/signup
2. Create account (free tier available)
3. Go to API Keys section
4. Create new secret key
5. Copy and store securely

**Free Tier:**

- $5 free credits for new accounts
- Good for ~2,500 requests (GPT-3.5)
- Expires after 3 months

### **Step 2: Install SDK**

```bash
# Backend
cd backend/functions
npm install openai

# Or use fetch API directly (no SDK needed)
```

### **Step 3: Configure Environment**

**backend/functions/.env:**

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

### **Step 4: Create AI Service**

**backend/functions/src/services/openai.service.js:**

```javascript
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  /**
   * Chat completion with GPT
   */
  async chat(messages, options = {}) {
    try {
      const response = await openai.chat.completions.create({
        model: options.model || process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return {
        success: true,
        message: response.choices[0].message.content,
        usage: response.usage,
        model: response.model,
      };
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Chatbot response
   */
  async getChatbotResponse(userMessage, conversationHistory = []) {
    const systemPrompt = `You are a helpful assistant for SkillSwap, a skill-sharing platform. 
    Help users with:
    - Understanding how the platform works
    - Finding and booking skills
    - Payment and refund policies
    - Account management
    - General platform questions
    
    Be friendly, concise, and helpful. If you don't know something, admit it and suggest contacting support.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];

    return await this.chat(messages, { max_tokens: 300 });
  }

  /**
   * Generate skill recommendations
   */
  async getRecommendations(userProfile, skills) {
    const prompt = `Based on this user profile:
    ${JSON.stringify(userProfile, null, 2)}
    
    And these available skills:
    ${JSON.stringify(skills, null, 2)}
    
    Recommend 5 skills with explanations. Return JSON format:
    {
      "recommendations": [
        {
          "skillId": "id",
          "reason": "why this skill",
          "confidence": 0.95
        }
      ]
    }`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 800,
      temperature: 0.5,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return { recommendations: [] };
      }
    }
    return { recommendations: [] };
  }

  /**
   * Generate course description
   */
  async generateCourseDescription(courseData) {
    const prompt = `Create a compelling course description for:
    
    Course Name: ${courseData.skillName}
    Category: ${courseData.category}
    Level: ${courseData.level}
    Duration: ${courseData.duration}
    Key Topics: ${courseData.keyTopics.join(", ")}
    Target Audience: ${courseData.targetAudience}
    
    Generate:
    1. Short description (2-3 sentences)
    2. Long description (1 paragraph)
    3. 5 learning objectives
    4. Course outline (week by week)
    5. Prerequisites
    6. Required materials
    
    Return in JSON format.`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 1500,
      temperature: 0.8,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Summarize reviews
   */
  async summarizeReviews(reviews) {
    const reviewTexts = reviews
      .map((r) => `Rating: ${r.rating}/5 - ${r.comment}`)
      .join("\n\n");

    const prompt = `Analyze these course reviews and provide:
    1. Overall summary (2-3 sentences)
    2. Sentiment analysis
    3. Common pros (top 3 themes with examples)
    4. Common cons (if any)
    5. Key insights
    6. Who should/shouldn't take this course
    
    Reviews:
    ${reviewTexts}
    
    Return in JSON format.`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 1200,
      temperature: 0.5,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Smart search with NLP
   */
  async smartSearch(query, availableSkills) {
    const prompt = `User search query: "${query}"
    
    Analyze the intent and match with these skills:
    ${JSON.stringify(
      availableSkills.map((s) => ({
        id: s.skillId,
        name: s.skillName,
        category: s.category,
        description: s.description,
      })),
      null,
      2
    )}
    
    Return JSON with:
    {
      "intent": { extracted intent },
      "matchedSkills": [skill IDs with relevance scores],
      "suggestions": [related search terms],
      "didYouMean": "corrected query if needed"
    }`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 800,
      temperature: 0.3,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Generate smart replies
   */
  async generateSmartReplies(incomingMessage, context = {}) {
    const prompt = `Generate 3 professional reply options for this message:
    
    Message: "${incomingMessage}"
    Context: ${JSON.stringify(context)}
    
    Create:
    1. Enthusiastic response
    2. Detailed response
    3. Engaging response (with follow-up question)
    
    Return JSON: { "suggestions": [{ "text": "...", "tone": "...", "type": "..." }] }`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 400,
      temperature: 0.8,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return { suggestions: [] };
      }
    }
    return { suggestions: [] };
  }

  /**
   * Suggest optimal booking times
   */
  async suggestBookingTimes(providerSchedule, studentPreferences) {
    const prompt = `Analyze and suggest best booking times:
    
    Provider availability: ${JSON.stringify(providerSchedule)}
    Student preferences: ${JSON.stringify(studentPreferences)}
    
    Suggest 3-5 optimal time slots with reasoning.
    Return JSON format.`;

    const response = await this.chat([{ role: "user", content: prompt }], {
      max_tokens: 1000,
      temperature: 0.5,
    });

    if (response.success) {
      try {
        return JSON.parse(response.message);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}

module.exports = new AIService();
```

### **Step 5: Create API Routes**

**backend/functions/src/routes/ai.js:**

```javascript
const express = require("express");
const router = express.Router();
const aiService = require("../services/openai.service");
const { verifyAuth } = require("../middleware/auth");

// Chatbot endpoint
router.post("/chatbot", verifyAuth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    const response = await aiService.getChatbotResponse(
      message,
      conversationHistory
    );

    // Log interaction for analytics
    await logAIInteraction(req.user.uid, "chatbot", response.usage);

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recommendations endpoint
router.post("/recommend", verifyAuth, async (req, res) => {
  try {
    const userProfile = await getUserProfile(req.user.uid);
    const skills = await getActiveSkills();

    const recommendations = await aiService.getRecommendations(
      userProfile,
      skills
    );

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate course description
router.post("/generate-course", verifyAuth, async (req, res) => {
  try {
    const courseData = req.body;

    const generated = await aiService.generateCourseDescription(courseData);

    res.json(generated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summarize reviews
router.post("/summarize-reviews", async (req, res) => {
  try {
    const { skillId } = req.body;
    const reviews = await getSkillReviews(skillId);

    const summary = await aiService.summarizeReviews(reviews);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smart search
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    const skills = await getActiveSkills();

    const results = await aiService.smartSearch(query, skills);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smart replies
router.post("/smart-replies", verifyAuth, async (req, res) => {
  try {
    const { message, context } = req.body;

    const replies = await aiService.generateSmartReplies(message, context);

    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suggest booking times
router.post("/suggest-times", verifyAuth, async (req, res) => {
  try {
    const { providerId, preferences } = req.body;

    const providerSchedule = await getProviderSchedule(providerId);
    const suggestions = await aiService.suggestBookingTimes(
      providerSchedule,
      preferences
    );

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Free Tier Optimization

### **Cost Reduction Strategies**

#### **1. Caching**

```javascript
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

async function getCachedAIResponse(cacheKey, aiFunction) {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const result = await aiFunction();
  cache.set(cacheKey, result);
  return result;
}

// Usage
const summary = await getCachedAIResponse(`review-summary-${skillId}`, () =>
  aiService.summarizeReviews(reviews)
);
```

#### **2. Rate Limiting**

```javascript
// Limit AI calls per user
const userAILimits = {
  free: 10, // 10 AI requests per day
  pro: 50, // 50 requests per day
  premium: 200, // 200 requests per day
};
```

#### **3. Response Streaming**

```javascript
// Stream responses for better UX
async function streamChatResponse(message) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    stream: true
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    // Send chunk to client
    yield content;
  }
}
```

#### **4. Batch Processing**

```javascript
// Batch multiple requests
async function batchGenerateDescriptions(courses) {
  const results = await Promise.all(
    courses.map((course) => aiService.generateCourseDescription(course))
  );
  return results;
}
```

#### **5. Fallback Responses**

```javascript
const fallbackResponses = {
  chatbot: "I'm experiencing high demand. Please contact support@skillswap.com",
  recommendations: [], // Return popular skills instead
};

async function aiWithFallback(aiFunction, fallback) {
  try {
    return await aiFunction();
  } catch (error) {
    if (error.code === "insufficient_quota") {
      return fallback;
    }
    throw error;
  }
}
```

---

## Alternative AI Solutions

### **Option 1: Hugging Face (Free)**

**Pros:**

- Completely free inference API
- Many pre-trained models
- No credit card required

**Setup:**

```javascript
const HfInference = require("@huggingface/inference");

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function generateText(prompt) {
  const response = await hf.textGeneration({
    model: "gpt2",
    inputs: prompt,
  });
  return response.generated_text;
}
```

### **Option 2: Google PaLM API**

**Pros:**

- Free tier available
- Good performance
- Multiple models

**Setup:**

```javascript
const { TextServiceClient } = require("@google-ai/generativelanguage");

const client = new TextServiceClient({
  apiKey: process.env.PALM_API_KEY,
});

async function generatePaLM(prompt) {
  const result = await client.generateText({
    model: "models/text-bison-001",
    prompt: { text: prompt },
  });
  return result.candidates[0].output;
}
```

### **Option 3: Anthropic Claude (Free Trial)**

**Pros:**

- Longer context window
- Good reasoning
- Free credits

**Setup:**

```javascript
const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chatClaude(message) {
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    messages: [{ role: "user", content: message }],
  });
  return response.content[0].text;
}
```

---

## Implementation Checklist

- [ ] Sign up for OpenAI API
- [ ] Install OpenAI SDK in backend
- [ ] Create AI service class
- [ ] Implement chatbot endpoint
- [ ] Build chatbot UI component
- [ ] Add recommendation engine
- [ ] Create course generator
- [ ] Implement review summarizer
- [ ] Build smart search
- [ ] Add smart replies to chat
- [ ] Implement caching strategy
- [ ] Set up rate limiting
- [ ] Add fallback responses
- [ ] Test all AI features
- [ ] Monitor usage and costs

---

**Next Document:** Proceed to `REALTIME_FEATURES.md` for chat and live updates implementation.
