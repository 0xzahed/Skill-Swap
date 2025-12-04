# SkillSwap Upgrade Plan

## 1. Vision & Goals

- **Transform static MVP into a production-ready marketplace** with live data, real bookings, payments, and communication.
- **Introduce AI-powered experiences** that personalize discovery and automate routine tasks using a free-tier GPT API (e.g., OpenAI o1-mini) proxied via serverless functions.
- **Strengthen platform reliability** through Firestore-backed data, secure Cloud Functions, analytics, and CI/CD.

---

## 2. Feature Roadmap

| Feature                         | Description                                                                                          | Target routes / components                                                                                      | Dependencies                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Real-time Skill Catalog         | Replace `public/skills.json` with Firestore collections for skills & categories. Add filters/search. | `src/Pages/Home.jsx`, `src/Pages/Service.jsx`, new `src/hooks/useSkillsQuery.js`                                | Firestore, React Query, Algolia/TanStack search helpers                                   |
| Booking Workflow                | Learners request/schedule sessions, tutors approve, both track status.                               | New routes under `/dashboard/learner/bookings`, `/dashboard/tutor/requests`, integrate with `SkillDetails.jsx`. | Firestore (bookings collection), Cloud Functions for transactional writes, calendar utils |
| Messaging & Notifications       | In-app chat + email/SMS alerts for booking updates.                                                  | New `src/Pages/Dashboard/Conversations.jsx`, header badge in `NavBar.jsx`.                                      | Firestore subcollections, Firebase Cloud Messaging or Twilio SendGrid, Cloud Functions    |
| Reviews & Ratings               | Capture feedback post-session, moderate content.                                                     | Extend `SkillDetails.jsx`, new `Dashboard/Reviews.jsx`.                                                         | Firestore reviews collection, AI moderation function                                      |
| Payments & Earnings             | Stripe checkout for bookings, payouts dashboard for tutors.                                          | `/checkout`, `/dashboard/tutor/earnings`.                                                                       | Stripe (Checkout + Connect), Cloud Functions webhook                                      |
| Analytics Dashboards            | KPIs for admins, tutors, learners.                                                                   | `/dashboard/admin/analytics`, `/dashboard/tutor/insights`.                                                      | BigQuery export or Firestore aggregations, Chart.js/Recharts                              |
| AI Skill Matchmaker             | Personalized suggestions based on goals, history.                                                    | Widget on Home, Service filters, onboarding modal.                                                              | GPT API + embeddings, Firestore user preferences                                          |
| AI Onboarding Copilot           | Chatbot guiding new users (FAQ, skill suggestions).                                                  | Floating assistant accessible globally (`src/components/Assistant/Fab.jsx`).                                    | GPT API via Cloud Function proxy, content knowledge base                                  |
| AI Review Moderator & Summaries | Auto-flag toxic text, summarize reviews per tutor.                                                   | Cloud Function triggered on review writes, summary displayed in `SkillDetails.jsx`.                             | GPT moderation + summarization                                                            |
| Profile Enhancer                | Generate headline/bio suggestions.                                                                   | `MyProfile.jsx`, tutor onboarding form.                                                                         | GPT text generation                                                                       |

---

## 3. Backend & Data Architecture

### 3.1 Firestore Collections (initial schema)

```
/users/{uid}
  role: 'learner' | 'tutor' | 'admin'
  displayName, photoURL, bio, skills[], availability, location
  preferences: { goals, categories[], aiConsent }
/skills/{skillId}
  tutorId, title, categoryId, price, duration, ratingAvg, ratingCount,
  description, tags[], media[], status
/bookings/{bookingId}
  skillId, tutorId, learnerId, status ('pending','confirmed','completed','canceled'),
  scheduledAt, notes, priceSnapshot, paymentIntentId
/messages/{threadId}/logs/{messageId}
  participants[], senderId, text, attachments, readAt
/reviews/{reviewId}
  bookingId, skillId, tutorId, learnerId, rating, comment, aiFlag, summary
/categories/{categoryId}
  name, icon, featuredWeight
/aiSessions/{sessionId}
  userId, type, prompt, response, tokens
```

### 3.2 Cloud Functions

1. **Booking Orchestrator**: validates slot availability, writes booking atomically, triggers notifications.
2. **Stripe Checkout Handler**: creates payment intents, listens to webhooks, updates booking/payment status.
3. **Messaging Notifications**: sends push/email when new message arrives.
4. **Review Moderation & Summary**: calls GPT moderation + summary endpoint before publishing.
5. **AI Proxy**: secure function wrapping GPT API, enforcing rate limits and logging.
6. **Daily Analytics Aggregator**: writes summary docs for dashboards to avoid expensive queries.

### 3.3 Storage & Media

- **Firebase Storage** for tutor certificates, session recordings, chat attachments.
- Create signed URL utilities accessible via Cloud Functions.

### 3.4 Security Rules

- Role-based read/write constraints (e.g., learners can only book skills, tutors only update their listings).
- Booking writes gate-kept through callable functions to prevent client-side tampering.
- Reviews only allowed for completed bookings; moderation must pass first.

