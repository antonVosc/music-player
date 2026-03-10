import { useRef, useEffect, useState } from "react";
import { useMusic } from "../contexts/MusicContext";

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
    volume,
    setVolume,
    playlists,
    addSongToPlaylist,
  } = useMusic();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  const handleAddToPlaylist = (playlist) => {
    const alreadyIn = playlist.songs.some((s) => s.id === currentTrack.id);
    if (!alreadyIn) {
      addSongToPlaylist(playlist.id, currentTrack);
    }
    setShowPlaylistMenu(false);
  };

  const progressRef = useRef(null);
  const audioRef = useRef(null);

  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((err) => console.error(err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => nextTrack();

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setDuration, setCurrentTime, currentTrack, nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      const handleCanPlay = () => audio.play().catch(console.error);
      audio.addEventListener("canplay", handleCanPlay, { once: true });
      return () => audio.removeEventListener("canplay", handleCanPlay);
    }
  }, [currentTrack, setCurrentTime, setDuration, isPlaying]);

  useEffect(() => {
    if (!showPlaylistMenu) return;
    const handleClickOutside = () => setShowPlaylistMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showPlaylistMenu]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

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
            onChange={handleTimeChange}
            style={{ "--progress": `${progressPercentage}%` }}
          />
        </div>

        <span className="time">{formatTime(duration)}</span>
      </div>

      <div className="controls-row">
        <div className="controls">
          <button className="control-btn" onClick={prevTrack}>
            ⏮
          </button>
          <button
            className="control-btn play-btn"
            onClick={() => (isPlaying ? pause() : play())}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="control-btn" onClick={nextTrack}>
            ⏭
          </button>
        </div>

        {isPlaying && playlists.length > 0 && (
          <div
            className="add-to-playlist-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="add-to-playlist-btn"
              onClick={() => setShowPlaylistMenu((prev) => !prev)}
            >
              + Add to playlist
            </button>

            {showPlaylistMenu && (
              <div className="playlist-menu">
                {playlists.map((playlist) => {
                  const alreadyIn = playlist.songs.some(
                    (s) => s.id === currentTrack.id,
                  );
                  return (
                    <div
                      key={playlist.id}
                      className={`playlist-menu-item ${alreadyIn ? "disabled" : ""}`}
                      onClick={() =>
                        !alreadyIn && handleAddToPlaylist(playlist)
                      }
                    >
                      {playlist.name} {alreadyIn ? "✓" : ""}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="volume-container">
        <span className="volume-icon">🔊</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="volume-bar"
          onChange={handleVolumeChange}
          value={volume}
        />
      </div>
    </div>
  );
};
