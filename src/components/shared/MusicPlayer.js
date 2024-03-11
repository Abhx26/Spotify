import { red } from '@cloudinary/url-gen/actions/adjust';
import React, { useState, useRef } from 'react';

function MusicPlayer({music}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);

  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    setCurrentTime(currentTime);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    audioRef.current.pause();
  };

  const handleDragEnd = (e) => {
    if (isDragging) {
      const { offsetX, target } = e.nativeEvent;
      const percent = offsetX / target.clientWidth;
      const newTime = percent * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      audioRef.current.play();
      setIsDragging(false);
    }
  };

  return (
    <div className=' bg-red-400'>
      <audio
        ref={audioRef}
        src={music}
        onTimeUpdate={handleTimeUpdate}
      />
      <div
        className="progress-bar"
        onMouseDown={handleDragStart}
        onMouseMove={(e) => isDragging && handleDragEnd(e)}
        onMouseUp={handleDragEnd}
      >
        <div
          className="progress-bar__filled bg-yellow-400"
          style={{ width: `${(currentTime /3.44) * 100}%`, height:100 }}
        />
      </div>
    </div>
  );
}

export default MusicPlayer;
