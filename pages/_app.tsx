import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 페이지 전환 효과를 위한 키 생성
  const pageKey = router.asPath;
  
  // 분석 및 성능 추적 (실제 앱에서 구현)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // 페이지 뷰 추적 로직
      console.log(`페이지 전환: ${url}`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // 개발 환경에서 디렉토리 설정 확인
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 대신 API route를 호출하여 서버 사이드에서 체크
      fetch('/api/system/check-directories')
        .catch(err => {
          console.warn('Failed to check directories:', err);
        });
    }
  }, []);

  // 앱 테마 및 사용자 설정 로드
  useEffect(() => {
    // 사용자 기본 설정을 로컬 스토리지에서 로드하는 로직을 여기에 추가
    // 예: 다크 모드 상태, 언어 설정 등
    const loadUserSettings = () => {
      try {
        // 실제 앱에서는 여기에 사용자 설정 로드 로직 구현
      } catch (error) {
        console.error('사용자 설정 로드 오류:', error);
      }
    };

    loadUserSettings();
  }, []);

  // Handle page transitions - add loading states if needed
  useEffect(() => {
    const handleStart = () => {
      // You could set a loading state here
    };
    
    const handleComplete = () => {
      // And reset it here
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <AuthProvider>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </AuthProvider>
    </>
  );
}

export default MyApp;
