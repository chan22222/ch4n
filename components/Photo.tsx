import React from 'react';

const Photo: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <iframe
        src="https://ch4n.co.kr/etc/photo/"
        className="w-full h-full border-0"
        title="Photo Tools"
        allow="camera; microphone"
      />
    </div>
  );
};

export default Photo;