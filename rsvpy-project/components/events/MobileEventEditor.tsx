import React, { useState } from 'react';
import { EventContent } from '../../types/common';
import ContentBlockEditor from './ContentBlockEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileEventEditorProps {
  contents: EventContent[];
  onUpdate: (updatedContents: EventContent[]) => void;
}

const MobileEventEditor: React.FC<MobileEventEditorProps> = ({ contents, onUpdate }) => {
  const [editingContent, setEditingContent] = useState<EventContent | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<'preview' | 'editor'>('editor');

  // 콘텐츠 편집 시작
  const handleStartEditing = (content: EventContent) => {
    setEditingContent(content);
  };
  
  // 콘텐츠 업데이트
  const handleContentUpdate = (updatedContent: EventContent) => {
    const updatedContents = contents.map(content => 
      content.id === updatedContent.id ? updatedContent : content
    );
    onUpdate(updatedContents);
    setEditingContent(null);
  };
  
  // 콘텐츠 삭제
  const handleContentDelete = (id: string) => {
    const updatedContents = contents.filter(content => content.id !== id);
    onUpdate(updatedContents);
  };
  
  // 콘텐츠 위치 변경 (위로)
  const handleMoveUp = (id: string) => {
    const index = contents.findIndex(content => content.id === id);
    if (index > 0) {
      const updatedContents = [...contents];
      [updatedContents[index - 1], updatedContents[index]] = [updatedContents[index], updatedContents[index - 1]];
      onUpdate(updatedContents);
    }
  };
  
  // 콘텐츠 위치 변경 (아래로)
  const handleMoveDown = (id: string) => {
    const index = contents.findIndex(content => content.id === id);
    if (index < contents.length - 1) {
      const updatedContents = [...contents];
      [updatedContents[index], updatedContents[index + 1]] = [updatedContents[index + 1], updatedContents[index]];
      onUpdate(updatedContents);
    }
  };
  
  // 새 콘텐츠 추가
  const handleAddContent = (type: 'heading' | 'text' | 'image') => {
    let defaultContent = '';
    
    switch (type) {
      case 'heading':
        defaultContent = '새 제목';
        break;
      case 'text':
        defaultContent = '새 텍스트 내용을 입력하세요.';
        break;
      case 'image':
        defaultContent = '';
        break;
    }
    
    const newContent: EventContent = {
      id: `content-${Date.now()}`,
      type,
      content: defaultContent
    };
    
    onUpdate([...contents, newContent]);
    setEditingContent(newContent);
  };

  // 콘텐츠 미리보기 렌더링
  const renderPreview = () => {
    return (
      <div className="space-y-4 p-4 bg-zinc-900/50 rounded-lg min-h-[300px]">
        {contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">
              콘텐츠가 없습니다. 아래에서 콘텐츠를 추가하세요.
            </p>
          </div>
        ) : (
          contents.map((content) => {
            switch (content.type) {
              case 'heading':
                return <h3 key={content.id} className="text-xl font-bold mb-2">{content.content}</h3>;
              case 'text':
                return <p key={content.id} className="text-gray-300 mb-4 whitespace-pre-wrap">{content.content}</p>;
              case 'image':
                return (
                  <div key={content.id} className="my-4">
                    {content.content ? (
                      <div className="relative aspect-w-16 aspect-h-9 bg-zinc-900 rounded-lg overflow-hidden">
                        <img src={content.content} alt="이미지" className="object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-w-16 aspect-h-9 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">이미지 URL이 필요합니다</span>
                      </div>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 토글 탭 */}
      <div className="flex mb-4 border-b border-zinc-800">
        <button
          className={`flex-1 py-3 text-center ${
            expandedPanel === 'editor'
              ? 'text-primary border-b-2 border-primary font-medium'
              : 'text-gray-400'
          }`}
          onClick={() => setExpandedPanel('editor')}
        >
          편집기
        </button>
        <button
          className={`flex-1 py-3 text-center ${
            expandedPanel === 'preview'
              ? 'text-primary border-b-2 border-primary font-medium'
              : 'text-gray-400'
          }`}
          onClick={() => setExpandedPanel('preview')}
        >
          미리보기
        </button>
      </div>

      {/* 패널 콘텐츠 */}
      <div className="flex-grow overflow-y-auto mb-20">
        <AnimatePresence mode="wait">
          {expandedPanel === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-3">
                {contents.map((content, index) => (
                  <ContentBlockEditor
                    key={content.id}
                    content={content}
                    onUpdate={handleContentUpdate}
                    onDelete={handleContentDelete}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === contents.length - 1}
                  />
                ))}
              </div>

              {/* 새 콘텐츠 추가 영역 */}
              <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800 p-4">
                <div className="text-center text-sm text-gray-400 mb-2">새 콘텐츠 추가</div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleAddContent('heading')}
                    className="flex flex-col items-center justify-center w-20 h-20 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
                    </svg>
                    <span className="text-xs">제목</span>
                  </button>
                  
                  <button
                    onClick={() => handleAddContent('text')}
                    className="flex flex-col items-center justify-center w-20 h-20 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <span className="text-xs">텍스트</span>
                  </button>
                  
                  <button
                    onClick={() => handleAddContent('image')}
                    className="flex flex-col items-center justify-center w-20 h-20 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-blue-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">이미지</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderPreview()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileEventEditor;
