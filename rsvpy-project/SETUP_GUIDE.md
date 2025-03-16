# RSVPY 설정 가이드

## 1. 저장소 초기화
```bash
git init
```

## 2. 의존성 설치
```bash
npm install
# 또는
yarn install
```

## 3. 환경 변수 설정
`.env.local.example` 파일을 `.env.local`로 복사하고 실제 값으로 업데이트하세요.

## 4. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

## 5. 새 GitHub 저장소에 푸시
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo-name.git
git push -u origin main
```
