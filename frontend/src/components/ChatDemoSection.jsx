import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import ChatWidget from './ChatWidget';

export default function ChatDemoSection() {
  return (
    <section className="wrap chat-demo-section" id="demo">
      <div className="chat-demo-header">
        <div className="demo-badge">
          <Bot size={14} /> LIVE INTERACTIVE AI AGENT
        </div>
        <h2>Test the Live MenuLink AI Order Engine</h2>
        <p>Experience how your customers will order food seamlessly in chat with instant UPI payouts.</p>
      </div>

      <div className="chat-demo-container">
        <ChatWidget />
      </div>
    </section>
  );
}
