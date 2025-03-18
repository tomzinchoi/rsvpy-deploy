import React, { useState } from 'react';
import { EventDetail } from '../../types/common';
import MobileEventEditor from './MobileEventEditor';

interface EventEditContentProps {
  event: EventDetail;
  onSave: (updatedEvent: EventDetail) => Promise<void>;
  isSaving?: boolean;
  className?: string;
}

const EventEditContent: React.FC<EventEditContentProps> = ({
  event,
  onSave,
  isSaving = false,
  className = ''
}) => {
  const [currentEvent, setCurrentEvent] = useState<EventDetail>(event);
  
  // 이벤트 필드 업데이트
  const handleUpdate = (updatedFields: Partial<EventDetail>) => {
    setCurrentEvent(prev => ({
      ...prev,
      ...updatedFields
    }));
  };
  
  // 변경사항 저장
  const handleSave = async () => {
    await onSave(currentEvent);
  };

  return (
    <div className={`h-full ${className}`}>
      {/* 모바일 에디터 컴포넌트만 사용 (반응형으로 처리) */}
      <MobileEventEditor
        event={currentEvent}
        onUpdate={handleUpdate}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default EventEditContent;
