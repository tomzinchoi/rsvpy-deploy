import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ticket ID for an event
 */
export const generateTicketId = (eventId: string): string => {
  // Generate a shorter unique ID based on UUID
  const shortId = uuidv4().substring(0, 8).toUpperCase();
  
  // Create a ticket ID with event prefix and short UUID
  return `E${eventId.substring(0, 3)}${shortId}`;
};

/**
 * Parse date string to parts
 */
export const parseDateString = (dateString: string): {
  year: number;
  month: number;
  day: number;
} => {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Months are 0-indexed
    day: date.getDate()
  };
};

/**
 * Format date to a friendly string
 */
export const formatDateToString = (dateString: string, locale = 'ko-KR'): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(date);
};

/**
 * Format time to a friendly string
 */
export const formatTimeToString = (timeString: string): string => {
  // Parse HH:MM format
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Format with AM/PM
  const isPM = hours >= 12;
  const twelveHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  
  return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
};

/**
 * Generate barcode data for ticket
 */
export const generateBarcodeData = (ticketId: string): string => {
  // Add a prefix to identify our system
  return `RSVPY-${ticketId}`;
};

/**
 * Check if a ticket is valid
 */
export const isTicketValid = (ticketId: string, eventDate: string): boolean => {
  const today = new Date();
  const eventDay = new Date(eventDate);
  
  // Event must be in the future or today
  return eventDay >= today;
};

/**
 * Calculate days remaining until event
 */
export const daysUntilEvent = (eventDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const diffTime = eventDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 영문자, 숫자로 구성된 무작위 문자열 생성
 */
export function generateRandomString(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 날짜를 YYYYMMDD 형식의 문자열로 변환
 */
export function formatDateToStringLegacy(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 영문/숫자/공백 확인 함수
 * 영문자, 숫자, 공백만 포함하는지 검증
 *
 * @param str 검증할 문자열
 * @returns 영문/숫자/공백만 포함하면 true, 그렇지 않으면 false
 */
export const isEnglishOrNumbersOrSpaces = (text: string): boolean => {
  return /^[A-Za-z0-9\s]*$/.test(text);
};

/**
 * 영문 이름 형식 변환
 * 이름의 각 단어를 대문자로 시작하게 변경
 *
 * @param name 이름 문자열
 * @returns 형식화된 이름
 */
export const formatEnglishName = (name: string): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * 다양한 날짜 문자열을 Date 객체로 파싱
 */
export const parseDateStringLegacy = (dateStr: string): Date => {
  // 영어 날짜 형식(June 15, 2023)
  const englishDatePattern = /([A-Za-z]+)\s+(\d+),\s+(\d{4})/;
  const englishMatch = dateStr.match(englishDatePattern);
  
  if (englishMatch) {
    const months: {[key: string]: number} = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const month = months[englishMatch[1]];
    const day = parseInt(englishMatch[2]);
    const year = parseInt(englishMatch[3]);
    
    return new Date(year, month, day);
  }
  
  // 한국어 날짜 형식(2023년 6월 15일)
  const koreanDatePattern = /(\d{4})년\s+(\d+)월\s+(\d+)일/;
  const koreanMatch = dateStr.match(koreanDatePattern);
  
  if (koreanMatch) {
    const year = parseInt(koreanMatch[1]);
    const month = parseInt(koreanMatch[2]) - 1; // 자바스크립트 Date는 0부터 시작
    const day = parseInt(koreanMatch[3]);
    
    return new Date(year, month, day);
  }
  
  // ISO 형식(2023-06-15)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(dateStr);
  }
  
  // 파싱 실패 시 현재 날짜 반환
  console.warn(`Failed to parse date string: ${dateStr}`);
  return new Date();
};

/**
 * 티켓 이미지 다운로드 함수
 * 캔버스에서 이미지를 생성하여 다운로드
 */
export const downloadTicketAsImage = (canvasId: string, fileName: string = 'ticket.png'): void => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * 이벤트 날짜와 ID를 기반으로 티켓 ID를 생성합니다.
 */
export function generateTicketIdLegacy(eventDate: Date, eventId: string): string {
  const dateStr = formatDateToStringLegacy(eventDate);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${dateStr}-${eventId.substring(0, 4)}-${randomPart}`;
}

/**
 * 영문/숫자/공백인지 확인합니다. (티켓에 사용할 이름 검증용)
 */
export function isEnglishOrNumbersOrSpacesLegacy(str: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(str);
}

/**
 * 영어 이름을 첫 글자만 대문자로 포맷팅합니다.
 */
export function formatEnglishNameLegacy(name: string): string {
  if (!name) return '';
  
  return name
    .trim()
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * 밀리초를 읽기 쉬운 시간 형식으로 변환합니다.
 * 예: 70000 -> "1분 10초"
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)));
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}시간 `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes}분 `;
  }
  
  result += `${seconds}초`;
  
  return result;
}

// 이메일 형식 검증
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 전화번호 형식화
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 한국 전화번호 형식 (010-1234-5678)
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // 그 외 케이스
  return phoneNumber;
}
