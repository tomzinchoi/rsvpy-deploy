import React from 'react';
import { EventContent, EventDetail } from '../../types/common';
import ContentBlockEditor from './ContentBlockEditor';
import { v4 as uuidv4 } from 'uuid';

interface MobileEventContentEditorProps {
  event: EventDetail;
  onUpdate: (updatedEvent: Partial<EventDetail>) => void;
}

const MobileEventContentEditor: React.FC<MobileEventContentEditorProps> = ({
  event,
  onUpdate
}) => {
  const contents = event.contents || [];
  
  // 새 콘텐츠 블록 추가
  const addContentBlock = (type: EventContent['type']) => {
    const newContent: EventContent = {
      id: uuidv4(),
      type,
      content: '',
      order: contents.length
    };

    onUpdate({ 
      contents: [...contents, newContent]
    });
  };
  
  // 콘텐츠 블록 업데이트
  const updateContentBlock = (updatedBlock: EventContent) => {
    const updatedContents = contents.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    );
    
    onUpdate({ contents: updatedContents });
  };
  
  // 콘텐츠 블록 삭제
  const deleteContentBlock = (blockId: string) => {
    const filteredContents = contents.filter(block => block.id !== blockId);
    
    // 순서 재조정
    const reorderedContents = filteredContents.map((block, index) => ({
      ...block,
      order: index
    }));
    
    onUpdate({ contents: reorderedContents });
  };
  
  // 콘텐츠 블록 순서 변경
  const moveContentBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = contents.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;
    
    const newContents = [...contents];
    
    if (direction === 'up' && blockIndex > 0) {
      // 위로 이동 (swap with previous block)
      [newContents[blockIndex], newContents[blockIndex - 1]] = 
        [newContents[blockIndex - 1], newContents[blockIndex]];
    } 
    else if (direction === 'down' && blockIndex < contents.length - 1) {
      // 아래로 이동 (swap with next block)
      [newContents[blockIndex], newContents[blockIndex + 1]] = 
        [newContents[blockIndex + 1], newContents[blockIndex]];
    }
    
    // 순서 재조정
    const reorderedContents = newContents.map((block, index) => ({
      ...block,
      order: index
    }));
    
    onUpdate({ contents: reorderedContents });
  };

  return (
    <div className="space-y-6">
      {/* 콘텐츠 블록 리스트 */}
      {contents.length > 0 ? (
        <div className="space-y-4">
          {contents.map((block, index) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onChange={updateContentBlock}
              onDelete={() => deleteContentBlock(block.id)}
              onMoveUp={() => moveContentBlock(block.id, 'up')}
              onMoveDown={() => moveContentBlock(block.id, 'down')}
              isFirst={index === 0}
              isLast={index === contents.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-400 mb-4">콘텐츠 블록이 없습니다. 아래 버튼을 눌러 콘텐츠를 추가하세요.</p>
        </div>
      )}
      
      {/* 새 블록 추가 버튼 */}
      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <p className="text-sm mb-3 text-gray-400">콘텐츠 블록 추가</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addContentBlock('heading')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="text-xs">제목</span>
          </button>
          
          <button
            onClick={() => addContentBlock('text')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs">텍스트</span>
          </button>
          
          <button
            onClick={() => addContentBlock('image')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">이미지</span>
          </button>
          
          <button
            onClick={() => addContentBlock('location')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">위치</span>
          </button>
          
          <button
            onClick={() => addContentBlock('datetime')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">날짜/시간</span>
          </button>
          
          <button
            onClick={() => addContentBlock('custom')}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md flex flex-col items-center transition-colors"
          >
            <svg className="w-5 h-5 mb-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">커스텀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileEventContentEditor;
