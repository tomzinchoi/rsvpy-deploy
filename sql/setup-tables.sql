-- events 테이블 생성
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    max_attendees INT,
    current_attendees INT DEFAULT 0,
    status TEXT DEFAULT 'draft',
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
    slug TEXT UNIQUE,
    cover_image TEXT,
    organizer_name TEXT,
    organizer_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- event_contents 테이블 생성
CREATE TABLE IF NOT EXISTS event_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events (id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT,
    order INT DEFAULT 0,
    style TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- participants 테이블 생성
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'registered',
    ticket_id TEXT UNIQUE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    checked_in_at TIMESTAMP WITH TIME ZONE
);

-- 필요한 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
