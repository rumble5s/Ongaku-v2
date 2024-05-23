import { useEffect, useState } from "react";

export function CommentBox({ socket }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const myroom = JSON.parse(localStorage.getItem("room"));
  const [comment, setComment] = useState("");
  const [listComment, setListComment] = useState([]);

  const SComment = () => {
    socket.emit("comment", myroom._id, `${user.username} : ${comment}`);
    setComment("");
  };

  useEffect(() => {
    socket.on("comment", function (message) {
      setListComment((oldValues) => [...oldValues, message]);
    });
  }, []);

  return (
    <div className="box">
      <input
        value={comment}
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
