import layoutImage from "../assets/layout.png";

export function Layout({ children }) {
  return (
    <div
      className="card bg-dark"
      style={{ maxWidth: "100vw", maxHeight: "100vh", overflow: "hidden" }}
    >
      <img className="card-img" src={layoutImage} />
      <div className="card-img-overlay">{children}</div>
    </div>
  );
}
