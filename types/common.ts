// Common type definitions for the RSVPY application

/**
 * Event content block types
 */
export type ContentBlockType = 'heading' | 'text' | 'image' | 'location' | 'datetime' | 'custom';

/**
 * Event content block
 */
export interface EventContent {
  id: string;
  type: ContentBlockType;
  content: string;
  event_id?: string;
  order?: number;
  style?: string;
  metadata?: Record<string, any>;
}

/**
 * Event status types
 */
export type EventStatus = 'draft' | 'active' | 'ended';

/**
 * Event detail
 */
export interface EventDetail {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees?: number;
  currentAttendees: number;
  status: EventStatus;
  contents?: EventContent[];
  user_id?: string;
  slug?: string;
  coverImage?: string;
  organizerName?: string;
  organizerImage?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Participant status types
 */
export type ParticipantStatus = 'registered' | 'confirmed' | 'checked_in' | 'cancelled' | 'waitlisted';

/**
 * Participant information
 */
export interface Participant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  status: ParticipantStatus;
  ticket_id: string;
  metadata?: Record<string, any>;
  created_at?: string;
  checked_in_at?: string;
}

/**
 * User profile
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

/**
 * Ticket viewer props
 */
export interface TicketViewerProps {
  eventName: string;
  participantName: string;
  ticketId: string;
  showControls?: boolean;
  height?: string;
  className?: string;
  date?: string;
}

// 페이지 메타데이터 (SEO 등)
export interface PageMeta {
  title: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
}

// 이벤트 통계
export interface EventStats {
  totalRegistrations: number;
  totalAttendees: number;
  checkInRate: number;
  registrationsByDay: { date: string; count: number }[];
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
