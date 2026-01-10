import { useContext, useEffect, useState } from "react";
import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow({ openSidebar }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  //for loading
  const [loading, setLoading] = useState(false);

  //user state to show user name on profile icon.
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const res = await response.json();
      console.log("CHAT API RESPONSE:", res);

      if (!res.success || !res.reply) {
        console.error("Invalid reply:", res);
        return;
      }

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: res.reply }, // 🔥 STRING
      ]);

      setPrompt("");

      if (!currThreadId && res.threadId) {
        setCurrThreadId(res.threadId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //this Loads user-wise chats when thread changes.
  useEffect(() => {
    if (!currThreadId) return;

    const fetchThreadChats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/thread/${currThreadId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        setPrevChats(data);
        setNewChat(false);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    };

    fetchThreadChats();
  }, [currThreadId]);

  //Append New chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
      setNewChat(false);
    }

    setPrompt("");
  }, [reply]);

  //getting user name from localstorage.
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");

      if (userStr && userStr !== "undefined") {
        setUser(JSON.parse(userStr));
      }
    } catch (err) {
      console.error("Invalid user in localStorage", err);
      localStorage.removeItem("user"); // safety
    }
  }, []);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home", { replace: true });
  };

  return (
    <>
      <div className="chatWindow">
        <div className="navbar">
          <div className="navbarInner">
            <div className="navbarLeft">
              {/* MOBILE SIDEBAR TOGGLE */}
              <i
                className="fa-solid fa-bars mobile-menu"
                onClick={openSidebar}
              ></i>

              <span className="navbarTitle">
                PromptiFy <i className="fa-solid fa-angle-down"></i>
              </span>
            </div>

            <div className="userIconDiv">
              <span className="userFirstLetter">
                {user?.name?.charAt(0).toUpperCase()}
              </span>

              <span className="userName">{user?.name}</span>
              <div className="dropDownItem" id="LogOut" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
              </div>
            </div>
          </div>
        </div>

        <Chat />
        {loading && (
          <div className="loaderWrapper">
            <ScaleLoader color="#00ffb3" />
          </div>
        )}

        {/* Input */}
        <div className="chatInput">
          <div className="inputBox">
            <input
              type="text"
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  getReply();
                }
              }}
            />

            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <p className="info">
            This model was trained on data up to October 2023 and may not
            reflect recent developments.
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;
