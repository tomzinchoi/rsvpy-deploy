import { NextApiRequest, NextApiResponse } from 'next';
import { EventDetail } from '../../../types/common';

// 임시 이벤트 저장소 (실제로는 DB를 사용해야 함)
// 이벤트 데이터는 events/index.ts와 공유되어야 하지만, 여기서는 간단히 구현
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
    organizerName: 'Tech Community Korea',
    status: 'active',
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
    organizerName: 'Startup Seoul',
    status: 'active',
    contents: []
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { id },
    method 
  } = req;

  // 이벤트 ID로 이벤트 찾기
  const eventIndex = events.findIndex(event => event.id === id);

  if (eventIndex === -1) {
    return res.status(404).json({ message: '이벤트를 찾을 수 없습니다.' });
  }

  switch (method) {
    case 'GET':
      // 단일 이벤트 조회
      return res.status(200).json(events[eventIndex]);
      
    case 'PUT':
      // 이벤트 업데이트
      try {
        const updatedData = req.body;
        
        // 중요: 실제 앱에서는 여기서 권한 검사를 해야 함
        
        events[eventIndex] = {
          ...events[eventIndex],
          ...updatedData
        };
        
        return res.status(200).json(events[eventIndex]);
      } catch (error) {
        console.error('이벤트 업데이트 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }
      
    case 'DELETE':
      // 이벤트 삭제
      try {
        // 중요: 실제 앱에서는 여기서 권한 검사를 해야 함
        
        const deletedEvent = events[eventIndex];
        events = events.filter(event => event.id !== id);
        
        return res.status(200).json(deletedEvent);
      } catch (error) {
        console.error('이벤트 삭제 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }
      
    default:
      return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }
}
