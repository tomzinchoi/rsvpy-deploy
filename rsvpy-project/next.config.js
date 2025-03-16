/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 불필요한 리디렉션 제거
  async redirects() {
    return [];
  },
  // 이미지 도메인 설정
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  // 캐시 최적화
  onDemandEntries: {
    // 개발 서버에서 페이지 캐시 유지 시간 (ms)
    maxInactiveAge: 60 * 1000,
    // 한 번에 캐시할 최대 페이지 수
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