---

## 4. Frontend Enhancements

### 4.1 Routing Updates (`src/Routes/Router.jsx`)

Add nested dashboard routes guarded by a new `PrivateRoute` component:

```
/dashboard
  /overview
  /learner/bookings
  /learner/messages
  /tutor/skills
  /tutor/requests
  /tutor/earnings
  /admin/analytics
```

Implement lazy-loaded route modules to keep bundle size manageable.

### 4.2 State & Data Layer

- Introduce **React Query** for Firestore reads via custom hooks (`useSkills`, `useBookings`).
- Use **Zustand** to store UI state (filters, assistant visibility).
- Add service modules under `src/services/` for bookings, messaging, payments.

### 4.3 UI Components

- **Skill Filters Panel**: category pills, price slider, rating filter, availability toggle.
- **Booking Modal**: date/time selector (integrate with `react-hook-form` + `react-datepicker`).
- **Chat Interface**: real-time message list, composer, typing indicators.
- **Dashboard Cards & Charts**: leverage `Recharts` or `Nivo`.
- **AI Assistant FAB**: global button opening a chat drawer with conversation context.

### 4.4 Navigation & Layout

- Update `NavBar.jsx` to show dashboard link, notifications badge, AI assistant trigger.
- Expand `Root.jsx` layout to include `<Suspense>` wrappers and loader fallbacks.

---

## 5. AI Integration Strategy

### 5.1 GPT Provider Setup

- Use OpenAI free-tier model (e.g., `gpt-4o-mini` or `o4-mini`) invoked via Cloud Function to hide API key.
- Store prompts/responses in `/aiSessions` for auditing and token budgeting.

### 5.2 Use Cases & Flows

1. **Skill Matchmaker Widget**

   - Input: learner goals, preferred schedule, budget.
   - Flow: front-end collects context → calls `POST /ai/match` (Cloud Function) → function queries Firestore for candidate tutors → GPT ranks/justifies suggestions → returns structured JSON.
   - UI: present top picks with “Why this match?” explanation inside Service page sidebar.

2. **Onboarding Copilot**

   - Embedded chat launched from hero section or signup flow.
   - Preload FAQ knowledge base (Markdown docs) into GPT prompt.
   - Provide quick action buttons ("Suggest tutors", "Explain booking process").

3. **Review Moderation & Summary**

   - Triggered in Cloud Function when learner submits review.
   - GPT decides `approved | needs_manual_review`, adds short summary per tutor for display under ratings block.

4. **Profile Enhancer**

   - In `MyProfile.jsx`, add "Generate Bio" button calling GPT with user skills/experience to produce marketing copy.

5. **Content Personalization**
   - Use embeddings (e.g., OpenAI text-embedding-3-small stored per skill) to power similarity search for recommendations.

### 5.3 Safeguards

- Consent checkbox for AI features stored in user preferences.
- Token limits via Cloud Function throttle per user/day.
- Logging & fallback messaging when AI unavailable.

---

## 6. Implementation Phases

1. **Foundation (Sprint 1-2)**
   - Set up Firestore schema, Cloud Functions scaffold, React Query integration, `.env` management, and CI/CD.
2. **Core Marketplace (Sprint 3-4)**
   - Skill catalog migration, booking flow, dashboard shell, messaging MVP.
3. **Monetization & Analytics (Sprint 5-6)**
   - Stripe checkout, earnings dashboards, automated notifications.
4. **AI Enhancements (Sprint 7-8)**
   - Matchmaker widget, onboarding assistant, moderation pipeline, profile enhancer.
5. **Polish & Launch (Sprint 9)**
   - Accessibility review, load testing, documentation updates, marketing content.

---

## 7. Tooling & DevOps

- **GitHub Actions**: lint/test/build, deploy Firebase Hosting & Functions with previews per PR.
- **Testing**: configure Vitest + React Testing Library; add integration tests for booking reducer logic.
- **Monitoring**: enable Firebase Performance Monitoring, crash/error logging via Sentry.
- **Secrets Management**: store API keys via `firebase functions:config:set` and Access Secret Manager for deploys.

---

## 8. Risks & Mitigations

| Risk                           | Impact            | Mitigation                                                           |
| ------------------------------ | ----------------- | -------------------------------------------------------------------- |
| Double booking                 | Frustrated users  | Use transactional Cloud Function and server timestamps               |
| AI misuse/toxicity             | Brand damage      | Layer moderation, human review queue                                 |
| Cost overruns (AI/Stripe fees) | Budget strain     | Token quotas, caching, rate limits, pricing tiers                    |
| Data privacy (PII)             | Compliance issues | Limit stored sensitive data, secure rules, audit logs                |
| Performance bottlenecks        | Poor UX           | Lazy load dashboards, paginate Firestore queries, cache AI summaries |

---

## 9. Next Steps

1. Align on feature priority/order and budget for third-party services.
2. Create detailed tickets per feature (backend + frontend acceptance criteria).
3. Spin up staging Firebase project and configure environment secrets.
4. Begin Sprint 1 foundation tasks.
