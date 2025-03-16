import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { EventDetail } from '../../types/common';
import FloatingLabelInput from '../../components/form/FloatingLabelInput';
import EventContentManager from '../../components/events/EventContentManager';
import { motion } from 'framer-motion';

const EditEvent = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    status: 'draft',
  });
  const [eventContents, setEventContents] = useState([]);
  
  // 이벤트 정보 로드
  useEffect(() => {
    if (id) {
      // 실제 API 호출 대신 임시 데이터
      setTimeout(() => {
        const mockEvent: EventDetail = {
          id: id as string,
          title: '2023 개발자 컨퍼런스',
          description: '최신 웹 개발 트렌드와 기술을 공유하는 연례 컨퍼런스입니다.',
          date: '2023-06-15',
          time: '10:00',
          location: '서울 강남구 테헤란로 123, 개발자 센터',
          maxAttendees: 100,
          currentAttendees: 42,
          status: 'active',
          contents: [
            {
              id: 'content-1',
              type: 'heading',
              content: '이벤트 소개'
            },
            {
              id: 'content-2',
              type: 'text',
              content: '이 컨퍼런스에서는 최신 웹 기술과 개발 트렌드에 대한 인사이트를 얻을 수 있습니다. 다양한 세션과 네트워킹 기회가 제공됩니다.'
            },
            {
              id: 'content-3',
              type: 'image',
              content: 'https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
          ]
        };
        
        setEvent(mockEvent);
        setFormData({
          title: mockEvent.title,
          description: mockEvent.description,
          date: mockEvent.date,
          time: mockEvent.time,
          location: mockEvent.location,
          maxAttendees: String(mockEvent.maxAttendees || ''),
          status: mockEvent.status
        });
        setEventContents(mockEvent.contents);
        setLoading(false);
      }, 800);
    }
  }, [id]);

  // 입력 필드 변경 처리
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 콘텐츠 업데이트 처리
  const handleContentsUpdate = (updatedContents) => {
    setEventContents(updatedContents);
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const eventData = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        contents: eventContents
      };
      
      // API 호출 대신 임시 지연
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updated event data:', eventData);
      
      // 성공 시 이벤트 상세 페이지로 이동
      router.push(`/events/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="이벤트 로딩 중...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-400">이벤트 정보를 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout title="이벤트를 찾을 수 없음">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">이벤트를 찾을 수 없습니다</h1>
          <p className="text-gray-400 mb-8">
            요청하신 이벤트가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <Link href="/dashboard" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all">
            대시보드로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${event.title} 수정`}>
      <div className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 부분 */}
          <div className="mb-12">
            <div className="flex items-center mb-3 text-sm">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                대시보드
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link href={`/events/${id}`} className="text-gray-400 hover:text-white transition-colors">
                이벤트 상세
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-gray-300">수정</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">이벤트 수정</h1>
            <p className="text-gray-400 max-w-2xl">
              이벤트 정보를 업데이트하고 변경 사항을 저장하세요.
            </p>
          </div>
          
          {/* 폼 부분 */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            {/* 폼 헤더 */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-400 ml-2">events/{id}/edit</span>
                </div>
                <div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      formData.status === 'active'
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50'
                        : formData.status === 'draft'
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {formData.status === 'active' ? '진행 중' : formData.status === 'draft' ? '초안' : '종료됨'}
                  </span>
                </div>
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
                    />
                    
                    <FloatingLabelInput
                      label="설명"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      type="textarea"
                      required
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
                  />
                  
                  <FloatingLabelInput
                    label="시간"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    type="time"
                    required
                  />
                  
                  <div className="md:col-span-2">
                    <FloatingLabelInput
                      label="장소"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
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
                  href={`/events/${id}`}
                  className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-primary/10 hover:shadow-primary/20 flex items-center"
                  disabled={saving}
                >
                  {saving ? (
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
                      저장 중...
                    </>
                  ) : (
                    '변경사항 저장'
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

export default EditEvent;
