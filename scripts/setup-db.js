const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 관리자 권한 필요

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('환경 변수가 올바르게 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL 및 SUPABASE_SERVICE_ROLE_KEY가 필요합니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('데이터베이스 설정을 시작합니다...');
  
  try {
    // events 테이블 생성
    console.log('events 테이블 생성 중...');
    const { error: eventsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'events',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        title text not null,
        description text,
        date text not null,
        time text not null,
        location text not null,
        max_attendees int,
        current_attendees int default 0,
        status text default 'draft',
        user_id uuid references auth.users(id),
        slug text unique,
        cover_image text,
        organizer_name text,
        organizer_image text,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    });
    
    if (eventsError) throw eventsError;
    
    // event_contents 테이블 생성
    console.log('event_contents 테이블 생성 중...');
    const { error: contentsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'event_contents',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        event_id uuid references events(id) on delete cascade,
        type text not null,
        content text,
        order int default 0,
        style text,
        metadata jsonb,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      `
    });
    
    if (contentsError) throw contentsError;
    
    // participants 테이블 생성
    console.log('participants 테이블 생성 중...');
    const { error: participantsError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'participants',
      table_definition: `
        id uuid primary key default uuid_generate_v4(),
        event_id uuid references events(id) on delete cascade,
        name text not null,
        email text not null,
        phone text,
        status text default 'registered',
        ticket_id text unique not null,
        metadata jsonb,
        created_at timestamp with time zone default now(),
        checked_in_at timestamp with time zone
      `
    });
    
    if (participantsError) throw participantsError;
    
    console.log('데이터베이스 설정이 완료되었습니다!');
    
  } catch (error) {
    console.error('데이터베이스 설정 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

setupDatabase();
