import { v4 as uuidv4 } from 'uuid';
import { auth } from './supabase';
import { User, Session } from '@supabase/supabase-js';

// 임시 사용자 데이터 저장소 (실제로는 DB를 사용해야 함)
interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

let users: UserData[] = [];

// 세션 관리 (실제로는 Redis나 DB를 사용)
interface SessionData {
  id: string;
  userId: string;
  expires: Date;
}

let sessions: SessionData[] = [];

// 사용자 등록 - bcryptjs 대신 단순 저장 (개발용)
export async function registerUser(name: string, email: string): Promise<UserData | null> {
  // 이미 존재하는 이메일인지 확인
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return null;
  }
  
  // 새 사용자 생성
  const newUser: UserData = {
    id: uuidv4(),
    name,
    email,
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
}

// 세션 생성
export function createSession(userId: string): SessionData {
  // 기존 세션 삭제
  sessions = sessions.filter(session => session.userId !== userId);
  
  // 새 세션 생성
  const newSession: SessionData = {
    id: uuidv4(),
    userId,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일
  };
  
  sessions.push(newSession);
  return newSession;
}

// 세션으로 사용자 찾기
export function getUserBySessionId(sessionId: string): UserData | null {
  const session = sessions.find(s => s.id === sessionId && s.expires > new Date());
  if (!session) {
    return null;
  }
  
  const user = users.find(u => u.id === session.userId);
  return user || null;
}

// 세션 삭제 (로그아웃)
export function removeSession(sessionId: string): boolean {
  const initialLength = sessions.length;
  sessions = sessions.filter(session => session.id !== sessionId);
  
  return sessions.length < initialLength;
}

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Sign in with social provider
 */
export const signInWithProvider = async (provider: 'google' | 'kakao') => {
  const { data, error } = await auth.signInWithOAuth({
    provider
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await auth.signOut();
  
  if (error) throw error;
  
  return true;
};

/**
 * Get the current user session
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await auth.getSession();
  
  if (error) throw error;
  
  return data?.session || null;
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await auth.getUser();
  
  if (error) throw error;
  
  return data?.user || null;
};

/**
 * Set up auth state change listener
 */
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
  
  return data;
};

/**
 * Update user profile
 */
export const updateProfile = async (profile: { name?: string, avatar_url?: string }) => {
  const { data, error } = await auth.updateUser({
    data: profile
  });
  
  if (error) throw error;
  
  return data;
};
