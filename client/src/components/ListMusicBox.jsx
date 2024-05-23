import { useState } from "react";
import { DeleteIcon, MusicIcon, PlayIcon, PlusIcon } from "../assets";
import { PlaylistBox } from "./PlaylistBox";

export function ListMusicBox({ room, setIsOpenAddBox, socket }) {
  const [addMusicId, setAddMusicId] = useState(null);

  const ChangeMusic = (musicId) => {
    socket.emit("change music", room._id, musicId);
  };

  const DeleteMusic = (musicId) => {
    socket.emit("delete music", room._id, musicId);
  };

  return (
    <>
      {!addMusicId ? (
        <div className="box">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsOpenAddBox(true)}
          >
            Add new
          </button>
          <div className="listitem">
            {room.list_music.map((item) => (
              <div className="item" key={item._id}>
                <MusicIcon />
                {item.name}
                <div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => ChangeMusic(item._id)}
                  >
                    <PlayIcon />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => DeleteMusic(item._id)}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAddMusicId(item._id)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <PlaylistBox MusicId={addMusicId} setAddMusicId={setAddMusicId} />
      )}
    </>
  );
}
