import { BotIcon, X, Loader2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/ai/request",
        { prompt: input }
      );

      newMessages.push({
        from: "bot",
        text: `You can Learn: ${res.data.suggetion} 🤖`,
      });

      setMessages(newMessages);
    } catch (error) {
      newMessages.push({
        from: "bot",
        text: "Sorry, something went wrong. Please try again later. ⚠️",
      });
      setMessages(newMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div
        className="fixed bottom-5 right-5 rounded-full bg-blue-500 w-fit p-5 z-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <BotIcon className="text-white w-10 h-10 cursor-pointer" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-96 bg-white shadow-2xl rounded-xl p-4 z-50 flex flex-col h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Chat with Bot</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto border p-2 rounded mb-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded-lg text-sm max-w-[75%] ${
                  msg.from === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Bot is typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border rounded p-2 text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Bot;
