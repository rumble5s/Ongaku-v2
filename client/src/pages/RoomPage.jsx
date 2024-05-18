import { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Layout } from "../layouts";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";

function MusicBox({ room, socket }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const videoRef = useRef(null);
  const musicId = room.current_music.Id;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  }, [musicId]);

  useEffect(() => {
    if (room.current_music.Id) {
      videoRef.current.currentTime = room.current_music.time;
      if (room.current_music.pause) videoRef.current.pause();
    }

    socket.on("play music", function () {
      videoRef.current.play();
    });

    socket.on("pause music", function () {
      videoRef.current.pause();
    });

    socket.on("seeked music", function (time) {
      videoRef.current.currentTime = time;
    });
  }, []);

  const HandlePlay = () => {
    socket.emit("play music", room._id);
  };

  const HandlePause = () => {
    socket.emit("pause music", room._id);
  };

  const HandleSeeked = () => {
    socket.emit("seeked music", room._id, videoRef.current.currentTime);
  };

  return (
    <div className="box">
      {musicId !== null ? (
        <video
          ref={videoRef}
          width="100%"
          height="15%"
          loop
          controls
          autoPlay
          muted
          onPlay={HandlePlay}
          onPause={HandlePause}
          onSeeked={HandleSeeked}
        >
          <source
            src={`${BASE_URL}music/play/${musicId}`}
            type="video/mp4"
          ></source>
          Your browser does not support the video tag.
        </video>
      ) : (
        <div>Ongaku-v2</div>
      )}
    </div>
  );
}

function ListMusicBox({ room, setIsOpenAddBox, socket }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const ChangeMusic = (musicId) => {
    socket.emit("change music", room._id, musicId);
  };

  const DeleteMusic = (musicId) => {
    socket.emit("delete music", room._id, musicId);
  };

  return (
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
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-file-earmark-music"
                viewBox="0 0 16 16"
              >
                <path d="M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.6 2.6 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377s.974-.134 1.338-.377c.36-.24.662-.628.662-1.123V8.89l2-.5z" />
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>{" "}
              {item.name}
            </div>
            <div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => ChangeMusic(item._id)}
              >
                Play
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => DeleteMusic(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddBox({ room, socket, setIsOpenAddBox }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [listMusic, setListMusic] = useState([]);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");

  const GetListMusic = useDebouncedCallback(async (value) => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "music/search",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          search: value,
        },
      });

      setListMusic(response.data);
    } catch (error) {
      console.log(error);
    }
  }, 1000);

  const AddMusic = (musicId) => {
    socket.emit("add music", room._id, musicId);
    setIsOpenAddBox(false);
  };

  const UploadMusic = async () => {
    console.log(file);
    const formData = new FormData();
    formData.append("name", filename);
    formData.append("file", file);

    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "music/upload",
        headers: {
          "x-access-token": user.token,
        },
        data: formData,
      });

      AddMusic(response.data._id);
      setIsOpenAddBox(false);
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <div className="box addbox z-1">
      <button
        type="button"
        className="close"
        aria-label="Close"
        onClick={() => setIsOpenAddBox(false)}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div>
        <input
          className="form-control form-control-md bg-transparent border-white"
          placeholder="Search music"
          onChange={(e) => GetListMusic(e.target.value)}
        ></input>
        <div className="listitem">
          {listMusic.map((item) => (
            <div key={item._id}>
              {item.name}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => AddMusic(item._id)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        Share your's music!
        <input
          className="form-control form-control-md bg-transparent border-white"
          type="text"
          placeholder="Music name"
          onChange={(e) => setFilename(e.target.value)}
        />
        <input type="file" onInput={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-secondary btn-sm" onClick={UploadMusic}>
          Upload
        </button>
      </div>
    </div>
  );
}

function CommentBox({ socket }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const myroom = JSON.parse(localStorage.getItem("room"));
  const [comment, setComment] = useState("");
  const [listComment, setListComment] = useState([]);

  const SComment = () => {
    socket.emit("comment", myroom._id, `${user.username} : ${comment}`);
  };

  useEffect(() => {
    socket.on("comment", function (message) {
      setListComment((oldValues) => [...oldValues, message]);
    });
  }, []);

  return (
    <div className="box">
      <input
        className="form-control form-control-md bg-transparent border-white"
        onChange={(e) => setComment(e.target.value)}
      ></input>
      <button className="btn btn-secondary btn-sm" onClick={SComment}>
        Comment
      </button>
      <div className="listitem">
        {listComment.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function PlaylistBox() {
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

      setPlaylist((oldValues) => [...oldValues, response.data]);
    } catch (error) {
      console.log(error);
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
        console.log(error);
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
        console.log(error);
      }
    };

    GetListMusic();
  }, [currentPlaylist]);

  return (
    <div className="box">
      {currentPlaylist == null ? (
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
          <div className="listitem">
            {playlist.map((item) => (
              <div
                onClick={() => setCurrentPlaylist(item)}
                className="item"
                key={item._id}
              >
                {item.name}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentPlaylist(null)}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}

export function RoomPage() {
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState(null);
  const [isOpenAddBox, setIsOpenAddBox] = useState(false);
  const navigate = useNavigate();

  const LeaveRoom = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const myroom = JSON.parse(localStorage.getItem("room"));
    socket.emit("leave room", myroom._id, user.userId);
    localStorage.removeItem("room");
    navigate("/");
  };

  useEffect(() => {
    let newSocket;
    const user = JSON.parse(localStorage.getItem("user"));
    const myroom = JSON.parse(localStorage.getItem("room"));

    const initializeSocket = async () => {
      newSocket = io(import.meta.env.VITE_BASE_URL);

      newSocket.on("error", function (message) {
        alert(message);
        localStorage.removeItem("room");
      });

      newSocket.emit("join room", myroom._id, user.userId);

      newSocket.on("current", function (current) {
        setRoom(current);
      });

      newSocket.on("add music", function (music) {
        setRoom((oldRoom) => {
          const newRoom = { ...oldRoom };
          newRoom.list_music.push(music);
          return newRoom;
        });
      });

      newSocket.on("change music", function (musicId) {
        setRoom((oldRoom) => {
          const newRoom = { ...oldRoom };
          newRoom.current_music.Id = musicId;
          return newRoom;
        });
      });

      newSocket.on("delete music", function (musicId) {
        setRoom((oldRoom) => {
          const newRoom = { ...oldRoom };
          newRoom.list_music = newRoom.list_music.filter(
            (item) => item._id !== musicId
          );
          return newRoom;
        });
      });

      setSocket(newSocket);
    };

    initializeSocket();

    return () => {
      newSocket.emit("leave room", myroom._id, user.userId);
      localStorage.removeItem("room");
    };
  }, []);

  return (
    <Layout>
      <button className="btn btn-secondary btn-lg" onClick={LeaveRoom}>
        Leave
      </button>
      {room && socket && (
        <div className="z-0 body d-flex flex-row position-fixed">
          <ListMusicBox
            room={room}
            setIsOpenAddBox={setIsOpenAddBox}
            setRoom={setRoom}
            socket={socket}
          />
          <MusicBox room={room} socket={socket} />
          <CommentBox socket={socket} />
          {isOpenAddBox && (
            <AddBox
              room={room}
              socket={socket}
              setIsOpenAddBox={setIsOpenAddBox}
            />
          )}
          <PlaylistBox />
        </div>
      )}
    </Layout>
  );
}
