/**
 * 티켓 ID 생성 함수
 *
 * @param eventDate 이벤트 날짜 (Date 객체)
 * @param eventId 이벤트 ID
 * @param length 무작위 문자열 길이 (기본값: 6)
 * @returns 생성된 티켓 ID 문자열
 */
export const generateTicketId = (date: Date, eventId: string): string => {
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${dateStr}-${eventId}-${randomStr}`;
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
export function formatDateToString(date: Date): string {
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
export const parseDateString = (dateStr: string): Date => {
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
 * 날짜 문자열을 파싱하여 Date 객체를 반환합니다.
 */
export function parseDateString(dateStr: string): Date {
  if (!dateStr) {
    return new Date();
  }
  
  // ISO 형식 (2023-12-30)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // 년월일 형식 (20231230)
  if (/^\d{8}$/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JavaScript의 월은 0부터 시작
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
  }
  
  // 기타 형식은 그냥 Date 생성자에 전달
  return new Date(dateStr);
}

/**
 * Date 객체를 YYYYMMDD 형식의 문자열로 변환합니다.
 */
export function formatDateToString(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}${month}${day}`;
}

/**
 * 이벤트 날짜와 ID를 기반으로 티켓 ID를 생성합니다.
 */
export function generateTicketId(eventDate: Date, eventId: string): string {
  const dateStr = formatDateToString(eventDate);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `${dateStr}-${eventId.substring(0, 4)}-${randomPart}`;
}

/**
 * 영문/숫자/공백인지 확인합니다. (티켓에 사용할 이름 검증용)
 */
export function isEnglishOrNumbersOrSpaces(str: string): boolean {
  return /^[a-zA-Z0-9\s]+$/.test(str);
}

/**
 * 영어 이름을 첫 글자만 대문자로 포맷팅합니다.
 */
export function formatEnglishName(name: string): string {
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

// 영어 이름 또는 숫자 또는 공백 확인
export function isEnglishOrNumbersOrSpaces(text: string): boolean {
  const regex = /^[A-Za-z0-9\s]+$/;
  return regex.test(text);
}

// 영어 이름 형식화 (각 단어의 첫 글자를 대문자로)
export function formatEnglishName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 날짜 형식화
export function formatDateToString(date: Date, locale: string = 'ko-KR'): string {
  try {
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    }).format(date);
  } catch (error) {
    console.error('날짜 형식화 오류:', error);
    return date.toLocaleDateString();
  }
}

// 시간 형식화
export function formatTime(timeString: string, locale: string = 'ko-KR'): string {
  try {
    // HH:MM 형식을 Date 객체로 변환
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return new Intl.DateTimeFormat(locale, { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (error) {
    console.error('시간 형식화 오류:', error);
    return timeString;
  }
}
