import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import mongoose from "mongoose";
import getOpenAIAPIResponse from "../utils/openai.js";
import { auth } from "../Middleware/auth.js";

//1. GET, Thread User wise using auth() middleware.
router.get("/thread", auth, async (req, res) => {
  try {
    const threads = await Thread.find({
      userId: req.userId, //USER-WISE FILTER
    }).sort({ updatedAt: -1 });
    //here, -1 = descending order of UpdatedAt...most recent data on top.
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

//2. GET, One individual thread
router.get("/thread/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findOne({
      _id: id,
      userId: req.userId, //CHECK THREAD OWNER, user rif apni chats open kr sakega
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//3. DELETE User wise chat using auth() middleware.
router.delete("/thread/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      _id: id,
      userId: req.userId, //OWNER CHECK, User sirf apna hi thread delete karega.
    });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

//4. POST req to Create/Continue Chat (User-wise)
router.post("/chat", auth, async (req, res) => {
  const { threadId, message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message required" });
  }

  try {
    let thread;

    if (threadId) {
      thread = await Thread.findOne({
        _id: threadId,
        userId: req.userId,
      });
    }

    if (!thread) {
      thread = new Thread({
        userId: req.userId,
        title: message.slice(0, 30),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });

    await thread.save();

    res.json({
      success: true,
      reply: assistantReply,
      threadId: thread._id,
    });
  } catch (error) {
    console.error("CHAT ROUTE ERROR :", error); // 🔥 VERY IMPORTANT

    res.status(500).json({
      success: false,
      error: error.message || "Chat failed",
    });
  }
});

export default router;
