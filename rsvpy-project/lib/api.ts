import { EventDetail, EventListItem, Ticket } from '../types/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// API 요청 헬퍼 함수
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
  }

  return response.json();
}

// 이벤트 API
export const eventsApi = {
  // 이벤트 목록 조회
  getEvents: async (filter?: string): Promise<EventListItem[]> => {
    const queryParam = filter ? `?status=${filter}` : '';
    return fetchApi<EventListItem[]>(`/events${queryParam}`);
  },

  // 단일 이벤트 조회
  getEvent: async (id: string): Promise<EventDetail> => {
    return fetchApi<EventDetail>(`/events/${id}`);
  },

  // 새 이벤트 생성
  createEvent: async (eventData: Partial<EventDetail>): Promise<EventDetail> => {
    return fetchApi<EventDetail>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // 이벤트 업데이트
  updateEvent: async (id: string, eventData: Partial<EventDetail>): Promise<EventDetail> => {
    return fetchApi<EventDetail>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // 이벤트 삭제
  deleteEvent: async (id: string): Promise<void> => {
    return fetchApi<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// 티켓 API
export const ticketsApi = {
  // 이벤트 등록/티켓 발급
  registerForEvent: async (eventId: string, attendeeData: { name: string; email: string; phone?: string }): Promise<Ticket> => {
    return fetchApi<Ticket>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify(attendeeData),
    });
  },

  // 티켓 조회
  getTicket: async (ticketId: string): Promise<Ticket> => {
    return fetchApi<Ticket>(`/tickets/${ticketId}`);
  },

  // 이벤트의 모든 티켓 조회
  getTicketsByEvent: async (eventId: string): Promise<Ticket[]> => {
    return fetchApi<Ticket[]>(`/events/${eventId}/tickets`);
  },

  // 티켓 체크인
  checkInTicket: async (ticketId: string): Promise<Ticket> => {
    return fetchApi<Ticket>(`/tickets/${ticketId}/check-in`, {
      method: 'POST',
    });
  },

  // 티켓 취소
  cancelTicket: async (ticketId: string): Promise<void> => {
    return fetchApi<void>(`/tickets/${ticketId}/cancel`, {
      method: 'POST',
    });
  },
};

// 사용자 API (인증 관련 기능은 별도 모듈로 분리할 수 있음)
export const userApi = {
  // 사용자 티켓 목록 조회
  getUserTickets: async (): Promise<Ticket[]> => {
    return fetchApi<Ticket[]>('/user/tickets');
  },

  // 사용자 이벤트 목록 조회 (주최한 이벤트)
  getUserEvents: async (): Promise<EventListItem[]> => {
    return fetchApi<EventListItem[]>('/user/events');
  },
};
