import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  IndianRupee, 
  ShieldCheck, 
  Store, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Utensils, 
  Phone, 
  Search 
} from 'lucide-react';
import { fetchMenuApi, fetchRestaurantsApi, fetchAllOrdersApi, updateOrderStatusApi } from '../services/api';

const DEFAULT_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-882910',
    customerName: 'Rahul Sharma',
    customerPhone: '9988776655',
    items: ['1x Butter Chicken & Naan Combo', '1x Mango Lassi'],
    totalAmount: 370,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    time: '12 mins ago'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-882911',
    customerName: 'Priya Verma',
    customerPhone: '9876501234',
    items: ['2x Special Chicken Biryani'],
    totalAmount: 640,
    orderStatus: 'Preparing',
    paymentStatus: 'Paid',
    time: '5 mins ago'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-882912',
    customerName: 'Anil Kumar',
    customerPhone: '9123456789',
    items: ['1x Paneer Butter Masala'],
    totalAmount: 240,
    orderStatus: 'Received',
    paymentStatus: 'Paid',
    time: 'Just now'
  }
];

const DEFAULT_PAYMENTS = [
  { id: 'pay-1', txnRef: 'UPI-TXN-9948201', orderNumber: 'ORD-882910', amount: 370, method: 'UPI Direct', commission: 0, status: 'Success', time: '12 mins ago' },
  { id: 'pay-2', txnRef: 'UPI-TXN-9948202', orderNumber: 'ORD-882911', amount: 640, method: 'UPI Direct', commission: 0, status: 'Success', time: '5 mins ago' },
  { id: 'pay-3', txnRef: 'UPI-TXN-9948203', orderNumber: 'ORD-882912', amount: 240, method: 'UPI Direct', commission: 0, status: 'Success', time: 'Just now' }
];

export default function AdminPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState(DEFAULT_ORDERS);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [outlets, setOutlets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const dbOrders = await fetchAllOrdersApi();
    if (dbOrders && dbOrders.length > 0) {
      setOrders(dbOrders.map(o => ({
        id: o._id || o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        items: o.items ? o.items.map(i => `${i.quantity}x ${i.name}`) : ['1x Item'],
        totalAmount: o.totalAmount,
        orderStatus: o.orderStatus || 'Received',
        paymentStatus: o.paymentStatus || 'Paid',
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
      })));
    }

    const dbOutlets = await fetchRestaurantsApi();
    if (dbOutlets && dbOutlets.length > 0) {
      setOutlets(dbOutlets);
    }

    const items = await fetchMenuApi();
    setMenuItems(items);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update order status dynamically in DB & State
  const handleUpdateStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    await updateOrderStatusApi(orderId, newStatus);
  };

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const commissionSaved = Math.round(totalRevenue * 0.30); // 30% aggregator commission saved

  return (
    <div className="admin-portal-container">
      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="admin-logo-mark">M</div>
          <div>
            <h1>MenuLink Admin Dashboard</h1>
            <span className="admin-subtitle">Super Admin Portal • Live Store & MongoDB Feed</span>
          </div>
        </div>
        <div className="admin-header-actions">
          <button className="btn-outline-admin" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh DB
          </button>
          <button className="btn-logout-admin" onClick={onLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Overview Metrics Cards */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="metric-icon icon-orders">
            <ShoppingBag size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Total Orders</span>
            <span className="metric-value">{totalOrders}</span>
            <span className="metric-sub text-green">↑ 100% Direct Orders</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-revenue">
            <IndianRupee size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Total Gross Sales</span>
            <span className="metric-value">₹{totalRevenue.toLocaleString()}</span>
            <span className="metric-sub text-green">100% Payouts to Bank</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-saved">
            <ShieldCheck size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Commission Saved</span>
            <span className="metric-value">₹{commissionSaved.toLocaleString()}</span>
            <span className="metric-sub text-red">0% Aggregator Cuts</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-outlets">
            <Store size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Active Outlets</span>
            <span className="metric-value">{outlets.length || 4}</span>
            <span className="metric-sub">Registered Food Partners</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="admin-tab-bar">
        <button 
          className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} /> Live Orders ({orders.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <IndianRupee size={16} /> UPI Payments ({payments.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'outlets' ? 'active' : ''}`}
          onClick={() => setActiveTab('outlets')}
        >
          <Store size={16} /> Outlets & Leads ({outlets.length || 4})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <Utensils size={16} /> Digital Menu ({menuItems.length})
        </button>
      </div>

      {/* Tab 1: Live Orders Table */}
      {activeTab === 'orders' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <h3>📦 Direct Customer Orders</h3>
            <div className="search-box">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer Details</th>
                  <th>Items Ordered</th>
                  <th>Total Amount</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-num-badge">{order.orderNumber}</span>
                      <span className="order-time-sub">{order.time}</span>
                    </td>
                    <td>
                      <strong>{order.customerName}</strong>
                      <span className="customer-phone"><Phone size={11} /> {order.customerPhone}</span>
                    </td>
                    <td>
                      <div className="item-pills-list">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="item-pill">{item}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="amount-txt">₹{order.totalAmount}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus === 'Received' && <Clock size={12} />}
                        {order.orderStatus === 'Preparing' && <Utensils size={12} />}
                        {order.orderStatus === 'OutForDelivery' && <Truck size={12} />}
                        {order.orderStatus === 'Delivered' && <CheckCircle2 size={12} />}
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span className="pay-badge pay-paid">✓ {order.paymentStatus}</span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      >
                        <option value="Received">Received</option>
                        <option value="Preparing">Preparing</option>
                        <option value="OutForDelivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: UPI Payments Table */}
      {activeTab === 'payments' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <h3>💳 Instant UPI Payout Receipts (0% Commission)</h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Txn Reference</th>
                  <th>Order #</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Commission Fee</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td><strong className="txn-ref">{p.txnRef}</strong></td>
                    <td><span className="order-num-badge">{p.orderNumber}</span></td>
                    <td><span className="amount-txt green-txt">₹{p.amount}</span></td>
                    <td><span className="method-pill">{p.method}</span></td>
                    <td><span className="zero-fee-pill">₹0.00 (0%)</span></td>
                    <td><span className="pay-badge pay-paid">✓ {p.status}</span></td>
                    <td><span className="order-time-sub">{p.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Outlets & Leads */}
      {activeTab === 'outlets' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <h3>🏬 Onboarded Food Outlets</h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Outlet Name</th>
                  <th>Owner Name</th>
                  <th>WhatsApp Phone</th>
                  <th>City / Location</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {outlets.map((outlet, idx) => (
                  <tr key={outlet._id || idx}>
                    <td><strong>{outlet.name}</strong></td>
                    <td>{outlet.ownerName || outlet.owner || 'Owner'}</td>
                    <td><span className="customer-phone"><Phone size={12} /> {outlet.phone}</span></td>
                    <td>{outlet.city || 'Hyderabad'}</td>
                    <td><span className="category-pill">{outlet.category || 'Restaurant'}</span></td>
                    <td><span className="pay-badge pay-paid">✓ {outlet.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Digital Menu Management */}
      {activeTab === 'menu' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <h3>🍔 Active Digital Menu Items</h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td><strong>{item.name}</strong></td>
                    <td><span className="category-pill">{item.category || 'Main Course'}</span></td>
                    <td><span className="amount-txt">₹{item.price}</span></td>
                    <td><span className="pay-badge pay-paid">✓ Available</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
