import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { generateTicketId, parseDateString } from '../../../../utils/ticketUtils';

// 실제 앱에서는 DB를 사용해야 함
interface Registrant {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  ticketId: string;
  registeredAt: Date;
}

// 임시 저장소
let registrations: Registrant[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { 
    query: { id },
    method,
  } = req;
  
  // 이벤트 ID가 없으면 오류 반환
  if (!id) {
    return res.status(400).json({ message: '이벤트 ID가 필요합니다.' });
  }

  switch (method) {
    case 'POST':
      // 이벤트 등록 처리
      try {
        const { name, email, phone } = req.body;
        
        // 기본 유효성 검사
        if (!name || !email) {
          return res.status(400).json({ message: '이름과 이메일은 필수 입력 항목입니다.' });
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ message: '유효한 이메일 주소를 입력해주세요.' });
        }
        
        // 이미 등록된 이메일인지 확인
        const existingRegistration = registrations.find(
          r => r.eventId === id && r.email === email
        );
        
        if (existingRegistration) {
          return res.status(400).json({ 
            message: '이미 등록된 이메일입니다.',
            ticketId: existingRegistration.ticketId 
          });
        }
        
        // 티켓 ID 생성
        // 실제 앱에서는 이벤트 날짜를 DB에서 조회해야 함
        const eventDate = new Date();
        const ticketId = generateTicketId(eventDate, id as string);
        
        // 새 등록 정보 생성
        const newRegistration: Registrant = {
          id: uuidv4(),
          eventId: id as string,
          name,
          email,
          phone,
          ticketId,
          registeredAt: new Date()
        };
        
        // 등록 정보 저장
        registrations.push(newRegistration);
        
        // 등록 정보 반환
        return res.status(201).json({
          message: '이벤트 등록이 완료되었습니다.',
          registration: {
            name,
            email,
            ticketId
          }
        });
        
      } catch (error) {
        console.error('이벤트 등록 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }
      
    case 'GET':
      // 이벤트 등록자 목록 조회
      try {
        const eventRegistrations = registrations.filter(r => r.eventId === id);
        return res.status(200).json(eventRegistrations);
      } catch (error) {
        console.error('등록자 목록 조회 오류:', error);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }
      
    default:
      return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }
}
