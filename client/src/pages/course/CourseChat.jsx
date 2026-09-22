import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/utils/BASE_URL";
import socket from "@/socket/socket";
import { setMessages, addMessage, clearMessages } from "@/redux/chatSlice";
import { Button } from "@/components/ui/button";
import Icons from "@/utils/Icons";

const CourseChat = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const courseName = location?.state?.courseName;
  const courseStudentsCount = location?.state?.coureStudetsCount;

  const messages = useSelector((state) => state.chat.messages || []);
  const currentUser = useSelector((state) => state.auth.user);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [chatReady, setChatReady] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleChatError = (data) => {
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

  useEffect(() => {
    const handleConnect = () => {
      setSocketConnected(true);
      setError("");
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleConnectError = () => {
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

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}message/${courseId}`, {
          withCredentials: true,
        });
        dispatch(setMessages(res.data?.data || []));
        setChatReady(true);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chat history.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();

    return () => {
      dispatch(clearMessages());
    };
  }, [courseId, dispatch]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      dispatch(addMessage(message));
    };

    socket.on("chat:message", handleNewMessage);
    return () => {
      socket.off("chat:message", handleNewMessage);
    };
  }, [dispatch]);

  const sendMessage = async () => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      socket.emit("chat:message", {
        courseId,
        content: content.trim(),
      });
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getId = (value) => {
    if (!value) return null;
    if (typeof value === "object") return value._id?.toString();
    return value.toString();
  };

  const currentUserId = getId(currentUser?._id);

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="cursor-pointer h-9 w-9 p-0"
            >
              <Icons.ArrowLeft className="w-4 h-4" />
            </Button>

            <div>
              <h1 className="truncate text-sm sm:text-base font-bold text-foreground">
                {courseName || "Course Discussion"}
              </h1>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{courseStudentsCount || 0} students</span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      socketConnected ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {socketConnected ? "Live" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
              <Icons.ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-foreground">Access Denied</h2>
            <p className="mt-1 text-xs text-muted-foreground">{error}</p>
            <Button
              onClick={() => navigate(-1)}
              className="mt-4 cursor-pointer"
              size="sm"
            >
              Go Back
            </Button>
          </div>
        </div>
      )}

      {/* Messages area */}
      {!error && (
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-5xl">
            {loading ? (
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="h-14 w-48 animate-pulse rounded-2xl bg-muted" />
                </div>
                <div className="flex justify-end">
                  <div className="h-12 w-56 animate-pulse rounded-2xl bg-muted" />
                </div>
                <div className="flex justify-start">
                  <div className="h-16 w-64 animate-pulse rounded-2xl bg-muted" />
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icons.MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Start the discussion</h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Ask questions, share ideas, and connect with your instructor and fellow classmates in real time.
                  </p>
                </div>
              </div>
            ) : (
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
                        className={`max-w-[85%] px-4 py-2.5 sm:max-w-[70%] rounded-2xl ${
                          isOwnMessage
                            ? "rounded-br-xs bg-primary text-primary-foreground shadow-xs"
                            : "rounded-bl-xs bg-card border border-border/60 text-foreground shadow-xs"
                        }`}
                      >
                        {!isOwnMessage && (
                          <p className="mb-0.5 text-[11px] font-bold text-primary">
                            {message.sender?.name || "Student"}
                          </p>
                        )}

                        <p className="whitespace-pre-wrap break-words text-xs md:text-sm leading-relaxed">
                          {message.content}
                        </p>

                        <p
                          className={`mt-1 text-[10px] ${
                            isOwnMessage
                              ? "text-primary-foreground/70 text-right"
                              : "text-muted-foreground"
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
      )}

      {/* Input bar */}
      {!error && (
        <footer className="shrink-0 border-t border-border/60 bg-card px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end gap-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  chatReady ? "Type your message..." : "Connecting to chat..."
                }
                disabled={!socketConnected || !chatReady}
                rows={1}
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-xs md:text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
              />

              <Button
                onClick={sendMessage}
                disabled={
                  !content.trim() || !socketConnected || !chatReady || sending
                }
                className="cursor-pointer shadow-xs h-[42px] px-4"
              >
                <Icons.Send className="w-4 h-4 mr-1 sm:mr-1.5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>

            <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
              Press Enter to send • Shift + Enter for a new line
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default CourseChat;
