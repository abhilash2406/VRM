import React, { useState, useRef, useEffect } from 'react';
import '../../style/ChatbotModal.css';

const ChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I am the DriveOnRyd Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const currentInput = input;
    setMessages(prev => [...prev, { text: currentInput, isBot: false }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `I received your message: "${currentInput}". I am currently a demo bot, but soon I'll be able to help you!`, 
        isBot: true 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-modal-overlay" onClick={onClose}>
      <div className="chatbot-modal-content" onClick={e => e.stopPropagation()}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="chatbot-avatar">
              <i className="bi-robot"></i>
            </div>
            <div>
              <h5>DriveOnRyd Assistant</h5>
              <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button onClick={onClose} className="chatbot-close-btn">
            <i className="bi-x-lg"></i>
          </button>
        </div>
        
        <div className="chatbot-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
              <div className="chat-message">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chatbot-footer">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="chatbot-send-btn" onClick={handleSend}>
            <i className="bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
