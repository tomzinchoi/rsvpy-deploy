import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return user;
  } catch (error) {
    console.error('현재 사용자 정보를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// 회원가입
export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    throw error;
  }
}

// 로그인
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
}

// 로그아웃
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    throw error;
  }
}

// 프로필 데이터 업데이트
export async function updateProfile(userId: string, data: { name?: string; avatar_url?: string }) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    throw error;
  }
}

// 파일 업로드
export async function uploadFile(bucket: string, path: string, file: File) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error);
    throw error;
  }
}

// 공개 파일 URL 생성
export function getPublicFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
