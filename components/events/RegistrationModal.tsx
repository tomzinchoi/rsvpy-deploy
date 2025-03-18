import React, { useState } from 'react';
import SlideupModal from '../common/SlideupModal';
import MobileInputField from '../form/MobileInputField';
import { EventDetail } from '../../types/common';
import { motion } from 'framer-motion';
import { validateEmail } from '../../utils/ticketUtils';
import { participantsApi } from '../../lib/api';
import TicketPrintingAnimation from '../tickets/TicketPrintingAnimation';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ 
  isOpen, 
  onClose, 
  event 
}) => {
  const [step, setStep] = useState<'form' | 'success' | 'printing'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleChange = (field: string, value: string) => {
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Update state based on field
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Generate a new ticket ID
      const generatedTicketId = `RSVP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setTicketId(generatedTicketId);
      
      // Register participant
      await participantsApi.registerParticipant(event.id, {
        name,
        email,
        phone: phone || undefined,
        ticket_id: generatedTicketId
      });
      
      // Show ticket printing animation
      setStep('printing');
      
      // After 3 seconds, show success state
      setTimeout(() => {
        setStep('success');
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        form: '등록 중 오류가 발생했습니다. 다시 시도해 주세요.'
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing the modal
    if (step !== 'form') {
      setTimeout(() => {
        setStep('form');
        setName('');
        setEmail('');
        setPhone('');
        setErrors({});
        setTicketId('');
      }, 300); // Delay reset until after animation
    }
    onClose();
  };

  // Content varies based on current step
  const renderContent = () => {
    switch (step) {
      case 'form':
        return (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">{event.title}</h3>
              <p className="text-gray-400">{event.date} · {event.time}</p>
            </div>

            {errors.form && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-900/30 rounded-lg">
                <p className="text-red-400 text-sm">{errors.form}</p>
              </div>
            )}

            <MobileInputField
              label="이름"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="참가자 이름을 입력하세요"
              required
              error={errors.name}
            />

            <MobileInputField
              label="이메일"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="이메일 주소"
              required
              error={errors.email}
              helpText="티켓 발급을 위해 사용됩니다"
            />

            <MobileInputField
              label="연락처"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="선택 사항"
              helpText="이벤트 관련 연락이 필요할 때 사용됩니다"
              error={errors.phone}
            />

            <div className="mt-10">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    처리 중...
                  </>
                ) : (
                  '등록하기'
                )}
              </button>
            </div>
          </form>
        );

      case 'printing':
        return (
          <TicketPrintingAnimation 
            eventName={event.title}
            participantName={name}
            onComplete={() => setStep('success')}
          />
        );

      case 'success':
        return (
          <div className="p-6">
            <div className="text-center">
              <div className="bg-green-900/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">등록이 완료되었습니다</h3>
              <p className="text-gray-400 mb-6">
                티켓이 <strong>{email}</strong> 주소로 발급되었습니다
              </p>
              
              <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">티켓 번호</span>
                  <span className="font-mono">{ticketId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">이름</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">이벤트</span>
                  <span>{event.title}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border border-zinc-700 hover:border-zinc-600 text-white rounded-lg transition-colors"
                >
                  닫기
                </button>
                <button
                  onClick={() => window.open(`/r/${event.id}/ticket?tid=${ticketId}`, '_blank')}
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                >
                  티켓 보기
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <SlideupModal
        isOpen={isOpen && step !== 'printing'}
        onClose={step === 'success' ? handleClose : undefined}
        closeOnBackdropClick={step === 'success'}
        title={step === 'form' ? "이벤트 등록" : undefined}
        showHandle={true}
      >
        {renderContent()}
      </SlideupModal>
      
      {isOpen && step === 'printing' && renderContent()}
    </>
  );
};

export default RegistrationModal;
