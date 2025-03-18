/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'], // 필요한 도메인 추가
    unoptimized: true, // 개발 환경에서 이미지 최적화 비활성화
  },
};

module.exports = nextConfig;
