import { supabase } from './supabase';
import { EventDetail, EventContent, Participant } from '../types/common';

/**
 * API client for event-related operations
 */
export const eventsApi = {
  /**
   * Get all events for the current user
   */
  async getMyEvents(): Promise<EventDetail[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as EventDetail[];
  },
  
  /**
   * Create a new event
   */
  async createEvent(event: Partial<EventDetail>): Promise<EventDetail> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const eventData = {
      ...event,
      user_id: user.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
    
    if (error) throw error;
    
    // If there are contents, add them as well
    if (event.contents && event.contents.length > 0 && data.id) {
      const contentsWithEventId = event.contents.map(content => ({
        ...content,
        event_id: data.id
      }));
      
      const { error: contentsError } = await supabase
        .from('event_contents')
        .insert(contentsWithEventId);
      
      if (contentsError) {
        console.error('Error adding event contents:', contentsError);
      }
    }
    
    return data as EventDetail;
  },
  
  /**
   * Update an existing event
   */
  async updateEvent(id: string, event: Partial<EventDetail>): Promise<EventDetail> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const eventData = {
      ...event,
      updated_at: new Date().toISOString()
    };
    
    // Remove contents from event data as they'll be handled separately
    const { contents, ...eventDataWithoutContents } = eventData;
    
    const { data, error } = await supabase
      .from('events')
      .update(eventDataWithoutContents)
      .eq('id', id)
      .eq('user_id', user.user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle contents update if provided
    if (contents && contents.length > 0) {
      // First delete all existing contents
      const { error: deleteError } = await supabase
        .from('event_contents')
        .delete()
        .eq('event_id', id);
      
      if (deleteError) throw deleteError;
      
      // Then add the new contents
      const contentsWithEventId = contents.map(content => ({
        ...content,
        event_id: id
      }));
      
      const { error: contentsError } = await supabase
        .from('event_contents')
        .insert(contentsWithEventId);
      
      if (contentsError) throw contentsError;
    }
    
    return {
      ...data,
      contents: contents || []
    } as EventDetail;
  },
  
  /**
   * Get a single event by ID
   */
  async getEvent(id: string): Promise<EventDetail> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (eventError) throw eventError;
    
    // Get contents for the event
    const { data: contentsData, error: contentsError } = await supabase
      .from('event_contents')
      .select('*')
      .eq('event_id', id)
      .order('order', { ascending: true });
    
    if (contentsError) throw contentsError;
    
    return {
      ...eventData,
      contents: contentsData
    } as EventDetail;
  },
  
  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Delete contents first (foreign key constraint)
    const { error: contentsError } = await supabase
      .from('event_contents')
      .delete()
      .eq('event_id', id);
    
    if (contentsError) throw contentsError;
    
    // Then delete the event
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.user.id);
    
    if (error) throw error;
    
    return true;
  },
  
  /**
   * Get a public event by its slug
   */
  async getPublicEvent(slug: string): Promise<EventDetail> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    
    if (error) throw error;
    
    // Get contents for the event
    const { data: contentsData, error: contentsError } = await supabase
      .from('event_contents')
      .select('*')
      .eq('event_id', data.id)
      .order('order', { ascending: true });
    
    if (contentsError) throw contentsError;
    
    return {
      ...data,
      contents: contentsData
    } as EventDetail;
  }
};

/**
 * API client for participant-related operations
 */
export const participantsApi = {
  /**
   * Register a participant for an event
   */
  async registerParticipant(eventId: string, participant: Partial<Participant>): Promise<Participant> {
    const participantData = {
      ...participant,
      event_id: eventId,
      created_at: new Date().toISOString(),
      status: 'registered'
    };
    
    const { data, error } = await supabase
      .from('participants')
      .insert([participantData])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Participant;
  },
  
  /**
   * Get participants for an event
   */
  async getEventParticipants(eventId: string): Promise<Participant[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Participant[];
  },
  
  /**
   * Update participant status
   */
  async updateParticipantStatus(id: string, status: string): Promise<Participant> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('participants')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Participant;
  }
};
