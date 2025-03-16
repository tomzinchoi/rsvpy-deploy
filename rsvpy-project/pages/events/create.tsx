import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { EventContent } from '../../types/common';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import EventContentManager from '../../components/events/EventContentManager';
import { motion } from 'framer-motion';

const CreateEvent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().substring(0, 10), // 오늘 날짜를 기본값으로
    time: '10:00', // 기본 시간
    location: '',
    maxAttendees: '',
    status: 'draft' as 'draft' | 'active' | 'ended'
  });
  
  const [eventContents, setEventContents] = useState<EventContent[]>([]);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 입력 필드 변경 처리
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 상태 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 콘텐츠 업데이트 처리
  const handleContentsUpdate = (updatedContents: EventContent[]) => {
    setEventContents(updatedContents);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // 필수 필드 검사
    if (!formData.title.trim()) {
      newErrors.title = '이벤트 제목은 필수입니다';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = '이벤트 설명은 필수입니다';
      isValid = false;
    }
    
    if (!formData.date) {
      newErrors.date = '이벤트 날짜는 필수입니다';
      isValid = false;
    }
    
    if (!formData.time) {
      newErrors.time = '이벤트 시간은 필수입니다';
      isValid = false;
    }
    
    if (!formData.location.trim()) {
      newErrors.location = '이벤트 장소는 필수입니다';
      isValid = false;
    }
    
    // 최대 참가자 수가 입력된 경우 숫자인지 확인
    if (formData.maxAttendees && isNaN(Number(formData.maxAttendees))) {
      newErrors.maxAttendees = '최대 참가자 수는 숫자여야 합니다';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setCreating(true);
    
    try {
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        contents: eventContents,
        currentAttendees: 0
      };
      
      // API 호출 대신 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Created event data:', eventData);
      
      // 성공 시 대시보드로 이동
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      setCreating(false);
    }
  };

  return (
    <Layout title="새 이벤트 만들기">
      <div className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 부분 */}
          <div className="mb-12">
            <div className="flex items-center mb-3 text-sm">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                대시보드
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-gray-300">새 이벤트</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">새 이벤트 만들기</h1>
            <p className="text-gray-400 max-w-2xl">
              새로운 이벤트를 생성하고 참가자들을 초대하세요. 모든 정보는 나중에 수정할 수 있습니다.
            </p>
          </div>
          
          {/* 폼 부분 */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            {/* 폼 헤더 */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center">
                <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-400 ml-2">events/create</span>
              </div>
            </div>
            
            {/* 폼 내용 */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              {/* 기본 정보 섹션 */}
              <div>
                <h2 className="text-xl font-medium mb-6 flex items-center text-white">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
                    1
                  </span>
                  기본 정보
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FloatingLabelInput
                      label="이벤트 제목"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      error={errors.title}
                    />
                    
                    <FloatingLabelInput
                      label="설명"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      type="textarea"
                      required
                      error={errors.description}
                    />
                  </div>
                </div>
              </div>
              
              {/* 날짜 및 시간 섹션 */}
              <div>
                <h2 className="text-xl font-medium mb-6 flex items-center text-white">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
                    2
                  </span>
                  날짜 및 장소
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FloatingLabelInput
                    label="날짜"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    type="date"
                    required
                    error={errors.date}
                  />
                  
                  <FloatingLabelInput
                    label="시간"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    type="time"
                    required
                    error={errors.time}
                  />
                  
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      label="장소"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      error={errors.location}
                    />
                  </div>
                </div>
              </div>
              
              {/* 이벤트 콘텐츠 섹션 */}
              <div>
                <h2 className="text-xl font-medium mb-6 flex items-center text-white">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
                    3
                  </span>
                  이벤트 콘텐츠
                </h2>
                
                <EventContentManager 
                  contents={eventContents}
                  onUpdate={handleContentsUpdate}
                />
              </div>
              
              {/* 설정 섹션 */}
              <div>
                <h2 className="text-xl font-medium mb-6 flex items-center text-white">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
                    4
                  </span>
                  이벤트 설정
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FloatingLabelInput
                      label="최대 참가자 수"
                      name="maxAttendees"
                      value={formData.maxAttendees}
                      onChange={handleInputChange}
                      type="number"
                      helpText="비워두면 제한 없음"
                      error={errors.maxAttendees}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      이벤트 상태
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('status', 'draft')}
                        className={`py-3 px-4 rounded text-center ${
                          formData.status === 'draft'
                            ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'
                            : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        초안
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('status', 'active')}
                        className={`py-3 px-4 rounded text-center ${
                          formData.status === 'active'
                            ? 'bg-green-900/30 text-green-400 border border-green-900/50'
                            : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        진행 중
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('status', 'ended')}
                        className={`py-3 px-4 rounded text-center ${
                          formData.status === 'ended'
                            ? 'bg-gray-700/50 text-gray-300 border border-gray-600/70'
                            : 'bg-zinc-800 text-gray-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        종료됨
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 저장 버튼 */}
              <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-primary/10 hover:shadow-primary/20 flex items-center"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      생성 중...
                    </>
                  ) : (
                    '이벤트 생성'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvent;
