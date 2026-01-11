import "./Home.css";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP } from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="home-container">
      {/* NAVBAR */}
      <div className="home-nav">
        <div className="home-logo">
          <FontAwesomeIcon icon={faP}/>
        </div>

        <div className="home-nav-buttons">
          <Link to="/login">
            <button className="home-btn login-btn">Log In</button>
          </Link>

          <Link to="/signup">
            <button className="home-btn signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="home-hero">
        <h1 className="home-title">Welcome to Promptify</h1>
        <p className="home-subtitle">
          Your personal AI assistant — chat, explore, and create anything.
        </p>

        <Link to="/signup">
          <button className="home-start-btn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
