-- CampusConnect AI - Supabase PostgreSQL Schema & RLS Policies
-- Migration: 20260101_init.sql

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    location TEXT NOT NULL,
    domain TEXT NOT NULL,
    logo_url TEXT,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    college_id TEXT REFERENCES public.colleges(id) ON DELETE SET NULL,
    college_name TEXT,
    department TEXT,
    year_of_study TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'club_lead', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLUBS TABLE
CREATE TABLE IF NOT EXISTS public.clubs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    college_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Artificial Intelligence',
        'Robotics & Hardware',
        'Cybersecurity',
        'Quantum Computing',
        'Design & Creative Tech',
        'Biomedical Engineering',
        'Open Source & Dev',
        'Entrepreneurship & VC'
    )),
    logo_url TEXT,
    banner_url TEXT,
    lead_user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    lead_user_name TEXT NOT NULL,
    lead_user_role TEXT DEFAULT 'President',
    member_count INTEGER DEFAULT 1,
    interests TEXT[] DEFAULT '{}',
    skills TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    activity_themes TEXT[] DEFAULT '{}',
    contact_email TEXT NOT NULL,
    discord_or_slack TEXT,
    github_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLUB MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.club_members (
    id TEXT PRIMARY KEY DEFAULT ('mem-' || substr(md5(random()::text), 1, 12)),
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'co-lead', 'core_member', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

-- 5. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    club_name TEXT NOT NULL,
    college_id TEXT NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    college_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Hackathon',
        'Workshop',
        'Symposium',
        'Tech Talk',
        'Competition',
        'Networking'
    )),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location_type TEXT NOT NULL CHECK (location_type IN ('in-person', 'virtual', 'hybrid')),
    venue TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 100,
    registered_count INTEGER NOT NULL DEFAULT 0,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    is_demo BOOLEAN DEFAULT FALSE,
    registration_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id TEXT PRIMARY KEY DEFAULT ('reg-' || substr(md5(random()::text), 1, 12)),
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- 7. COLLABORATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
    id TEXT PRIMARY KEY,
    initiator_club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    initiator_club_name TEXT NOT NULL,
    initiator_college_name TEXT NOT NULL,
    initiator_user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    initiator_user_name TEXT NOT NULL,
    target_club_id TEXT NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
    target_club_name TEXT NOT NULL,
    target_college_name TEXT NOT NULL,
    collab_type TEXT NOT NULL CHECK (collab_type IN (
        'Cross-Campus Hackathon',
        'Joint Workshop & Tech Talk',
        'Collaborative Research & R&D',
        'Inter-College Competition',
        'Community Resource Sharing'
    )),
    message TEXT NOT NULL,
    proposed_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    rejection_reason TEXT,
    compatibility_score INTEGER NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REPORTS / MODERATION TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    target_type TEXT NOT NULL CHECK (target_type IN ('club', 'event', 'user', 'collaboration')),
    target_id TEXT NOT NULL,
    target_title TEXT NOT NULL,
    reported_by_user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_by_user_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_clubs_college_id ON public.clubs(college_id);
CREATE INDEX IF NOT EXISTS idx_clubs_category ON public.clubs(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_club_id ON public.events(club_id);
CREATE INDEX IF NOT EXISTS idx_collab_initiator ON public.collaboration_requests(initiator_club_id);
CREATE INDEX IF NOT EXISTS idx_collab_target ON public.collaboration_requests(target_club_id);
CREATE INDEX IF NOT EXISTS idx_collab_status ON public.collaboration_requests(status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. Colleges: Public read
CREATE POLICY "Public read colleges" ON public.colleges FOR SELECT USING (true);

-- 2. Profiles: Public read, Self update
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self update profiles" ON public.profiles FOR UPDATE USING (auth.uid()::text = id);

-- 3. Clubs: Public read, Authorized lead can insert/update
CREATE POLICY "Public read clubs" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Authorized lead insert club" ON public.clubs FOR INSERT WITH CHECK (auth.uid()::text = lead_user_id);
CREATE POLICY "Authorized lead update club" ON public.clubs FOR UPDATE USING (auth.uid()::text = lead_user_id);

-- 4. Events: Public read, Club lead can insert/update
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Club lead insert event" ON public.events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = club_id AND lead_user_id = auth.uid()::text)
);
CREATE POLICY "Club lead update event" ON public.events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = club_id AND lead_user_id = auth.uid()::text)
);

-- 5. Event Registrations: Users can register and view their registrations
CREATE POLICY "User view registrations" ON public.event_registrations FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "User create registration" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- 6. Collaboration Requests:
-- Visible to members of initiator club OR target club
CREATE POLICY "View collab requests" ON public.collaboration_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clubs WHERE (id = initiator_club_id OR id = target_club_id) AND lead_user_id = auth.uid()::text)
    OR auth.uid()::text = initiator_user_id
);

-- Only initiator club lead can create request
CREATE POLICY "Lead create collab request" ON public.collaboration_requests FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = initiator_club_id AND lead_user_id = auth.uid()::text)
);

-- Only target club lead can accept or reject
CREATE POLICY "Target lead update collab status" ON public.collaboration_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.clubs WHERE id = target_club_id AND lead_user_id = auth.uid()::text)
);

-- 7. Reports: Authenticated insert, Admin view
CREATE POLICY "User insert report" ON public.reports FOR INSERT WITH CHECK (auth.uid()::text = reported_by_user_id);
CREATE POLICY "Admin view reports" ON public.reports FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin')
);
