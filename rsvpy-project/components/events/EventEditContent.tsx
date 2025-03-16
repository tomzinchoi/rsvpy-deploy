import React, { useState } from 'react';
import { EventContent } from '../../types/common';
import ContentBlockEditor from './ContentBlockEditor';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface EventEditContentProps {
  contents: EventContent[];
  onChange: (contents: EventContent[]) => void;
}

const EventEditContent: React.FC<EventEditContentProps> = ({ contents, onChange }) => {
  // 활성화된 콘텐츠 ID (편집 중인 콘텐츠)
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  
  // 콘텐츠 항목 추가
  const handleAddContent = (type: 'heading' | 'text' | 'image') => {
    const newContent: EventContent = {
      id: `content-${Date.now()}`,
      type,
      content: type === 'heading' ? '새 제목' : type === 'text' ? '새 텍스트 블록' : ''
    };
    
    onChange([...contents, newContent]);
    setActiveContentId(newContent.id);
  };

  // 콘텐츠 항목 수정
  const handleUpdateContent = (updatedContent: EventContent) => {
    const newContents = contents.map(content =>
      content.id === updatedContent.id ? updatedContent : content
    );
    onChange(newContents);
  };

  // 콘텐츠 항목 삭제
  const handleDeleteContent = (id: string) => {
    onChange(contents.filter(content => content.id !== id));
    setActiveContentId(null);
  };

  // 콘텐츠 순서 변경
  const handleDragEnd = (result: any) => {
    // 드래그가 취소되면 아무것도 하지 않음
    if (!result.destination) return;

    // 순서 변경이 없으면 아무것도 하지 않음
    if (result.destination.index === result.source.index) return;

    // 새 배열 생성
    const updatedContents = Array.from(contents);
    
    // 드래그된 항목 제거
    const [removed] = updatedContents.splice(result.source.index, 1);
    
    // 새 위치에 항목 삽입
    updatedContents.splice(result.destination.index, 0, removed);
    
    // 상태 업데이트
    onChange(updatedContents);
  };

  return (
    <div className="space-y-6">
      {/* 콘텐츠 목록 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="contents">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {contents.length === 0 ? (
                <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-400">
                    이벤트 콘텐츠가 없습니다. 아래에서 콘텐츠를 추가하세요.
                  </p>
                </div>
              ) : (
                contents.map((content, index) => (
                  <Draggable key={content.id} draggableId={content.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1
                        }}
                      >
                        <ContentBlockEditor
                          content={content}
                          onUpdate={handleUpdateContent}
                          onDelete={handleDeleteContent}
                          onMoveUp={index > 0 ? () => {
                            const newContents = [...contents];
                            [newContents[index - 1], newContents[index]] = [newContents[index], newContents[index - 1]];
                            onChange(newContents);
                          } : undefined}
                          onMoveDown={index < contents.length - 1 ? () => {
                            const newContents = [...contents];
                            [newContents[index], newContents[index + 1]] = [newContents[index + 1], newContents[index]];
                            onChange(newContents);
                          } : undefined}
                          dragHandleProps={provided.dragHandleProps}
                          isActive={activeContentId === content.id}
                          onFocus={() => setActiveContentId(content.id)}
                          isFirst={index === 0}
                          isLast={index === contents.length - 1}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* 콘텐츠 추가 버튼 */}
      <div className="flex flex-wrap gap-4 pt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAddContent('heading')}
          className="flex items-center px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
          </svg>
          제목 추가
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAddContent('text')}
          className="flex items-center px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          텍스트 추가
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAddContent('image')}
          className="flex items-center px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 추가
        </motion.button>
      </div>
    </div>
  );
};

export default EventEditContent;
