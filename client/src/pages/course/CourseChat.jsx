import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import socket from "@/socket/socket";

import { setMessages, addMessage, clearMessages } from "@/redux/chatSlice";

const CourseChat = ({ course }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();
  console.log("location: ",location)
  const courseName=location?.state?.courseName;
  const courseStudentsCount=location?.state?.coureStudetsCount;


  const messages = useSelector((state) => state.chat.messages);

  const currentUser = useSelector((state) => state.auth.user);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [chatReady, setChatReady] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  // -----------------------------------------
  // Scroll to latest message
  // -----------------------------------------

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const handleChatError = (data) => {
      console.error("Chat error:", data);

      setError(data?.message || "You are not allowed to access this chat.");
    };

    socket.on("chat:error", handleChatError);

    return () => {
      socket.off("chat:error", handleChatError);
    };
  }, []);

  useEffect(() => {
    if (!courseId) return;

    const joinRoom = () => {
      console.log("Joining course room:", courseId);
      socket.emit("chat:join", courseId);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.emit("chat:leave", courseId);
    };
  }, [courseId]);

  // -----------------------------------------
  // Socket connection status
  // -----------------------------------------

  useEffect(() => {
    const handleConnect = () => {
      console.log("🟢 Socket connected");
      setSocketConnected(true);
      setError("");
    };

    const handleDisconnect = () => {
      console.log("🔴 Socket disconnected");
      setSocketConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);

      setSocketConnected(false);
      setError("Unable to connect to chat.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  // -----------------------------------------
  // Load messages + join room
  // -----------------------------------------

  useEffect(() => {
    if (!courseId) return;

    let mounted = true;
    let chatLoaded = false;
    setChatReady(false);

    const handleNewMessage = (message) => {
      if (!mounted) return;

      console.log("🔥 LIVE MESSAGE:", message);

      dispatch(addMessage(message));
    };

    const handleChatError = (data) => {
      console.error("❌ Chat error:", data);
      setError(data?.message || "Chat error");
    };

    const joinRoom = () => {
      console.log("🟢 Socket connected");
      console.log("👥 Joining:", `course:${courseId}`);

      socket.emit("chat:join", courseId, (result) => {
        if (!mounted) return;

        if (result?.ok) {
          setChatReady(true);
        } else {
          setError(result?.message || "Unable to join the chat.");
        }
      });
    };

    const handleSocketConnect = () => {
      if (chatLoaded) joinRoom();
    };

    const initializeChat = async () => {
      try {
        setLoading(true);

        // Register listeners FIRST
        socket.on("chat:message", handleNewMessage);
        socket.on("chat:error", handleChatError);

        // Load old messages
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}message/${courseId}`,
          {
            withCredentials: true,
          },
        );

        if (!mounted) return;

        dispatch(setMessages(response?.data?.data || []));
        chatLoaded = true;

        // If already connected → join immediately
        if (socket.connected) {
          joinRoom();
        }
      } catch (error) {
        console.error("❌ Failed to load chat:", error);

        if (mounted) {
          setError(
            error?.response?.data?.message || "Failed to load discussion",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    socket.on("connect", handleSocketConnect);
    initializeChat();

    return () => {
      mounted = false;

      socket.off("connect", handleSocketConnect);

      socket.emit("chat:leave", courseId);

      socket.off("chat:message", handleNewMessage);
      socket.off("chat:error", handleChatError);

      dispatch(clearMessages());
    };
  }, [courseId, dispatch]);

  // -----------------------------------------
  // Send message
  // -----------------------------------------

  const sendMessage = () => {
    const text = content.trim();

    if (!text) return;

    if (!socket.connected || !chatReady) {
      setError("Chat is still connecting. Please try again.");
      return;
    }

    setSending(true);
    setError("");

    socket.emit("chat:message", {
      courseId,
      content: text,
    });

    setContent("");

    /*
     * The backend broadcasts the saved message
     * back through chat:message.
     *
     * So we don't manually add the message here.
     */
    setSending(false);
  };

  // -----------------------------------------
  // Enter to send
  // -----------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // -----------------------------------------
  // Compare IDs
  // -----------------------------------------

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value._id?.toString();
    }

    return value.toString();
  };

  const currentUserId = getId(currentUser?._id);

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50">
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <header className="shrink-0 border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          {/* Back */}

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg px-3 py-2 text-sm transition hover:bg-gray-100"
          >
            ←
          </button>

          {/* Course */}

          <div>
            <h1 className="truncate text-base font-semibold sm:text-lg">
              {courseName || "Course Discussion"}
            </h1>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{courseStudentsCount || 0} students</span>

              <span>•</span>

              <span>1 instructor</span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <span
                  className={`h-2 w-2 rounded-full ${
                    socketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                {socketConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-3 text-4xl">🔒</div>

            <h2 className="text-lg font-semibold">Access Denied</h2>

            <p className="mt-1 text-sm text-gray-500">
              You don't have access to this course discussion.
            </p>

            <button
              onClick={() => navigate(-1)}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* ================================= */}
      {/* MESSAGE AREA */}
      {/* ================================= */}

      <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            /* Loading */

            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="h-16 w-48 animate-pulse rounded-2xl bg-gray-200" />
              </div>

              <div className="flex justify-end">
                <div className="h-14 w-56 animate-pulse rounded-2xl bg-gray-200" />
              </div>

              <div className="flex justify-start">
                <div className="h-20 w-64 animate-pulse rounded-2xl bg-gray-200" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            /* Empty state */

            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  💬
                </div>

                <h2 className="text-lg font-semibold">Start the discussion</h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Ask questions, share ideas, and discuss the course with your
                  instructor and classmates.
                </p>
              </div>
            </div>
          ) : (
            /* Messages */

            <div className="space-y-3 sm:space-y-4">
              {messages.map((message) => {
                const senderId = getId(message.sender?._id);

                const isOwnMessage = senderId === currentUserId;

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 sm:max-w-[70%] ${
                        isOwnMessage
                          ? "rounded-2xl rounded-br-md bg-blue-600 text-white"
                          : "rounded-2xl rounded-bl-md bg-white text-gray-900 shadow-sm"
                      }`}
                    >
                      {/* Other user's name */}

                      {!isOwnMessage && (
                        <p className="mb-1 text-xs font-semibold text-blue-600">
                          {message.sender?.name || "User"}
                        </p>
                      )}

                      {/* Message */}

                      <p className="whitespace-pre-wrap break-words text-sm leading-5">
                        {message.content}
                      </p>

                      {/* Time */}

                      <p
                        className={`mt-1 text-[10px] ${
                          isOwnMessage ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </main>

      {/* ================================= */}
      {/* INPUT */}
      {/* ================================= */}

      <footer className="shrink-0 border-t bg-white px-3 py-3 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                chatReady ? "Write a message..." : "Connecting to chat..."
              }
              disabled={!socketConnected || !chatReady}
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
            />

            <button
              onClick={sendMessage}
              disabled={
                !content.trim() || !socketConnected || !chatReady || sending
              }
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>

          <p className="mt-1 hidden text-xs text-gray-400 sm:block">
            Press Enter to send • Shift + Enter for a new line
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CourseChat;
