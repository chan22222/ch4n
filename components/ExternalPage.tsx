import React, { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

interface ExternalPageProps {
  src: string;
  title: string;
}

const ExternalPage: React.FC<ExternalPageProps> = ({ src, title }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full flex flex-col relative bg-background">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-slate-400 text-sm animate-pulse">불러오는 중... {title}</p>
        </div>
      )}

      {/* Toolbar / Header */}
      <div className="h-10 bg-surface border-b border-slate-700/50 flex items-center justify-between px-4 shrink-0">
         <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <span className="ml-3 text-xs text-slate-400 font-mono truncate max-w-[300px]">{src}</span>
         </div>
         <a
           href={src}
           target="_blank"
           rel="noopener noreferrer"
           className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
           title="새 탭에서 열기"
         >
           <span className="hidden sm:inline">브라우저에서 열기</span>
           <ExternalLink size={12} />
         </a>
      </div>

      {/* Iframe */}
      <iframe
        src={src}
        title={title}
        className="flex-1 w-full h-full border-0 bg-white"
        onLoad={() => setIsLoading(false)}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

export default ExternalPage;
