import React, { useState } from 'react';
import { EventContent } from '../../types/common';
import { motion, AnimatePresence } from 'framer-motion';
import MobileInputField from '../form/MobileInputField';

interface MobileEventContentEditorProps {
  contents: EventContent[];
  onUpdate: (contents: EventContent[]) => void;
}

const MobileEventContentEditor: React.FC<MobileEventContentEditorProps> = ({ contents, onUpdate }) => {
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  
  // 콘텐츠 추가
  const handleAddContent = (type: 'heading' | 'text' | 'image') => {
    const newContent: EventContent = {
      id: `content-${Date.now()}`,
      type,
      content: type === 'heading' ? '새 제목' : type === 'text' ? '새 텍스트 내용' : ''
    };
    
    const updatedContents = [...contents, newContent];
    onUpdate(updatedContents);
    setEditingContentId(newContent.id);
  };
  
  // 콘텐츠 삭제
  const handleDeleteContent = (id: string) => {
    const updatedContents = contents.filter(item => item.id !== id);
    onUpdate(updatedContents);
    setEditingContentId(null);
  };
  
  // 콘텐츠 수정
  const handleUpdateContent = (id: string, content: string) => {
    const updatedContents = contents.map(item => 
      item.id === id ? { ...item, content } : item
    );
    onUpdate(updatedContents);
  };
  
  // 콘텐츠 순서 변경
  const handleMoveContent = (id: string, direction: 'up' | 'down') => {
    const currentIndex = contents.findIndex(item => item.id === id);
    if (currentIndex === -1) return;
    
    const newContents = [...contents];
    
    if (direction === 'up' && currentIndex > 0) {
      // 위로 이동
      [newContents[currentIndex - 1], newContents[currentIndex]] = 
      [newContents[currentIndex], newContents[currentIndex - 1]];
    } else if (direction === 'down' && currentIndex < contents.length - 1) {
      // 아래로 이동
      [newContents[currentIndex], newContents[currentIndex + 1]] = 
      [newContents[currentIndex + 1], newContents[currentIndex]];
    } else {
      return;
    }
    
    onUpdate(newContents);
  };
  
  return (
    <div className="space-y-6">
      {/* 콘텐츠 목록 */}
      <div className="space-y-4">
        {contents.length === 0 ? (
          <div className="py-8 border-2 border-dashed border-zinc-800 rounded-lg text-center">
            <svg className="w-10 h-10 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">이벤트 콘텐츠가 없습니다</p>
          </div>
        ) : (
          contents.map((content, index) => (
            <motion.div
              key={content.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg overflow-hidden ${editingContentId === content.id ? 'border-primary' : 'border-zinc-800'}`}
            >
              {/* 콘텐츠 헤더 */}
              <div className="px-3 py-2 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {/* 콘텐츠 타입 아이콘 */}
                  {content.type === 'heading' && (
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
                    </svg>
                  )}
                  {content.type === 'text' && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  )}
                  {content.type === 'image' && (
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  
                  <span className="text-sm font-medium text-gray-400">
                    {content.type === 'heading' ? '제목' : content.type === 'text' ? '텍스트' : '이미지'}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  {/* 위로 이동 버튼 */}
                  <button
                    onClick={() => handleMoveContent(content.id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-700' : 'text-gray-400'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  
                  {/* 아래로 이동 버튼 */}
                  <button
                    onClick={() => handleMoveContent(content.id, 'down')}
                    disabled={index === contents.length - 1}
                    className={`p-1 rounded ${index === contents.length - 1 ? 'text-gray-700' : 'text-gray-400'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="p-1 rounded text-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 콘텐츠 내용 */}
              <div className="p-3">
                {content.type === 'heading' && (
                  <MobileInputField
                    label="제목"
                    name={`heading-${content.id}`}
                    value={content.content}
                    onChange={(_, value) => handleUpdateContent(content.id, value)}
                    placeholder="제목을 입력하세요"
                  />
                )}
                
                {content.type === 'text' && (
                  <MobileInputField
                    label="텍스트"
                    name={`text-${content.id}`}
                    value={content.content}
                    onChange={(_, value) => handleUpdateContent(content.id, value)}
                    type="textarea"
                    placeholder="내용을 입력하세요"
                  />
                )}
                
                {content.type === 'image' && (
                  <div className="space-y-3">
                    <MobileInputField
                      label="이미지 URL"
                      name={`image-${content.id}`}
                      value={content.content}
                      onChange={(_, value) => handleUpdateContent(content.id, value)}
                      placeholder="이미지 URL을 입력하세요"
                    />
                    
                    {content.content && (
                      <div className="rounded-lg overflow-hidden border border-zinc-800">
                        <img 
                          src={content.content} 
                          alt="이미지 미리보기" 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* 콘텐츠 추가 버튼 */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-300 mb-3">콘텐츠 추가</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAddContent('heading')}
            className="flex flex-col items-center justify-center p-3 bg-zinc-800 rounded-lg"
          >
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
            </svg>
            <span className="text-xs mt-1 text-gray-300">제목</span>
          </button>
          
          <button
            onClick={() => handleAddContent('text')}
            className="flex flex-col items-center justify-center p-3 bg-zinc-800 rounded-lg"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="text-xs mt-1 text-gray-300">텍스트</span>
          </button>
          
          <button
            onClick={() => handleAddContent('image')}
            className="flex flex-col items-center justify-center p-3 bg-zinc-800 rounded-lg"
          >
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1 text-gray-300">이미지</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileEventContentEditor;
