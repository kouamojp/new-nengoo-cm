import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { 
  Homepage, 
  ProductCatalog, 
  ProductDetail, 
  ShoppingCart, 
  Checkout, 
  UserProfile, 
  About,
  SearchResults,
  SellerDashboard,
  SellerProducts,
  SellerOrders,
  SellerAnalytics,
  SellerProfile,
  SellerMessages,
  Login,
  BuyerSignup,
  SellerSignup,
  PendingApproval
} from './components';

function App() {
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('XAF');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nengoo-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    const savedUser = localStorage.getItem('nengoo-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save cart to localStorage when cartItems change
  useEffect(() => {
    localStorage.setItem('nengoo-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const appProps = {
    language,
    currency,
    cartItems,
    user,
    searchQuery,
    setSearchQuery,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleLanguage,
    setUser
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage {...appProps} />} />
          <Route path="/catalog" element={<ProductCatalog {...appProps} />} />
          <Route path="/catalog/:category" element={<ProductCatalog {...appProps} />} />
          <Route path="/product/:id" element={<ProductDetail {...appProps} />} />
          <Route path="/cart" element={<ShoppingCart {...appProps} />} />
          <Route path="/checkout" element={<Checkout {...appProps} />} />
          <Route path="/profile" element={<UserProfile {...appProps} />} />
          <Route path="/about" element={<About {...appProps} />} />
          <Route path="/search" element={<SearchResults {...appProps} />} />
          
          {/* Seller Routes */}
          <Route path="/seller" element={<SellerDashboard {...appProps} />} />
          <Route path="/seller/products" element={<SellerProducts {...appProps} />} />
          <Route path="/seller/orders" element={<SellerOrders {...appProps} />} />
          <Route path="/seller/analytics" element={<SellerAnalytics {...appProps} />} />
          <Route path="/seller/profile" element={<SellerProfile {...appProps} />} />
          <Route path="/seller/messages" element={<SellerMessages {...appProps} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;