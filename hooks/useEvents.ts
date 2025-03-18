import { useState, useEffect } from 'react';
import { EventDetail } from '../types/common';
import { eventsApi } from '../lib/api';

export function useEvents() {
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        
        let eventData: EventDetail[];
        
        try {
          // 실제 API에서 이벤트 가져오기 시도
          eventData = await eventsApi.getMyEvents();
        } catch (apiError) {
          console.warn('실제 API 호출 실패, 모의 데이터 사용:', apiError);
          
          // 실패 시 모의 API 호출
          const response = await fetch('/api/mock/events');
          if (!response.ok) throw new Error('Failed to fetch events');
          eventData = await response.json();
        }
        
        setEvents(eventData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('알 수 없는 오류 발생'));
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}
