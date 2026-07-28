import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, CheckCheck, ShieldCheck, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { sendRenderChatApi, createOrderApi, verifyPaymentApi } from '../services/api';

const SAMPLE_RESTAURANTS = [
  { id: 'rest-1', name: 'Spice House Restaurant', area: 'Hitec City, Hyderabad', cuisine: 'Biryani & North Indian' },
  { id: 'rest-2', name: 'Bawarchi Biryani', area: 'Kukatpally, Hyderabad', cuisine: 'Hyderabadi Biryani' },
  { id: 'rest-3', name: 'Annapurna Tiffins', area: 'Jubilee Hills, Hyderabad', cuisine: 'South Indian Tiffins' },
  { id: 'rest-4', name: "Mamma's Kitchen", area: 'Gachibowli, Hyderabad', cuisine: 'Home Chef Meals' },
];

const MENU_ITEMS_MAP = {
  'rest-1': [
    { id: 'm101', name: 'Butter Chicken & Naan Combo', price: 280, category: 'Main Course' },
    { id: 'm102', name: 'Special Chicken Biryani', price: 320, category: 'Biryani' },
    { id: 'm103', name: 'Paneer Butter Masala', price: 240, category: 'Veg Main' },
    { id: 'm104', name: 'Mango Lassi', price: 90, category: 'Beverages' },
  ],
  'rest-2': [
    { id: 'm201', name: 'Hyderabadi Mutton Biryani', price: 380, category: 'Biryani' },
    { id: 'm202', name: 'Chicken Dum Biryani (Family Pack)', price: 650, category: 'Biryani' },
    { id: 'm203', name: 'Mirchi Ka Salan', price: 120, category: 'Sides' },
  ],
  'rest-3': [
    { id: 'm301', name: 'Ghee Karam Masala Dosa', price: 110, category: 'Tiffins' },
    { id: 'm302', name: 'Button Idli in Sambar (8 pcs)', price: 90, category: 'Tiffins' },
    { id: 'm303', name: 'Filter Coffee', price: 40, category: 'Beverages' },
  ],
  'rest-4': [
    { id: 'm401', name: 'Home Style Veg Thali', price: 160, category: 'Thali' },
    { id: 'm402', name: 'Chicken Curry & Phulka Combo', price: 220, category: 'Combos' },
  ]
};

