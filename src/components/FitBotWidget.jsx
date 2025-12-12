import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitbotConversation, handleFitBotAction } from '../data/fitbotTree';

export default function FitBotWidget() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  });
  const isPremium = user?.membership?.plan === 'pro' || user?.membership?.plan === 'elite';
  const [botOpen, setBotOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState('start');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-open FitBot if requested
  useEffect(() => {
    const shouldOpen = localStorage.getItem('openFitBot');
    if (shouldOpen === 'true' && isPremium) {
      localStorage.removeItem('openFitBot');
      setTimeout(() => {
        setBotOpen(true);
      }, 1500);
    }
  }, [isPremium]);

  // Show initial message
  useEffect(() => {
    if (botOpen && showGreeting && isPremium) {
      const timer = setTimeout(() => {
        setShowGreeting(false);
        addBotMessage(fitbotConversation.start.message, fitbotConversation.start.options);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [botOpen, showGreeting, isPremium]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const addBotMessage = (message, options) => {
    setIsTyping(true);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'bot', message, options, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
  };

  const handleOptionClick = (option) => {
    // Add user's choice to chat
    setChatHistory(prev => [...prev, { type: 'user', message: option.label, timestamp: new Date() }]);

    // Handle action or navigate to next node
    if (option.action) {
      handleFitBotAction(option.action, navigate);
      setTimeout(() => {
        setBotOpen(false);
      }, 500);
    } else if (option.next && fitbotConversation[option.next]) {
      setCurrentNode(option.next);
      const nextNode = fitbotConversation[option.next];
      
      // Check if node requires Elite membership
      if (nextNode.requiresElite && user?.membership?.plan !== 'elite') {
        // Show upgrade message instead
        const upgradeMessage = "This feature is exclusive to Elite members (Rs.499/month).\n\nElite membership includes:\n• Advanced HIIT workouts\n• Pre/post workout nutrition\n• 10% supplement discount\n• 1-on-1 video calls with trainers\n• Detailed supplement guidance\n• Hydration tracking\n\nWould you like to upgrade to Elite?";
        const upgradeOptions = [
          { label: "View Elite Benefits", next: "elite_features" },
          { label: "Upgrade to Elite", action: "membership" },
          { label: "Back to Main Menu", next: "start" }
        ];
        addBotMessage(upgradeMessage, upgradeOptions);
      } else if (nextNode.requiresPro && user?.membership?.plan === 'free') {
        // Show Pro upgrade message
        const upgradeMessage = "This feature requires Pro or Elite membership.\n\nPro membership (Rs.199/month) includes:\n• 7-day exercise plans\n• Structured diet plans\n• 4% supplement discount\n• FitBot AI assistant\n• Progress tracking\n\nWould you like to upgrade?";
        const upgradeOptions = [
          { label: "View Pro Benefits", next: "pro_features" },
          { label: "View Elite Benefits", next: "elite_features" },
          { label: "Upgrade Now", action: "membership" },
          { label: "Back to Main Menu", next: "start" }
        ];
        addBotMessage(upgradeMessage, upgradeOptions);
      } else {
        // User has access, show the content
        addBotMessage(nextNode.message, nextNode.options);
      }
    }
  };

  const handleReset = () => {
    setChatHistory([]);
    setCurrentNode('start');
    setShowGreeting(true);
  };

  const toggleBot = () => {
    if (!isPremium) {
      navigate('/membership');
      return;
    }
    setBotOpen(!botOpen);
    if (!botOpen) {
      setShowGreeting(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleBot}
          className={`group relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 ${
            botOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
          }`}
          aria-label="FitBot Assistant"
        >
          {botOpen ? (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
          
          {/* Pulse animation */}
          {!botOpen && (
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
          )}

          {/* Tooltip */}
          {!botOpen && (
            <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                {isPremium ? 'Chat with FitBot' : 'Upgrade for FitBot'}
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {botOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up border-2 border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">FitBot</h3>
                <p className="text-blue-100 text-xs">AI Fitness Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset conversation"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setBotOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {showGreeting ? (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-md max-w-[80%] animate-bounce-in">
                  <p className="text-gray-800 text-sm">
                    Hello! I'm FitBot, your AI fitness assistant. Give me a moment to load...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 animate-slide-in ${
                      chat.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {chat.type === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2 max-w-[80%]">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-md ${
                          chat.type === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{chat.message}</p>
                      </div>

                      {chat.options && chat.options.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                          {chat.options.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              onClick={() => handleOptionClick(option)}
                              className="text-left px-4 py-2 bg-white border-2 border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {chat.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Powered by FitLife+ AI • Pro & Elite Feature
            </p>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </>
  );
}
