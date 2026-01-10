import "./Sidebar.css";
import { useState } from "react";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";

function Sidebar({ isOpen, closeSidebar }) {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
  }

  const getAllThreads = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; //STOP API CALL

    try {
      const response = await fetch( `${import.meta.env.VITE_API_URL}/api/thread` , {
        headers: {
          Authorization: `Bearer ${token}`, //token send kr rhe he
        },
      });

      if (!response.ok) return;
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        id: thread._id,
        title: thread.title,
      }));
      //   console.log(filteredData);
      setAllThreads(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  //Func to create new chat
  const createNewChat = () => {
    setCurrThreadId(null); //pehle threadId
    setPrevChats([]); //clear old chats
    setPrompt("");
    setReply(null);
    setNewChat(true); //last me UI flag
  };

  //func to change Threads in Sidebar thread history.
  const changeThread = (newThreadId) => {
    setCurrThreadId(newThreadId);
    setNewChat(false);
    setReply(null);
  };

  // const changeThread = async (newThreadId) => {
  //   setCurrThreadId(newThreadId);

  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/thread/${newThreadId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, //yha bhi token bhej rhe he
  //         },
  //       }
  //     );
  //     const res = await response.json();
  //     console.log(res);
  //     setPrevChats(res);
  //     setNewChat(false);
  //     setReply(null);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //func to delete Thread from Sidebar thread/chat history
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, //yha bhi token bhej rhe he
          },
        }
      );
      const res = await response.json();
      console.log(res);

      //re-rendering the updated Threads.
      setAllThreads((prev) => prev.filter((thread) => thread.id !== threadId));

      //jese hi Thread delete ho jaega vese hi we create new chat.
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      <section className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* New Chat button */}
        <button onClick={createNewChat}>
          <img src="src/assets/openai.png" alt="gpt logo" className="logo" />
          <span className="CreateNewChat"> New Chat </span>
          <i>
            <span>
              <i className="fas fa-edit"></i>
            </span>
          </i>
        </button>

        {/* History */}
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={thread.id}
              onClick={(e) => changeThread(thread.id)}
              className={thread.id === currThreadId ? "highlighted" : " "}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation(); //to stop event bubbling.
                  deleteThread(thread.id);
                }}
              ></i>
            </li>
          ))}
        </ul>

        {/* Sign */}
        <div className="sign">
          <p>By Naval &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
