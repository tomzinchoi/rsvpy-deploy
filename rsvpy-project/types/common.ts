// 이벤트 컨텐츠 타입
export type EventContentType = 'heading' | 'text' | 'image';

// 이벤트 컨텐츠 항목
export interface EventContent {
  id: string;
  type: EventContentType;
  content: string;
}

// 전체 이벤트 정보
export interface EventDetail extends EventListItem {
  contents: EventContent[];
}

// 이벤트 목록 아이템 (목록 조회용 간소화된 정보)
export interface EventListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  coverImage?: string | null;
  maxAttendees?: number | null;
  currentAttendees: number;
  status: 'draft' | 'active' | 'ended';
  organizerName: string;
  organizerImage?: string | null;
}

// 티켓 정보
export interface Ticket {
  id: string;
  ticketId: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string | null;
  status: 'active' | 'used' | 'canceled';
  additionalInfo?: string | null;
  createdAt: string;
  checkedInAt?: string | null;
}

// 참가자 정보
export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ticketId: string;
  status: 'registered' | 'checked-in' | 'cancelled';
  registeredAt: string;
  checkedInAt?: string;
}

// 3D 티켓 뷰어 속성
export interface TicketViewerProps {
  eventName: string;
  participantName: string;
  ticketId: string;
  showControls?: boolean;
  height?: string;
  className?: string;
}

// 사용자 프로필
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: string;
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
