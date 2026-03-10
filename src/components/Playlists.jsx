import { useState } from "react";
import { useMusic } from "../contexts/MusicContext";

export const Playlists = () => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    playlists,
    createPlaylist,
    allSongs,
    addSongToPlaylist,
    currentTrackIndex,
    handlePlaySong,
    deletePlaylist,
    isPlaying,
    removeSongFromPlaylist,
  } = useMusic();
  const filteredSongs = allSongs.filter((song) => {
    const matches =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const isAlreadyInPlaylist = selectedPlaylist?.songs.some(
      (playlistSong) => playlistSong.id === song.id,
    );

    return matches && !isAlreadyInPlaylist;
  });

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());

      setNewPlaylistName("");
    }
  };

  const handleAddSong = (song) => {
    if (selectedPlaylist) {
      addSongToPlaylist(selectedPlaylist.id, song);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handlePlayFromPlaylist = (song, playlistId) => {
    const globalIndex = allSongs.findIndex((s) => s.id === song.id);
    handlePlaySong(song, globalIndex, playlistId);
  };

  const deletePlaylistConfirmation = (playlist) => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
    }
  };

  return (
    <div className="playlists">
      <h2>Playlists</h2>

      <div className="create-playlist">
        <h3>Create New Playlist</h3>

        <div className="playlist-form">
          <input
            type="text"
            placeholder="Playlist Name..."
            className="playlist-input"
            onChange={(e) => setNewPlaylistName(e.target.value)}
            value={newPlaylistName}
          />

          <button className="create-btn" onClick={handleCreatePlaylist}>
            Create
          </button>
        </div>
      </div>

      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p className="empty-message">No playlists created yet.</p>
        ) : (
          playlists.map((playlist, key) => (
            <div className="playlist-item" key={key}>
              <div className="playlist-header">
                <h3>{playlist.name}</h3>

                <div className="playlist-actions">
                  <button
                    className="delete-playlist-btn"
                    onClick={() => deletePlaylistConfirmation(playlist)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="add-song-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search songs to add..."
                    value={
                      selectedPlaylist?.id === playlist.id ? searchQuery : ""
                    }
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    onFocus={(e) => {
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    className="song-search-input"
                  />

                  {selectedPlaylist?.id === playlist.id && showDropdown && (
                    <div className="song-dropdown">
                      {filteredSongs.length === 0 ? (
                        <div className="dropdown-item no-results">
                          No songs found.
                        </div>
                      ) : (
                        filteredSongs.slice(0, 5).map((song, key) => (
                          <div
                            key={key}
                            className="dropdown-item"
                            onClick={() => handleAddSong(song)}
                          >
                            <span className="song-title">{song.title}</span>
                            <span className="song-artist">{song.artist}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="playlist-songs">
                {playlist.songs.length === 0 ? (
                  <p className="empty-playlist">No songs in this playlist.</p>
                ) : (
                  playlist.songs.map((song) => {
                    const globalIndex = allSongs.findIndex((s) => s.id === song.id);
                    const isActive = currentTrackIndex === globalIndex;

                    return (
                      <div
                        key={song.id}
                        className={`playlist-song ${isActive ? "active" : ""}`}
                        onClick={() => handlePlayFromPlaylist(song, playlist.id)}
                      >
                        <div className="song-info">
                          <span className="song-title">{song.title}</span>
                          <span className="song-artist">{song.artist}</span>
                          <button
                            className="remove-song-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSongFromPlaylist(playlist.id, song.id);
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="play-button">
                          {isActive ? (isPlaying ? "▶" : "") : ""}
                        </div>

                        <span className="song-duration">{song.duration}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
