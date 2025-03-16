import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// 보호된 경로 목록
const PROTECTED_ROUTES = [
  '/dashboard',
  '/events/create',
  '/profile',
];

// 인증이 필요하지 않은 특별 경로 (예: public API)
const PUBLIC_ROUTES = [
  '/api/public',
  '/r/',
  '/_next/',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  // 현재 URL 경로
  const path = request.nextUrl.pathname;
  
  // PUBLIC_ROUTES로 시작하는 경로인지 확인
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }
  
  // PROTECTED_ROUTES에 포함된 경로인지 확인
  const requiresAuth = PROTECTED_ROUTES.some(route => path.startsWith(route));
  
  if (!requiresAuth) {
    return NextResponse.next();
  }
  
  try {
    // Supabase 클라이언트 생성 (서버 측)
    const { supabaseClient } = createServerSupabaseClient({ req: request, res: NextResponse.next() });

    // 현재 세션 가져오기
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    // 인증된 사용자가 없고 보호된 경로에 접근하려는 경우
    if (!session && requiresAuth) {
      const redirectUrl = new URL('/auth/signin', request.url);
      // 로그인 후 원래 페이지로 리디렉션 하기 위한 정보 추가
      redirectUrl.searchParams.set('redirect', encodeURI(request.nextUrl.pathname));
      return NextResponse.redirect(redirectUrl);
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('미들웨어 오류:', error);
    // 오류가 발생했을 경우 기본 동작은 그냥 다음 단계로 넘어가기
    return NextResponse.next();
  }
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
