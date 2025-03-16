import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcryptjs';

// 임시 사용자 데이터 저장소 (실제로는 DB를 사용해야 함)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

let users: User[] = [];

// 세션 관리 (실제로는 Redis나 DB를 사용)
interface Session {
  id: string;
  userId: string;
  expires: Date;
}

let sessions: Session[] = [];

// 사용자 등록
export async function registerUser(name: string, email: string, password: string): Promise<User | null> {
  // 이미 존재하는 이메일인지 확인
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return null;
  }
  
  // 비밀번호 해시 생성
  const hashedPassword = await hash(password, 10);
  
  // 새 사용자 생성
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  // 비밀번호를 제외한 사용자 정보 반환
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as any;
}

// 로그인 검증
export async function validateLogin(email: string, password: string): Promise<User | null> {
  // 사용자 찾기
  const user = users.find(user => user.email === email);
  if (!user) {
    return null;
  }
  
  // 비밀번호 확인
  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }
  
  // 비밀번호를 제외한 사용자 정보 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as any;
}

// 세션 생성
export function createSession(userId: string): Session {
  // 기존 세션 삭제
  sessions = sessions.filter(session => session.userId !== userId);
  
  // 새 세션 생성
  const newSession: Session = {
    id: uuidv4(),
    userId,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일
  };
  
  sessions.push(newSession);
  return newSession;
}

// 세션으로 사용자 찾기
export function getUserBySessionId(sessionId: string): User | null {
  const session = sessions.find(s => s.id === sessionId && s.expires > new Date());
  if (!session) {
    return null;
  }
  
  const user = users.find(u => u.id === session.userId);
  if (!user) {
    return null;
  }
  
  // 비밀번호를 제외한 사용자 정보 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as any;
}

// 세션 삭제 (로그아웃)
export function removeSession(sessionId: string): boolean {
  const initialLength = sessions.length;
  sessions = sessions.filter(session => session.id !== sessionId);
  
  return sessions.length < initialLength;
}
