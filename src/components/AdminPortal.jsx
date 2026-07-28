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
  Search,
  Plus,
  Trash2,
  Edit,
  Printer,
  X
} from 'lucide-react';
import { 
  fetchMenuApi, 
  createMenuItemApi,
  updateMenuItemApi,
  toggleMenuStockApi,
  deleteMenuItemApi,
  fetchRestaurantsApi, 
  registerRestaurantApi,
  updateRestaurantStatusApi,
  deleteRestaurantApi,
  fetchAllOrdersApi, 
  createOrderApi,
  updateOrderStatusApi,
  deleteOrderApi,
  fetchAllPaymentsApi,
  verifyPaymentApi,
  saveLocalStoreData 
} from '../services/api';

export default function AdminPortal({ onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddOutletModal, setShowAddOutletModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Form states
  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    customerPhone: '',
    items: '',
    totalAmount: '',
    orderStatus: 'Received'
  });

  const [newOutletData, setNewOutletData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    city: 'Hyderabad',
    category: 'Restaurant',
    status: 'Active'
  });

  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    description: '',
    inStock: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    
    // 1. Fetch Orders from Backend / MongoDB
    const dbOrders = await fetchAllOrdersApi();
    if (dbOrders) {
      setOrders(dbOrders.map(o => ({
        id: o._id || o.id,
        orderNumber: o.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
        customerName: o.customerName || 'Customer',
        customerPhone: o.customerPhone || '9988776655',
        items: Array.isArray(o.items) ? o.items.map(i => typeof i === 'string' ? i : `${i.quantity || 1}x ${i.name}`) : [o.items || '1x Item'],
        totalAmount: Number(o.totalAmount) || 250,
        orderStatus: o.orderStatus || 'Received',
        paymentStatus: o.paymentStatus || 'Paid',
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
      })));
    }

    // 2. Fetch Payments from Backend / MongoDB
    const dbPayments = await fetchAllPaymentsApi();
    if (dbPayments) {
      setPayments(dbPayments.map(p => ({
        id: p._id || p.id,
        txnRef: p.transactionRef || p.txnRef || `UPI-TXN-${Date.now().toString().slice(-7)}`,
        orderNumber: p.orderNumber || 'ORD-882910',
        amount: Number(p.amount) || 250,
        method: p.paymentMethod || p.method || 'UPI Direct',
        commission: 0,
        status: p.status || 'Success',
        time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
      })));
    }

    // 3. Fetch Outlets from Backend / MongoDB
    const dbOutlets = await fetchRestaurantsApi();
    if (dbOutlets) {
      setOutlets(dbOutlets);
    }

    // 4. Fetch Menu from Backend / MongoDB
    const items = await fetchMenuApi();
    if (items) {
      setMenuItems(items);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update order status dynamically in Backend & State
  const handleUpdateStatus = async (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
    setOrders(updated);
    saveLocalStoreData('orders', updated);
    await updateOrderStatusApi(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}" in MongoDB`);
  };

  // Delete Order in Backend & State
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    const updated = orders.filter(o => o.id !== orderId);
    setOrders(updated);
    saveLocalStoreData('orders', updated);
    await deleteOrderApi(orderId);
    showToast('Order record deleted from Backend');
  };

  // Create New Order in Backend & State
  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!newOrderData.customerName || !newOrderData.totalAmount) return;

    const itemList = newOrderData.items.split(',').map(i => i.trim()).filter(Boolean);
    const orderObj = {
      customerName: newOrderData.customerName,
      customerPhone: newOrderData.customerPhone || '9988776655',
      items: itemList.length > 0 ? itemList : ['1x Direct Order Item'],
      totalAmount: Number(newOrderData.totalAmount),
      orderStatus: newOrderData.orderStatus || 'Received'
    };

    const res = await createOrderApi(orderObj);
    const created = res.order || orderObj;

    const formattedOrder = {
      id: created._id || created.id || `ord-${Date.now()}`,
      orderNumber: created.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      customerName: created.customerName,
      customerPhone: created.customerPhone,
      items: Array.isArray(created.items) ? created.items.map(i => typeof i === 'string' ? i : `${i.quantity || 1}x ${i.name}`) : [created.items],
      totalAmount: Number(created.totalAmount),
      orderStatus: created.orderStatus || 'Received',
      paymentStatus: 'Paid',
      time: 'Just now'
    };

    const updatedOrders = [formattedOrder, ...orders];
    setOrders(updatedOrders);

    // Record UPI payment in Backend
    const payRes = await verifyPaymentApi({
      orderId: formattedOrder.id,
      amount: formattedOrder.totalAmount,
      paymentMethod: 'UPI Direct',
      orderNumber: formattedOrder.orderNumber
    });

    const newPay = payRes.payment || {
      id: `pay-${Date.now()}`,
      txnRef: `UPI-TXN-${Date.now().toString().slice(-7)}`,
      orderNumber: formattedOrder.orderNumber,
      amount: formattedOrder.totalAmount,
      method: 'UPI Direct',
      commission: 0,
      status: 'Success',
      time: 'Just now'
    };
    setPayments([newPay, ...payments]);

    setShowAddOrderModal(false);
    setNewOrderData({ customerName: '', customerPhone: '', items: '', totalAmount: '', orderStatus: 'Received' });
    showToast(`New order #${formattedOrder.orderNumber} saved to Backend Database!`);
  };

  // Add Outlet in Backend & State
  const handleAddOutletSubmit = async (e) => {
    e.preventDefault();
    if (!newOutletData.name) return;

    const outletObj = {
      name: newOutletData.name,
      ownerName: newOutletData.ownerName || 'Outlet Manager',
      phone: newOutletData.phone || '9876543210',
      city: newOutletData.city || 'Hyderabad',
      category: newOutletData.category || 'Restaurant',
      status: newOutletData.status || 'Active'
    };

    const res = await registerRestaurantApi(outletObj);
    const created = res.restaurant || outletObj;

    const updated = [created, ...outlets];
    setOutlets(updated);

    setShowAddOutletModal(false);
    setNewOutletData({ name: '', ownerName: '', phone: '', city: 'Hyderabad', category: 'Restaurant', status: 'Active' });
    showToast(`Outlet "${created.name}" onboarded to MongoDB!`);
  };

  // Toggle Outlet Status in Backend & State
  const handleToggleOutletStatus = async (outletId) => {
    const target = outlets.find(o => o.id === outletId || o._id === outletId);
    if (!target) return;

    const nextStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    const updated = outlets.map(o => (o.id === outletId || o._id === outletId) ? { ...o, status: nextStatus } : o);
    setOutlets(updated);

    await updateRestaurantStatusApi(outletId, nextStatus);
    showToast(`Outlet status changed to ${nextStatus}`);
  };

  // Delete Outlet in Backend & State
  const handleDeleteOutlet = async (outletId) => {
    if (!window.confirm('Are you sure you want to delete this outlet?')) return;
    const updated = outlets.filter(o => o.id !== outletId && o._id !== outletId);
    setOutlets(updated);

    await deleteRestaurantApi(outletId);
    showToast('Outlet deleted from MongoDB');
  };

  // Menu Items Management in Backend & State
  const handleAddMenuItemSubmit = async (e) => {
    e.preventDefault();
    if (!menuFormData.name || !menuFormData.price) return;

    const newItemObj = {
      name: menuFormData.name,
      category: menuFormData.category,
      price: Number(menuFormData.price),
      description: menuFormData.description || 'Delicious freshly prepared item',
      inStock: menuFormData.inStock
    };

    const res = await createMenuItemApi(newItemObj);
    const created = res.menuItem || newItemObj;

    const updated = [created, ...menuItems];
    setMenuItems(updated);

    setShowAddMenuModal(false);
    setMenuFormData({ name: '', category: 'Main Course', price: '', description: '', inStock: true });
    showToast(`Menu Item "${created.name}" saved to MongoDB!`);
  };

  const handleEditMenuItemSubmit = async (e) => {
    e.preventDefault();
    if (!showEditMenuModal) return;

    const itemId = showEditMenuModal._id || showEditMenuModal.id;
    const updateObj = {
      name: menuFormData.name,
      category: menuFormData.category,
      price: Number(menuFormData.price),
      description: menuFormData.description,
      inStock: menuFormData.inStock
    };

    const updated = menuItems.map(item => (item.id === itemId || item._id === itemId) ? { ...item, ...updateObj } : item);
    setMenuItems(updated);

    await updateMenuItemApi(itemId, updateObj);
    setShowEditMenuModal(null);
    showToast('Menu item updated in MongoDB!');
  };

  const handleToggleMenuStock = async (itemId) => {
    const updated = menuItems.map(i => {
      if (i.id === itemId || i._id === itemId) {
        return { ...i, inStock: i.inStock === false ? true : false, isAvailable: i.isAvailable === false ? true : false };
      }
      return i;
    });
    setMenuItems(updated);
    await toggleMenuStockApi(itemId);
    showToast('Stock availability toggled');
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    const updated = menuItems.filter(i => i.id !== itemId && i._id !== itemId);
    setMenuItems(updated);
    await deleteMenuItemApi(itemId);
    showToast('Menu item removed from MongoDB');
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  const commissionSaved = Math.round(totalRevenue * 0.30);

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.customerPhone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-portal-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} /> {toastMessage}
        </div>
      )}

      {/* Admin Top Header */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="admin-logo-mark">M</div>
          <div>
            <h1>MenuLink Admin Dashboard</h1>
            <span className="admin-subtitle">Live Express Backend & MongoDB Connected • 0% Commission Control</span>
          </div>
        </div>
        <div className="admin-header-actions">
          <button className="btn-outline-admin" onClick={loadData} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync DB Feed
          </button>
          <button className="btn-logout-admin" onClick={onLogout}>
            <LogOut size={14} /> Logout Admin
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
            <span className="metric-label">Total Direct Orders</span>
            <span className="metric-value">{totalOrdersCount}</span>
            <span className="metric-sub text-green">↑ 100% Commission-Free</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-revenue">
            <IndianRupee size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Gross Sales Revenue</span>
            <span className="metric-value">₹{totalRevenue.toLocaleString()}</span>
            <span className="metric-sub text-green">Instant Direct Payouts</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-saved">
            <ShieldCheck size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Aggregator Fees Saved</span>
            <span className="metric-value">₹{commissionSaved.toLocaleString()}</span>
            <span className="metric-sub text-green">Saved for Store Owners</span>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="metric-icon icon-outlets">
            <Store size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Active Food Outlets</span>
            <span className="metric-value">{outlets.length}</span>
            <span className="metric-sub">Onboarded Partners</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="admin-tab-bar">
        <button 
          className={`admin-nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
        >
          <ShoppingBag size={16} /> Live Orders ({orders.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => { setActiveTab('payments'); setSearchTerm(''); }}
        >
          <IndianRupee size={16} /> UPI Payments ({payments.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'outlets' ? 'active' : ''}`}
          onClick={() => { setActiveTab('outlets'); setSearchTerm(''); }}
        >
          <Store size={16} /> Outlets & Leads ({outlets.length})
        </button>
        <button 
          className={`admin-nav-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => { setActiveTab('menu'); setSearchTerm(''); }}
        >
          <Utensils size={16} /> Digital Menu ({menuItems.length})
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS */}
      {activeTab === 'orders' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <div>
              <h3>📦 Live Customer Orders (MongoDB Feed)</h3>
              <p className="section-subtext">Manage, update status, or dispatch food orders in real time.</p>
            </div>

            <div className="action-row-right">
              <button className="btn-add-primary" onClick={() => setShowAddOrderModal(true)}>
                <Plus size={15} /> Create Order
              </button>

              <div className="search-box">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search order #, customer, phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="status-filter-row">
            {['All', 'Received', 'Preparing', 'OutForDelivery', 'Delivered'].map((st) => (
              <button
                key={st}
                className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'All' ? 'All Orders' : st}
              </button>
            ))}
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
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                      No orders found matching your search/filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const id = order._id || order.id;
                    return (
                      <tr key={id}>
                        <td>
                          <span className="order-num-badge">{order.orderNumber}</span>
                          <span className="order-time-sub">{order.time}</span>
                        </td>
                        <td>
                          <strong>{order.customerName}</strong>
                          <span className="customer-phone">
                            <Phone size={11} /> {order.customerPhone}
                          </span>
                        </td>
                        <td>
                          <div className="item-pills-list">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="item-pill">{typeof item === 'string' ? item : `${item.quantity || 1}x ${item.name}`}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="amount-txt">₹{order.totalAmount}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-${(order.orderStatus || 'received').toLowerCase()}`}>
                            {order.orderStatus === 'Received' && <Clock size={12} />}
                            {order.orderStatus === 'Preparing' && <Utensils size={12} />}
                            {order.orderStatus === 'OutForDelivery' && <Truck size={12} />}
                            {order.orderStatus === 'Delivered' && <CheckCircle2 size={12} />}
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <span className="pay-badge pay-paid">✓ {order.paymentStatus || 'Paid'}</span>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <select 
                              className="status-select"
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateStatus(id, e.target.value)}
                            >
                              <option value="Received">Received</option>
                              <option value="Preparing">Preparing</option>
                              <option value="OutForDelivery">Out For Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            <button className="btn-icon" onClick={() => setInvoiceOrder(order)} title="Print / View Invoice">
                              <Printer size={15} />
                            </button>

                            <button className="btn-icon danger" onClick={() => handleDeleteOrder(id)} title="Delete Order">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: UPI PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <div>
              <h3>💳 Instant UPI Payout Receipts</h3>
              <p className="section-subtext">Direct 0% commission payment logs deposited directly into store accounts.</p>
            </div>
            <div className="search-box">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search txn ref or order..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                {payments
                  .filter(p => (p.txnRef || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id || p._id}>
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

      {/* TAB 3: OUTLETS & LEADS */}
      {activeTab === 'outlets' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <div>
              <h3>🏬 Onboarded Outlets & Partner Leads</h3>
              <p className="section-subtext">Manage active store accounts and new partner lead registrations.</p>
            </div>

            <div className="action-row-right">
              <button className="btn-add-primary" onClick={() => setShowAddOutletModal(true)}>
                <Plus size={15} /> Add New Outlet
              </button>

              <div className="search-box">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search outlets, owner..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Outlet Name</th>
                  <th>Owner Name</th>
                  <th>WhatsApp Contact</th>
                  <th>City / Location</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {outlets
                  .filter(o => (o.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (o.city || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((outlet, idx) => {
                    const id = outlet._id || outlet.id || idx;
                    const isActive = outlet.status !== 'Inactive';
                    return (
                      <tr key={id}>
                        <td><strong>{outlet.name}</strong></td>
                        <td>{outlet.ownerName || outlet.owner || 'Owner'}</td>
                        <td>
                          <a href={`https://wa.me/91${outlet.phone}`} target="_blank" rel="noreferrer" className="customer-phone wa-link">
                            <Phone size={12} /> {outlet.phone}
                          </a>
                        </td>
                        <td>{outlet.city || 'Hyderabad'}</td>
                        <td><span className="category-pill">{outlet.category || 'Restaurant'}</span></td>
                        <td>
                          <span className={`pay-badge ${isActive ? 'pay-paid' : 'pay-pending'}`}>
                            {isActive ? '✓ Active' : '✕ Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button 
                              className={`btn-status-toggle ${isActive ? 'btn-deactivate' : 'btn-activate'}`}
                              onClick={() => handleToggleOutletStatus(id)}
                            >
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn-icon danger" onClick={() => handleDeleteOutlet(id)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DIGITAL MENU MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="admin-card-section">
          <div className="table-header-row">
            <div>
              <h3>🍔 Digital Menu Management</h3>
              <p className="section-subtext">Add dishes, update prices, and control stock availability.</p>
            </div>

            <div className="action-row-right">
              <button className="btn-add-primary" onClick={() => setShowAddMenuModal(true)}>
                <Plus size={15} /> Add Menu Item
              </button>

              <div className="search-box">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search menu items..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems
                  .filter(i => (i.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (i.category || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item, idx) => {
                    const id = item._id || item.id || idx;
                    const inStock = item.inStock !== false && item.isAvailable !== false;
                    return (
                      <tr key={id}>
                        <td>
                          <strong>{item.name}</strong>
                          {item.description && <span className="item-desc-sub">{item.description}</span>}
                        </td>
                        <td><span className="category-pill">{item.category || 'Main Course'}</span></td>
                        <td><span className="amount-txt">₹{item.price}</span></td>
                        <td>
                          <button 
                            className={`stock-toggle-btn ${inStock ? 'in-stock' : 'out-of-stock'}`}
                            onClick={() => handleToggleMenuStock(id)}
                          >
                            {inStock ? '✓ In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button className="btn-icon" onClick={() => {
                              setShowEditMenuModal(item);
                              setMenuFormData({
                                name: item.name,
                                category: item.category || 'Main Course',
                                price: item.price,
                                description: item.description || '',
                                inStock: inStock
                              });
                            }}>
                              <Edit size={15} />
                            </button>

                            <button className="btn-icon danger" onClick={() => handleDeleteMenuItem(id)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD ORDER */}
      {showAddOrderModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create New Manual Order</h3>
              <button className="close-btn" onClick={() => setShowAddOrderModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateOrderSubmit} className="modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Reddy" 
                  value={newOrderData.customerName}
                  onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Phone (WhatsApp)</label>
                <input 
                  type="tel" 
                  placeholder="10-digit mobile number" 
                  value={newOrderData.customerPhone}
                  onChange={(e) => setNewOrderData({ ...newOrderData, customerPhone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Items (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1x Special Biryani, 2x Mango Lassi" 
                  value={newOrderData.items}
                  onChange={(e) => setNewOrderData({ ...newOrderData, items: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 450" 
                  value={newOrderData.totalAmount}
                  onChange={(e) => setNewOrderData({ ...newOrderData, totalAmount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Initial Status</label>
                <select 
                  value={newOrderData.orderStatus}
                  onChange={(e) => setNewOrderData({ ...newOrderData, orderStatus: e.target.value })}
                >
                  <option value="Received">Received</option>
                  <option value="Preparing">Preparing</option>
                  <option value="OutForDelivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Order to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD OUTLET */}
      {showAddOutletModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Onboard New Food Outlet</h3>
              <button className="close-btn" onClick={() => setShowAddOutletModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddOutletSubmit} className="modal-form">
              <div className="form-group">
                <label>Outlet Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paradise Biryani" 
                  value={newOutletData.name}
                  onChange={(e) => setNewOutletData({ ...newOutletData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Owner Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vikram Singh" 
                  value={newOutletData.ownerName}
                  onChange={(e) => setNewOutletData({ ...newOutletData, ownerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="10-digit mobile number" 
                  value={newOutletData.phone}
                  onChange={(e) => setNewOutletData({ ...newOutletData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>City / Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hyderabad, Bengaluru" 
                  value={newOutletData.city}
                  onChange={(e) => setNewOutletData({ ...newOutletData, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newOutletData.category}
                  onChange={(e) => setNewOutletData({ ...newOutletData, category: e.target.value })}
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Home Chef">Home Chef</option>
                  <option value="Tiffin Service">Tiffin Service</option>
                  <option value="Bakery">Bakery & Sweets</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddOutletModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Onboard Outlet to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD MENU ITEM */}
      {showAddMenuModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add New Menu Item</h3>
              <button className="close-btn" onClick={() => setShowAddMenuModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddMenuItemSubmit} className="modal-form">
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paneer Tikka Combo" 
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={menuFormData.category}
                  onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Biryani">Biryani</option>
                  <option value="Veg Main">Veg Main</option>
                  <option value="Starters">Starters</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 260" 
                  value={menuFormData.price}
                  onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Short description of dish..."
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddMenuModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Item to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT MENU ITEM */}
      {showEditMenuModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Menu Item</h3>
              <button className="close-btn" onClick={() => setShowEditMenuModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditMenuItemSubmit} className="modal-form">
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={menuFormData.category}
                  onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Biryani">Biryani</option>
                  <option value="Veg Main">Veg Main</option>
                  <option value="Starters">Starters</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  value={menuFormData.price}
                  onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={menuFormData.description}
                  onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditMenuModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes to MongoDB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINT INVOICE / RECEIPT VIEWER */}
      {invoiceOrder && (
        <div className="modal-backdrop">
          <div className="modal-card invoice-modal">
            <div className="modal-header">
              <h3>Receipt Invoice #{invoiceOrder.orderNumber}</h3>
              <button className="close-btn" onClick={() => setInvoiceOrder(null)}><X size={18} /></button>
            </div>

            <div className="invoice-print-body" id="printable-invoice">
              <div className="invoice-brand-row">
                <div className="brand-title">MenuLink Food Order</div>
                <div className="badge-tag">0% COMMISSION</div>
              </div>

              <div className="invoice-details-grid">
                <div>
                  <strong>Order ID:</strong> {invoiceOrder.orderNumber}<br />
                  <strong>Customer:</strong> {invoiceOrder.customerName}<br />
                  <strong>Phone:</strong> {invoiceOrder.customerPhone}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Time:</strong> {invoiceOrder.time}<br />
                  <strong>Status:</strong> {invoiceOrder.orderStatus}<br />
                  <strong>Payment:</strong> Instant UPI (Paid)
                </div>
              </div>

              <hr className="divider-line" />

              <h4>Items Ordered:</h4>
              <ul className="invoice-items-list">
                {invoiceOrder.items.map((it, idx) => (
                  <li key={idx}><span>{typeof it === 'string' ? it : `${it.quantity || 1}x ${it.name}`}</span></li>
                ))}
              </ul>

              <hr className="divider-line" />

              <div className="invoice-total-row">
                <span>Total Amount Paid:</span>
                <span className="total-val">₹{invoiceOrder.totalAmount}.00</span>
              </div>
              <div className="commission-saved-note">
                ✓ Store owner saved ₹{Math.round(invoiceOrder.totalAmount * 0.30)} in aggregator commissions on this order!
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setInvoiceOrder(null)}>Close</button>
              <button className="btn-primary" onClick={() => window.print()}>
                <Printer size={15} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
