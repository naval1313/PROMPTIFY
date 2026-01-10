import "./App.css";
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import Home from "./Pages/Home.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Login from "./Pages/Login.jsx";
import ProtectedRoutes from "./ProtectedRoutes";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <BrowserRouter>
      {/* CONTEXT OUTSIDE ROUTES */}
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoutes>
                <div className="app">
                  <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                  <ChatWindow  openSidebar={openSidebar} />
                </div>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
