# 🛰️ CampusConnect AI

> **One Network. Every Campus. Endless Possibilities.**  
> *Cross-Campus Student Community Platform powered by an Intelligent Collaboration Radar.*

---

## 🌟 Overview & Problem Statement

Collegiate student clubs, engineering teams, and research groups frequently operate in **institutional isolation**. An Artificial Intelligence society at Stanford might spend months creating computer vision models without access to physical hardware, while a Robotics laboratory at UC Berkeley constructs drones but lacks deep learning autonomy. Meanwhile, students struggle to discover hackathons, capture-the-flag tournaments, and interdisciplinary teammates outside their own university gates.

**CampusConnect AI** solves this problem by uniting student organizations across universities through a centralized community directory, cross-campus event hub, and an **Intelligent Campus Collaboration Radar**. The radar algorithmically uncovers high-synergy student organizations at neighboring universities, explains the mathematical evidence behind the match, and allows verified student leaders to initiate official, structured collaboration proposals.

---

## ✨ Key Features Implemented

### 1. 🎯 Campus Collaboration Radar (Core AI Differentiator)
- **Deterministic, Explainable Scoring Engine** based on a weighted 4-factor formula:
  - **Shared Interests (35%)**: Semantic overlap across technical domains (AI, Robotics, InfoSec, Quantum, etc.).
  - **Complementary Skills (30%)**: Cross-disciplinary skill pairing (e.g. *PyTorch & Machine Learning* paired with *ROS2 & Embedded Hardware*).
  - **Goal Alignment (25%)**: Synergistic objectives (e.g. *Host Cross-Campus Hackathons*, *Publish Joint Research*).
  - **Event Themes & Formats (10%)**: Shared history in hackathons, workshops, and symposiums.
- **Interactive Radar Sweep Visualizer**: Custom SVG vector radar with concentric rings (60%, 75%, 85%, 95%) and interactive candidate nodes plotted by vector distance.
- **Explainable Evidence Modal**: Complete mathematical breakdown, paired complementary skill matrix, strategic synergy rationale, and practical suggested joint activities.
- **Algorithmic Transparency**: Explicit disclaimer that scores represent multi-variable heuristic estimates, not guaranteed outcomes.

### 2. 🤝 Collaboration Requests Desk
- **State Machine**: Handles `pending`, `accepted`, and `declined` states.
- **Duplicate Prevention**: Enforces a database/client constraint preventing redundant requests between the same clubs while a proposal is active.
- **Dual Perspective**: Dedicated **Incoming** and **Outgoing** proposal desks.
- **Celebration Feedback**: Interactive confetti burst upon successful collaboration acceptance.

### 3. 📅 Cross-Campus Events Hub & Registration
- Comprehensive inter-college calendar across Stanford, UC Berkeley, and San Jose State University.
- Filter by format (*Hackathons*, *Workshops*, *Symposiums*, *Competitions/CTFs*, *Networking*), college, and location type (*In-Person*, *Virtual*, *Hybrid*).
- Interactive 1-click event registration with live headcount tracking, capacity limits, and duplicate registration protection.
- Authorized club representative event publishing console.

### 4. 🧭 Explore Communities Directory
- Filter clubs by University, Category, and Technical Skills.
- Real-time search query matching club titles, descriptions, and skill tags.
- Detailed modal with membership count, leadership contact, GitHub repositories, and direct links to Radar.

### 5. 👥 1-Click Persona Switcher (For Hackathon Judges)
Switch between 4 pre-configured collegiate personas with 1 click to test multi-user workflows instantly without manual account creation:
1. **Alex Chen**: President, *Apex AI & Machine Learning Society* (Stanford University)
2. **Maya Lin**: Vice President, *OmniBotics Autonomous Systems Lab* (UC Berkeley)
3. **Marcus Vance**: President, *CyberShield InfoSec & CTF Guild* (San Jose State University)
4. **Elena Rostova**: Student Developer & Designer (Stanford University)

### 6. 🛡️ Safety & Moderation Center
- Community safety desk for reporting code of conduct violations, fake clubs, or inappropriate event listings.
- Role-aware status resolution (*Dismiss* or *Resolve & Sanction*).

