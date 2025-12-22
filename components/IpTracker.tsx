import React from 'react';

const IpTracker: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-background">
      <iframe
        src="https://ch4n.co.kr/etc/ip"
        className="w-full h-full border-0"
        title="IP Intelligence"
        allowFullScreen
      />
    </div>
  );
};

export default IpTracker;