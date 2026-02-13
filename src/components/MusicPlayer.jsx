import { useMusic } from "../hooks/useMusic";
import { useRef, useEffect } from "react";

export const MusicPlayer = () => {
  const {
    currentTrack,
    formatTime,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    nextTrack,
    prevTrack,
    isPlaying,
    pause,
    play,
  } = useMusic();
  const progressRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {};

    const handleEnded = () => {};

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [setDuration, setCurrentTime, currentTrack]);

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <div className="track-info">
        <h3 className="track-title">{currentTrack.title}</h3>
        <p className="track-artist">{currentTrack.artist}</p>
      </div>

      <div className="progress-container">
        <span className="time">{formatTime(currentTime)}</span>

        <div className="progress-wrapper">
          <div className="progress-background"></div>

          <input
            ref={progressRef}
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime || 0}
            className="progress-bar"
            onChange={(e) => {
              const value = Number(e.target.value);
              audioRef.current.currentTime = value;
              setCurrentTime(value);
            }}
          />
        </div>

        <span className="time">{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={prevTrack}>
          ⏮
        </button>

        <button
          className="control-btn play-btn"
          onClick={() => (isPlaying ? pause() : play())}
        >
          { isPlaying ? "⏸" : "▶" }
        </button>

        <button className="control-btn" onClick={nextTrack}>
          ⏭
        </button>
      </div>
    </div>
  );
};
