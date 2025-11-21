# SkillSwap Upgrade Blueprint

_Last updated: 21 Nov 2025_

## Executive Overview
- **Goal:** evolve SkillSwap from a static catalog into a production-ready learning marketplace with real bookings, collaboration workflows, monetisation, analytics, and AI-driven experiences.
- **Approach:** phased rollout that first establishes persistent data and secure backend services, then layers on feature verticals (sessions, messaging, reviews, payments, dashboards) and culminates with AI assistants and operational tooling.
- **Key Pillars:** Firestore-backed data model, Firebase Cloud Functions API layer, modular React routes, GPT-powered automation, Stripe/Twilio integrations, automated DevOps.

---

## Architecture Snapshot
- **Frontend:** Vite + React Router + Tailwind/DaisyUI; new feature modules live under `src/Pages` and `src/Components` with shared hooks in `src/hooks` (to be created).
- **State/Data:** React Query (server state) + Zustand (client UI state) around Firestore/Function APIs; deprecate direct `fetch` usage in existing pages.
- **Backend:** Firebase Authentication (custom claims for roles), Firestore (NoSQL document store), Firebase Storage (media), Firebase Cloud Functions (REST endpoints, webhooks, scheduled jobs), Cloud Scheduler.
- **Integrations:** Stripe (payments), Twilio SendGrid (email), Twilio Conversations (SMS/WhatsApp optional), Calendar (Google/Outlook via OAuth), OpenRouter/OpenAI free-tier GPT models.
- **DevOps:** GitHub Actions pipelines (lint, test, deploy), Firebase Hosting multi-environment.

---

## Phase Roadmap

### Phase 1 — Data & Auth Foundation
**Objectives:** migrate static data, establish schemas, enrich auth state, prepare clients.
- **Features:**
  - Firestore collections (`skills`, `providers`, `users`, `categories`).
  - Admin seed script (Cloud Function or one-off node script under `tools/seed`).
  - Auth roles (`learner`, `tutor`, `admin`) via custom claims; update `AuthProvider.jsx` to surface `role`, `isVerified`.
  - Global API client: create `src/lib/firebaseClient.js` and `src/hooks/useFirestoreQuery.js` using React Query.
- **Routes/Components touched:**
  - `src/Pages/Home.jsx`, `Service.jsx`, `TopRatedTutors.jsx` -> swap `fetch("/skills.json")`/`fetch("/providers.json")` with React Query hooks.
  - Create `src/hooks/useSkills.js`, `src/hooks/useProviders.js`.
- **Dependencies:**
  - `@tanstack/react-query`, `firebase-admin` (for functions), `zod` (schema validation).
- **Best Practices:** use Firestore security rules to restrict write access to admins/tutors; add TypeScript definitions (optional) or `zod` validators.

### Phase 2 — Session Booking Engine
**Objectives:** enable learners to browse availability, request and manage sessions.
- **Features:**
  - New collection `sessions` with fields (`skillId`, `tutorId`, `learnerId`, `schedule`, `status`, `price`, `notes`).
  - Tutor availability sub-collection or `availability` documents.
  - Session workflow Cloud Functions (`/sessions/create`, `/sessions/updateStatus`, `/sessions/cancel`).
  - Add scheduling UI with calendar picker.
- **Routes/Components:**
  - Update `SkillDetails.jsx` booking form to call `createSession` function instead of mock toast.
  - Add `src/Pages/Dashboard/Learner/Sessions.jsx` and `src/Pages/Dashboard/Tutor/Sessions.jsx` for agenda view.
  - Add `src/Components/Calendar/AvailabilityPicker.jsx` (use `react-big-calendar` or `@fullcalendar/react`).
- **Dependencies:** `@fullcalendar/react`, `date-fns`, `firebase-functions` callable endpoints.
- **Implementation Notes:** store timestamps in UTC ISO strings; apply optimistic UI via React Query mutation.

### Phase 3 — Messaging & Collaboration
**Objectives:** allow tutors and learners to communicate before/after sessions.
- **Features:**
  - `conversations` collection with `participants`, `lastMessage`, `updatedAt`; `messages` sub-collection.
  - In-app chat UI with real-time updates (Firestore listeners or WebSocket via Cloud Functions + Socket.io if Firestore cost is high).
  - Optional Twilio Conversations integration for SMS fallback.
