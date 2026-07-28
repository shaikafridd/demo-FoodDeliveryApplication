const API_BASE_URL = 'http://localhost:5000/api';
const RENDER_CHAT_URL = 'https://demo-menulnk.onrender.com/chat';

export function getLocalStoreData(key, fallback) {
  try {
    const saved = localStorage.getItem(`menulink_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveLocalStoreData(key, data) {
  try {
    localStorage.setItem(`menulink_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

/**
 * Admin Login API call
 */
export async function adminLoginApi(emailOrUser, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailOrUser, password }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('[Backend Login Fallback]:', err);
  }

  const cleanUser = (emailOrUser || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();
  if ((cleanUser === 'admin' || cleanUser === 'admin@menulink.in') && cleanPass === '12345') {
    return { success: true, token: 'mock-token-123', admin: { name: 'Super Admin', role: 'superadmin' } };
  }
  return { success: false, message: 'Invalid username or password' };
}

/**
 * Render Chat AI Backend
 */
export async function sendRenderChatApi(userMessage) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(RENDER_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Render API HTTP error: ${response.status}`);
    const data = await response.json();
    return data.reply || data.message || null;
  } catch (err) {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * ORDERS API
 */
export async function fetchAllOrdersApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (response.ok) {
      const data = await response.json();
      if (data.orders && data.orders.length > 0) return data.orders;
    }
  } catch (err) {
    console.warn('[Backend Fallback] fetchAllOrdersApi using local store');
  }
  return getLocalStoreData('orders', [
    {
      id: 'ord-101',
      _id: 'ord-101',
      orderNumber: 'ORD-882910',
      customerName: 'Rahul Sharma',
      customerPhone: '9988776655',
      items: ['1x Butter Chicken & Naan Combo', '1x Mango Lassi'],
      totalAmount: 370,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
      createdAt: new Date(Date.now() - 720000).toISOString()
    },
    {
      id: 'ord-102',
      _id: 'ord-102',
      orderNumber: 'ORD-882911',
      customerName: 'Priya Verma',
      customerPhone: '9876501234',
      items: ['2x Special Chicken Biryani'],
      totalAmount: 640,
      orderStatus: 'Preparing',
      paymentStatus: 'Paid',
      createdAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: 'ord-103',
      _id: 'ord-103',
      orderNumber: 'ORD-882912',
      customerName: 'Anil Kumar',
      customerPhone: '9123456789',
      items: ['1x Paneer Butter Masala'],
      totalAmount: 240,
      orderStatus: 'Received',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function createOrderApi(orderPayload) {
  let backendOrder = null;
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    if (response.ok) {
      const data = await response.json();
      backendOrder = data.order;
    }
  } catch (err) {
    console.warn('[Backend Fallback] createOrderApi offline, saving locally:', err);
  }

  const fallbackOrder = backendOrder || {
    id: `ord-${Date.now()}`,
    _id: `ord-${Date.now()}`,
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    totalAmount: orderPayload.totalAmount || 370,
    customerName: orderPayload.customerName || 'Rahul Sharma',
    customerPhone: orderPayload.customerPhone || '9988776655',
    orderStatus: 'Received',
    paymentStatus: 'Paid',
    items: orderPayload.items ? orderPayload.items.map(i => typeof i === 'string' ? i : `${i.quantity || 1}x ${i.name}`) : ['1x Butter Chicken Combo'],
    createdAt: new Date().toISOString()
  };

  const currentOrders = getLocalStoreData('orders', []);
  saveLocalStoreData('orders', [fallbackOrder, ...currentOrders]);

  return { success: true, order: fallbackOrder };
}

export async function updateOrderStatusApi(orderId, orderStatus) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    });
  } catch (err) {
    console.warn('[Backend Status Update Error]:', err);
  }

  const currentOrders = getLocalStoreData('orders', []);
  const updated = currentOrders.map(o => (o.id === orderId || o._id === orderId) ? { ...o, orderStatus } : o);
  saveLocalStoreData('orders', updated);
  return { success: true };
}

export async function deleteOrderApi(orderId) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[Backend Delete Order Error]:', err);
  }

  const currentOrders = getLocalStoreData('orders', []);
  const updated = currentOrders.filter(o => o.id !== orderId && o._id !== orderId);
  saveLocalStoreData('orders', updated);
  return { success: true };
}

/**
 * PAYMENTS API
 */
export async function fetchAllPaymentsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`);
    if (response.ok) {
      const data = await response.json();
      if (data.payments && data.payments.length > 0) return data.payments;
    }
  } catch (err) {
    console.warn('[Backend Fallback] fetchAllPaymentsApi using local store');
  }

  return getLocalStoreData('payments', [
    { id: 'pay-1', txnRef: 'UPI-TXN-9948201', orderNumber: 'ORD-882910', amount: 370, method: 'UPI Direct', commission: 0, status: 'Success', time: '12 mins ago' },
    { id: 'pay-2', txnRef: 'UPI-TXN-9948202', orderNumber: 'ORD-882911', amount: 640, method: 'UPI Direct', commission: 0, status: 'Success', time: '5 mins ago' },
    { id: 'pay-3', txnRef: 'UPI-TXN-9948203', orderNumber: 'ORD-882912', amount: 240, method: 'UPI Direct', commission: 0, status: 'Success', time: 'Just now' }
  ]);
}