### 7. 🗄️ Dual-Engine Data Architecture
- **Interactive Local Repository**: Zero-config hackathon demo mode with full `localStorage` and in-memory persistence.
- **Supabase Integration Ready**: Complete PostgreSQL schema, foreign keys, indexes, and Row Level Security (RLS) policies in `supabase/migrations/20260101_init.sql`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & Design System** | Tailwind CSS v3, Custom Navy/Violet/Cyan Theme, Glassmorphism |
| **Routing** | React Router DOM v7 |
| **Icons & UI** | Lucide React |
| **Animations & FX** | Custom CSS keyframes, Canvas Confetti |
| **Testing** | Vitest 5 (Unit Tests for Radar Engine & Repository) |
| **Database & Auth (Prepared)** | Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v26)
- **npm**: v9.0.0 or later

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/campusconnect-ai.git
cd campusconnect-ai

# Install packages
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser. The application will start in **Interactive Local Demo Mode** immediately.

### 3. Run Unit Tests
```bash
npm test
```
Executes all Vitest test suites verifying the Collaboration Radar engine, score reproducibility, duplicate prevention, and event registration.

### 4. Run Production Build
```bash
npm run build
```

---

## ⚡ 2-Minute Hackathon Judge Demo Journey

Follow this sequence to evaluate the end-to-end functionality in under 2 minutes:

1. **Visit Landing Page (`/`)**:
   - Observe the headline, value proposition, and the **Live Match Simulation** preview between Stanford Apex AI and Berkeley OmniBotics.
2. **Open Collaboration Radar (`/radar`)**:
   - Notice you are logged in as **Alex Chen (Stanford Apex AI)**.
   - Observe the animated **Radar Sweep Visualizer** with candidate nodes plotted according to compatibility.
   - Notice **OmniBotics Lab (UC Berkeley)** ranked #1 with **92% compatibility**.
   - Click **"View Complete Math & Evidence"** to inspect the 35% Interests / 30% Skills / 25% Goals / 10% Events breakdown.
   - Click **"Initiate Collaboration Proposal"** and transmit the request.
3. **Switch Persona to Maya Lin (UC Berkeley)**:
   - Click the top demo banner button: *"Switch to Maya Lin (UC Berkeley)"* (or use the top-right profile dropdown).
4. **Accept Proposal in Requests (`/collaborations`)**:
   - Go to **Requests**. Under **Incoming Proposals**, see the request just sent from Alex Chen.
   - Click **"Accept Collaboration"**. Enjoy the celebratory confetti burst and observe the status transition to **Accepted & Active**!
5. **Register for an Inter-Campus Event (`/events`)**:
   - Click on the **NorCal Tri-Campus AI + Robotics Hackathon 2026**.
   - Click **"Register for Event"**. Notice your ticket status and the attendance count update live!
6. **Inspect Dashboard (`/dashboard`)**:
   - See your updated active partnerships count, upcoming events, and recommendations.

---

## 🗄️ Supabase PostgreSQL Setup & Deployment

CampusConnect AI includes production-ready Supabase migrations and RLS policies.

### Connecting to Live Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run the entire SQL script from:
   ```
   supabase/migrations/20260101_init.sql
   ```