- **Routes/Components:**
  - Add `src/Pages/Dashboard/Messages.jsx` with nested route for conversation details.
  - Create `src/Components/Chat/ConversationList.jsx`, `ChatWindow.jsx`, `MessageComposer.jsx`.
  - Add quick access button on `SkillDetails.jsx` to "Message Tutor".
- **Dependencies:** `zustand` for chat UI state, `react-virtuoso` for message list virtualization, optional `socket.io-client` (already installed).
- **Best Practices:** enforce membership checks in Firestore rules; implement read receipts; sanitize message content.

### Phase 4 — Payments & Monetisation
**Objectives:** support paid sessions, refunds, and tutor payouts.
- **Features:**
  - Stripe integration (Checkout for booking, Connect for tutor payouts).
  - `payments` collection storing session payment status, Stripe IDs.
  - Cloud Function webhooks for `checkout.session.completed`, `payment_intent.succeeded`, etc.
  - Pricing controls in `src/Pages/Dashboard/Tutor/Pricing.jsx`.
  - Invoice receipts via SendGrid.
- **Routes/Components:**
  - Update booking flow to redirect to Stripe Checkout when session created.
  - Add `src/Pages/Dashboard/Learner/Billing.jsx` and `src/Pages/Dashboard/Tutor/Earnings.jsx`.
  - Extend NavBar avatar dropdown with "Billing" & "Earnings" links depending on role.
