import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  withHeader?: boolean;
  transparentHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = '개인 이벤트 관리 플랫폼 - RSVPY',
  withHeader = true,
  transparentHeader = false
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {withHeader && <Header transparent={transparentHeader} />}
      
      <main className={`flex min-h-screen flex-col bg-white ${withHeader ? '' : ''}`}>
        {children}
      </main>
    </>
  );
};

export default Layout;