export default function ChatWidget() {
  const [step, setStep] = useState('location'); // 'location' | 'restaurant' | 'menu' | 'confirmed'
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(SAMPLE_RESTAURANTS[0]);
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const getTimeString = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      text: '👋 Welcome to *MenuLink WhatsApp Business Order Engine*!\n\n📍 Please select or type your delivery location to see available restaurants:',
      time: getTimeString()
    }
  ]);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    
    const rotateX = (dy / yc) * -12; // max tilt up/down 12 degrees
    const rotateY = (dx / xc) * 12;  // max tilt left/right 12 degrees
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'transform 0.08s linear',
      boxShadow: `${-rotateY * 0.5}px ${rotateX * 0.5 + 15}px 35px rgba(0, 0, 0, 0.25)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  const chatBodyRef = useRef(null);

  // Scroll ONLY the inner chat body container (NEVER the outer page window)
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, cart]);

  // Handle Location Choice
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setStep('restaurant');

    const userTime = getTimeString();
    const botTime = getTimeString();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', type: 'text', text: `📍 Location: ${loc}`, time: userTime },
      {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'restaurants',
        text: `📍 Location set to *${loc}*!\n\n🏬 Choose a restaurant from the catalog below to open their digital menu:`,
        time: botTime
      }
    ]);
  };

  // Handle Restaurant Selection
  const handleSelectRestaurant = (rest) => {
    setSelectedRestaurant(rest);
    setStep('menu');

    const userTime = getTimeString();
    const botTime = getTimeString();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', type: 'text', text: `🏬 Selected Store: ${rest.name}`, time: userTime },
      {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'menu',
        restaurant: rest,
        text: `🎉 Welcome to *${rest.name}* (${rest.area})!\n\n0% Commission Menu • Click "+ Add" on items to build your order:`,
        time: botTime
      }
    ]);
  };

  // Handle Add Dish to Cart
  const handleAddToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }
    setCart(updatedCart);

    const total = updatedCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', type: 'text', text: `Added ${item.name} (₹${item.price})`, time: getTimeString() },
      {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'cart_update',
        text: `🛒 *Cart Updated!* (${updatedCart.length} items - ₹${total})\nClick "Confirm Order & Pay" below to place direct order.`,
        cart: updatedCart,
        total,
        time: getTimeString()
      }
    ]);
  };

  // Handle Checkout Order and Save to MongoDB Express Backend
  const handleCheckoutOrder = async () => {
    if (cart.length === 0) {
      cart.push({ id: 'm101', name: 'Butter Chicken & Naan Combo', price: 280, quantity: 1 });
    }

    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setIsTyping(true);

    const orderRes = await createOrderApi({
      restaurantId: selectedRestaurant.id,
      customerName: 'Rahul Sharma',
      customerPhone: '9988776655',
      deliveryAddress: `${selectedLocation || 'Hitec City'}, Hyderabad`,
      items: cart.map((i) => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      totalAmount,
    });

    const paymentRes = await verifyPaymentApi({
      orderId: orderRes.order?._id || `ord-${Date.now()}`,
      restaurantId: selectedRestaurant.id,
      amount: totalAmount,
      paymentMethod: 'UPI Direct',
      orderNumber: orderRes.order?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`
    });

    setIsTyping(false);
    setStep('confirmed');

    const createdOrder = {
      orderNumber: orderRes.order?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      totalAmount,
      txnRef: paymentRes.payment?.transactionRef || `UPI-TXN-${Date.now().toString().slice(-8)}`,
      restaurantName: selectedRestaurant.name,
      items: [...cart],
    };
    setLastOrder(createdOrder);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', type: 'text', text: '💳 Confirm Order & Pay via UPI (₹0 Commission)', time: getTimeString() },
      {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'receipt',
        order: createdOrder,
        time: getTimeString()
      }
    ]);
  };

  // Send Message & Render AI API Sync
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', type: 'text', text: userText, time: getTimeString() }]);

    if (userText.toLowerCase().includes('checkout') || userText.toLowerCase().includes('pay') || userText.toLowerCase().includes('confirm')) {
      handleCheckoutOrder();
      return;
    }

    setIsTyping(true);

    let botReply = await sendRenderChatApi(userText);

    if (!botReply) {
      if (userText.toLowerCase().includes('hyderabad') || userText.toLowerCase().includes('bengaluru') || userText.toLowerCase().includes('mumbai')) {
        handleSelectLocation(userText);
        setIsTyping(false);
        return;
      } else if (userText.toLowerCase().includes('biryani') || userText.toLowerCase().includes('chicken') || userText.toLowerCase().includes('paneer')) {
        botReply = `🍽️ Great choice! We recommend our *Special Chicken Biryani* (₹320) or *Butter Chicken & Naan* (₹280). Click "+ Add" on the menu cards above!`;
      } else {
        botReply = `Thanks for reaching out! You can order directly from *${selectedRestaurant.name}* with 0% commission fees via WhatsApp UPI! 🍔`;
      }
    }

    setIsTyping(false);

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, sender: 'bot', type: 'text', text: botReply, time: getTimeString() }
    ]);
  };

  const currentMenuItems = MENU_ITEMS_MAP[selectedRestaurant.id] || MENU_ITEMS_MAP['rest-1'];
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div 
      className="phone-frame"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="phone-screen">
        {/* Authentic WhatsApp Business Top Bar */}
        <div className="wa-header">
          <div className="wa-header-left">
            <span className="wa-back-arrow">←</span>
            <div className="wa-avatar-container">
              <div className="wa-avatar">M</div>
              <div className="wa-verified-badge">✓</div>
            </div>
            <div className="wa-title-box">
              <h3>
                {selectedRestaurant.name.split(' ')[0]} Business <ShieldCheck size={13} color="#25D366" />
              </h3>
              <span className="wa-subtext">Official Business Account • Online</span>
            </div>
          </div>

          <div className="wa-header-right">
            <Video size={16} />
            <Phone size={16} />
            <MoreVertical size={16} />
          </div>
        </div>

        {/* WhatsApp Chat Message Timeline Stream */}
        <div className="wa-chat-body" ref={chatBodyRef}>
          <div className="wa-date-divider">
            <span className="wa-date-chip">TODAY</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`wa-bubble ${msg.sender}`}>
              {/* Message Content */}
              <div>{msg.text}</div>

              {/* Step 2: Interactive WhatsApp Restaurant Catalog List */}
              {msg.type === 'restaurants' && (
                <div className="wa-card-msg">
                  <div className="wa-card-header">
                    <span>🏬 NEARBY RESTAURANTS CATALOG</span>
                    <span>0% FEE</span>
                  </div>
                  <div className="wa-card-body">
                    {SAMPLE_RESTAURANTS.map((rest) => (
                      <div key={rest.id} className="wa-rest-item">
                        <div>
                          <strong className="wa-rest-name">{rest.name}</strong>
                          <span className="wa-rest-sub">{rest.area} • {rest.cuisine}</span>
                        </div>
                        <button className="btn-wa-action" onClick={() => handleSelectRestaurant(rest)}>
                          Browse Menu
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Interactive WhatsApp Menu Items inside Chat */}
              {msg.type === 'menu' && (
                <div className="wa-menu-grid">
                  {currentMenuItems.map((item) => (
                    <div key={item.id} className="wa-menu-card-item">
                      <div>
                        <strong className="wa-dish-title">{item.name}</strong>
                        <span className="wa-dish-price">₹{item.price}</span>
                      </div>
                      <button className="btn-wa-add" onClick={() => handleAddToCart(item)}>
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Interactive WhatsApp Cart Checkout Card in Chat */}
              {msg.type === 'cart_update' && (
                <div className="wa-checkout-card">
                  <div className="wa-cart-summary">
                    <span>Cart Total ({msg.cart.length} Items):</span>
                    <span>₹{msg.total}</span>
                  </div>
                  <button className="btn-wa-checkout" onClick={handleCheckoutOrder}>
                    💳 Confirm Order & Pay via UPI (₹{msg.total}) <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 5: Official WhatsApp Payment Receipt Card in Chat */}
              {msg.type === 'receipt' && msg.order && (
                <div className="wa-payment-receipt-bubble">
                  <div className="wa-receipt-icon">
                    <CheckCircle2 size={24} color="#166534" />
                  </div>
                  <div className="wa-receipt-title">Instant UPI Payment Verified</div>
                  <div className="wa-receipt-amount">₹{msg.order.totalAmount}.00</div>

                  <div className="wa-receipt-details">
                    <div className="wa-receipt-row">
                      <span>Order #:</span>
                      <strong>{msg.order.orderNumber}</strong>
                    </div>
                    <div className="wa-receipt-row">
                      <span>Merchant:</span>
                      <span>{msg.order.restaurantName}</span>
                    </div>
                    <div className="wa-receipt-row">
                      <span>Commission Charged:</span>
                      <span className="zero-fee-tag">₹0.00 (100% Retained)</span>
                    </div>
                    <div className="wa-receipt-row">
                      <span>UPI Reference:</span>
                      <span style={{ fontFamily: 'monospace' }}>{msg.order.txnRef}</span>
                    </div>
                    <div className="wa-receipt-row">
                      <span>Status:</span>
                      <strong style={{ color: '#166534' }}>Saved in MongoDB & Dispatched</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamp & Double Green Ticks */}
              <div className="wa-msg-footer">
                <span>{msg.time}</span>
                {msg.sender === 'user' && <CheckCheck size={14} className="wa-ticks" />}
              </div>
            </div>
          ))}

          {isTyping && <div className="wa-bubble bot">WhatsApp MenuLink AI is typing...</div>}
        </div>

        {/* WhatsApp Quick Action Chips */}
        {step === 'location' && (
          <div className="wa-quick-actions">
            <span className="wa-action-chip" onClick={() => handleSelectLocation('Hyderabad')}>📍 Hyderabad</span>
            <span className="wa-action-chip" onClick={() => handleSelectLocation('Hitec City')}>📍 Hitec City</span>
            <span className="wa-action-chip" onClick={() => handleSelectLocation('Jubilee Hills')}>📍 Jubilee Hills</span>
            <span className="wa-action-chip" onClick={() => handleSelectLocation('Bengaluru')}>📍 Bengaluru</span>
          </div>
        )}

        {step === 'menu' && cart.length > 0 && (
          <div className="wa-quick-actions">
            <span className="wa-action-chip" onClick={handleCheckoutOrder} style={{ background: '#25D366', color: '#fff', fontWeight: 700 }}>
              💳 Confirm & Pay (₹{cartTotal})
            </span>
          </div>
        )}

        {/* WhatsApp Input Footer */}
        <form onSubmit={handleSendMessage} className="wa-input-bar">
          <input
            type="text"
            placeholder="Type a message or order item..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="wa-send-btn">
            <Send size={15} />
          </button>
        </form>
      </div>
      <p className="chat-note">⚡ Powered by WhatsApp Business API & Express MongoDB Backend</p>
    </div>
  );
}