- **Dependencies:** `stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `@sendgrid/mail` (functions).
- **Security:** use Firebase Functions to create Checkout sessions; never expose secret keys on client; store Stripe publishable key in `.env`.

### Phase 5 — Reviews & Reputation
**Objectives:** capture feedback, display ratings, and moderate content.
- **Features:**
  - `reviews` collection (sessionId, tutorId, learnerId, rating, comment, status, flaggedReason).
  - Tutor public profile enhancements: testimonials, average rating, badges.
  - Review moderation pipeline (AI-assisted + manual).
- **Routes/Components:**
  - Extend `SkillDetails.jsx` with tabbed interface: Overview, Reviews, FAQs.
  - Add `src/Components/Reviews/ReviewList.jsx`, `ReviewForm.jsx`, `ReviewSummary.jsx`.
  - Dashboard page `src/Pages/Dashboard/Tutor/Reviews.jsx` for responding to feedback.
- **Dependencies:** integrate AI moderation API (OpenAI `omni-moderation-latest` or open-source) and GPT for summarisation (see AI section).
- **Best Practices:** only allow review after session completion; display verification badges.

### Phase 6 — Dashboards & Analytics
**Objectives:** provide actionable insights for learners, tutors, admins.
- **Features:**
  - Dashboard layout under new route `/dashboard` with guard (PrivateRoute HOC).
  - Learner dashboard: upcoming sessions, recommended skills, recent messages, billing summary.
  - Tutor dashboard: revenue chart, session heatmap, top reviews, conversion funnel.
  - Admin dashboard: platform metrics, flagged content queue, user management.
- **Routes/Components:**
  - `src/Pages/Dashboard/Layout.jsx` (shell), nested routes for each persona (`/dashboard/learner`, `/dashboard/tutor`, `/dashboard/admin`).
  - Shared components `src/Components/Charts/AreaChart.jsx`, `BarChart.jsx` using `recharts`.
- **Dependencies:** `recharts`, `@tanstack/react-query-devtools`, `firebase-analytics` (optional), `swr` alternative if preferred.
- **Implementation Notes:** use Firestore aggregate queries or scheduled exports to BigQuery for heavy analytics.

### Phase 7 — AI Enhancements
**Objectives:** differentiate the platform with intelligent assistants and automation.
- **Features:**
  1. **Smart Skill Match (Discovery page):** integrate GPT embeddings or free-tier model to match learners with tutors based on goals. Build `src/hooks/useSkillMatch.js` interfacing with Cloud Function that generates embeddings using OpenAI `text-embedding-3-large` (or open-source like `InstructorXL` via OpenRouter). Display results on new `/discover` route.
  2. **Onboarding Copilot:** add conversational widget on register/profile pages (`src/Pages/Register.jsx`, `MyProfile.jsx`) guiding users through profile completion using GPT-4o-mini (free tier). UI component `src/Components/Assistants/OnboardingBot.jsx`.
  3. **Lesson Plan Generator:** in tutor dashboard, allow tutors to auto-generate session plans based on learner profile and skill using GPT. Store generated plans in `lessonPlans` sub-collection.
  4. **Review Moderation & Summaries:** Cloud Function triggered on review write to run moderation model; produce condensed testimonials displayed on skill pages.
  5. **Knowledge-base Chatbot:** Admin-curated docs stored in Firestore; build RAG pipeline (Vector DB optional; start with embeddings + metadata filter) to power support chat on `/help` route.
- **Dependencies:** `openai` or OpenRouter SDK, `langchain` (for orchestration), `@pinecone-database/pinecone` or Firestore hybrid vector store if budget allows.
- **Guardrails:** log AI requests, handle rate limits, include fallback copy, expose opt-out for users.

### Phase 8 — Operational Excellence
**Objectives:** ensure maintainability, scalability, and reliability.
- **Features:**
  - GitHub Actions workflow (`.github/workflows/ci.yml`) running lint (`npm run lint`), tests, and deploy preview.
  - Testing stack: Vitest + React Testing Library + Cypress for e2e.
  - Error monitoring (Sentry) & performance tracking (Firebase Performance).
  - Feature flag system (LaunchDarkly or simple Firestore-driven toggles) for gradual rollouts.
  - Documentation portal under `docs/` with architecture decision records (ADRs).

---

## Data Model & API Contracts

### Firestore Collections (initial)
| Collection | Fields (core) | Notes |
|------------|----------------|-------|
| `users` | `displayName`, `email`, `role`, `photoURL`, `bio`, `skillsOffered`, `hourlyRate`, `availability`, `preferences`, `verificationStatus`, `createdAt` | Augment current Firebase user records; sync via onCreate trigger.
| `skills` | `title`, `description`, `categoryId`, `level`, `price`, `tags`, `media`, `tutorId`, `ratingSummary`, `isFeatured`, `createdAt` | Replace `skills.json`; maintain denormalised stats for fast reads.
| `categories` | `name`, `icon`, `priority` | Drives filters.
| `sessions` | `skillId`, `tutorId`, `learnerId`, `schedule`, `status`, `price`, `meetingLink`, `notes`, `paymentStatus`, `cancellationReason`, `createdAt` | Index on `tutorId`, `learnerId`, `schedule`.
| `availability` | `tutorId`, `slots[]` | Could be sub-collection under users.
| `messages` | `conversationId`, `senderId`, `text`, `attachments`, `sentAt`, `readBy` | Use batched writes for read receipts.
| `conversations` | `participants[]`, `lastMessage`, `updatedAt` | Denormalised for list view.
| `reviews` | `sessionId`, `tutorId`, `learnerId`, `rating`, `comment`, `status`, `summary`, `flags[]`, `createdAt` | `status` enum (pending, published, rejected).
| `payments` | `sessionId`, `stripePaymentIntentId`, `amount`, `currency`, `status`, `receipts[]`, `createdAt` | Minimal PII; rely on Stripe for sensitive info.
| `lessonPlans` | `sessionId`, `tutorId`, `learnerId`, `prompt`, `content`, `model`, `createdAt` | Generated via GPT.
| `aiLogs` | `requestType`, `userId`, `payloadSummary`, `cost`, `timestamp` | For auditing AI usage.

### Cloud Function Endpoints (REST/Callable)
- `POST /api/sessions` — create session (validates availability, price, auth).
- `PATCH /api/sessions/:id/status` — update (accept, decline, cancel, complete).
- `GET /api/sessions?role=tutor` — list upcoming sessions for dashboard.
- `POST /api/payments/create-checkout-session` — returns Stripe session ID.
- `POST /api/payments/webhook` — Stripe webhook handler.
- `POST /api/messages/:conversationId` — append message, send notifications.
- `POST /api/reviews` — submit review (checks session completion).
- `POST /api/ai/match` — runs skill matching prompt + embeddings.
- `POST /api/ai/lesson-plan` — generate plan for a session.
- `POST /api/ai/moderate-review` — evaluate review text.
- `GET /api/admin/stats` — aggregate metrics for dashboard.

_All endpoints secured via Firebase Auth ID token in headers; use `express` app within Cloud Functions for routing._

---

## Route & Component Map

| Route | Purpose | Components to Create/Update | Notes |
|-------|---------|------------------------------|-------|
| `/` | Enhanced home with dynamic data | Update `Home.jsx`, `Header.jsx`, `Service.jsx`, `TopRatedTutors.jsx`, `OverallRatings.jsx` | Use React Query hooks; integrate testimonials & AI match CTA.
| `/discover` | Skill discovery with filters + AI recommendations | New `src/Pages/Discover.jsx`, `src/Components/Filters/FilterPanel.jsx`, `src/Components/Skill/SkillCard.jsx` | Link from navbar and hero.
| `/skill/:id` | Rich skill page with tabs (Overview, Reviews, Availability) | Update `SkillDetails.jsx`, add `src/Components/Skill/Tabs.jsx`, `AvailabilityCalendar.jsx`, `ReviewList.jsx` | Integrate booking + messaging buttons.
| `/auth/login`, `/auth/register` | Extend onboarding flow with AI copilot | Update existing pages with `<OnboardingBot />` | Add knowledge base link.
| `/dashboard` | Shell with nested routes | New `Dashboard/Layout.jsx`, `Sidebar.jsx`, `Header.jsx` | Guard with private route and role-based redirects.
| `/dashboard/learner` | Overview page | `Dashboard/Learner/Home.jsx`, `SessionList.jsx`, `RecommendedSkills.jsx` | Hook into sessions & AI match.
| `/dashboard/learner/billing` | Payment history | `Dashboard/Learner/Billing.jsx` | Stripe customer portal integration.
| `/dashboard/tutor` | Tutor KPIs | `Dashboard/Tutor/Home.jsx`, `RevenueChart.jsx`, `UpcomingSessions.jsx` | Provide quick actions.
| `/dashboard/tutor/availability` | Manage slots | `AvailabilityEditor.jsx` | Write to `availability` collection.
| `/dashboard/tutor/lesson-plans` | AI plan generator view | `LessonPlanGenerator.jsx`, `PlanHistory.jsx` | Use AI endpoint.
| `/dashboard/messages` | messaging hub | `Messages.jsx`, `ConversationPane.jsx`, `MessageComposer.jsx` | Real-time updates with Firestore listener.
| `/dashboard/admin` | Admin panel | `Admin/Home.jsx`, `UserTable.jsx`, `FlaggedContent.jsx` | Restrict to admin role.
| `/help` | Support center + chatbot | `HelpCenter.jsx`, `FAQAccordion.jsx`, `SupportBot.jsx` | Chatbot integrated via AI API.

---

## AI Integration Blueprint

| Use Case | Location | Data Inputs | Model/API | Output Handling |
|----------|----------|-------------|-----------|-----------------|
| Skill Matching | `/discover`, learner dashboard | User goals, preferred schedule, skill levels, tutor metadata | OpenRouter (GPT-4o-mini) + Firestore metadata similarity | Render ranked list with explanations, cache results per query.
| Onboarding Copilot | Register/Profile pages | Form fields, user role | GPT-4o-mini (chat completions) | Suggest profile improvements, prompt to complete missing fields.
| Lesson Plan Generator | Tutor dashboard | Skill details, learner profile, session objectives | GPT-4.1 or 4o-mini with structured prompts | Store plan JSON + text; allow manual edits.
| Review Moderation | Cloud Function trigger | Review text | OpenAI moderation endpoint (omni-moderation-latest) | Auto-flag or auto-approve; log decisions.
| Review Summaries | Skill details page | Approved reviews | GPT-4o-mini summarise + highlight quotes | Cache summary, update when new reviews arrive.
| Support Chatbot | `/help` | FAQ content, docs stored in Firestore | RAG workflow (LangChain + embeddings) | Provide answers with citations; escalate to human when uncertain.

**Cost Control:**
- Maintain `aiLogs` with total tokens; set daily quotas per user.
- Implement exponential backoff + fallback responses if quota exceeded.
- Offer opt-out toggle in profile settings; respect privacy constraints.

---

## Dependencies & Tooling Additions
- **Frontend:** `@tanstack/react-query`, `zustand`, `react-big-calendar`, `react-hook-form` (already), `zod`, `recharts`, `swr` (optional), `openai`/`openrouter`, `langchain`, `@fullcalendar/react`, `react-virtuoso`, `@stripe/react-stripe-js`, `@stripe/stripe-js`.
- **Backend (Functions):** `firebase-admin`, `firebase-functions`, `express`, `cors`, `stripe`, `@sendgrid/mail`, `openai`, `langchain`, `nodemailer`, `googleapis` (for Calendar integration), `axios`.
- **DevOps:** `vitest`, `@testing-library/react`, `cypress`, `husky`, `lint-staged`, `eslint-plugin-testing-library`.

_Add these via npm scripts; ensure TypeScript consideration if migrating._

---

## Security, Compliance & Privacy
- Enforce HTTPS via Firebase Hosting.
- Firestore security rules:
  - Learners can read public skills, create sessions tied to their UID, read own sessions, reviews.
  - Tutors can read sessions where `tutorId == uid`, update availability.
  - Admins (custom claim) can read/write all.
- Store minimal PII; rely on Stripe for payments. Do not store full card data.
- GDPR/Data deletion: create endpoint for `Right to be Forgotten` (delete user data on request).
- Logging & Monitoring: integrate Sentry for error tracking, Firebase Performance for app metrics.
- AI usage transparency: display disclaimers, allow toggling AI features, log prompts/responses securely.

---

## Development Workflow & Milestones
1. **Foundation Sprint (2 weeks)**
   - Firestore migration, auth roles, React Query integration, documentation updates.
2. **Sessions Sprint (2–3 weeks)**
   - Booking flow, availability UI, session dashboards.
3. **Messaging Sprint (2 weeks)**
   - Conversations, push notifications, message moderation.
4. **Payments Sprint (2–3 weeks)**
   - Stripe integration, billing pages, webhook automation.
5. **Reputation Sprint (1–2 weeks)**
   - Reviews, moderation, summaries.
6. **Dashboards Sprint (2–3 weeks)**
   - Learner/tutor/admin dashboards, analytics.
7. **AI Sprint (ongoing iterations)**
   - Roll out AI features sequentially, starting with matching and onboarding copilot.
8. **Ops & QA Sprint (continuous)**
   - CI/CD, automated tests, load testing, documentation.

_Adapt timeline to team size; overlap AI work with feature sprints once requisite data present._

---

## Outstanding Questions & Decisions Needed
- Choose primary vector storage approach for AI (Firestore + embeddings vs. dedicated vector DB).
- Finalise payment jurisdictions/tax handling requirements.
- Determine whether video conferencing should be built-in (e.g., Daily.co) or external (Zoom links).
- Decide on push notification channels (web push vs SMS vs email).
- Clarify moderation policy and human escalation process.

---

## Next Actions Checklist
- [ ] Approve architecture and phase roadmap.
- [ ] Provision Firebase resources (Firestore, Functions, Storage, Hosting multi-env).
- [ ] Set up Stripe test environment & keys.
- [ ] Register for OpenRouter/OpenAI free-tier API, configure environment secrets.
- [ ] Create GitHub Actions workflow skeleton.
- [ ] Begin Phase 1 implementation per plan.

---

## References
- Firebase Docs: Firestore data modelling, Functions, Auth custom claims.
- Stripe Docs: Checkout + Connect for marketplaces.
- OpenRouter Docs: GPT model access & pricing.
- LangChain JS Docs: building RAG pipelines.
- React Query Docs: asynchronous state management best practices.

_This blueprint will evolve; keep `docs/` updated with ADRs and sprint notes._
