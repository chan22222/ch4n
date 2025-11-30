import React, { useState } from 'react';

const Currency: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="w-full h-full relative"
      style={{
        animation: 'fadeInZoom 0.5s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]">
          <div className="text-primary" style={{ animation: 'spin 1s linear infinite' }}>
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}
      <iframe
        src="https://ch4n.co.kr/currency"
        className="w-full h-full"
        style={{
          border: 'none',
          display: isLoading ? 'none' : 'block',
        }}
        onLoad={() => setIsLoading(false)}
        title="Currency Exchange"
        allow="fullscreen"
      />
    </div>
  );
};

export default Currency;