import { Layout, NavBar } from "../layouts/index";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

function CreateRoomBox() {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const CreateRoom = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "room/create",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          roomname: roomName,
        },
      });

      localStorage.setItem("room", JSON.stringify(response.data));
      navigate("/room");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="box text-center">
      <input
        className="form-control form-control-lg bg-transparent border-white"
        placeholder="Create your own room!"
        onChange={(e) => setRoomName(e.target.value)}
      ></input>
      <button className="btn btn-secondary btn-lg" onClick={CreateRoom}>
        Create Room
      </button>
    </div>
  );
}

function ListRoomBox() {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [listRoom, setListRoom] = useState([]);

  const JoinRoom = (room) => {
    localStorage.setItem("room", JSON.stringify(room));
    navigate("/room");
  };

  const GetListRoom = useDebouncedCallback(async (value) => {
    try {
      const response = await axios({
        method: "POST",
        url: BASE_URL + "room/search",
        headers: {
          "x-access-token": user.token,
        },
        data: {
          search: value,
        },
      });

      setListRoom(response.data);
    } catch (error) {
      alert(error);
    }
  }, 1000);

  return (
    <div className="box">
      <input
        className="form-control form-control-lg bg-transparent border-white"
        placeholder="Search room"
        onChange={(e) => GetListRoom(e.target.value)}
      ></input>
      <div className="listitem">
        {listRoom.map((item) => (
          <div className="item" key={item._id}>
            <h3>{item.name}</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => JoinRoom(item)}
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MainPage() {
  return (
    <Layout>
      <NavBar />
      <div className="body d-flex justify-content-around">
        <CreateRoomBox />
        <ListRoomBox />
      </div>
    </Layout>
  );
}
