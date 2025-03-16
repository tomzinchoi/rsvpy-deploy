import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase 설정
// 참고: 실제 환경에서는 환경 변수에서 로드해야 함
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'rsvpy-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'rsvpy-app',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'rsvpy-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

// Firebase 앱 초기화
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase 서비스
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development') {
  // 이미 에뮬레이터에 연결되어 있지 않은 경우에만 연결
  if (window.location.hostname === 'localhost') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    } catch (error) {
      console.error('Failed to connect to Firebase emulators:', error);
    }
  }
}

export default app;

// Firebase Firestore 헬퍼 함수
export const firestoreHelper = {
  // 컬렉션에서 문서 목록 가져오기
  getCollection: async <T>(collectionName: string): Promise<T[]> => {
    // 구현 필요...
    return [];
  },
  
  // 단일 문서 가져오기
  getDocument: async <T>(collectionName: string, documentId: string): Promise<T | null> => {
    // 구현 필요...
    return null;
  },
  
  // 문서 생성 또는 업데이트
  setDocument: async <T>(collectionName: string, documentId: string, data: T): Promise<void> => {
    // 구현 필요...
  },
  
  // 문서 삭제
  deleteDocument: async (collectionName: string, documentId: string): Promise<void> => {
    // 구현 필요...
  },
};
