import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //if user is already loggedIn.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/chat", { replace: true });
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    };

    try {
      //clear old junk token
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        options
      );
      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/chat", { replace: true });
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.log(error);
      alert("Login failed!");
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2 className="loginTitle">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email address"
          className="loginInput"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="loginInput"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="loginBtn" onClick={handleLogin}>
          Log In
        </button>

        <p className="loginFooter">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
