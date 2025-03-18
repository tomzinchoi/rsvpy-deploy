import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EventDetail } from '../../types/common';
import MobileInputField from '../form/MobileInputField';
import MobileEventContentEditor from './MobileEventContentEditor';

interface MobileEventEditorProps {
  event: EventDetail;
  onUpdate: (updatedEvent: Partial<EventDetail>) => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
}

const MobileEventEditor: React.FC<MobileEventEditorProps> = ({
  event,
  onUpdate,
  onSave,
  isSaving = false
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'contents'>('details');
  
  // 필드 변경 처리
  const handleFieldChange = (name: string, value: string) => {
    onUpdate({ [name]: value });
  };
  
  // 상태 변경 처리
  const handleStatusChange = (status: string) => {
    onUpdate({ status: status as EventDetail['status'] });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-zinc-800 mb-4">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 text-center relative ${
            activeTab === 'details' ? 'text-white' : 'text-gray-400'
          }`}
        >
          이벤트 정보
          {activeTab === 'details' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={false}
            />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('contents')}
          className={`flex-1 py-3 text-center relative ${
            activeTab === 'contents' ? 'text-white' : 'text-gray-400'
          }`}
        >
          이벤트 콘텐츠
          {activeTab === 'contents' && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={false}
            />
          )}
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'details' ? (
          <div className="space-y-4 px-1">
            <MobileInputField
              label="이벤트 제목"
              name="title"
              value={event.title}
              onChange={handleFieldChange}
              placeholder="이벤트 제목을 입력하세요"
              required
            />

            <MobileInputField
              label="이벤트 설명"
              name="description"
              value={event.description}
              onChange={handleFieldChange}
              placeholder="이벤트에 대한 간략한 설명을 입력하세요"
              type="textarea"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MobileInputField
                label="날짜"
                name="date"
                value={event.date}
                onChange={handleFieldChange}
                type="date"
                required
              />

              <MobileInputField
                label="시간"
                name="time"
                value={event.time}
                onChange={handleFieldChange}
                type="time"
                required
              />
            </div>

            <MobileInputField
              label="장소"
              name="location"
              value={event.location}
              onChange={handleFieldChange}
              placeholder="이벤트 장소"
              required
            />

            <MobileInputField
              label="최대 참가자 수"
              name="maxAttendees"
              value={event.maxAttendees?.toString() || ''}
              onChange={handleFieldChange}
              type="number"
              placeholder="무제한은 비워두세요"
            />

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                이벤트 상태
              </label>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('draft')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    event.status === 'draft'
                      ? 'bg-yellow-900/30 border border-yellow-800 text-yellow-400'
                      : 'bg-zinc-800 border border-zinc-700 text-gray-400'
                  }`}
                >
                  임시저장
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('active')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    event.status === 'active'
                      ? 'bg-green-900/30 border border-green-800 text-green-400'
                      : 'bg-zinc-800 border border-zinc-700 text-gray-400'
                  }`}
                >
                  활성화
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('ended')}
                  className={`px-4 py-2 rounded-md flex-1 ${
                    event.status === 'ended'
                      ? 'bg-zinc-700 border border-zinc-600 text-gray-300'
                      : 'bg-zinc-800 border border-zinc-700 text-gray-400'
                  }`}
                >
                  종료됨
                </button>
              </div>
            </div>

            <MobileInputField
              label="주최자명"
              name="organizerName"
              value={event.organizerName || ''}
              onChange={handleFieldChange}
              placeholder="주최자 이름 또는 단체명"
            />

            <MobileInputField
              label="커버 이미지 URL"
              name="coverImage"
              value={event.coverImage || ''}
              onChange={handleFieldChange}
              placeholder="이미지 URL을 입력하세요"
            />
          </div>
        ) : (
          <MobileEventContentEditor 
            event={event}
            onUpdate={onUpdate}
          />
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-800 py-4 px-4">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              저장 중...
            </>
          ) : (
            '이벤트 저장'
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileEventEditor;
