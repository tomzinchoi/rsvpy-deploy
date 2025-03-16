import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatEnglishName, isEnglishOrNumbersOrSpaces } from '../../utils/ticketUtils';
import FloatingLabelInput from '../form/FloatingLabelInput';
import { motion } from 'framer-motion';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle
}) => {
  // 폼 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // 오류 메시지
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    terms: '',
    general: ''
  });
  
  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const router = useRouter();
  
  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setAgreeTerms(false);
      setErrors({
        name: '',
        email: '',
        phone: '',
        terms: '',
        general: ''
      });
      setIsSubmitting(false);
      setIsSuccess(false);
      setTicketId('');
    }
  }, [isOpen]);
  
  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      terms: '',
      general: ''
    };
    let isValid = true;
    
    // 이름 검증
    if (!name.trim()) {
      newErrors.name = '이름을 입력하세요';
      isValid = false;
    } else if (!isEnglishOrNumbersOrSpaces(name) && name.length > 50) {
      newErrors.name = '이름은 50자 이내로 입력하세요';
      isValid = false;
    }
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = '이메일을 입력하세요';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력하세요';
      isValid = false;
    }
    
    // 약관 동의 검증
    if (!agreeTerms) {
      newErrors.terms = '이용 약관에 동의해야 합니다';
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
    
    setIsSubmitting(true);
    setErrors({...errors, general: ''});
    
    try {
      // API 호출 모의 (실제 앱에서는 실제 API 호출로 대체)
      // const response = await fetch(`/api/events/${eventId}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, phone })
      // });
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 성공 처리
      const mockTicketId = `${Date.now()}-${eventId}-DEMO`;
      setTicketId(mockTicketId);
      setIsSuccess(true);
      
      // 3초 후에 티켓 페이지로 리디렉션
      setTimeout(() => {
        router.push({
          pathname: `/r/${eventId}/ticket`,
          query: {
            name: formatEnglishName(name),
            email,
            ticketId: mockTicketId
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('등록 오류:', error);
      setErrors({
        ...errors,
        general: '등록 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
      setIsSubmitting(false);
    }
  };
  
  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* 헤더 */}
          <div className="relative bg-zinc-800 p-4 border-b border-zinc-700">
            <button
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-white"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-white">이벤트 참가 등록</h2>
            <p className="text-sm text-gray-400 mt-1">{eventTitle}</p>
          </div>
          
          {/* 본문 */}
          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">등록이 완료되었습니다!</h3>
                <p className="text-gray-400 mb-6">
                  티켓이 생성되었습니다. 잠시 후 티켓 페이지로 이동합니다...
                </p>
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="absolute h-full bg-primary animate-loading-progress"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 일반 오류 메시지 */}
                {errors.general && (
                  <div className="mb-6 p-3 bg-red-900/20 border border-red-900/40 text-red-400 rounded-lg text-sm">
                    {errors.general}
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* 이름 입력 필드 */}
                  <FloatingLabelInput
                    label="이름"
                    name="name"
                    value={name}
                    onChange={(_, value) => setName(value)}
                    error={errors.name}
                    required
                    disabled={isSubmitting}
                  />
                  
                  {/* 이메일 입력 필드 */}
                  <FloatingLabelInput
                    label="이메일"
                    name="email"
                    value={email}
                    onChange={(_, value) => setEmail(value)}
                    error={errors.email}
                    required
                    disabled={isSubmitting}
                  />
                  
                  {/* 연락처 입력 필드 */}
                  <FloatingLabelInput
                    label="연락처 (선택)"
                    name="phone"
                    value={phone}
                    onChange={(_, value) => setPhone(value)}
                    error={errors.phone}
                    disabled={isSubmitting}
                  />
                  
                  {/* 약관 동의 체크박스 */}
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 rounded bg-zinc-800 border-zinc-700 text-primary focus:ring-primary focus:ring-opacity-25"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-400">
                        본인은 <a href="#" className="text-primary hover:underline">개인정보 처리방침</a>에
                        동의하며, 이벤트 관련 정보를 제공받는 것에 동의합니다.
                      </span>
                    </label>
                    {errors.terms && <p className="mt-1 text-sm text-red-400">{errors.terms}</p>}
                  </div>
                </div>
                
                {/* 버튼 영역 */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 sm:py-3 border border-zinc-700 hover:border-zinc-500 text-gray-400 hover:text-white rounded-lg transition-all"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 sm:py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
                        등록 중...
                      </>
                    ) : (
                      '등록하기'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationModal;
