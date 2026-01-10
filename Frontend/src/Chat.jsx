import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats } = useContext(MyContext);
  const [typingText, setTypingText] = useState("");

  useEffect(() => {
    if (prevChats.length === 0) return;

    const lastMsg = prevChats[prevChats.length - 1];

    // typing effect ONLY for assistant
    if (lastMsg.role !== "assistant") {
      setTypingText("");
      return;
    }

    const words = (lastMsg.content || "").split(" ");
    let index = 0;
    setTypingText("");

    const interval = setInterval(() => {
      setTypingText((prev) => prev + " " + words[index]);
      index++;
      if (index >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats]);

  return (
    <>
      <div className="chats">
        {newChat && (
          <div className="newChatCenter">
            <h1>Start a New chat!</h1>
          </div>
        )}

        {prevChats.length === 0 && !newChat && (
          <h2 className="emptyChat">Ask something to start chat</h2>
        )}

        {prevChats.map((chat, idx) => (
          <div
            key={idx}
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : idx === prevChats.length - 1 ? (
              <ReactMarkdown>{typingText || chat.content}</ReactMarkdown>
            ) : (
              <ReactMarkdown>{chat.content}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Chat;
