import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Translations
const translations = {
  fr: {
    // Header
    search: "Rechercher des produits...",
    categories: "Catégories",
    cart: "Panier",
    profile: "Profil",
    signin: "Se connecter",
    language: "Langue",
    
    // Navigation Categories
    fashion: "Mode",
    electronics: "Électronique",
    home: "Maison & Jardin",
    local: "Produits Locaux",
    agriculture: "Agriculture",
    beauty: "Beauté",
    sports: "Sports",
    books: "Livres",
    
    // Homepage
    welcome: "Bienvenue sur Nengoo",
    subtitle: "Votre marketplace camerounaise de confiance",
    featuredProducts: "Produits en Vedette",
    newArrivals: "Nouvelles Arrivées",
    bestSellers: "Meilleures Ventes",
    localSpecialties: "Spécialités Locales",
    flashSale: "Vente Flash",
    viewAll: "Voir tout",
    
    // Product
    addToCart: "Ajouter au Panier",
    buyNow: "Acheter Maintenant",
    inStock: "En Stock",
    outOfStock: "Rupture de Stock",
    reviews: "Avis",
    rating: "Note",
    specifications: "Spécifications",
    description: "Description",
    
    // Cart
    shoppingCart: "Panier d'Achat",
    quantity: "Quantité",
    price: "Prix",
    total: "Total",
    subtotal: "Sous-total",
    shipping: "Livraison",
    tax: "Taxe",
    checkout: "Commander",
    continueShipping: "Continuer les Achats",
    removeItem: "Supprimer",
    emptyCart: "Votre panier est vide",
    
    // Checkout
    billingInfo: "Informations de Facturation",
    shippingInfo: "Informations de Livraison",
    paymentMethod: "Méthode de Paiement",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone",
    address: "Adresse",
    city: "Ville",
    region: "Région",
    postalCode: "Code Postal",
    mtnMoney: "MTN Mobile Money",
    orangeMoney: "Orange Money",
    creditCard: "Carte de Crédit",
    cashOnDelivery: "Paiement à la Livraison",
    placeOrder: "Passer Commande",
    
    // Footer
    about: "À Propos",
    contact: "Contact",
    help: "Aide",
    terms: "Conditions",
    privacy: "Confidentialité",
    followUs: "Suivez-nous",
    newsletter: "Newsletter",
    subscribe: "S'abonner",
    footerText: "Nengoo - Votre marketplace camerounaise de confiance depuis 2025"
  },
  en: {
    // Header
    search: "Search products...",
    categories: "Categories",
    cart: "Cart",
    profile: "Profile",
    signin: "Sign In",
    language: "Language",
    
    // Navigation Categories
    fashion: "Fashion",
    electronics: "Electronics",
    home: "Home & Garden",
    local: "Local Products",
    agriculture: "Agriculture",
    beauty: "Beauty",
    sports: "Sports",
    books: "Books",
    
    // Homepage
    welcome: "Welcome to Nengoo",
    subtitle: "Your trusted Cameroonian marketplace",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    localSpecialties: "Local Specialties",
    flashSale: "Flash Sale",
    viewAll: "View All",
    
    // Product
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    reviews: "Reviews",
    rating: "Rating",
    specifications: "Specifications",
    description: "Description",
    
    // Cart
    shoppingCart: "Shopping Cart",
    quantity: "Quantity",
    price: "Price",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    checkout: "Checkout",
    continueShipping: "Continue Shopping",
    removeItem: "Remove",
    emptyCart: "Your cart is empty",
    
    // Checkout
    billingInfo: "Billing Information",
    shippingInfo: "Shipping Information",
    paymentMethod: "Payment Method",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    region: "Region",
    postalCode: "Postal Code",
    mtnMoney: "MTN Mobile Money",
    orangeMoney: "Orange Money",
    creditCard: "Credit Card",
    cashOnDelivery: "Cash on Delivery",
    placeOrder: "Place Order",
    
    // Footer
    about: "About",
    contact: "Contact",
    help: "Help",
    terms: "Terms",
    privacy: "Privacy",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    subscribe: "Subscribe",
    footerText: "Nengoo - Your trusted Cameroonian marketplace since 2025"
  }
};

