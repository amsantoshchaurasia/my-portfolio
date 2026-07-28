import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Santosh<span>.</span>
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>About</li>
        <li>Skills</li>
        <li>Projects</li>
        <li>Certificates</li>
        <li>Contact</li>
      </ul>

      <button className="resume-btn">
        Resume
      </button>
    </nav>
  );
}