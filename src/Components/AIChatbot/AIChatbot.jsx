import { useState } from "react";
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your SkillSwap AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simulated AI responses (replace with actual OpenAI API call)
  const getAIResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based responses (replace with actual API)
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm here to help you find the perfect skill to learn. What are you interested in?";
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost")
    ) {
      return "Our skills range from $15 to $60 per session. Would you like me to show you skills in a specific price range?";
    } else if (
      lowerMessage.includes("book") ||
      lowerMessage.includes("session")
    ) {
      return "To book a session, browse our skills, select one you like, choose a date and time, and proceed to payment. Need help finding a specific skill?";
    } else if (
      lowerMessage.includes("refund") ||
      lowerMessage.includes("cancel")
    ) {
      return "You can cancel bookings up to 24 hours before the session for a full refund. After that, a 50% cancellation fee applies.";
    } else if (
      lowerMessage.includes("skill") ||
      lowerMessage.includes("learn")
    ) {
      return "We offer skills in Music, Language, Health, Marketing, Programming, Art, Lifestyle, and Design. What interests you most?";
    } else {
      return "I'd be happy to help! You can ask me about available skills, pricing, booking process, or anything else about SkillSwap.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(async () => {
      const aiResponse = await getAIResponse(input);
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Show me programming courses",
    "How do I book a session?",
    "What's your refund policy?",
    "Tell me about pricing",
  ];

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-primary-focus transition-all z-50 flex items-center gap-2"
          >
            <FaComments className="text-2xl" />
            <span className="hidden md:inline font-medium">Chat with AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-base-100 rounded-2xl shadow-2xl flex flex-col z-50 border border-base-300"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary-focus text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <FaRobot className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-base-100 text-base-content rounded-bl-none shadow border border-base-300"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-white/70"
                          : "text-base-content/50"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-base-100 p-3 rounded-2xl rounded-bl-none shadow border border-base-300">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-base-300 bg-base-100">
                <p className="text-xs text-base-content/70 mb-2">
                  Quick actions:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action)}
                      className="text-xs bg-base-200 hover:bg-base-300 p-2 rounded-lg text-left transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-base-300 bg-base-100 rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 input input-bordered border-base-300 bg-base-100 text-base-content focus:border-primary rounded-full"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="btn btn-primary btn-circle"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
