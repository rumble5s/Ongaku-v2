import { useEffect, useState } from "react";
import axios from "axios";
import { DeleteIcon, MusicIcon, PlusIcon } from "../assets";

export function PlaylistBox({ AddMusic, MusicId, setAddMusicId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [playlist, setPlaylist] = useState([]);
  const [newplaylist, setNewplaylist] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [listMusic, setListMusic] = useState([]);

  const CreateNewPlaylist = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "playlist/create",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          name: newplaylist,
          userId: user.userId,
        },
      });
      setNewplaylist("");
      setPlaylist((oldValues) => [...oldValues, response.data]);
    } catch (error) {
      alert(error);
    }
  };

  const DeletePlayList = async (itemId) => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "playlist/delete",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          playlistId: itemId,
        },
      });

      setPlaylist((oldValues) => {
        return oldValues.filter((item) => item._id != itemId);
      });
    } catch (error) {
      alert(error);
    }
  };

  const AddtoPlaylist = async (itemId) => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "playlist/add_music",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          playlistId: itemId,
          musicId: MusicId,
        },
      });

      setAddMusicId(null);
    } catch (error) {
      alert(error);
    }
  };

  const DeleteMusic = async (itemId) => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "playlist/delete_music",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          playlistId: currentPlaylist._id,
          musicId: itemId,
        },
      });
      setListMusic((oldValues) => {
        return oldValues.filter((item) => item._id != itemId);
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const GetPlaylist = async () => {
      try {
        const response = await axios({
          method: "POST",
          url: BASE_URL + "playlist/list",
          headers: {
            "x-access-token": user.token,
          },
          data: {
            userId: user.userId,
          },
        });

        setPlaylist(response.data);
      } catch (error) {
        alert(error);
      }
    };

    GetPlaylist();
  }, []);

  useEffect(() => {
    const GetListMusic = async () => {
      try {
        const response = await axios({
          method: "POST",
          url: BASE_URL + "playlist/list_music",
          headers: {
            "x-access-token": user.token,
          },
          data: {
            playlistId: currentPlaylist._id,
          },
        });

        setListMusic(response.data);
      } catch (error) {
        alert(error);
      }
    };

    if (currentPlaylist != null) GetListMusic();
  }, [currentPlaylist]);

  return (
    <div className="box">
      {!MusicId ? (
        <h6>Choose from your's playlist</h6>
      ) : (
        <>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => setAddMusicId(null)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h6>Add to your's playlist</h6>
        </>
      )}
      {currentPlaylist == null ? (
        <>
          {MusicId && (
            <>
              <input
                className="form-control form-control-md bg-transparent border-white"
                placeholder="Create new playlist"
                onChange={(e) => setNewplaylist(e.target.value)}
              ></input>
              <button
                className="btn btn-secondary btn-sm"
                onClick={CreateNewPlaylist}
              >
                Create
              </button>
            </>
          )}
          <div className="listitem">
            {playlist.map((item) => (
              <div
                onClick={() => setCurrentPlaylist(item)}
                className="item"
                key={item._id}
              >
                <MusicIcon />
                {item.name}
                <div>
                  {MusicId && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        AddtoPlaylist(item._id);
                      }}
                    >
                      <PlusIcon />
                    </button>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      DeletePlayList(item._id);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => setCurrentPlaylist(null)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="listitem">
            {listMusic.map((item) => (
              <div className="item" key={item._id}>
                <MusicIcon />
                {item.name}
                <div>
                  {!MusicId && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => AddMusic(item._id)}
                    >
                      <PlusIcon />
                    </button>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => DeleteMusic(item._id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