// Mock Product Data
const mockProducts = [
  {
    id: 1,
    name: { fr: "Robe Traditionnelle Camerounaise", en: "Traditional Cameroonian Dress" },
    category: "fashion",
    price: 45000,
    image: "https://images.pexels.com/photos/21618972/pexels-photo-21618972.jpeg",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: {
      fr: "Belle robe traditionnelle camerounaise faite à la main avec des tissus locaux authentiques.",
      en: "Beautiful handmade traditional Cameroonian dress with authentic local fabrics."
    },
    images: [
      "https://images.pexels.com/photos/21618972/pexels-photo-21618972.jpeg",
      "https://images.pexels.com/photos/31964014/pexels-photo-31964014.jpeg"
    ]
  },
  {
    id: 2,
    name: { fr: "Smartphone Android", en: "Android Smartphone" },
    category: "electronics",
    price: 125000,
    image: "https://images.pexels.com/photos/8475124/pexels-photo-8475124.jpeg",
    rating: 4.5,
    reviews: 89,
    inStock: true,
    description: {
      fr: "Smartphone Android dernière génération avec appareil photo haute résolution.",
      en: "Latest generation Android smartphone with high-resolution camera."
    }
  },
  {
    id: 3,
    name: { fr: "Panier Artisanal", en: "Handcrafted Basket" },
    category: "home",
    price: 15000,
    image: "https://images.pexels.com/photos/31964014/pexels-photo-31964014.jpeg",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    description: {
      fr: "Panier artisanal traditionnel fabriqué par des artisans locaux camerounais.",
      en: "Traditional handcrafted basket made by local Cameroonian artisans."
    }
  },
  {
    id: 4,
    name: { fr: "Chapeaux Traditionnels", en: "Traditional Hats" },
    category: "local",
    price: 8500,
    image: "https://images.pexels.com/photos/16430537/pexels-photo-16430537.jpeg",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    description: {
      fr: "Collection de chapeaux traditionnels camerounais faits à la main.",
      en: "Collection of handmade traditional Cameroonian hats."
    }
  },
  {
    id: 5,
    name: { fr: "Grains Biologiques", en: "Organic Grains" },
    category: "agriculture",
    price: 3500,
    image: "https://images.pexels.com/photos/33062138/pexels-photo-33062138.jpeg",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    description: {
      fr: "Grains biologiques de haute qualité cultivés par des agriculteurs locaux.",
      en: "High-quality organic grains grown by local farmers."
    }
  },
  {
    id: 6,
    name: { fr: "Cosmétiques Naturels", en: "Natural Cosmetics" },
    category: "beauty",
    price: 12000,
    image: "https://images.pexels.com/photos/30419070/pexels-photo-30419070.jpeg",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    description: {
      fr: "Cosmétiques naturels à base d'ingrédients africains traditionnels.",
      en: "Natural cosmetics made from traditional African ingredients."
    }
  },
  {
    id: 7,
    name: { fr: "Vêtements de Mode", en: "Fashion Clothing" },
    category: "fashion",
    price: 25000,
    image: "https://images.unsplash.com/photo-1550041499-4c5857d2b508",
    rating: 4.3,
    reviews: 92,
    inStock: true,
    description: {
      fr: "Vêtements de mode moderne avec des influences traditionnelles camerounaises.",
      en: "Modern fashion clothing with traditional Cameroonian influences."
    }
  },
  {
    id: 8,
    name: { fr: "Accessoires de Marché", en: "Market Accessories" },
    category: "local",
    price: 7500,
    image: "https://images.pexels.com/photos/2014342/pexels-photo-2014342.jpeg",
    rating: 4.5,
    reviews: 134,
    inStock: true,
    description: {
      fr: "Accessoires authentiques du marché local camerounais.",
      en: "Authentic accessories from the local Cameroonian market."
    }
  }
];

