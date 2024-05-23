import { useEffect, useRef } from "react";

export function MusicBox({ room, socket }) {
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
      {musicId != null ? (
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
