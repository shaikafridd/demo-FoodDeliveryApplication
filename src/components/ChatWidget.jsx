import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, CheckCircle2, MessageSquare, BookOpen, CreditCard } from 'lucide-react';

const API_URL = "https://demo-menulnk.onrender.com/chat";

const PRESET_PROMPTS = [
  "🍗 1x Butter Chicken & Naan",
  "📜 Show today's specials",
  "🛵 How fast is delivery?",
  "💳 Do you accept UPI?"
];

const DEMO_MENU = [
  { id: 101, name: "Special Butter Chicken", price: "₹340", tag: "Bestseller" },
  { id: 102, name: "Garlic Butter Naan (2 pcs)", price: "₹80", tag: "Fresh" },
  { id: 103, name: "Hyderabadi Chicken Biryani", price: "₹290", tag: "Chef's Special" },
  { id: 104, name: "Mango Lassi (300ml)", price: "₹90", tag: "Cooler" }
];

export default function ChatWidget() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'menu' | 'receipt'
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! 👋 Welcome to Spice House. What would you like to order today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 50);
    }
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, loading, activeTab]);

  const generateSmartReply = (query) => {
    const text = query.toLowerCase();
    if (text.includes("butter chicken") || text.includes("naan")) {
      return "Delicious choice! 🍗 1x Special Butter Chicken & Garlic Naan added to your order (Total: ₹420). Would you like to confirm via UPI or WhatsApp?";
    } else if (text.includes("biryani")) {
      return "Chef's Special Hyderabadi Chicken Biryani is fresh & hot today for ₹290! 🍲 Shall I add this to your order?";
    } else if (text.includes("menu") || text.includes("special")) {
      return "Here are today's Spice House top specials:\n• Special Butter Chicken — ₹340\n• Hyderabadi Biryani — ₹290\n• Garlic Naan (2 pcs) — ₹80\n• Mango Lassi — ₹90\nType what you want or click below!";
    } else if (text.includes("delivery") || text.includes("fast") || text.includes("time")) {
      return "🛵 Delivery usually takes 25-30 minutes! We deliver direct to your doorstep with 0% extra aggregator fees.";
    } else if (text.includes("upi") || text.includes("pay") || text.includes("card")) {
      return "💳 Yes! You can pay directly via Google Pay, PhonePe, Paytm or UPI QR Code. 100% money goes straight to Spice House.";
    } else {
      return `Got it! 👋 Spice House AI received your request for: "${query}". We have added this to your direct WhatsApp order!`;
    }
  };

  const handleSend = async (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend.trim() : input.trim();
    if (!messageText || loading) return;

    const userMessage = { id: Date.now(), sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    // Abort controller to prevent hanging if Render backend is sleeping
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      const botReplyText = data.reply || generateSmartReply(messageText);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botReplyText }
      ]);
    } catch (err) {
      clearTimeout(timeoutId);
      // Fast fallback to smart local AI logic
      const fallbackReply = generateSmartReply(messageText);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: fallbackReply }
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
    const userMsgText = `Add ${item.name} (${item.price}) to my order`;
    setActiveTab('chat');
    setTimeout(() => {
      handleSend(userMsgText);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div id="demo">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="chat-head">
            <div className="chat-avatar">SP</div>
            <div>
              <b>Spice House</b>
              <span>MenuLink AI Agent · online</span>
            </div>
          </div>

          <div className="phone-tab-bar">
            <button
              type="button"
              className={`phone-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={13} /> Chat
            </button>
            <button
              type="button"
              className={`phone-tab ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <BookOpen size={13} /> Menu
            </button>
            <button
              type="button"
              className={`phone-tab ${activeTab === 'receipt' ? 'active' : ''}`}
              onClick={() => setActiveTab('receipt')}
            >
              <CreditCard size={13} /> Payout
            </button>
          </div>

          {activeTab === 'chat' && (
            <>
              <div className="chat-body" ref={chatBodyRef}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="bubble typing">
                    <Bot size={14} className="animate-spin" /> typing…
                  </div>
                )}
              </div>

              <div className="chat-quick-prompts">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="prompt-chip"
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="chat-input-row">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                >
                  <Send size={15} />
                </button>
              </div>
            </>
          )}

          {activeTab === 'menu' && (
            <div className="phone-menu-tab">
              <div className="menu-header">
                <h4>Spice House Digital Menu</h4>
                <p>Click item to add directly into AI Chat</p>
              </div>
              <div className="menu-list">
                {DEMO_MENU.map((item) => (
                  <div key={item.id} className="menu-card-item">
                    <div>
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price}</span>
                    </div>
                    <button type="button" className="btn-add-item" onClick={() => addToCart(item)}>
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'receipt' && (
            <div className="phone-receipt-tab">
              <div className="upi-receipt-card">
                <CheckCircle2 size={36} color="var(--green)" />
                <h4>UPI Payment Received!</h4>
                <span className="receipt-amount">₹420.00</span>
                <span className="receipt-sub">Transferred instantly to Spice House HDFC Bank A/c</span>

                <div className="receipt-breakdown">
                  <div className="r-row">
                    <span>Order Total:</span>
                    <span>₹420.00</span>
                  </div>
                  <div className="r-row highlight-row">
                    <span>MenuLink Commission:</span>
                    <span className="green-txt">₹0.00 (0%)</span>
                  </div>
                  <div className="r-row">
                    <span>Delivery App Fee:</span>
                    <span className="strike-txt">₹126.00 Saved</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="chat-note">Try typing an order or clicking the Chat, Menu, or Payout tabs above.</div>
    </div>
  );
}