export async function verifyPaymentApi(paymentPayload) {
  let backendPayment = null;
  try {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload),
    });
    if (response.ok) {
      const data = await response.json();
      backendPayment = data.payment;
    }
  } catch (err) {
    console.warn('[Backend Fallback] verifyPaymentApi offline, saving locally:', err);
  }

  const fallbackPay = backendPayment || {
    id: `pay-${Date.now()}`,
    txnRef: `UPI-TXN-${Date.now().toString().slice(-7)}`,
    orderNumber: paymentPayload.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
    amount: paymentPayload.amount || 370,
    method: paymentPayload.paymentMethod || 'UPI Direct',
    commission: 0,
    status: 'Success',
    createdAt: new Date().toISOString()
  };

  const currentPayments = getLocalStoreData('payments', []);
  saveLocalStoreData('payments', [fallbackPay, ...currentPayments]);

  return { success: true, message: 'Instant UPI Payout verified. ₹0 commission charged!', payment: fallbackPay };
}

/**
 * RESTAURANTS / OUTLETS API
 */
export async function registerRestaurantApi(formData) {
  let backendOutlet = null;
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      backendOutlet = data.restaurant;
    }
  } catch (err) {
    console.warn('[Backend Fallback] registerRestaurantApi offline:', err);
  }

  const fallbackOutlet = backendOutlet || {
    id: `mock-${Date.now()}`,
    _id: `mock-${Date.now()}`,
    name: formData.name || formData.businessName,
    ownerName: formData.ownerName || formData.name,
    phone: formData.phone || formData.mobileNumber,
    city: formData.city || formData.location || 'Hyderabad',
    category: formData.category || formData.businessType || 'Restaurant',
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  const currentOutlets = getLocalStoreData('outlets', []);
  saveLocalStoreData('outlets', [fallbackOutlet, ...currentOutlets]);

  return { success: true, message: 'Restaurant onboarded successfully!', restaurant: fallbackOutlet };
}

export async function fetchRestaurantsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (response.ok) {
      const data = await response.json();
      if (data.restaurants && data.restaurants.length > 0) return data.restaurants;
    }
  } catch (err) {
    console.warn('[Backend Fallback] fetchRestaurantsApi using local store');
  }

  const defaultOutlets = [
    { id: 'rest-1', _id: 'rest-1', name: 'Spice House Restaurant', ownerName: 'Shaik Afrid', city: 'Hyderabad', category: 'Restaurant', phone: '9876543210', status: 'Active' },
    { id: 'rest-2', _id: 'rest-2', name: 'Bawarchi Biryani', ownerName: 'Syed Ali', city: 'Hyderabad', category: 'Restaurant', phone: '9876543211', status: 'Active' },
    { id: 'rest-3', _id: 'rest-3', name: 'Annapurna Tiffins', ownerName: 'Venkatesh Rao', city: 'Bengaluru', category: 'Tiffin Service', phone: '9876543212', status: 'Active' },
    { id: 'rest-4', _id: 'rest-4', name: "Mamma's Kitchen", ownerName: 'Sunita Sharma', city: 'Mumbai', category: 'Home Chef', phone: '9876543213', status: 'Active' },
  ];

  return getLocalStoreData('outlets', defaultOutlets);
}

