import { useState } from "react";

const songs = [
  {
    id: 1,
    title: "All That She Wants", // Exact wav file name
    artist: "Ace of Base",
    url: "/songs/All That She Wants.wav",
    duration: "3:31",
  },
  {
    id: 2,
    title: "Unbreak My Heart", // Exact wav file name
    artist: "80s 90s Hit Factory",
    url: "/songs/Unbreak My Heart.wav",
    duration: "4:22",
  },
  {
    id: 3,
    title: "Rockabye", // Exact wav file name
    artist: "Clean Bandit",
    url: "/songs/Rockabye.wav",
    duration: "4:11",
  },
  {
    id: 4,
    title: "I Love You Baby", // Exact wav file name
    artist: "Frank Sinatra",
    url: "/songs/I Love You Baby.wav",
    duration: "3:40",
  },
  {
    id: 5,
    title: "Away", // Exact wav file name
    artist: "Igor Dvorkin, Duncan Pittock, Ellie Kidd",
    url: "/songs/Away.wav",
    duration: "2:32",
  },
  {
    id: 6,
    title: "Believe It", // Exact wav file name
    artist: "Seaside",
    url: "/songs/Believe It.wav",
    duration: "3:34",
  },
  {
    id: 7,
    title: "A Lady of a Certain Age", // Exact wav file name
    artist: "The Divine Comedy",
    url: "/songs/A Lady of a Certain Age.wav",
    duration: "5:50",
  },
  {
    id: 8,
    title: "PIANINO & VIOLIN", // Exact wav file name
    artist: "TIGRAN",
    url: "/songs/PIANINO & VIOLIN.wav",
    duration: "2:03",
  },
];

export const useMusic = () => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);

      return nextIndex;
    });
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);

      return nextIndex;
    });
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return {
    allSongs,
    handlePlaySong,
    currentTrackIndex,
    currentTrack,
    setCurrentTime,
    currentTime,
    formatTime,
    duration,
    setDuration,
    nextTrack,
    prevTrack,
    play,
    pause,
    isPlaying,
  };
};