// Header Component
const Header = ({ language, toggleLanguage, cartItems, searchQuery, setSearchQuery, user }) => {
  const navigate = useNavigate();
  const t = translations[language];
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { key: 'fashion', icon: '👗' },
    { key: 'electronics', icon: '📱' },
    { key: 'home', icon: '🏠' },
    { key: 'local', icon: '🎨' },
    { key: 'agriculture', icon: '🌾' },
    { key: 'beauty', icon: '💄' },
    { key: 'sports', icon: '⚽' },
    { key: 'books', icon: '📚' }
  ];

  return (
    <header className="bg-gradient-to-r from-purple-700 to-red-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-purple-800 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            <span>📍 Cameroun</span>
            <span>📞 +237 6XX XXX XXX</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={toggleLanguage} className="hover:text-yellow-300 transition-colors">
              {language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </button>
            <span>💰 XAF</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-lg p-2">
              <span className="text-2xl font-bold text-purple-700">🛍️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nengoo</h1>
              <p className="text-sm opacity-90">nengoo.com</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full px-4 py-3 text-black rounded-lg border-2 border-white focus:border-yellow-300 focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔍
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-yellow-300 transition-colors">
              <span className="text-2xl">🛒</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
              <div className="text-sm">{t.cart}</div>
            </Link>
            
            <Link to="/profile" className="hover:text-yellow-300 transition-colors">
              <span className="text-2xl">👤</span>
              <div className="text-sm">{user ? user.name : t.signin}</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="bg-purple-600 border-t border-purple-500">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto py-3">
            {categories.map(cat => (
              <Link
                key={cat.key}
                to={`/catalog/${cat.key}`}
                className="flex items-center space-x-2 hover:text-yellow-300 transition-colors whitespace-nowrap"
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="font-medium">{t[cat.key]}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

// Footer Component
const Footer = ({ language }) => {
  const t = translations[language];
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-600 rounded-lg p-2">
                <span className="text-2xl font-bold">🛍️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Nengoo</h3>
                <p className="text-sm opacity-75">nengoo.com</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              {t.footerText}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-purple-400 transition-colors">📘</a>
              <a href="#" className="text-2xl hover:text-purple-400 transition-colors">📧</a>
              <a href="#" className="text-2xl hover:text-purple-400 transition-colors">📷</a>
              <a href="#" className="text-2xl hover:text-purple-400 transition-colors">🐦</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.about}</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">{t.about}</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t.contact}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t.help}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t.terms}</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.categories}</h4>
            <ul className="space-y-2">
              <li><Link to="/catalog/fashion" className="text-gray-300 hover:text-white transition-colors">{t.fashion}</Link></li>
              <li><Link to="/catalog/electronics" className="text-gray-300 hover:text-white transition-colors">{t.electronics}</Link></li>
              <li><Link to="/catalog/local" className="text-gray-300 hover:text-white transition-colors">{t.local}</Link></li>
              <li><Link to="/catalog/agriculture" className="text-gray-300 hover:text-white transition-colors">{t.agriculture}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.newsletter}</h4>
            <p className="text-gray-300 mb-4">Recevez nos dernières offres et nouveautés</p>
            <div className="flex">
              <input
                type="email"
                placeholder={t.email}
                className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:bg-gray-600"
              />
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg transition-colors">
                {t.subscribe}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Nengoo. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Product Card Component
const ProductCard = ({ product, language, addToCart }) => {
  const navigate = useNavigate();
  const t = translations[language];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
        />
        {product.inStock ? (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
            {t.inStock}
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            {t.outOfStock}
          </span>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
              ⭐
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-2 cursor-pointer hover:text-purple-600 transition-colors"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name[language]}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {product.reviews} {t.reviews} • {product.rating} ⭐
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

// Homepage Component
export const Homepage = (props) => {
  const { language, addToCart } = props;
  const t = translations[language];

  const featuredProducts = mockProducts.slice(0, 4);
  const newArrivals = mockProducts.slice(2, 6);
  const bestSellers = mockProducts.slice(1, 5);
  const localProducts = mockProducts.filter(p => p.category === 'local');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">{t.welcome}</h1>
              <p className="text-xl mb-8 opacity-90">{t.subtitle}</p>
              <div className="flex space-x-4">
                <Link to="/catalog" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                  {t.viewAll} 🛍️
                </Link>
                <Link to="/catalog/local" className="border-2 border-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                  {t.localSpecialties} 🎨
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1550041499-4c5857d2b508"
                alt="Hero"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black p-4 rounded-lg font-bold">
                {t.flashSale} 🔥<br />
                <span className="text-sm">-30% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.categories}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'fashion', icon: '👗', bg: 'from-pink-400 to-red-400' },
              { key: 'electronics', icon: '📱', bg: 'from-blue-400 to-indigo-400' },
              { key: 'home', icon: '🏠', bg: 'from-green-400 to-teal-400' },
              { key: 'local', icon: '🎨', bg: 'from-purple-400 to-pink-400' },
              { key: 'agriculture', icon: '🌾', bg: 'from-yellow-400 to-orange-400' },
              { key: 'beauty', icon: '💄', bg: 'from-purple-400 to-red-400' },
              { key: 'sports', icon: '⚽', bg: 'from-indigo-400 to-blue-400' },
              { key: 'books', icon: '📚', bg: 'from-gray-400 to-gray-600' }
            ].map(cat => (
              <Link
                key={cat.key}
                to={`/catalog/${cat.key}`}
                className={`bg-gradient-to-r ${cat.bg} text-white rounded-lg p-6 text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-semibold">{t[cat.key]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t.featuredProducts}</h2>
            <Link to="/catalog" className="text-purple-600 hover:text-purple-700 font-semibold">
              {t.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Local Specialties */}
      <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.localSpecialities}</h2>
            <p className="text-gray-600">Découvrez l'artisanat et les produits authentiques du Cameroun</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localProducts.map(product => (
              <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.newsletter}</h2>
          <p className="text-xl mb-8 opacity-90">Restez informé de nos dernières offres et nouveautés</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder={t.email}
              className="flex-1 px-4 py-3 text-black rounded-l-lg focus:outline-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              {t.subscribe}
            </button>
          </div>
        </div>
      </section>

      <Footer language={language} />
    </div>
  );
};

// Product Catalog Component
export const ProductCatalog = (props) => {
  const { language, addToCart } = props;
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  
  const t = translations[language];
  
  let filteredProducts = mockProducts;
  
  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }
  
  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      default: return a.name[language].localeCompare(b.name[language]);
    }
  });

  const categories = [
    { key: 'all', name: { fr: 'Tous', en: 'All' } },
    { key: 'fashion', name: { fr: 'Mode', en: 'Fashion' } },
    { key: 'electronics', name: { fr: 'Électronique', en: 'Electronics' } },
    { key: 'home', name: { fr: 'Maison', en: 'Home' } },
    { key: 'local', name: { fr: 'Produits Locaux', en: 'Local Products' } },
    { key: 'agriculture', name: { fr: 'Agriculture', en: 'Agriculture' } },
    { key: 'beauty', name: { fr: 'Beauté', en: 'Beauty' } }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Filtres</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">{t.categories}</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat.key} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat.key}
                        checked={selectedCategory === cat.key}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      {cat.name[language]}
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Prix (XAF)</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0 XAF</span>
                    <span>{priceRange[1].toLocaleString()} XAF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 sm:mb-0">
                  {selectedCategory === 'all' ? 'Tous les produits' : t[selectedCategory]} 
                  <span className="text-gray-500 ml-2">({filteredProducts.length})</span>
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="name">Trier par nom</option>
                  <option value="price-low">Prix: Bas → Haut</option>
                  <option value="price-high">Prix: Haut → Bas</option>
                  <option value="rating">Meilleure note</option>
                  <option value="reviews">Plus d'avis</option>
                </select>
              </div>
            </div>
            
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">Essayez d'ajuster vos filtres ou explorez d'autres catégories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Product Detail Component
export const ProductDetail = (props) => {
  const { language, addToCart } = props;
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const t = translations[language];
  
  const product = mockProducts.find(p => p.id === parseInt(id));
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header {...props} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <Link to="/catalog" className="text-purple-600 hover:text-purple-700">
            ← Retour au catalogue
          </Link>
        </div>
        <Footer language={language} />
      </div>
    );
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-purple-600 hover:text-purple-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link to="/catalog" className="text-purple-600 hover:text-purple-700">Catalogue</Link>
          <span className="mx-2">›</span>
          <Link to={`/catalog/${product.category}`} className="text-purple-600 hover:text-purple-700">{t[product.category]}</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{product.name[language]}</span>
        </nav>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-6">
              <div className="mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name[language]}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name[language]} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">{product.name[language]}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews} {t.reviews})</span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-purple-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ {t.inStock}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    ❌ {t.outOfStock}
                  </span>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">{t.quantity}</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={!product.inStock}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  {t.addToCart}
                </button>
                <button
                  disabled={!product.inStock}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  {t.buyNow}
                </button>
              </div>
              
              {/* Product Description */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">{t.description}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description[language]}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8">Produits similaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} language={language} addToCart={addToCart} />
              ))}
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Shopping Cart Component
export const ShoppingCart = (props) => {
  const { language, cartItems, updateCartQuantity, removeFromCart, clearCart } = props;
  const navigate = useNavigate();
  const t = translations[language];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500; // Free shipping over 50,000 XAF
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header {...props} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">{t.emptyCart}</h2>
            <p className="text-gray-600 mb-8">Découvrez nos produits et ajoutez-les à votre panier.</p>
            <Link
              to="/catalog"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {t.continueShipping}
            </Link>
          </div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t.shoppingCart}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg">{item.name[language]}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm mt-1"
                      >
                        {t.removeItem}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-6">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Résumé de commande</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t.shipping}</span>
                  <span>{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t.tax} (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>{t.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold mt-6 transition-colors"
              >
                {t.checkout}
              </button>
              
              <Link
                to="/catalog"
                className="block text-center text-purple-600 hover:text-purple-700 mt-4"
              >
                {t.continueShipping}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Checkout Component
export const Checkout = (props) => {
  const { language, cartItems, clearCart } = props;
  const navigate = useNavigate();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    paymentMethod: 'mtnMoney'
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock order processing
    alert('Commande passée avec succès! Vous recevrez une confirmation par email.');
    clearCart();
    navigate('/');
  };
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">{t.billingInfo}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={t.firstName}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={t.lastName}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.email}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t.phone}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t.address}
                  required
                  className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={t.city}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder={t.region}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-6">{t.paymentMethod}</h3>
              <div className="space-y-3">
                {[
                  { key: 'mtnMoney', label: t.mtnMoney, icon: '📱' },
                  { key: 'orangeMoney', label: t.orangeMoney, icon: '🍊' },
                  { key: 'creditCard', label: t.creditCard, icon: '💳' },
                  { key: 'cashOnDelivery', label: t.cashOnDelivery, icon: '💰' }
                ].map(method => (
                  <label key={method.key} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.key}
                      checked={formData.paymentMethod === method.key}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-xl mr-3">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Votre commande</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name[language]} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{item.name[language]}</p>
                        <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <hr className="my-4" />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.shipping}</span>
                  <span>{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.tax}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold mt-6 transition-colors"
              >
                {t.placeOrder}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// User Profile Component
export const UserProfile = (props) => {
  const { language } = props;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
        <p className="text-gray-600 mb-8">Fonctionnalité en cours de développement</p>
        <Link to="/" className="text-purple-600 hover:text-purple-700">
          ← Retour à l'accueil
        </Link>
      </div>
      <Footer language={language} />
    </div>
  );
};

// About Component
export const About = (props) => {
  const { language } = props;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">À propos de Nengoo</h1>
            <p className="text-xl text-gray-600">
              Votre marketplace camerounaise de confiance depuis 2025
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nengoo a été créé avec pour mission de connecter les consommateurs camerounais 
                aux meilleurs produits locaux et internationaux, tout en soutenant l'économie locale 
                et l'artisanat traditionnel.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nous croyons fermement au potentiel du commerce électronique pour transformer 
                l'économie camerounaise et offrir de nouvelles opportunités aux entrepreneurs locaux.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/13086663/pexels-photo-13086663.jpeg"
                alt="About Nengoo"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Qualité Garantie</h3>
              <p className="text-gray-600">Tous nos produits sont soigneusement sélectionnés et vérifiés.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Livraison dans tout le Cameroun avec suivi en temps réel.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Support 24/7</h3>
              <p className="text-gray-600">Notre équipe est toujours là pour vous aider.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Rejoignez la famille Nengoo</h2>
            <p className="mb-6">Découvrez les meilleurs produits du Cameroun et d'ailleurs</p>
            <Link
              to="/catalog"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Commencer mes achats
            </Link>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Search Results Component
export const SearchResults = (props) => {
  const { language, addToCart, searchQuery } = props;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || searchQuery;
  
  const searchResults = mockProducts.filter(product =>
    product.name[language].toLowerCase().includes(query.toLowerCase()) ||
    product.description[language].toLowerCase().includes(query.toLowerCase()) ||
    translations[language][product.category].toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Résultats de recherche</h1>
          <p className="text-gray-600">
            {searchResults.length} résultat(s) pour "<strong>{query}</strong>"
          </p>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-8">
              Aucun produit ne correspond à votre recherche "<strong>{query}</strong>".
            </p>
            <Link
              to="/catalog"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Parcourir tous les produits
            </Link>
          </div>
        )}
      </div>
      
      <Footer language={language} />
    </div>
  );
};