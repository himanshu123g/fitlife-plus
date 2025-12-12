import React, { useState, useEffect, useRef } from 'react';

export default function ConnectionQuality() {
  const [quality, setQuality] = useState('good');
  const [latency, setLatency] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const qualityRef = useRef(null);

  useEffect(() => {
    // Simulate network quality check
    const checkQuality = () => {
      // In production, you'd get this from Zego SDK network stats
      const randomLatency = Math.floor(Math.random() * 200) + 20;
      setLatency(randomLatency);

      if (randomLatency < 50) setQuality('excellent');
      else if (randomLatency < 100) setQuality('good');
      else if (randomLatency < 150) setQuality('weak');
      else setQuality('poor');
    };

    checkQuality();
    const interval = setInterval(checkQuality, 5000);
    return () => clearInterval(interval);
  }, []);

  const getQualityConfig = () => {
    switch (quality) {
      case 'excellent':
        return { color: 'bg-green-500', text: 'Excellent', bars: 4 };
      case 'good':
        return { color: 'bg-blue-500', text: 'Good', bars: 3 };
      case 'weak':
        return { color: 'bg-yellow-500', text: 'Weak', bars: 2 };
      case 'poor':
        return { color: 'bg-red-500', text: 'Poor', bars: 1 };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', bars: 0 };
    }
  };

  const config = getQualityConfig();

  // Handle mouse down - start dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move - update position
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  // Handle mouse up - stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={qualityRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/20 transition-shadow hover:shadow-xl select-none"
      title="Drag to move"
    >
      <div className="flex items-center gap-2">
        {/* Signal Bars */}
        <div className="flex items-end gap-0.5 h-3">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-full ${bar <= config.bars ? config.color : 'bg-gray-600'} transition-all`}
              style={{ height: `${bar * 25}%` }}
            ></div>
          ))}
        </div>
        
        {/* Quality Text */}
        <div className="text-white">
          <div className="text-xs font-semibold">{config.text}</div>
          <div className="text-[10px] text-gray-300">{latency}ms</div>
        </div>
      </div>
    </div>
  );
}
