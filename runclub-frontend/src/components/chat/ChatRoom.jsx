import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import * as api from "../../utils/api";

export default function ChatRoom({ eventId }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .getChatMessages(eventId)
      .then((response) => {
        if (mounted) {
          setMessages(response.data || []);
        }
      })
      .catch(() => {
        toast.error("Could not load chat messages.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    socket.emit("join-room", eventId);

    const handleReceive = (message) => {
      setMessages((current) => [...current, message]);
    };

    const handleTyping = ({ name }) => {
      setTyping(`${name} is typing...`);
      window.clearTimeout(handleTyping.timerId);
      handleTyping.timerId = window.setTimeout(() => setTyping(""), 1200);
    };

    socket.on("receive-message", handleReceive);
    socket.on("typing", handleTyping);

    return () => {
      socket.emit("leave-room", eventId);
      socket.off("receive-message", handleReceive);
      socket.off("typing", handleTyping);
      window.clearTimeout(handleTyping.timerId);
    };
  }, [socket, eventId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextText = text.trim();

    if (!nextText) {
      return;
    }

    try {
      const response = await api.sendChatMessage(eventId, { text: nextText });
      const message = response.data;
      setMessages((current) => [...current, message]);
      socket?.emit("send-message", { room: eventId, message });
      setText("");
      setTyping("");
    } catch {
      toast.error("Failed to send message.");
    }
  };

  const handleTypingInput = (value) => {
    setText(value);
    if (value.trim()) {
      socket?.emit("typing", { room: eventId, name: user?.name || "Runner" });
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">Event Chat</h3>
          <p className="text-sm text-zinc-400">Real-time updates for this run.</p>
        </div>
        <span className="text-xs text-zinc-500">{typing || " "}</span>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        {loading ? <p className="text-sm text-zinc-500">Loading chat...</p> : null}
        {!loading && messages.length === 0 ? <p className="text-sm text-zinc-500">No messages yet.</p> : null}
        {messages.map((message) => {
          const mine = String(message.sender?._id || message.sender) === String(user?.id);
          return (
            <div key={message._id || `${message.text}-${message.createdAt}`} className={mine ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left ${
                  mine ? "bg-brand-400 text-zinc-950" : "bg-zinc-800 text-zinc-100"
                }`}
              >
                <p className={`mb-1 text-xs font-semibold ${mine ? "text-zinc-900/70" : "text-zinc-400"}`}>
                  {message.sender?.name || "Runner"}
                </p>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          value={text}
          onChange={(event) => handleTypingInput(event.target.value)}
          className="input"
          placeholder="Send a message to the group"
        />
        <button type="submit" className="btn-primary gap-2">
          <Send size={15} />
          Send
        </button>
      </form>
    </div>
  );
}
