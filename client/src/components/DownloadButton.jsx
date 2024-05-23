import axios from "axios";

export function DownloadButton({ fileurl }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const Download = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: fileurl,
        headers: {
          "x-access-token": user.token,
          responseType: "blob",
        },
      });
      const mp3 = new Blob([response.data], { type: "audio/mp3" });
      const url = window.URL.createObjectURL(mp3);
      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded-file";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <button className="btn btn-secondary btn-sm" onClick={Download}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-download"
        viewBox="0 0 16 16"
      >
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
      </svg>
    </button>
  );
}
