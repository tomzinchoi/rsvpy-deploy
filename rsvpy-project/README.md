# RSVPY - 프리미엄 이벤트 관리 플랫폼

RSVPY는 웹 기반 이벤트 관리 플랫폼으로, 특별한 3D 티켓 경험을 제공합니다. 독특한 시각적 경험과 쉽고 효율적인 이벤트 관리를 결합하여 이벤트 주최자와 참가자 모두에게 특별한 경험을 제공합니다.

## 주요 기능

- 🎫 **3D 인터랙티브 티켓**: Three.js를 활용한 독특한 3D 티켓 경험
- 📱 **모바일 최적화 UI**: 데스크톱 및 모바일 기기에서 완벽하게 작동하는 반응형 디자인
- 📊 **이벤트 관리**: 이벤트 생성, 편집, 참가자 관리를 위한 직관적인 인터페이스
- 🔒 **안전한 인증**: 사용자 및 티켓 정보 보안을 위한 안전한 인증 시스템
- 🚀 **효율적인 체크인**: QR 코드를 통한 빠른 이벤트 체크인 프로세스

## 기술 스택

### 프론트엔드
- Next.js - React 프레임워크
- TypeScript - 정적 타입 지원
- Tailwind CSS - 디자인 시스템
- Framer Motion - 애니메이션
- Three.js - 3D 렌더링

### 백엔드 (개발 중)
- Next.js API Routes
- Prisma ORM
- PostgreSQL 데이터베이스

### 인프라 (계획)
- Vercel 배포
- Supabase 인증
- AWS S3 스토리지

## 시작하기

### 필수 조건
- Node.js 16.x 이상
- npm 또는 yarn
- Git

### 개발 환경 설정
1. 레포지토리 복제
   ```bash
   git clone https://github.com/yourusername/rsvp-app.git
   cd rsvp-app
   ```

2. 의존성 설치
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 개발 서버 실행
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. 브라우저에서 `http://localhost:3000` 열기

### 환경 변수
다음 환경 변수를 `.env.local` 파일에 설정:

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 설치 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/tomzinchoi/rsvp-app.git
   cd rsvp-app
   ```

2. 의존성 설치:
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정:
   `.env.local` 파일을 생성하고 다음 변수를 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 `http://localhost:3000`으로 접속

남은 작업이 있다면 다음과 같은 것들이 있을 수 있습니다:

단위 및 통합 테스트 작성
실제 백엔드 API와의 연결 구현
성능 최적화
접근성(a11y) 개선
그러나 현재 상태로도 애플리케이션은 실사용이 가능한 수준으로 구현되었습니다.