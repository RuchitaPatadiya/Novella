import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AIAssistant = ({ onApplyFilters, onClearFilters }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [pastChats, setPastChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState("active");
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`novella_chat_${user._id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.activeChat && Array.isArray(parsed.activeChat)) {
            setChatLog(parsed.activeChat);
            setActiveChat(parsed.activeChat);
            setPastChats(parsed.pastChats || []);
          } else if (Array.isArray(parsed)) {
            // Legacy structure migration
            setChatLog(parsed);
            setActiveChat(parsed);
            setPastChats([]);
          }
        } catch (err) {
          console.error("Failed to parse chat logs", err);
          resetToDefault();
        }
      } else {
        resetToDefault();
      }
    }
  }, [user]);

  const resetToDefault = () => {
    const defaultMsg = [
      {
        sender: "bot",
        text: `Welcome ${user?.name || "friend"}. I am your personal design curator. Ask me to find matching catalog items, filter prices, or suggest themes for your space.`
      }
    ];
    setChatLog(defaultMsg);
    setActiveChat(defaultMsg);
    setPastChats([]);
    setSelectedChatId("active");
  };

  // Scroll to bottom on chat logs update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const generateTitle = (log) => {
    const firstUserMsg = log.find((m) => m.sender === "user");
    if (firstUserMsg) {
      return firstUserMsg.text.length > 22
        ? firstUserMsg.text.substring(0, 22) + "..."
        : firstUserMsg.text;
    }
    return `Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleSend = async (textToSend) => {
    const prompt = textToSend || message;
    if (!prompt.trim()) return;

    if (!textToSend) setMessage("");
    
    const userMsg = { sender: "user", text: prompt };
    const updatedLog = [...chatLog, userMsg];
    setChatLog(updatedLog);
    setLoading(true);

    try {
      const res = await API.post("/assistant/chat", {
        message: prompt,
        history: chatLog.slice(-10) // Sends last 10 messages for conversational context
      });

      const botMsg = { sender: "bot", text: res.data.message };
      const finalLog = [...updatedLog, botMsg];
      setChatLog(finalLog);

      if (selectedChatId === "active") {
        setActiveChat(finalLog);
        localStorage.setItem(
          `novella_chat_${user._id}`,
          JSON.stringify({ activeChat: finalLog, pastChats })
        );
      } else {
        const updatedPast = pastChats.map((c) =>
          c.id === selectedChatId ? { ...c, log: finalLog } : c
        );
        setPastChats(updatedPast);
        localStorage.setItem(
          `novella_chat_${user._id}`,
          JSON.stringify({ activeChat, pastChats: updatedPast })
        );
      }

      // Trigger filter action in parent shop page
      if (res.data.filters && Object.keys(res.data.filters).length > 0) {
        onApplyFilters(res.data.filters);
      }
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { sender: "bot", text: "I apologize, but my connection was temporarily interrupted. Let's try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const hasUserMessages = activeChat.some((m) => m.sender === "user");

    if (hasUserMessages) {
      const newPastChat = {
        id: Date.now().toString(),
        title: generateTitle(activeChat),
        log: activeChat
      };
      const updatedPast = [newPastChat, ...pastChats];
      const defaultMsg = [
        {
          sender: "bot",
          text: `Welcome ${user?.name || "friend"}. I am your personal design curator. Ask me to find matching catalog items, filter prices, or suggest themes for your space.`
        }
      ];
      setPastChats(updatedPast);
      setActiveChat(defaultMsg);
      setChatLog(defaultMsg);
      setSelectedChatId("active");
      localStorage.setItem(
        `novella_chat_${user._id}`,
        JSON.stringify({ activeChat: defaultMsg, pastChats: updatedPast })
      );
      onClearFilters();
    } else {
      setSelectedChatId("active");
      setChatLog(activeChat);
    }
  };

  const handleLoadPastChat = (id) => {
    if (id === "clear_all") {
      if (window.confirm("Do you want to delete all past chats and clear conversation history?")) {
        resetToDefault();
        localStorage.setItem(
          `novella_chat_${user._id}`,
          JSON.stringify({ activeChat: [], pastChats: [] })
        );
        onClearFilters();
      }
      return;
    }

    setSelectedChatId(id);
    if (id === "active") {
      setChatLog(activeChat);
    } else {
      const selected = pastChats.find((c) => c.id === id);
      if (selected) {
        setChatLog(selected.log);
      }
    }
  };

  const handleDeletePastChat = (id) => {
    if (window.confirm("Delete this conversation log from history?")) {
      const updatedPast = pastChats.filter((c) => c.id !== id);
      setPastChats(updatedPast);
      
      if (selectedChatId === id) {
        setSelectedChatId("active");
        setChatLog(activeChat);
      }
      
      localStorage.setItem(
        `novella_chat_${user._id}`,
        JSON.stringify({ activeChat, pastChats: updatedPast })
      );
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border border-bronze/20 flex flex-col h-[560px] rounded-[12px] overflow-hidden shadow-[0_20px_50px_rgba(27,27,27,0.18)] transition-all duration-300 animate-slideUp relative">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/80 flex justify-between items-center bg-gradient-to-r from-surface to-background">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-bronze animate-pulse shadow-[0_0_8px_rgba(184,144,71,0.5)]" />
          <span className="font-display font-medium text-[0.8rem] uppercase tracking-[0.15em] text-ink">Design Curator</span>
        </div>
        
        <div className="flex items-center gap-4">
          {pastChats.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="bg-transparent border-0 text-muted hover:text-bronze cursor-pointer p-0 transition-colors duration-200 flex items-center gap-1.5 font-body text-[0.62rem] uppercase tracking-wider font-medium"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-current mt-[0.5px]">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History ({pastChats.length})
            </button>
          )}
          <button 
            type="button"
            onClick={handleNewChat} 
            className="bg-transparent border-0 text-[0.62rem] text-muted hover:text-bronze cursor-pointer font-body uppercase tracking-[0.12em] transition-colors duration-200 font-medium"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* History Slide-out Overlay Panel */}
      {showHistory && (
        <div className="absolute inset-x-0 top-[53px] bottom-0 bg-white/98 backdrop-blur-md z-30 flex flex-col p-5 animate-fadeIn border-b border-bronze/10">
          <div className="flex justify-between items-center border-b border-border/60 pb-3 mb-4">
            <h4 className="font-display font-medium text-[0.72rem] uppercase tracking-widest text-ink m-0">Saved Conversations</h4>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="bg-transparent border-0 text-muted hover:text-ink cursor-pointer font-body text-[0.75rem]"
            >
              ✕ Close
            </button>
          </div>

          {/* History scroll list */}
          <div className="flex-grow overflow-y-auto space-y-2.5 pr-1 max-h-[380px] scrollbar-thin">
            {/* Active chat selector */}
            <button
              type="button"
              onClick={() => {
                handleLoadPastChat("active");
                setShowHistory(false);
              }}
              className={`w-full text-left px-3.5 py-3 border font-body text-xs transition-all duration-200 rounded-[6px] cursor-pointer flex items-center justify-between outline-none ${
                selectedChatId === "active"
                  ? "border-bronze bg-surface/50 text-ink font-medium"
                  : "border-border/60 hover:border-bronze/60 bg-background text-muted"
              }`}
            >
              <span>● Current Active Chat</span>
              <span className="text-[10px] text-bronze uppercase tracking-widest font-normal">Active</span>
            </button>

            {pastChats.map((chat) => (
              <div key={chat.id} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    handleLoadPastChat(chat.id);
                    setShowHistory(false);
                  }}
                  className={`w-full text-left px-3.5 py-3 border font-body text-xs transition-all duration-200 rounded-[6px] pr-10 cursor-pointer outline-none ${
                    selectedChatId === chat.id
                      ? "border-bronze bg-surface/50 text-ink font-medium"
                      : "border-border/60 hover:border-bronze/60 bg-background text-muted"
                  }`}
                >
                  <div className="truncate">{chat.title}</div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePastChat(chat.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 text-muted/60 hover:text-red-700 cursor-pointer text-xs p-1 outline-none transition-colors duration-150"
                  title="Delete chat log"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Footer Clear All */}
          <div className="mt-4 pt-3.5 border-t border-border/50 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Do you want to delete all past chats and clear conversation history?")) {
                  resetToDefault();
                  localStorage.setItem(
                    `novella_chat_${user._id}`,
                    JSON.stringify({ activeChat: [], pastChats: [] })
                  );
                  setShowHistory(false);
                  onClearFilters();
                }
              }}
              className="bg-transparent border-0 text-[0.62rem] text-red-600 hover:text-red-750 font-body uppercase tracking-wider cursor-pointer font-semibold outline-none"
            >
              Clear All History
            </button>
          </div>
        </div>
      )}

      {/* Message logs */}
      <div className="flex-grow p-5 overflow-y-auto space-y-4 max-h-[360px] scrollbar-thin scrollbar-thumb-bronze/20 scrollbar-track-transparent">
        {chatLog.map((log, i) => (
          <div key={i} className={`flex ${log.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-3 font-body text-xs leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
              log.sender === "user" 
                ? "bg-ink text-background rounded-l-[12px] rounded-tr-[12px]" 
                : "bg-[#FDFBF7] border border-border/60 text-ink rounded-r-[12px] rounded-tl-[12px]"
            }`}>
              {log.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#FDFBF7] border border-border/60 px-4 py-3 rounded-r-[12px] rounded-tl-[12px] flex items-center gap-2 text-xs text-muted animate-pulse">
              <span className="w-1.5 h-1.5 bg-bronze rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-bronze rounded-full animate-bounce [animation-delay:0.2s]" />
              Curator is searching catalogs...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none border-t border-border/40 bg-surface/30 items-center min-h-[48px] shrink-0">
        <button 
          type="button"
          onClick={() => handleSend("Show me items under ₹20,000")} 
          className="shrink-0 bg-white border border-border/80 px-3 py-1.5 rounded-full text-[0.62rem] text-ink font-body cursor-pointer hover:border-bronze hover:bg-surface/50 transition-all duration-200"
        >
          Under ₹20k 🏷️
        </button>
        <button 
          type="button"
          onClick={() => handleSend("Suggest wabi-sabi mirrors")} 
          className="shrink-0 bg-white border border-border/80 px-3 py-1.5 rounded-full text-[0.62rem] text-ink font-body cursor-pointer hover:border-bronze hover:bg-surface/50 transition-all duration-200"
        >
          Wabi-Sabi Mirrors 🪞
        </button>
        <button 
          type="button"
          onClick={() => handleSend("Lighting for living-room")} 
          className="shrink-0 bg-white border border-border/80 px-3 py-1.5 rounded-full text-[0.62rem] text-ink font-body cursor-pointer hover:border-bronze hover:bg-surface/50 transition-all duration-200"
        >
          Living Room Lights 💡
        </button>
      </div>

      {/* Inputs */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-white border-t border-border/50 flex gap-2 items-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask curator..."
          disabled={loading}
          className="flex-grow bg-[#FDFBF7] border border-border px-3.5 py-2 font-body text-xs text-ink outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/10 rounded-[6px] transition-all"
        />
        <button 
          type="submit" 
          disabled={loading || !message.trim()}
          className="px-4 py-2 bg-ink text-background hover:bg-bronze font-body font-medium text-[0.65rem] tracking-wider uppercase border-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-[4px] shrink-0"
        >
          Ask
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
