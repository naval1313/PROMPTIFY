import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //handling signUp button func
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        options
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        navigate("/login", { replace: true });
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="signupContainer">
      <div className="signupCard">
        <h2 className="signupTitle">Create PromptiFy Account</h2>
        <label htmlFor="fullName">Enter Full Name :</label>
        <input
          id="fullName"
          type="text"
          placeholder="Enter full Name"
          className="signupInput"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Your Email :</label>
        <input
          id="email"
          type="email"
          placeholder="Enter Your Email address"
          className="signupInput"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Enter Password : </label>
        <input
          id="password"
          type="password"
          placeholder="Create Password"
          className="signupInput"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signupBtn" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="signupFooter">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
