import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { EventDetail } from '../../../types/common';

// 임시 이벤트 저장소 (실제로는 DB를 사용해야 함)
let events: EventDetail[] = [
  {
    id: '1',
    title: '2023 개발자 컨퍼런스',
    description: '최신 웹 개발 트렌드와 기술을 공유하는 연례 컨퍼런스입니다.',
    date: '2023-06-15',
    time: '10:00',
    location: '서울 강남구 테헤란로 123, 개발자 센터',
    maxAttendees: 100,
    currentAttendees: 42,
    status: 'active',
    organizerName: 'Tech Community Korea',
    contents: [
      {
        id: 'content-1',
        type: 'heading',
        content: '이벤트 소개'
      },
      {
        id: 'content-2',
        type: 'text',
        content: '이 컨퍼런스에서는 최신 웹 기술과 개발 트렌드에 대한 인사이트를 얻을 수 있습니다. 다양한 세션과 네트워킹 기회가 제공됩니다.'
      },
      {
        id: 'content-3',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ]
  },
  {
    id: '2',
    title: '스타트업 밋업 네트워킹',
    description: '스타트업 창업자, 투자자, 개발자들이 모여 네트워킹하는 행사입니다.',
    date: '2023-07-22',
    time: '19:00',
    location: '서울 성수동 소셜벤처 허브',
    maxAttendees: 50,
    currentAttendees: 23,
    status: 'active',
    organizerName: 'Startup Seoul',
    contents: []
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // HTTP 메서드에 따라 다른 처리
  switch (req.method) {
    case 'GET':
      return handleGetEvents(req, res);
    case 'POST':
      return handleCreateEvent(req, res);
    default:
      return res.status(405).json({ message: '허용되지 않는 메서드입니다' });
  }
}

/**
 * 이벤트 목록 조회 처리
 */
async function handleGetEvents(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 필터링 파라미터
    const { status } = req.query;
    
    // 상태 필터가 있으면 필터링
    let filteredEvents = [...events];
    if (status && typeof status === 'string') {
      filteredEvents = events.filter(event => event.status === status);
    }
    
    return res.status(200).json(filteredEvents);
    
  } catch (error) {
    console.error('이벤트 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
}

/**
 * 새 이벤트 생성 처리
 */
async function handleCreateEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const eventData = req.body;
    
    // 필수 필드 검증
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.location) {
      return res.status(400).json({ 
        message: '필수 필드가 누락되었습니다. (title, date, time, location은 필수입니다)' 
      });
    }
    
    // 새 이벤트 생성
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      currentAttendees: 0,
      status: eventData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contents: eventData.contents || []
    };
    
    // 이벤트 목록에 추가
    events.push(newEvent);
    
    return res.status(201).json(newEvent);
    
  } catch (error) {
    console.error('이벤트 생성 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
}
