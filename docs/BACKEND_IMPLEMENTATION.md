# Backend Implementation Guide

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 1 - Backend Infrastructure

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Implementation Steps](#implementation-steps)
7. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Current Architecture (Frontend Only)

```
Browser → React App → Static JSON Files → Firebase Auth
```

### New Architecture (Full Stack)

```
Browser → React App → REST API → Firebase Firestore → External Services
                                     ↓
                              Cloud Functions
                                     ↓
                         (Email, Payments, AI)
```

---

## Technology Stack

### Backend Framework Options

#### **Option 1: Firebase Cloud Functions (Recommended)**

**Pros:**

- Seamless Firebase integration
- Auto-scaling
- No server management
- Free tier available
- Already using Firebase

**Cons:**

- Vendor lock-in
- Cold start latency
- Limited customization

#### **Option 2: Node.js + Express**

**Pros:**

- Full control
- Better for complex logic
- Easier local development
- More flexible

**Cons:**

- Requires hosting (Vercel/Railway/Render)
- More setup needed

### **Recommended Approach: Hybrid**

- Firebase Cloud Functions for Firebase-specific operations
- Express API for complex business logic
- Deploy Express on Vercel/Railway (free tier)

---

## Project Structure

```
SkillSwap/
├── frontend/                    # Existing React app
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                     # New backend directory
│   ├── functions/              # Firebase Cloud Functions
│   │   ├── src/
│   │   │   ├── index.js       # Function entry point
│   │   │   ├── auth/          # Auth functions
│   │   │   ├── skills/        # Skill operations
│   │   │   ├── bookings/      # Booking logic
│   │   │   ├── payments/      # Payment processing
│   │   │   └── ai/            # AI features
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── api/                    # Express API (optional)
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── utils/
│   │   └── server.js
│   │
│   └── shared/                 # Shared utilities
│       ├── constants.js
│       ├── validation.js
│       └── types.js
│
└── docs/                       # Documentation
```

---

## Database Schema

### Firestore Collections Structure

#### **1. Users Collection** (`users`)

```javascript
users/{userId}
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  photoURL: string,
  role: "student" | "provider" | "admin",
  bio: string,
  phone: string,
  location: {
    city: string,
    country: string,
    coordinates: GeoPoint
  },
  skills: {                       // For providers
    offered: [skillId],
    teaching: [skillId]
  },
  learningHistory: {              // For students
    enrolled: [skillId],
    completed: [skillId],
    inProgress: [skillId]
  },
  stats: {
    totalBookings: number,
    totalEarnings: number,        // For providers
    totalSpent: number,           // For students
    averageRating: number,
    totalReviews: number
  },
  preferences: {
    notifications: boolean,
    emailUpdates: boolean,
    language: string,
    timezone: string
  },
  subscription: {
    plan: "free" | "pro" | "premium",
    status: "active" | "cancelled",
    expiresAt: timestamp
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp,
  isActive: boolean,
  isVerified: boolean
}
```

#### **2. Skills Collection** (`skills`)

```javascript
skills/{skillId}
{
  skillId: string,
  skillName: string,
  slug: string,                   // URL-friendly name
  providerId: string,             // Reference to user
  providerName: string,
  providerEmail: string,
  providerPhoto: string,
  category: string,
  subcategory: string,
  description: string,
  longDescription: string,        // Detailed content
  objectives: [string],           // Learning objectives
  prerequisites: [string],
  image: string,
  images: [string],               // Multiple images
  price: number,
  currency: "USD",
  pricing: {
    perSession: number,
    perHour: number,
    packageDeals: [{
      sessions: number,
      price: number,
      discount: number
    }]
  },
  duration: {
    perSession: number,           // In minutes
    totalSessions: number,
    flexibility: "fixed" | "flexible"
  },
  rating: number,
  totalRatings: number,
  reviewCount: number,
  slotsAvailable: number,
  availability: {
    schedule: [{
      day: string,                // "monday", "tuesday", etc.
      slots: [{
        startTime: string,        // "09:00"
        endTime: string,          // "10:00"
        available: boolean
      }]
    }],
    timezone: string
  },
  location: {
    type: "online" | "in-person" | "hybrid",
    address: string,
    city: string,
    country: string,
    meetingLink: string           // For online
  },
  level: "beginner" | "intermediate" | "advanced" | "all",
  language: [string],
  materials: [{
    name: string,
    type: "pdf" | "video" | "link",
    url: string
  }],
  tags: [string],
  isActive: boolean,
  isFeatured: boolean,
  totalBookings: number,
  totalRevenue: number,
  createdAt: timestamp,
  updatedAt: timestamp,
  publishedAt: timestamp,

  // AI-generated fields
  aiGeneratedDescription: boolean,
  aiSuggestions: [string],
  searchKeywords: [string]        // For search optimization
}
```

#### **3. Bookings Collection** (`bookings`)

```javascript
bookings/{bookingId}
{
  bookingId: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
  studentPhoto: string,
  providerId: string,
  providerName: string,
  providerEmail: string,
  skillId: string,
  skillName: string,
  skillImage: string,

  session: {
    date: timestamp,
    startTime: string,
    endTime: string,
    duration: number,             // In minutes
    timezone: string,
    meetingLink: string,
    meetingPassword: string
  },

  package: {
    type: "single" | "package",
    totalSessions: number,
    sessionsCompleted: number,
    sessionsRemaining: number
  },

  pricing: {
    basePrice: number,
    discount: number,
    tax: number,
    totalAmount: number,
    currency: "USD"
  },

  payment: {
    paymentId: string,            // Stripe payment ID
    method: "card" | "paypal",
    status: "pending" | "completed" | "failed" | "refunded",
    paidAt: timestamp,
    refundedAt: timestamp,
    refundReason: string
  },

  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show",

  communication: {
    studentMessage: string,
    providerResponse: string,
    internalNotes: string
  },

  completion: {
    completedAt: timestamp,
    attendanceMarked: boolean,
    certificateIssued: boolean,
    certificateUrl: string
  },

  review: {
    isReviewed: boolean,
    reviewId: string,
    rating: number
  },

  notifications: {
    confirmationSent: boolean,
    reminderSent: boolean,
    followUpSent: boolean
  },

  createdAt: timestamp,
  updatedAt: timestamp,
  cancelledAt: timestamp,
  cancellationReason: string,
  cancelledBy: "student" | "provider" | "admin"
}
```

#### **4. Reviews Collection** (`reviews`)

```javascript
reviews/{reviewId}
{
  reviewId: string,
  skillId: string,
  skillName: string,
  providerId: string,
  providerName: string,
  studentId: string,
  studentName: string,
  studentPhoto: string,
  bookingId: string,

  rating: number,                 // 1-5
  ratings: {
    overall: number,
    communication: number,
    knowledge: number,
    punctuality: number,
    value: number
  },

  title: string,
  comment: string,
  pros: [string],
  cons: [string],

  helpful: {
    count: number,
    userIds: [string]              // Users who marked helpful
  },

  response: {
    providerId: string,
    providerName: string,
    comment: string,
    respondedAt: timestamp
  },

  // AI features
  aiSentiment: "positive" | "neutral" | "negative",
  aiSummary: string,
  aiKeywords: [string],

  isVerified: boolean,            // Verified booking
  isReported: boolean,
  reportReason: string,

  createdAt: timestamp,
  updatedAt: timestamp,
  publishedAt: timestamp,
  isPublished: boolean
}
```

#### **5. Messages Collection** (`messages`)

```javascript
messages/{conversationId}/messages/{messageId}
{
  messageId: string,
  conversationId: string,
  senderId: string,
  senderName: string,
  senderPhoto: string,
  receiverId: string,
  receiverName: string,

  content: string,
  type: "text" | "image" | "file" | "system",

  attachments: [{
    type: string,
    url: string,
    name: string,
    size: number
  }],

  // AI features
  aiSuggestion: string,           // Smart reply suggestion
  aiTranslation: string,          // Auto-translated

  status: "sent" | "delivered" | "read",
  readAt: timestamp,

  createdAt: timestamp,
  updatedAt: timestamp,
  deletedBy: [string],            // User IDs who deleted
  isEdited: boolean,
  editedAt: timestamp
}
```

#### **6. Conversations Collection** (`conversations`)

```javascript
conversations/{conversationId}
{
  conversationId: string,
  participants: [{
    userId: string,
    name: string,
    photo: string,
    role: string
  }],

  relatedTo: {
    type: "booking" | "skill" | "general",
    id: string,
    name: string
  },

  lastMessage: {
    content: string,
    senderId: string,
    senderName: string,
    timestamp: timestamp
  },

  unreadCount: {
    [userId]: number
  },

  status: "active" | "archived" | "blocked",

  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **7. Notifications Collection** (`notifications`)

```javascript
notifications/{notificationId}
{
  notificationId: string,
  userId: string,                 // Recipient
  type: "booking" | "message" | "review" | "payment" | "system",

  title: string,
  message: string,
  icon: string,

  data: {
    bookingId: string,
    skillId: string,
    reviewId: string,
    // Context-specific data
  },

  action: {
    type: "navigate" | "external",
    url: string,
    label: string
  },

  isRead: boolean,
  readAt: timestamp,

  priority: "low" | "medium" | "high" | "urgent",

  channel: {
    push: boolean,
    email: boolean,
    sms: boolean,
    inApp: boolean
  },

  createdAt: timestamp,
  expiresAt: timestamp
}
```

#### **8. AI Interactions Collection** (`ai_interactions`)

```javascript
ai_interactions/{interactionId}
{
  interactionId: string,
  userId: string,
  type: "chatbot" | "recommendation" | "generator" | "search",

  input: {
    query: string,
    context: object,
    language: string
  },

  output: {
    response: string,
    suggestions: [string],
    confidence: number
  },

  model: string,                  // "gpt-3.5-turbo", "gpt-4", etc.
  tokens: {
    prompt: number,
    completion: number,
    total: number
  },

  cost: number,                   // In USD
  latency: number,                // In ms

  feedback: {
    helpful: boolean,
    rating: number,
    comment: string
  },

  createdAt: timestamp
}
```

#### **9. Analytics Collection** (`analytics`)

```javascript
analytics/{date}/events/{eventId}
{
  eventId: string,
  userId: string,
  sessionId: string,

  event: {
    type: "page_view" | "click" | "booking" | "search" | "signup",
    name: string,
    category: string
  },

  page: {
    url: string,
    title: string,
    referrer: string
  },

  user: {
    role: string,
    location: string,
    device: string,
    browser: string
  },

  metadata: object,               // Event-specific data

  timestamp: timestamp
}
```

---

## API Endpoints

### **Authentication Endpoints**

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh-token     - Refresh JWT token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/verify-email      - Verify email address
POST   /api/auth/google            - Google OAuth
```

### **User Endpoints**

```
GET    /api/users/me               - Get current user
PUT    /api/users/me               - Update current user
DELETE /api/users/me               - Delete account
GET    /api/users/:id              - Get user by ID
PUT    /api/users/:id/role         - Update user role (admin)
GET    /api/users/:id/stats        - Get user statistics
POST   /api/users/:id/verify       - Verify user (admin)
```

### **Skills Endpoints**

```
GET    /api/skills                 - Get all skills (paginated, filtered)
GET    /api/skills/:id             - Get skill by ID
POST   /api/skills                 - Create new skill (provider)
PUT    /api/skills/:id             - Update skill (provider)
DELETE /api/skills/:id             - Delete skill (provider)
GET    /api/skills/search          - Search skills (with AI)
GET    /api/skills/featured        - Get featured skills
GET    /api/skills/category/:cat   - Get skills by category
GET    /api/skills/provider/:id    - Get provider's skills
POST   /api/skills/:id/generate    - AI generate description
```

### **Booking Endpoints**

```
GET    /api/bookings               - Get user's bookings
GET    /api/bookings/:id           - Get booking by ID
POST   /api/bookings               - Create new booking
PUT    /api/bookings/:id           - Update booking
DELETE /api/bookings/:id           - Cancel booking
POST   /api/bookings/:id/confirm   - Confirm booking (provider)
POST   /api/bookings/:id/complete  - Mark as completed
GET    /api/bookings/:id/receipt   - Generate receipt
POST   /api/bookings/:id/reschedule - Reschedule booking
```

### **Review Endpoints**

```
GET    /api/reviews                - Get reviews (filtered)
GET    /api/reviews/:id            - Get review by ID
POST   /api/reviews                - Create review
PUT    /api/reviews/:id            - Update review
DELETE /api/reviews/:id            - Delete review
POST   /api/reviews/:id/helpful    - Mark review helpful
POST   /api/reviews/:id/respond    - Provider response
GET    /api/reviews/skill/:id      - Get skill reviews
GET    /api/reviews/summary/:id    - AI review summary
```

### **Payment Endpoints**

```
POST   /api/payments/create-intent - Create payment intent (Stripe)
POST   /api/payments/confirm       - Confirm payment
GET    /api/payments/:id           - Get payment details
POST   /api/payments/:id/refund    - Request refund
GET    /api/payments/history       - Payment history
POST   /api/payments/webhook       - Stripe webhook
```

### **Message Endpoints**

```
GET    /api/messages/conversations - Get user's conversations
GET    /api/messages/:convId       - Get conversation messages
POST   /api/messages/:convId       - Send message
PUT    /api/messages/:id           - Update message
DELETE /api/messages/:id           - Delete message
POST   /api/messages/:id/read      - Mark as read
POST   /api/messages/ai-suggest    - Get AI reply suggestions
```

### **Notification Endpoints**

```
GET    /api/notifications          - Get user notifications
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id      - Delete notification
PUT    /api/notifications/settings - Update notification preferences
```

### **AI Endpoints**

```
POST   /api/ai/chatbot             - Chat with AI assistant
POST   /api/ai/recommend           - Get AI recommendations
POST   /api/ai/generate-course     - Generate course outline
POST   /api/ai/summarize-reviews   - Summarize reviews
POST   /api/ai/search              - AI-powered search
POST   /api/ai/suggest-times       - Smart scheduling
POST   /api/ai/translate           - Translate text
```

### **Admin Endpoints**

```
GET    /api/admin/stats            - Platform statistics
GET    /api/admin/users            - Get all users
GET    /api/admin/skills           - Get all skills
GET    /api/admin/bookings         - Get all bookings
GET    /api/admin/reports          - Get reports
POST   /api/admin/users/:id/ban    - Ban user
POST   /api/admin/skills/:id/verify - Verify skill
POST   /api/admin/reviews/:id/moderate - Moderate review
GET    /api/admin/analytics        - Analytics dashboard
```

---

## Implementation Steps

### **Step 1: Set Up Firebase Firestore**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore
firebase init firestore
```

**firestore.rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isOwner(userId) || isAdmin();
    }

    // Skills collection
    match /skills/{skillId} {
      allow read: if true; // Public
      allow create: if isSignedIn();
      allow update: if isSignedIn() &&
                    (resource.data.providerId == request.auth.uid || isAdmin());
      allow delete: if isSignedIn() &&
                    (resource.data.providerId == request.auth.uid || isAdmin());
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isSignedIn() &&
                  (resource.data.studentId == request.auth.uid ||
                   resource.data.providerId == request.auth.uid ||
                   isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() &&
                    (resource.data.studentId == request.auth.uid ||
                     resource.data.providerId == request.auth.uid ||
                     isAdmin());
      allow delete: if isAdmin();
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public
      allow create: if isSignedIn();
      allow update: if isOwner(resource.data.studentId) || isAdmin();
      allow delete: if isOwner(resource.data.studentId) || isAdmin();
    }

    // Messages collection
    match /conversations/{convId} {
      allow read, write: if isSignedIn() &&
                         request.auth.uid in resource.data.participants;

      match /messages/{messageId} {
        allow read, write: if isSignedIn();
      }
    }

    // Notifications collection
    match /notifications/{notifId} {
      allow read, delete: if isOwner(resource.data.userId);
      allow update: if isOwner(resource.data.userId);
      allow create: if isSignedIn() || isAdmin();
    }
  }
}
```

### **Step 2: Create Backend Directory Structure**

```bash
# Create backend folder
mkdir -p backend/functions
cd backend/functions

# Initialize Firebase Functions
firebase init functions

# Install dependencies
npm install express cors dotenv stripe openai @google-cloud/firestore
npm install --save-dev nodemon
```

### **Step 3: Create Express Server**

**backend/functions/src/index.js:**

```javascript
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const skillRoutes = require("./routes/skills");
const bookingRoutes = require("./routes/bookings");
const reviewRoutes = require("./routes/reviews");
const paymentRoutes = require("./routes/payments");
const messageRoutes = require("./routes/messages");
const aiRoutes = require("./routes/ai");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(app);

// Export other Cloud Functions
exports.onBookingCreated = require("./triggers/onBookingCreated");
exports.onReviewCreated = require("./triggers/onReviewCreated");
exports.dailyNotifications = require("./scheduled/dailyNotifications");
```

### **Step 4: Create Migration Script**

**backend/functions/src/migrate.js:**

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateSkillsFromJSON() {
  const skills = require("../../../public/skills.json");

  const batch = db.batch();

  skills.forEach((skill) => {
    const docRef = db.collection("skills").doc();
    batch.set(docRef, {
      ...skill,
      skillId: skill.skillId.toString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      totalBookings: 0,
      totalRevenue: 0,
      reviewCount: 0,
      totalRatings: 0,
    });
  });

  await batch.commit();
  console.log("Skills migrated successfully!");
}

async function migrateProvidersFromJSON() {
  const providers = require("../../../public/providers.json");

  // Create user accounts for providers
  for (const provider of providers) {
    const email = `${provider.name
      .toLowerCase()
      .replace(/\s+/g, ".")}@skillswap.com`;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        displayName: provider.name,
        photoURL: provider.image,
      });

      await db
        .collection("users")
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          email,
          displayName: provider.name,
          photoURL: provider.image,
          role: "provider",
          stats: {
            averageRating: provider.rating,
            totalReviews: provider.reviews,
          },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isActive: true,
          isVerified: true,
        });

      console.log(`Provider ${provider.name} created`);
    } catch (error) {
      console.error(`Error creating provider ${provider.name}:`, error);
    }
  }
}