4. Copy your project credentials into `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart Vite (`npm run dev`). The top status badge will automatically illuminate: `🟢 Supabase Live`.

### Row Level Security (RLS) Policy Summary:
- **`colleges` / `clubs` / `events`**: Publicly readable. Only authorized club leads can insert or update records for their organizations.
- **`collaboration_requests`**: Visible only to members of the initiator club and target club. Only initiator club leads can propose collaborations. Only target club leads can accept or decline.
- **`event_registrations`**: Authenticated users can register and view their own tickets. Duplicate registrations are blocked by unique constraints.
- **`reports`**: Any authenticated student can file a report; only admins can view and resolve.

---

## 📁 Project Structure

```
d:/PS2/
├── index.html                     # Entry HTML with Google Fonts & SEO metadata
├── package.json                   # Dependencies, scripts (dev, build, test)
├── tailwind.config.js             # Custom Navy/Indigo/Cyan theme & animations
├── tsconfig.app.json              # TypeScript compiler configuration
├── vite.config.ts                 # Vite bundler configuration
├── .env.example                   # Safe template for environment variables
├── supabase/
│   └── migrations/
│       └── 20260101_init.sql      # Complete PostgreSQL schema & RLS policies
└── src/
    ├── main.tsx                   # React root entry
    ├── App.tsx                    # React Router configuration & layout
    ├── index.css                  # Tailwind directives & glassmorphic utilities
    ├── types/
    │   └── database.ts            # TypeScript interfaces for all entities
    ├── data/
    │   └── initialData.ts         # Coherent fictional dataset (3 colleges, 6 clubs, 8 events)
    ├── context/
    │   └── AuthContext.tsx        # Auth state & 1-click persona switcher
    ├── services/
    │   ├── supabase.ts            # Optional Supabase client initializer
    │   ├── storage.ts             # Dual-engine repository (LocalStorage + Supabase)
    │   ├── radarEngine.ts         # Deterministic explainable matching algorithm
    │   └── __tests__/
    │       ├── radarEngine.test.ts # Unit tests for radar scoring
    │       └── storage.test.ts     # Unit tests for storage & state transitions
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx         # Navigation, notifications, persona switcher
    │   │   ├── DemoBanner.tsx     # Hackathon persona assistant ribbon
    │   │   └── Footer.tsx         # Footnotes, links, algorithmic disclosure
    │   ├── radar/
    │   │   ├── RadarSweepVisualizer.tsx # Animated SVG radar canvas with plotted nodes
    │   │   ├── EvidenceModal.tsx        # Transparent 35/30/25/10 evidence breakdown
    │   │   └── CollaborationModal.tsx   # Proposal composer with duplicate protection
    │   ├── clubs/
    │   │   └── ClubDetailModal.tsx      # Comprehensive club profile dialog
    │   └── events/
    │       └── EventDetailModal.tsx     # Event dialog with live registration
    └── pages/
        ├── LandingPage.tsx        # Value prop, problem breakdown, live sandbox preview
        ├── RadarPage.tsx          # Campus Collaboration Radar with visualizer & filters
        ├── CollaborationsPage.tsx # Incoming/outgoing requests with accept/reject & confetti
        ├── ExplorePage.tsx        # Directory with search & category filters
        ├── EventsPage.tsx         # Inter-college event hub & publishing modal
        ├── DashboardPage.tsx      # Personalized metrics, widgets, recommendations
        ├── AuthPage.tsx           # 1-Click quick access & email authentication
        ├── ProfilePage.tsx        # Student profile editor & completion indicator
        ├── ManageClubPage.tsx     # Club lead management & RLS settings
        └── ModerationPage.tsx     # Safety center & report filing console
```

---

## 🧪 Verification & QA Results

- **Unit Testing**: 7 tests passed (Vitest) in 463ms:
  - `radarEngine.test.ts`: Deterministic score reproducibility, high cross-campus synergy validation, low-overlap handling, self-exclusion.
  - `storage.test.ts`: Data retrieval, duplicate collaboration request prevention, status transitions (`pending` -> `accepted`), event registration and headcount tracking.
- **Production Build**: Clean compilation via `tsc -b && vite build` in 1.07s.
- **Browser Automation**: End-to-end verification recorded in browser WebP artifacts (`campusconnect_e2e_1791968909291.webp` and `campusconnect_events_dashboard_1791969050818.webp`).

---

## 🔒 Security Best Practices
- **No Hardcoded Secrets**: Zero API keys or private credentials in code or repository.
- **Row Level Security (RLS)**: Enforced in PostgreSQL schema for data isolation.
- **Client-Side Sanitation**: Inputs validated with explicit constraints.
- **Role Isolation**: Only authorized club representatives can send official requests or publish events.

---

## 📜 License
MIT License. Built for collegiate innovation and cross-campus collaboration.
