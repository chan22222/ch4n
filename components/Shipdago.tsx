import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const Shipdago: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 pointer-events-none">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-slate-400 text-sm animate-pulse">불러오는 중... Shipdago</p>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src="https://shipdago.com"
        title="Shipdago"
        className="absolute inset-0 w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        style={{
          backgroundColor: 'white',
          visibility: isLoading ? 'hidden' : 'visible'
        }}
      />
    </>
  );
};

export default Shipdago;