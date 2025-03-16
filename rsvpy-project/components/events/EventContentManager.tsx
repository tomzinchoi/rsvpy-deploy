import React, { useState } from 'react';
import { EventContent } from '../../types/common';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ContentBlockEditor from './ContentBlockEditor';
import { motion } from 'framer-motion';

interface EventContentManagerProps {
  contents: EventContent[];
  onUpdate: (updatedContents: EventContent[]) => void;
}

const EventContentManager: React.FC<EventContentManagerProps> = ({ contents, onUpdate }) => {
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  
  // 항목 순서 변경 처리 (드래그 앤 드롭)
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reorderedContents = Array.from(contents);
    const [removed] = reorderedContents.splice(result.source.index, 1);
    reorderedContents.splice(result.destination.index, 0, removed);
    
    onUpdate(reorderedContents);
  };

  // 항목 업데이트 처리
  const handleContentUpdate = (updatedContent: EventContent) => {
    const newContents = contents.map(content => 
      content.id === updatedContent.id ? updatedContent : content
    );
    onUpdate(newContents);
  };

  // 항목 삭제 처리
  const handleContentDelete = (id: string) => {
    const newContents = contents.filter(content => content.id !== id);
    onUpdate(newContents);
    setActiveContentId(null);
  };

  // 새 콘텐츠 추가
  const handleAddContent = (type: 'heading' | 'text' | 'image') => {
    const newContent: EventContent = {
      id: `content-${Date.now()}`,
      type,
      content: type === 'heading' ? '새 제목' : type === 'text' ? '새 텍스트 내용' : ''
    };
    
    onUpdate([...contents, newContent]);
    setActiveContentId(newContent.id);
  };
  
  return (
    <div className="space-y-6">
      {/* 드래그 앤 드롭 가능한 콘텐츠 목록 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {contents.length === 0 ? (
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-8 text-center">
                  <svg
                    className="mx-auto w-12 h-12 text-gray-600 mb-3"
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
                  <p className="text-gray-500">
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
                          onUpdate={handleContentUpdate}
                          onDelete={handleContentDelete}
                          onMoveUp={index > 0 ? () => {
                            const newContents = [...contents];
                            [newContents[index - 1], newContents[index]] = [newContents[index], newContents[index - 1]];
                            onUpdate(newContents);
                          } : undefined}
                          onMoveDown={index < contents.length - 1 ? () => {
                            const newContents = [...contents];
                            [newContents[index], newContents[index + 1]] = [newContents[index + 1], newContents[index]];
                            onUpdate(newContents);
                          } : undefined}
                          dragHandleProps={provided.dragHandleProps}
                          isFirst={index === 0}
                          isLast={index === contents.length - 1}
                          isActive={activeContentId === content.id}
                          onFocus={() => setActiveContentId(content.id)}
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

      {/* 콘텐츠 추가 버튼 영역 */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5">
        <h3 className="font-medium mb-4 text-gray-200">콘텐츠 추가</h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAddContent('heading')}
            className="flex items-center px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-200"
          >
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2 2m0 0l2 2m-2-2l-2 2m0 0l-2 2" />
            </svg>
            제목
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAddContent('text')}
            className="flex items-center px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-200"
          >
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            텍스트
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAddContent('image')}
            className="flex items-center px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-gray-200"
          >
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            이미지
          </motion.button>
        </div>
      </div>

      {/* 미리보기 영역 - 추가 가능 */}
      {contents.length > 0 && (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5">
          <h3 className="font-medium mb-4 text-gray-200">미리보기</h3>
          <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-3">
            {contents.map((content) => {
              switch (content.type) {
                case 'heading':
                  return <h2 key={content.id} className="text-xl font-bold mb-1">{content.content}</h2>;
                case 'text':
                  return <p key={content.id} className="text-gray-300 whitespace-pre-wrap">{content.content}</p>;
                case 'image':
                  return content.content ? (
                    <div key={content.id} className="my-3">
                      <img 
                        src={content.content} 
                        alt="콘텐츠 이미지" 
                        className="rounded-lg w-full max-h-64 object-cover"
                      />
                    </div>
                  ) : (
                    <div key={content.id} className="h-32 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">이미지 URL이 입력되지 않았습니다</span>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventContentManager;
