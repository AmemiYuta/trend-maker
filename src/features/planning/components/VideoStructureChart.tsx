import { Video } from 'lucide-react';
import type { VideoStructure } from '../../../types/idea';

interface Props {
  structures: VideoStructure[];
}

export const VideoStructureChart = ({ structures }: Props) => {
  return (
    <div className="relative border-l-2 border-indigo-100 pl-8 space-y-8 my-6">
      {structures.map((part, idx) => (
        <div key={idx} className="relative group">
          {/* 左側の丸い装飾 */}
          <div className="absolute -left-[39px] top-0 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 shadow-sm z-10 group-hover:scale-110 transition-transform"></div>
          
          {/* カード本体 */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow hover:bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-indigo-700 text-xs bg-indigo-50 px-2 py-1 rounded">{part.label}</span>
              <span className="text-sm font-mono font-bold text-gray-500">{part.time}</span>
            </div>
            <p className="text-base font-medium text-gray-800 mb-3">{part.content}</p>
            
            {/* 撮影メモがある場合のみ表示 */}
            {part.memo && (
              <div className="flex items-start gap-2 text-xs text-gray-600 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                <Video className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                <span><span className="font-bold text-yellow-700">撮影Point:</span> {part.memo}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};