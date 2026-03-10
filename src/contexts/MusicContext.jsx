import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

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

export const MusicProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");

    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const handlePlaySong = (song, index, playlistId = null) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setActivePlaylistId(playlistId);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    const playlist = activePlaylistId ? playlists.find(p => p.id === activePlaylistId) : null;

    if (playlist) {
      const indexInPlaylist = playlist.songs.findIndex(s => s.id === currentTrack.id);
      const nextSong = playlist.songs[(indexInPlaylist + 1) % playlist.songs.length];
      const globalIndex = allSongs.findIndex(s => s.id === nextSong.id);

      setCurrentTrack(nextSong);
      setCurrentTrackIndex(globalIndex);
    } else {
      setCurrentTrackIndex((prev) => {
        const nextIndex = (prev + 1) % allSongs.length;
        setCurrentTrack(allSongs[nextIndex]);

        return nextIndex;
      });
    }
  };

  const prevTrack = () => {
    const playlist = activePlaylistId ? playlists.find(p => p.id === activePlaylistId) : null;

    if (playlist) {
      const indexInPlaylist = playlist.songs.findIndex(s => s.id === currentTrack.id);
      const prevSong = playlist.songs[indexInPlaylist === 0 ? playlist.songs.length - 1 : indexInPlaylist - 1];
      const globalIndex = allSongs.findIndex(s => s.id === prevSong.id);

      setCurrentTrack(prevSong);
      setCurrentTrackIndex(globalIndex);
    } else {
      setCurrentTrackIndex((prev) => {
        const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
        setCurrentTrack(allSongs[nextIndex]);

        return nextIndex;
      });
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      }),
    );
  };

  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: playlist.songs.filter((s) => s.id !== songId) };
        }
        return playlist;
      })
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
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
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
        removeSongFromPlaylist,
        setCurrentTrack,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);

  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }

  return contextValue;
};
