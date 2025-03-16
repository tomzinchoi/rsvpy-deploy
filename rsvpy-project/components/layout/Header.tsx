import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  
  // 임시 인증 상태 - 실제로는 AuthContext에서 가져와야 함
  const { user, loading, signOut } = useAuth();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-zinc-800/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 */}
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* 데스크톱 내비게이션 */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/features" 
              className={`px-3 py-2 text-sm font-medium ${
                router.pathname === '/features' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white transition-colors'
              }`}
            >
              기능
            </Link>
            <Link 
              href="/pricing" 
              className={`px-3 py-2 text-sm font-medium ${
                router.pathname === '/pricing' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white transition-colors'
              }`}
            >
              가격
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-medium ${
                router.pathname === '/about' 
                  ? 'text-white' 
                  : 'text-gray-300 hover:text-white transition-colors'
              }`}
            >
              소개
            </Link>
            
            {/* 로그인 여부에 따라 다른 버튼 표시 */}
            {loading ? (
              <div className="h-8 w-24 bg-zinc-800 rounded-md animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 rounded-full pr-3 pl-1 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-10"
                    >
                      <Link 
                        href="/dashboard" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        대시보드
                      </Link>
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        내 프로필
                      </Link>
                      <button 
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 border-t border-zinc-800"
                      >
                        로그아웃
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/signin" 
                  className="text-sm font-medium text-gray-200 hover:text-white"
                >
                  로그인
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  시작하기
                </Link>
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-t border-zinc-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/features" 
                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                기능
              </Link>
              <Link 
                href="/pricing" 
                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                가격
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>

              {/* 로그인 여부에 따라 다른 옵션 표시 */}
              {loading ? (
                <div className="h-10 bg-zinc-800 rounded-md animate-pulse"></div>
              ) : user ? (
                <>
                  <div className="border-t border-zinc-800 pt-4 mt-4">
                    <div className="flex items-center px-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center overflow-hidden">
                          {user.image ? (
                            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="font-medium">{user.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">{user.name}</div>
                        <div className="text-sm font-medium text-gray-400">{user.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link 
                        href="/dashboard" 
                        className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        대시보드
                      </Link>
                      <Link 
                        href="/profile" 
                        className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        내 프로필
                      </Link>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full text-left block px-3 py-2 rounded-md text-red-400 hover:bg-zinc-800 hover:text-red-300 text-base font-medium"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-zinc-800 pt-4 mt-4 flex flex-col space-y-2">
                  <Link 
                    href="/auth/signin" 
                    className="block px-3 py-2 rounded-md text-gray-300 hover:bg-zinc-800 hover:text-white text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-3 py-2 rounded-md bg-primary hover:bg-primary-dark text-white text-center text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    시작하기
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
