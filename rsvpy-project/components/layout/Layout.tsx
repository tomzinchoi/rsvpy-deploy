import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  withHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'RSVPY - 프리미엄 이벤트 관리 플랫폼',
  withHeader = true
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="프리미엄 이벤트 관리 및 3D 티켓 생성 플랫폼" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-black text-white flex flex-col">
        {withHeader && <Header />}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {!withHeader && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 text-center text-xs text-gray-600 py-2"
          >
            © 2023 RSVPY. All rights reserved.
          </motion.div>
        )}
      </div>
    </>
  );
}

export default Layout;
