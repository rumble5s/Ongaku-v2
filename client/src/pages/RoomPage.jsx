import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Layout } from "../layouts";
import { useNavigate } from "react-router-dom";
import {
  MusicBox,
  ListMusicBox,
  PlaylistBox,
  SearchMusicBox,
  CommentBox,
  UploadMusicBox,
} from "../components";

function AddMusicBox({ room, socket, setIsOpenAddBox }) {
  const AddMusic = (musicId) => {
    socket.emit("add music", room._id, musicId);
    setIsOpenAddBox(false);
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
      <div className="body p-0 d-flex justify-content-around">
        <SearchMusicBox AddMusic={AddMusic} />
        <PlaylistBox AddMusic={AddMusic} />
      </div>
      <UploadMusicBox AddMusic={AddMusic} />
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
            (item) => item._id != musicId
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
            <AddMusicBox
              room={room}
              socket={socket}
              setIsOpenAddBox={setIsOpenAddBox}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
