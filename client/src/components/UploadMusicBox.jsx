import { useState } from "react";
import axios from "axios";

export function UploadMusicBox({ AddMusic }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");

  const UploadMusic = async () => {
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
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
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
  );
}
