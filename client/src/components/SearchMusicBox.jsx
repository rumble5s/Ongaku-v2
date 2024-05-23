import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import axios from "axios";
import { MusicIcon, PlusIcon } from "../assets";

export function SearchMusicBox({ AddMusic }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [listMusic, setListMusic] = useState([]);

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
      alert(error);
    }
  }, 1000);

  return (
    <div className="box">
      <h6>Search music</h6>
      <input
        className="form-control form-control-md bg-transparent border-white"
        placeholder="Search music"
        onChange={(e) => GetListMusic(e.target.value)}
      ></input>
      <div className="listitem">
        {listMusic.map((item) => (
          <div className="item" key={item._id}>
            <MusicIcon />
            {item.name}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => AddMusic(item._id)}
            >
              <PlusIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
