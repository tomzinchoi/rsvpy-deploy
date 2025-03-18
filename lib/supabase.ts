import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 자격 증명 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 개발 환경에서 자격 증명이 없을 때 사용할 모의 클라이언트
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 자격 증명이 설정되지 않았습니다. 모의 클라이언트를 사용합니다.');
  
  // 모의 클라이언트 생성
  const mockAuthResponse = { data: { user: null, session: null }, error: null };
  
  supabase = {
    auth: {
      getUser: async () => mockAuthResponse,
      getSession: async () => mockAuthResponse,
      signUp: async () => mockAuthResponse,
      signInWithPassword: async () => mockAuthResponse,
      signInWithOAuth: async () => mockAuthResponse,
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      updateUser: async () => mockAuthResponse,
      resetPasswordForEmail: async () => mockAuthResponse,
    },
    from: (table: string) => ({
      select: (query: string) => ({
        eq: (field: string, value: any) => ({
          order: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => ({ data: { id: 'mock-id', ...data[0] }, error: null }),
        }),
      }),
      update: (data: any) => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: { id: 'mock-id', ...data }, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({ error: null }),
      }),
    }),
  };
  
} else {
  // 실제 Supabase 클라이언트 생성
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Helper functions for common Supabase operations
export const auth = supabase.auth;

/**
 * Event-related database operations
 */
export const eventService = {
  /**
   * Get all events for the current user
   */
  async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get a single event by ID
   */
  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*, event_contents(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Create a new event
   */
  async createEvent(eventData: any) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Update an event
   */
  async updateEvent(id: string, eventData: any) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Delete an event
   */
  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  /**
   * Get a public event by slug
   */
  async getPublicEvent(slug: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*, event_contents(*)')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    
    if (error) throw error;
    return data;
  }
};

/**
 * Participant-related database operations
 */
export const participantService = {
  /**
   * Get participants for an event
   */
  async getEventParticipants(eventId: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Register a new participant
   */
  async registerParticipant(participantData: any) {
    const { data, error } = await supabase
      .from('participants')
      .insert([participantData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

export default supabase;