// Run migrations
(async () => {
  await migrateSkillsFromJSON();
  await migrateProvidersFromJSON();
  console.log("All migrations complete!");
  process.exit(0);
})();
```

### **Step 5: Deploy Backend**

```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:api
```

### **Step 6: Update Frontend to Use API**

**src/services/api.js:**

```javascript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://us-central1-skillswap-d2870.cloudfunctions.net/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Security Considerations

### **1. API Authentication**

- Use Firebase Auth tokens for all requests
- Verify tokens on backend using `admin.auth().verifyIdToken()`
- Implement rate limiting
- Use CORS properly

### **2. Data Validation**

- Validate all inputs on backend
- Use Zod or Joi for schema validation
- Sanitize user inputs
- Prevent SQL/NoSQL injection

### **3. Environment Variables**

```env
STRIPE_SECRET_KEY=sk_test_...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
FIREBASE_SERVICE_ACCOUNT=...
```

### **4. Payment Security**

- Never store card details
- Use Stripe Elements for PCI compliance
- Verify webhook signatures
- Implement idempotency keys

### **5. Rate Limiting**

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## Next Steps

1. ✅ Review this backend implementation plan
2. 🔄 Set up Firebase Firestore database
3. 🔄 Create Firebase Functions project
4. 🔄 Implement API endpoints
5. 🔄 Create migration scripts
6. 🔄 Deploy to Firebase
7. 🔄 Update frontend to use new API

**Next Document:** Proceed to `AI_FEATURES_INTEGRATION.md` for AI implementation details.
