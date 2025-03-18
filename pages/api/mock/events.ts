import { NextApiRequest, NextApiResponse } from 'next';
import { EventDetail } from '../../../types/common';

// 모의 이벤트 데이터
const mockEvents: EventDetail[] = [
  {
    id: '1',
    title: '2023 개발자 컨퍼런스',
    description: '최신 웹 개발 트렌드와 기술을 공유하는 연례 컨퍼런스입니다.',
    date: '2023-12-15',
    time: '10:00',
    location: '서울 강남구 테헤란로 123, 개발자 센터',
    maxAttendees: 100,
    currentAttendees: 42,
    status: 'active',
    organizerName: 'Tech Community Korea',
    contents: [
      { id: 'c1', type: 'heading', content: '이벤트 소개' },
      { id: 'c2', type: 'text', content: '이 컨퍼런스에서는 최신 웹 기술과 개발 트렌드에 대한 인사이트를 얻을 수 있습니다.' }
    ]
  },
  {
    id: '2',
    title: '스타트업 밋업 네트워킹',
    description: '스타트업 창업자, 투자자, 개발자들이 모여 네트워킹하는 행사입니다.',
    date: '2023-12-22',
    time: '19:00',
    location: '서울 성수동 소셜벤처 허브',
    maxAttendees: 50,
    currentAttendees: 23,
    status: 'active',
    organizerName: 'Startup Seoul',
    contents: []
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return res.status(200).json(mockEvents);
    case 'POST':
      const newEvent = {
        ...req.body,
        id: `${mockEvents.length + 1}`,
        currentAttendees: 0
      };
      mockEvents.push(newEvent as EventDetail);
      return res.status(201).json(newEvent);
    default:
      return res.status(405).json({ message: '허용되지 않는 메서드입니다' });
  }
}