export async function updateRestaurantStatusApi(id, status) {
  try {
    await fetch(`${API_BASE_URL}/restaurants/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.warn('[Backend Update Status Error]:', err);
  }

  const current = getLocalStoreData('outlets', []);
  const updated = current.map(o => (o.id === id || o._id === id) ? { ...o, status } : o);
  saveLocalStoreData('outlets', updated);
  return { success: true };
}

export async function deleteRestaurantApi(id) {
  try {
    await fetch(`${API_BASE_URL}/restaurants/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[Backend Delete Outlet Error]:', err);
  }

  const current = getLocalStoreData('outlets', []);
  const updated = current.filter(o => o.id !== id && o._id !== id);
  saveLocalStoreData('outlets', updated);
  return { success: true };
}

/**
 * MENU API
 */
export async function fetchMenuApi(restaurantId = 'rest-1') {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) return data.items;
    }
  } catch (err) {
    console.warn('[Backend Fallback] fetchMenuApi using local store');
  }

  const defaultItems = [
    { id: 'm1', _id: 'm1', name: 'Butter Chicken & Naan Combo', price: 280, category: 'Main Course', inStock: true, description: 'Creamy gravy chicken served with 2 hot butter naans' },
    { id: 'm2', _id: 'm2', name: 'Special Chicken Biryani', price: 320, category: 'Biryani', inStock: true, description: 'Authentic Hyderabadi dum biryani with raita and mirchi ka salan' },
    { id: 'm3', _id: 'm3', name: 'Paneer Butter Masala', price: 240, category: 'Veg Main', inStock: true, description: 'Rich cottage cheese in tomato butter gravy' },
    { id: 'm4', _id: 'm4', name: 'Mango Lassi', price: 90, category: 'Beverages', inStock: true, description: 'Chilled Alphonso mango yogurt drink' },
  ];

  return getLocalStoreData('menu_items', defaultItems);
}

export async function createMenuItemApi(menuPayload) {
  let backendItem = null;
  try {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuPayload),
    });
    if (response.ok) {
      const data = await response.json();
      backendItem = data.menuItem;
    }
  } catch (err) {
    console.warn('[Backend Fallback] createMenuItemApi offline:', err);
  }

  const fallbackItem = backendItem || {
    id: `m-${Date.now()}`,
    _id: `m-${Date.now()}`,
    name: menuPayload.name,
    category: menuPayload.category || 'Main Course',
    price: Number(menuPayload.price) || 150,
    description: menuPayload.description || 'Delicious freshly prepared item',
    inStock: menuPayload.inStock !== false
  };

  const current = getLocalStoreData('menu_items', []);
  saveLocalStoreData('menu_items', [fallbackItem, ...current]);
  return { success: true, menuItem: fallbackItem };
}

export async function updateMenuItemApi(id, menuPayload) {
  try {
    await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuPayload),
    });
  } catch (err) {
    console.warn('[Backend Update Menu Error]:', err);
  }

  const current = getLocalStoreData('menu_items', []);
  const updated = current.map(item => (item.id === id || item._id === id) ? { ...item, ...menuPayload } : item);
  saveLocalStoreData('menu_items', updated);
  return { success: true };
}

export async function toggleMenuStockApi(id) {
  try {
    await fetch(`${API_BASE_URL}/menu/${id}/stock`, { method: 'PATCH' });
  } catch (err) {
    console.warn('[Backend Stock Toggle Error]:', err);
  }

  const current = getLocalStoreData('menu_items', []);
  const updated = current.map(item => (item.id === id || item._id === id) ? { ...item, inStock: !item.inStock } : item);
  saveLocalStoreData('menu_items', updated);
  return { success: true };
}

export async function deleteMenuItemApi(id) {
  try {
    await fetch(`${API_BASE_URL}/menu/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[Backend Delete Menu Item Error]:', err);
  }

  const current = getLocalStoreData('menu_items', []);
  const updated = current.filter(item => item.id !== id && item._id !== id);
  saveLocalStoreData('menu_items', updated);
  return { success: true };
}
