// src/components/AiContentModal.tsx
'use client';

interface AiContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const AiContentModal = ({ isOpen, onClose, title, content }: AiContentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {/* whitespace-pre-wrap preserves line breaks from the AI's response */}
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AiContentModal;