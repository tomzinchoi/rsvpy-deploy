import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth(); // useAuth 훅에서 user와 signOut 가져오기
  
  // Track scroll position for changing header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);
  
  // Clean navigation styles
  const navLinkClasses = "font-medium text-[15px] transition-colors text-zinc-700 hover:text-black";
  
  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-12 pointer-events-none">
      <div className="container mx-auto max-w-[1400px]">
        <header className={`border border-zinc-200/60 rounded-xl shadow-sm py-3 px-4 md:px-6 -mx-4 pointer-events-auto ${isScrolled || !transparent ? 'bg-white/95 backdrop-blur-sm' : 'bg-transparent'}`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Logo 
                size="md" 
                color={isScrolled || !transparent ? "#1E2330" : "#1E2330"} 
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/templates" className={navLinkClasses}>템플릿</Link>
              <Link href="/features" className={navLinkClasses}>기능</Link>
              <Link href="/pricing" className={navLinkClasses}>요금제</Link>
              <Link href="/about" className={navLinkClasses}>소개</Link>
            </nav>
            
            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  로그아웃
                </button>
              ) : (
                <>
                  <Link href="/auth/signin" 
                    className="px-4 py-2 rounded-md font-medium text-zinc-800 hover:text-black transition-all">
                    로그인
                  </Link>
                  <Link href="/auth/signup" 
                    className="px-4 py-2 rounded-md font-medium bg-[#7722cf] hover:bg-[#6317a9] 
                    text-white transition-all">
                    무료로 시작하기
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Link href="/auth/signin" className="text-sm font-medium text-zinc-800 mr-3">
                로그인
              </Link>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-zinc-100/80 w-12 h-12 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white mt-2 mx-auto max-w-[1400px] rounded-xl overflow-hidden pointer-events-auto shadow-md"
            style={{ zIndex: 1, overflow: "scroll" }}
          >
            <div className="py-2">
              <nav className="flex flex-col">
                {[
                  { name: "템플릿", href: "/templates" },
                  { name: "기능", href: "/features" },
                  { name: "요금제", href: "/pricing" }, 
                  { name: "소개", href: "/about" }
                ].map((item) => (
                  <div key={item.name} className="py-3 border-b border-zinc-100 px-4">
                    <Link 
                      href={item.href} 
                      className="flex items-center justify-between"
                    >
                      <span className="text-lg font-semibold">{item.name}</span>
                      <div>
                        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                ))}
              </nav>
              
              <div className="py-4 px-4">
                <Link href="/auth/signup" 
                  className="w-full block py-3 px-4 rounded-md bg-[#7722cf] hover:bg-[#6317a9] 
                  text-white text-center font-medium">
                  무료로 시작하기
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
