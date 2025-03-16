import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase';
import { UserProfile } from '../types/common';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

// 기본값과 함께 Context 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  getAccessToken: async () => null
});

// 컨텍스트 사용을 위한 훅 생성
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 초기 사용자 상태 로드
  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabaseUser = await getCurrentUser();
        
        if (supabaseUser) {
          setUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || '',
            email: supabaseUser.email || '',
            image: supabaseUser.user_metadata?.avatar_url,
            createdAt: new Date(supabaseUser.created_at).toISOString()
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // 인증 상태 변화 이벤트 구독
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || '',
          email: session.user.email || '',
          image: session.user.user_metadata?.avatar_url,
          createdAt: new Date(session.user.created_at).toISOString()
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    loadUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // 액세스 토큰 가져오기
  const getAccessToken = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data?.session) {
        console.error('토큰 가져오기 오류:', error);
        return null;
      }
      
      return data.session.access_token;
    } catch (error) {
      console.error('토큰 가져오기 오류:', error);
      return null;
    }
  };

  // 로그인 함수
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  };

  // 회원가입 함수
  const signUp = async (email: string, password: string, name: string) => {
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

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    }
  };

  // 프로필 업데이트
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          avatar_url: data.image
        }
      });

      if (error) throw error;
      
      // 성공적으로 업데이트되면 로컬 상태 업데이트
      if (user) {
        setUser({
          ...user,
          ...data
        });
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getAccessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
