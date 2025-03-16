import React, { useState } from 'react';
import { EventContent } from '../../types/common';
import { motion } from 'framer-motion';

interface ContentBlockEditorProps {
  content: EventContent;
  onUpdate: (content: EventContent) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  dragHandleProps?: any;
  isActive?: boolean;
  onFocus?: () => void;
}

const ContentBlockEditor: React.FC<ContentBlockEditorProps> = ({
  content,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  dragHandleProps,
  isActive = false,
  onFocus
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // 콘텐츠 타입에 따른 아이콘 렌더링
  const renderTypeIcon = () => {
    switch (content.type) {
      case 'heading':
        return (
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
          </svg>
        );
      case 'text':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // 미리보기 모드 렌더링
  const renderPreview = () => {
    switch (content.type) {
      case 'heading':
        return (
          <div className="text-lg font-semibold mb-2 truncate">
            {content.content || '제목 없음'}
          </div>
        );
      case 'text':
        return (
          <div className="text-gray-300 line-clamp-3 whitespace-pre-line">
            {content.content || '텍스트 없음'}
          </div>
        );
      case 'image':
        return (
          <div className="h-24 bg-zinc-800 rounded overflow-hidden">
            {content.content ? (
              <img 
                src={content.content} 
                alt="콘텐츠 이미지" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                이미지 URL 없음
              </div>
            )}
          </div>
        );
      default:
        return <div>알 수 없는 콘텐츠 타입</div>;
    }
  };

  // 편집 모드 렌더링
  const renderEditor = () => {
    switch (content.type) {
      case 'heading':
        return (
          <div>
            <label className="block text-sm text-gray-400 mb-1">제목</label>
            <input
              type="text"
              value={content.content}
              onChange={(e) => onUpdate({ ...content, content: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="제목을 입력하세요"
              autoFocus
            />
          </div>
        );
      case 'text':
        return (
          <div>
            <label className="block text-sm text-gray-400 mb-1">텍스트</label>
            <textarea
              value={content.content}
              onChange={(e) => onUpdate({ ...content, content: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              placeholder="내용을 입력하세요"
              rows={5}
              autoFocus
            />
          </div>
        );
      case 'image':
        return (
          <div>
            <label className="block text-sm text-gray-400 mb-1">이미지 URL</label>
            <input
              type="text"
              value={content.content}
              onChange={(e) => onUpdate({ ...content, content: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="이미지 URL을 입력하세요"
              autoFocus
            />
            {content.content && (
              <div className="mt-3 h-32 bg-zinc-800 rounded overflow-hidden">
                <img 
                  src={content.content} 
                  alt="이미지 미리보기" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>
        );
      default:
        return <div>알 수 없는 콘텐츠 타입</div>;
    }
  };

  return (
    <motion.div
      layout
      className={`bg-zinc-900/60 border ${isActive || isEditing ? 'border-zinc-600' : 'border-zinc-800'} rounded-lg shadow-sm`}
      onClick={() => onFocus && onFocus()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* 헤더 영역 */}
      <div className="px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center">
          {/* 드래그 핸들 */}
          <div 
            {...dragHandleProps} 
            className="cursor-grab active:cursor-grabbing p-1 mr-2 hover:bg-zinc-800 rounded"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          
          {/* 콘텐츠 타입 아이콘 및 라벨 */}
          <div className="flex items-center">
            <span className="mr-2">{renderTypeIcon()}</span>
            <span className="text-sm font-medium text-gray-300">
              {content.type === 'heading' ? '제목' : 
               content.type === 'text' ? '텍스트' : 
               content.type === 'image' ? '이미지' : '알 수 없음'}
            </span>
          </div>
        </div>
        
        {/* 액션 버튼 */}
        <div className="flex items-center space-x-1">
          {!isEditing && (
            <>
              {/* 위로 이동 버튼 */}
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className={`p-1 rounded hover:bg-zinc-800 ${isFirst ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400'}`}
                title="위로 이동"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              
              {/* 아래로 이동 버튼 */}
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className={`p-1 rounded hover:bg-zinc-800 ${isLast ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400'}`}
                title="아래로 이동"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}
          
          {/* 편집 토글 버튼 */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-white"
            title={isEditing ? "편집 완료" : "편집"}
          >
            {isEditing ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </button>
          
          {/* 삭제 버튼 */}
          {isConfirmingDelete ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="p-1 rounded bg-zinc-800 text-gray-300"
                title="취소"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(content.id)}
                className="p-1 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                title="삭제 확인"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="p-1 rounded hover:bg-zinc-800 text-gray-400 hover:text-red-400"
              title="삭제"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* 콘텐츠 영역 */}
      <div className="p-4">
        {isEditing ? renderEditor() : renderPreview()}
      </div>
    </motion.div>
  );
};

export default ContentBlockEditor;
