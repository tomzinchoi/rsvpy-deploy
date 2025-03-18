import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import Link from 'next/link';
import MobileEventEditor from '../../../components/events/MobileEventEditor';
import SlideupModal from '../../../components/common/SlideupModal';
import MobileInputField from '../../../components/form/MobileInputField';
import { EventDetail, EventContent } from '../../../types/common';

const EditEventPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    status: 'draft',
  });
  const [eventContents, setEventContents] = useState<EventContent[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 모바일 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 이벤트 정보 로딩
  useEffect(() => {
    if (id) {
      // 실제 API 요청 대신 임시 데이터 사용
      setTimeout(() => {
        const mockEvent: EventDetail = {
          id: id as string,
          title: id === '1' ? '2023 개발자 컨퍼런스' : `이벤트 ${id}`,
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
          status: mockEvent.status || 'draft',
        });
        setEventContents(mockEvent.contents || []);
        setLoading(false);
      }, 800);
    }
  }, [id]);

  // 입력 필드 변경 처리
  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 콘텐츠 업데이트 처리
  const handleContentsUpdate = (updatedContents: EventContent[]) => {
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
        contents: eventContents,
      };
      
      // MVP에서는 콘솔에 데이터 출력 (나중에 실제 API 연결)
      console.log('이벤트 업데이트 데이터:', { id, ...eventData });

      // 성공적으로 업데이트 되면 이벤트 상세 페이지로 리디렉션
      setTimeout(() => {
        router.push(`/events/${id}`);
      }, 1500);
    } catch (error) {
      console.error('이벤트 업데이트 오류:', error);
      setSaving(false);
    }
  };

  // 모달 열기
  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  // 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
  };

  if (loading) {
    return (
      <Layout title="이벤트 로딩 중...">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-400">정보를 불러오는 중입니다...</p>
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
          <Link href="/dashboard" className="btn-primary">
            대시보드로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  // 모바일 버전
  if (isMobile) {
    return (
      <Layout title={`${event.title} 편집`}>
        <div className="pt-20 pb-32 px-4">
          <div className="mb-6">
            <Link href={`/events/${id}`} className="text-sm text-gray-400 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
              </svg>
              이벤트로 돌아가기
            </Link>
            
            <h1 className="text-2xl font-bold mt-4 mb-2">이벤트 편집</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center
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

          {/* 모바일 에디터 버튼 그룹 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => openModal('basicInfo')}
              className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">기본 정보</h3>
                  <p className="text-lg font-medium mt-1 truncate">{formData.title}</p>
                </div>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => openModal('dateLocation')}
              className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">날짜 및 장소</h3>
                  <p className="text-base font-medium mt-1 truncate">{formData.date}</p>
                </div>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => openModal('settings')}
              className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">이벤트 설정</h3>
                  <p className="text-base font-medium mt-1">설정 관리</p>
                </div>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => openModal('contents')}
              className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">콘텐츠 편집</h3>
                  <p className="text-base font-medium mt-1">{eventContents.length}개 항목</p>
                </div>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* 미리보기 섹션 */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 mb-6">
            <h2 className="font-medium mb-4">미리보기</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              {eventContents.map(content => {
                switch (content.type) {
                  case 'heading':
                    return <h3 key={content.id} className="text-xl font-bold">{content.content}</h3>;
                  case 'text':
                    return <p key={content.id} className="text-gray-300">{content.content}</p>;
                  case 'image':
                    return (
                      <div key={content.id} className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                        <img src={content.content} alt="이벤트 콘텐츠" className="object-cover" />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 p-4 border-t border-zinc-800 backdrop-blur-sm">
            <div className="flex justify-between gap-4">
              <Link
                href={`/events/${id}`}
                className="w-1/3 py-3 border border-zinc-700 hover:border-zinc-600 text-gray-300 hover:text-white rounded-lg text-center"
              >
                취소
              </Link>
              <button
                onClick={handleSubmit}
                className="w-2/3 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg flex items-center justify-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5"
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
                  '저장하기'
                )}
              </button>
            </div>
          </div>

          {/* 기본 정보 모달 */}
          <SlideupModal
            isOpen={activeModal === 'basicInfo'}
            onClose={closeModal}
            title="기본 정보 편집"
          >
            <div className="space-y-6">
              <MobileInputField
                label="이벤트 제목"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="이벤트 제목을 입력하세요"
                required
              />
              <MobileInputField
                label="이벤트 설명"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="이벤트에 대한 설명을 입력하세요"
                type="textarea"
                required
              />
              <button
                onClick={closeModal}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg"
              >
                확인
              </button>
            </div>
          </SlideupModal>

          {/* 날짜 및 장소 모달 */}
          <SlideupModal
            isOpen={activeModal === 'dateLocation'}
            onClose={closeModal}
            title="날짜 및 장소 편집"
          >
            <div className="space-y-6">
              <MobileInputField
                label="날짜"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                type="date"
                required
              />
              <MobileInputField
                label="시간"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                type="time"
                required
              />
              <MobileInputField
                label="장소"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="이벤트 장소를 입력하세요"
                required
              />
              <button
                onClick={closeModal}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg"
              >
                확인
              </button>
            </div>
          </SlideupModal>

          {/* 설정 모달 */}
          <SlideupModal
            isOpen={activeModal === 'settings'}
            onClose={closeModal}
            title="이벤트 설정"
          >
            <div className="space-y-6">
              <MobileInputField
                label="최대 참석자 수"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleInputChange}
                type="number"
                placeholder="비워두면 제한 없음"
                helpText="최대 참석자 수를 지정하세요. 비워두면 제한이 없습니다."
              />
              
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <label className="block text-sm font-medium mb-3 text-gray-300">이벤트 상태</label>
                <div className="grid grid-cols-3 gap-2">
                  {['draft', 'active', 'ended'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleInputChange('status', status)}
                      className={`py-2 px-3 rounded text-center text-sm ${
                        formData.status === status
                          ? status === 'active'
                            ? 'bg-green-900/50 text-green-400 border border-green-900/70'
                            : status === 'draft'
                              ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-900/70'
                              : 'bg-gray-700/50 text-gray-300 border border-gray-600/70'
                          : 'bg-zinc-800 text-gray-400 border border-zinc-700'
                      }`}
                    >
                      {status === 'active' ? '진행 중' : status === 'draft' ? '초안' : '종료됨'}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={closeModal}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg"
              >
                확인
              </button>
            </div>
          </SlideupModal>

          {/* 콘텐츠 모달 */}
          <SlideupModal
            isOpen={activeModal === 'contents'}
            onClose={closeModal}
            title="콘텐츠 편집"
            fullScreen
          >
            <MobileEventEditor 
              contents={eventContents} 
              onUpdate={handleContentsUpdate} 
            />
          </SlideupModal>
        </div>
      </Layout>
    );
  }

  // 데스크톱 버전
  return (
    <Layout title={`${event.title} 수정`}>
      <div className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="mb-12">
            <div className="flex items-center mb-3 text-sm">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                대시보드
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <Link
                href={`/events/${id}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                이벤트 상세
              </Link>
              <span className="mx-2 text-gray-600">/</span>
              <span className="text-gray-300">수정</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">이벤트 수정</h1>
            <p className="text-gray-400 max-w-2xl">
              이벤트 정보를 업데이트하고 변경사항을 저장하세요.
            </p>
          </div>

          {/* 폼 섹션 */}
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
                    {formData.status === 'active'
                      ? '진행 중'
                      : formData.status === 'draft'
                        ? '초안'
                        : '종료됨'}
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
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium mb-2 text-gray-300"
                      >
                        이벤트 제목*
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="예: 2023 개발자 컨퍼런스"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-2 text-gray-300"
                      >
                        이벤트 설명*
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="이벤트에 대한 설명을 입력하세요..."
                        disabled={saving}
                      />
                    </div>
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
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-300">
                      날짜*
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-2 text-gray-300">
                      시간*
                    </label>
                    <input
                      id="time"
                      name="time"
                      type="time"
                      required
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      disabled={saving}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      장소*
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="예: 서울 강남구 테헤란로 123"
                      disabled={saving}
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
                
                <div className="space-y-4 mb-6">
                  {eventContents.map((content, index) => (
                    <div key={content.id} className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
                      {content.type === 'heading' && (
                        <h3 className="text-lg font-bold">{content.content}</h3>
                      )}
                      {content.type === 'text' && (
                        <p className="text-gray-300">{content.content}</p>
                      )}
                      {content.type === 'image' && (
                        <div className="relative aspect-w-16 aspect-h-9 bg-zinc-900 rounded overflow-hidden">
                          <img src={content.content} alt="이미지" className="object-cover" />
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (index > 0) {
                              const newContents = [...eventContents];
                              [newContents[index], newContents[index - 1]] = [newContents[index - 1], newContents[index]];
                              handleContentsUpdate(newContents);
                            }
                          }}
                          disabled={index === 0}
                          className={`p-1.5 rounded ${index === 0 ? 'text-gray-600 bg-zinc-800' : 'text-gray-400 bg-zinc-800 hover:bg-zinc-700'}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (index < eventContents.length - 1) {
                              const newContents = [...eventContents];
                              [newContents[index], newContents[index + 1]] = [newContents[index + 1], newContents[index]];
                              handleContentsUpdate(newContents);
                            }
                          }}
                          disabled={index === eventContents.length - 1}
                          className={`p-1.5 rounded ${index === eventContents.length - 1 ? 'text-gray-600 bg-zinc-800' : 'text-gray-400 bg-zinc-800 hover:bg-zinc-700'}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newContents = eventContents.filter(item => item.id !== content.id);
                            handleContentsUpdate(newContents);
                          }}
                          className="p-1.5 text-red-500 hover:text-red-400 bg-red-900/20 hover:bg-red-900/30 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center py-2">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                      <button
                        type="button"
                        onClick={() => {
                          const newContent: EventContent = {
                            id: `heading-${Date.now()}`,
                            type: 'heading',
                            content: '새 제목'
                          };
                          handleContentsUpdate([...eventContents, newContent]);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-l-lg hover:bg-zinc-700 focus:z-10"
                      >
                        제목 추가
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newContent: EventContent = {
                            id: `text-${Date.now()}`,
                            type: 'text',
                            content: '새 텍스트 내용을 입력하세요.'
                          };
                          handleContentsUpdate([...eventContents, newContent]);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-zinc-800 border-t border-b border-zinc-700 hover:bg-zinc-700 focus:z-10"
                      >
                        텍스트 추가
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newContent: EventContent = {
                            id: `image-${Date.now()}`,
                            type: 'image',
                            content: ''
                          };
                          handleContentsUpdate([...eventContents, newContent]);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-r-lg hover:bg-zinc-700 focus:z-10"
                      >
                        이미지 추가
                      </button>
                    </div>
                  </div>
                </div>
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
                    <label
                      htmlFor="maxAttendees"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      최대 참가자 수
                    </label>
                    <input
                      id="maxAttendees"
                      name="maxAttendees"
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                      placeholder="비워두면 제한 없음"
                      disabled={saving}
                    />
                    <p className="mt-1 text-xs text-gray-500">비워두면 참가자 수 제한이 없습니다.</p>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium mb-2 text-gray-300"
                    >
                      이벤트 상태
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={saving}
                    >
                      <option value="draft">초안</option>
                      <option value="active">진행 중</option>
                      <option value="ended">종료됨</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">이벤트 상태에 따라 참석자 등록이 활성화/비활성화됩니다.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
                <Link
                  href={`/events/${id}`}
                  className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                >
                  취소
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                    </div>
                  ) : (
                    '저장하기'
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

export default EditEventPage;
