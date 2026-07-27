import React, { useState, useRef, useEffect } from 'react';
import { Send, Utensils, MessageSquare, IndianRupee, MapPin, Store, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'menu' | 'payout'
  const [step, setStep] = useState('location'); // 'location' | 'restaurant' | 'menu' | 'confirmed'
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(SAMPLE_RESTAURANTS[0]);
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Welcome to *MenuLink Direct Food Order*!\n\n📍 Please select or type your location to discover nearby restaurants:'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle location choice
  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setStep('restaurant');

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `📍 Location: ${loc}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `📍 Location set to *${loc}*!\n\n🏬 Please select a restaurant below to open their digital menu:`
      }
    ]);
  };

  // Handle restaurant choice
  const handleSelectRestaurant = (rest) => {
    setSelectedRestaurant(rest);
    setStep('menu');

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `🏬 Selected: ${rest.name}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🎉 Welcome to *${rest.name}* (${rest.area})!\n\nCheck out our menu below or ask me any question about dishes, recommendations, or pricing. 🍔🍕`
      }
    ]);
  };

  // Add Item to Cart
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
      { id: Date.now(), sender: 'user', text: `Add ${item.name}` },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `✅ Added *${item.name}* to cart!\nTotal Cart: ₹${total} (${updatedCart.length} items).\n\nType "checkout" or click "Confirm Order" to place your direct order.`
      }
    ]);
  };

  // Process Checkout & Save to Database
  const handleCheckoutOrder = async () => {
    if (cart.length === 0) {
      // Default sample item if empty
      const defaultItem = { id: 'm101', name: 'Butter Chicken & Naan Combo', price: 280, quantity: 1 };
      cart.push(defaultItem);
    }

    const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setIsTyping(true);

    // Call Node.js MongoDB API
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
      paymentMethod: 'UPI',
    });

    setIsTyping(false);
    setStep('confirmed');
    setLastOrder({
      orderNumber: orderRes.order?.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      totalAmount,
      txnRef: paymentRes.payment?.transactionRef || `UPI-TXN-${Date.now().toString().slice(-8)}`,
      restaurantName: selectedRestaurant.name,
      items: [...cart],
    });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: '💳 Confirm Order & Pay via UPI' },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: `🎉 *Order Confirmed!* (${orderRes.order?.orderNumber || 'ORD-882910'})\n\n💰 Total Paid: ₹${totalAmount} via Instant UPI\n⚡ Commission Charged: ₹0.00 (100% saved!)\n\n🚚 Delivery Rider Dispatched! Track status in the receipt tab.`
      }
    ]);

    setActiveTab('payout');
  };

  // Handle User Message Submission
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userText }]);

    if (userText.toLowerCase().includes('checkout') || userText.toLowerCase().includes('pay') || userText.toLowerCase().includes('confirm')) {
      handleCheckoutOrder();
      return;
    }

    setIsTyping(true);

    // 1. Try Render Chat API
    let botReply = await sendRenderChatApi(userText);

    // 2. If Render API offline, use smart fallback
    if (!botReply) {
      if (userText.toLowerCase().includes('hyderabad') || userText.toLowerCase().includes('bengaluru') || userText.toLowerCase().includes('mumbai')) {
        botReply = `📍 Setting location to *${userText}*! Pick a restaurant from the list below:`;
        handleSelectLocation(userText);
      } else if (userText.toLowerCase().includes('biryani') || userText.toLowerCase().includes('chicken') || userText.toLowerCase().includes('paneer')) {
        botReply = `🍽️ Great choice! We recommend our *Special Chicken Biryani* (₹320) or *Butter Chicken & Naan* (₹280). Click "Add" in the Menu tab to order!`;
      } else {
        botReply = `Thanks for reaching out! You can order directly from *${selectedRestaurant.name}* with 0% commission fees. What would you like to eat today? 🍔`;
      }
    }

    setIsTyping(false);

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, sender: 'bot', text: botReply }
    ]);
  };

  const currentMenuItems = MENU_ITEMS_MAP[selectedRestaurant.id] || MENU_ITEMS_MAP['rest-1'];
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="phone-frame">
      <div className="phone-screen">
        {/* Header */}
        <div className="chat-head">
          <div className="chat-avatar">M</div>
          <div>
            <b>{selectedRestaurant.name}</b>
            <span>Online • Instant UPI Order</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="phone-tab-bar">
          <button
            className={`phone-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={13} /> Chat
          </button>
          <button
            className={`phone-tab ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils size={13} /> Menu {cart.length > 0 && `(${cart.length})`}
          </button>
          <button
            className={`phone-tab ${activeTab === 'payout' ? 'active' : ''}`}
            onClick={() => setActiveTab('payout')}
          >
            <IndianRupee size={13} /> Payout Receipt
          </button>
        </div>

        {/* Tab 1: Chat Body */}
        {activeTab === 'chat' && (
          <>
            <div className="chat-body">
              {messages.map((msg) => (
                <div key={msg.id} className={`bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && <div className="bubble bot typing">MenuLink AI is typing...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* Interactive Step Prompts */}
            {step === 'location' && (
              <div className="chat-quick-prompts">
                <span className="prompt-chip" onClick={() => handleSelectLocation('Hyderabad')}>
                  📍 Hyderabad
                </span>
                <span className="prompt-chip" onClick={() => handleSelectLocation('Hitec City')}>
                  📍 Hitec City
                </span>
                <span className="prompt-chip" onClick={() => handleSelectLocation('Jubilee Hills')}>
                  📍 Jubilee Hills
                </span>
                <span className="prompt-chip" onClick={() => handleSelectLocation('Bengaluru')}>
                  📍 Bengaluru
                </span>
              </div>
            )}

            {step === 'restaurant' && (
              <div className="chat-quick-prompts">
                {SAMPLE_RESTAURANTS.map((r) => (
                  <span key={r.id} className="prompt-chip" onClick={() => handleSelectRestaurant(r)}>
                    🏬 {r.name}
                  </span>
                ))}
              </div>
            )}

            {step === 'menu' && (
              <div className="chat-quick-prompts">
                <span className="prompt-chip" onClick={() => handleAddToCart(currentMenuItems[0])}>
                  + Add {currentMenuItems[0]?.name.split(' ')[0]}
                </span>
                <span className="prompt-chip" onClick={handleCheckoutOrder}>
                  💳 Confirm & Pay (₹{cartTotal || 280})
                </span>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="chat-input-row">
              <input
                type="text"
                placeholder="Type location, dish, or message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit">
                <Send size={15} />
              </button>
            </form>
          </>
        )}

        {/* Tab 2: Menu Items */}
        {activeTab === 'menu' && (
          <div className="phone-menu-tab">
            <div className="menu-header">
              <h4>{selectedRestaurant.name} Digital Menu</h4>
              <p>📍 {selectedRestaurant.area} • 0% Commission</p>
            </div>

            <div className="menu-list">
              {currentMenuItems.map((item) => (
                <div key={item.id} className="menu-card-item">
                  <div>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  <button className="btn-add-item" onClick={() => handleAddToCart(item)}>
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <button className="btn-primary" onClick={handleCheckoutOrder} style={{ width: '100%' }}>
                  Checkout ({cart.length} Items - ₹{cartTotal}) <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Payout Receipt */}
        {activeTab === 'payout' && (
          <div className="phone-receipt-tab">
            <div className="upi-receipt-card">
              <CheckCircle2 size={36} color="var(--green)" style={{ margin: '0 auto' }} />
              <h4>Instant UPI Payout Verified</h4>
              <span className="receipt-amount">₹{lastOrder ? lastOrder.totalAmount : 370}.00</span>
              <span className="receipt-sub">Order #{lastOrder ? lastOrder.orderNumber : 'ORD-882910'}</span>

              <div className="receipt-breakdown">
                <div className="r-row">
                  <span>Restaurant Payout</span>
                  <span className="green-txt">100% Direct to Bank</span>
                </div>
                <div className="r-row">
                  <span>Aggregator Commission</span>
                  <span className="strike-txt">₹{Math.round((lastOrder ? lastOrder.totalAmount : 370) * 0.30)}</span>
                </div>
                <div className="r-row">
                  <span>MenuLink Fee</span>
                  <span className="green-txt">₹0.00 (0%)</span>
                </div>
                <div className="r-row">
                  <span>Txn Ref</span>
                  <span>{lastOrder ? lastOrder.txnRef : 'UPI-TXN-9948201'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="chat-note">⚡ Powered by Render AI Chat & MongoDB</p>
    </div>
  );
}
