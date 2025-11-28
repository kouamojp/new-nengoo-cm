import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';

// PWA Install Component
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setShowInstall(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-gradient-to-r from-purple-600 to-red-600 text-white p-4 rounded-lg shadow-xl z-50 animate-bounce">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-semibold text-sm">Installer Nengoo</p>
            <p className="text-xs opacity-90">Accès rapide depuis votre écran d'accueil</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Installer
          </button>
          <button
            onClick={() => setShowInstall(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

// Permanent Install Button Component (Header)
const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or already installed
      alert('Pour installer Nengoo:\n\niOS: Cliquez sur le bouton Partager puis "Ajouter à l\'écran d\'accueil"\n\nAndroid: Utilisez le menu du navigateur "Ajouter à l\'écran d\'accueil"');
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <button
      onClick={handleInstall}
      className="hidden sm:flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
      title="Installer l'application Nengoo"
    >
      <span className="text-lg">📱</span>
      <span className="text-sm">Installer l'App</span>
    </button>
  );
};

// Install App Button Component (Homepage - Large)
const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      setShowInstructions(true);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
        <span className="text-5xl mb-3 block">✅</span>
        <h3 className="text-xl font-bold text-green-800 mb-2">Application Installée!</h3>
        <p className="text-green-700">Nengoo est maintenant sur votre écran d'accueil</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstall}
        className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-3"
      >
        <span className="text-3xl">📱</span>
        <span>Installer l'Application</span>
      </button>

      {/* Manual Installation Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">📱</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Comment Installer Nengoo
              </h3>
            </div>

            <div className="space-y-6 text-left">
              {/* iOS Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🍎</span>
                  Sur iPhone/iPad (Safari):
                </h4>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Appuyez sur le bouton <strong>Partager</strong> (□↑) en bas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Faites défiler et choisissez <strong>"Sur l'écran d'accueil"</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Appuyez sur <strong>"Ajouter"</strong></span>
                  </li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  Sur Android (Chrome):
                </h4>
                <ol className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start">
                    <span className="font-bold mr-2">1.</span>
                    <span>Appuyez sur le menu <strong>(⋮)</strong> en haut à droite</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">2.</span>
                    <span>Sélectionnez <strong>"Installer l'application"</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2">3.</span>
                    <span>Appuyez sur <strong>"Installer"</strong></span>
                  </li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold mt-6 transition-colors"
            >
              Compris!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

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
    food_drinks: "Aliments et Boissons",
    sports_articles: "Articles Sportifs", 
    handicrafts: "Artisanat et Produits Faits Main",
    electronics: "Électroniques",
    professional_equipment: "Équipements Professionnels",
    toys: "Jouets pour Enfants",
    home_garden: "Maison & Jardinage",
    medical_equipment: "Matériel Médical",
    beauty_care: "Produits de Beauté et Soins Personnels",
    services: "Services",
    clothing_accessories: "Vêtements et Accessoires",
    travel_tickets: "Voyages et Billets",
    
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
    footerText: "Nengoo - Votre marketplace camerounaise de confiance depuis 2025",
    
    // Authentication
    login: "Se connecter",
    signup: "S'inscrire",
    loginAsBuyer: "Se connecter en tant qu'Acheteur",
    loginAsSeller: "Se connecter en tant que Vendeur",
    buyerLogin: "Connexion Acheteur",
    sellerLogin: "Connexion Vendeur",
    whatsappNumber: "Numéro WhatsApp",
    enterWhatsApp: "Entrez votre numéro WhatsApp",
    selectCategories: "Sélectionner les catégories",
    businessName: "Nom de l'entreprise",
    city: "Ville",
    selectCity: "Choisir votre ville",
    signupAsSeller: "Inscription Vendeur",
    signupAsBuyer: "Inscription Acheteur",
    createAccount: "Créer un compte",
    haveAccount: "Déjà un compte ?",
    noAccount: "Pas de compte ?",
    pendingApproval: "En attente d'approbation",
    approvalMessage: "Votre demande d'inscription en tant que vendeur a été soumise. Vous recevrez une confirmation par WhatsApp une fois votre compte approuvé par l'administrateur.",
    backToHome: "Retour à l'accueil",
    logout: "Se déconnecter",
    welcomeBack: "Bon retour"
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
    food_drinks: "Food & Drinks",
    sports_articles: "Sports Articles", 
    handicrafts: "Handicrafts & Handmade",
    electronics: "Electronics",
    professional_equipment: "Professional Equipment",
    toys: "Children's Toys",
    home_garden: "Home & Garden",
    medical_equipment: "Medical Equipment",
    beauty_care: "Beauty & Personal Care",
    services: "Services",
    clothing_accessories: "Clothing & Accessories",
    travel_tickets: "Travel & Tickets",
    
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
    footerText: "Nengoo - Your trusted Cameroonian marketplace since 2025",
    
    // Authentication
    login: "Sign In",
    signup: "Sign Up",
    loginAsBuyer: "Sign In as Buyer",
    loginAsSeller: "Sign In as Seller",
    buyerLogin: "Buyer Login",
    sellerLogin: "Seller Login",
    whatsappNumber: "WhatsApp Number",
    enterWhatsApp: "Enter your WhatsApp number",
    selectCategories: "Select categories",
    businessName: "Business Name",
    city: "City",
    selectCity: "Choose your city",
    signupAsSeller: "Seller Registration",
    signupAsBuyer: "Buyer Registration",
    createAccount: "Create Account",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    pendingApproval: "Pending Approval",
    approvalMessage: "Your seller registration request has been submitted. You will receive a WhatsApp confirmation once your account is approved by the administrator.",
    backToHome: "Back to Home",
    logout: "Logout",
    welcomeBack: "Welcome Back"
  }
};

// Utility functions for social media and WhatsApp
const openWhatsApp = (phoneNumber, message = '') => {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

const formatPhoneForWhatsApp = (phone) => {
  return phone.replace(/\D/g, '');
};

const generateProductWhatsAppMessage = (product, language) => {
  return `Bonjour! Je suis intéressé(e) par votre produit "${product.name[language]}" sur Nengoo. Pourriez-vous me donner plus d'informations? Merci!`;
};

// Mock Product Data with seller WhatsApp
const mockProducts = [
  {
    id: 1,
    name: { fr: "Robe Traditionnelle Camerounaise", en: "Traditional Cameroonian Dress" },
    category: "clothing_accessories",
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
    ],
    sellerWhatsApp: "+237655123456"
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
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 3,
    name: { fr: "Panier Artisanal", en: "Handcrafted Basket" },
    category: "home_garden",
    price: 15000,
    image: "https://images.pexels.com/photos/31964014/pexels-photo-31964014.jpeg",
    rating: 4.9,
    reviews: 67,
    inStock: true,
    description: {
      fr: "Panier artisanal traditionnel fabriqué par des artisans locaux camerounais.",
      en: "Traditional handcrafted basket made by local Cameroonian artisans."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 4,
    name: { fr: "Chapeaux Traditionnels", en: "Traditional Hats" },
    category: "handicrafts",
    price: 8500,
    image: "https://images.pexels.com/photos/16430537/pexels-photo-16430537.jpeg",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    description: {
      fr: "Collection de chapeaux traditionnels camerounais faits à la main.",
      en: "Collection of handmade traditional Cameroonian hats."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 5,
    name: { fr: "Grains Biologiques", en: "Organic Grains" },
    category: "food_drinks",
    price: 3500,
    image: "https://images.pexels.com/photos/33062138/pexels-photo-33062138.jpeg",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    description: {
      fr: "Grains biologiques de haute qualité cultivés par des agriculteurs locaux.",
      en: "High-quality organic grains grown by local farmers."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 6,
    name: { fr: "Cosmétiques Naturels", en: "Natural Cosmetics" },
    category: "beauty_care",
    price: 12000,
    image: "https://images.pexels.com/photos/30419070/pexels-photo-30419070.jpeg",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    description: {
      fr: "Cosmétiques naturels à base d'ingrédients africains traditionnels.",
      en: "Natural cosmetics made from traditional African ingredients."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 7,
    name: { fr: "Vêtements de Mode", en: "Fashion Clothing" },
    category: "clothing_accessories",
    price: 25000,
    image: "https://images.unsplash.com/photo-1550041499-4c5857d2b508",
    rating: 4.3,
    reviews: 92,
    inStock: true,
    description: {
      fr: "Vêtements de mode moderne avec des influences traditionnelles camerounaises.",
      en: "Modern fashion clothing with traditional Cameroonian influences."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 8,
    name: { fr: "Accessoires de Marché", en: "Market Accessories" },
    category: "handicrafts",
    price: 7500,
    image: "https://images.pexels.com/photos/2014342/pexels-photo-2014342.jpeg",
    rating: 4.5,
    reviews: 134,
    inStock: true,
    description: {
      fr: "Accessoires authentiques du marché local camerounais.",
      en: "Authentic accessories from the local Cameroonian market."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 9,
    name: { fr: "Produits Alimentaires Bio", en: "Organic Food Products" },
    category: "food_drinks",
    price: 8500,
    image: "https://images.pexels.com/photos/33062138/pexels-photo-33062138.jpeg",
    rating: 4.6,
    reviews: 87,
    inStock: true,
    description: {
      fr: "Produits alimentaires biologiques locaux de haute qualité.",
      en: "High-quality local organic food products."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 10,
    name: { fr: "Équipement Sportif", en: "Sports Equipment" },
    category: "sports_articles",
    price: 35000,
    image: "https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg",
    rating: 4.4,
    reviews: 56,
    inStock: true,
    description: {
      fr: "Équipement sportif de qualité pour tous les sports.",
      en: "Quality sports equipment for all sports."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 11,
    name: { fr: "Jouets Éducatifs", en: "Educational Toys" },
    category: "toys",
    price: 15000,
    image: "https://images.pexels.com/photos/163028/lego-build-blocks-bricks-163028.jpeg",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: {
      fr: "Jouets éducatifs pour le développement des enfants.",
      en: "Educational toys for children's development."
    },
    sellerWhatsApp: "+237655123456"
  },
  {
    id: 12,
    name: { fr: "Services de Livraison", en: "Delivery Services" },
    category: "services",
    price: 5000,
    image: "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg",
    rating: 4.2,
    reviews: 201,
    inStock: true,
    description: {
      fr: "Services de livraison rapide et fiable dans toute la ville.",
      en: "Fast and reliable delivery services throughout the city."
    },
    sellerWhatsApp: "+237655123456"
  }
];

// Header Component
const Header = ({ language, toggleLanguage, cartItems, searchQuery, setSearchQuery, user, setUser }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const t = translations[language];
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { key: 'clothing_accessories', icon: '👗' },
    { key: 'food_drinks', icon: '🍽️' },
    { key: 'electronics', icon: '📱' },
    { key: 'home_garden', icon: '🏠' },
    { key: 'handicrafts', icon: '🎨' },
    { key: 'beauty_care', icon: '💄' },
    { key: 'sports_articles', icon: '⚽' },
    { key: 'toys', icon: '🧸' },
    { key: 'medical_equipment', icon: '🏥' },
    { key: 'professional_equipment', icon: '🔧' },
    { key: 'services', icon: '🛠️' },
    { key: 'travel_tickets', icon: '✈️' }
  ];

  return (
    <header className="bg-gradient-to-r from-purple-700 to-red-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-purple-800 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex space-x-4">
            <span className="hidden sm:inline">📍 Cameroun</span>
            <span className="hidden md:inline">📞 +237 6XX XXX XXX</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={toggleLanguage} className="hover:text-yellow-300 transition-colors text-xs sm:text-sm">
              {language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </button>
            <span className="text-xs sm:text-sm">💰 XAF</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-lg p-1 sm:p-2">
              <span className="text-lg sm:text-2xl font-bold text-purple-700">🛍️</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">Nengoo</h1>
              <p className="text-xs opacity-90 hidden sm:block">nengoo.com</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white text-2xl"
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <InstallButton />
            
            <Link to="/cart" className="relative hover:text-yellow-300 transition-colors">
              <span className="text-2xl">🛒</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
              <div className="text-sm">{t.cart}</div>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user.type === 'seller' ? '/seller' : '/profile'} className="hover:text-yellow-300 transition-colors">
                  <span className="text-2xl">{user.type === 'seller' ? '🏪' : '👤'}</span>
                  <div className="text-sm">{user.name}</div>
                </Link>
                <button
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem('nengoo-user');
                  }}
                  className="text-sm hover:text-yellow-300 transition-colors"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-yellow-300 transition-colors">
                <span className="text-2xl">👤</span>
                <div className="text-sm">{t.signin}</div>
              </Link>
            )}
          </div>

          {/* Mobile User Actions */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/cart" className="relative">
              <span className="text-xl">🛒</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full px-4 py-2 text-black rounded-lg border-2 border-white focus:border-yellow-300 focus:outline-none"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors"
            >
              🔍
            </button>
          </form>
        </div>
      </div>

      {/* Categories Navigation - Desktop */}
      <nav className="hidden md:block bg-purple-600 border-t border-purple-500">
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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-purple-600 border-t border-purple-500">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Categories */}
            <div className="space-y-3 mb-6">
              <h3 className="font-bold text-yellow-300">Catégories</h3>
              {categories.map(cat => (
                <Link
                  key={cat.key}
                  to={`/catalog/${cat.key}`}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 py-2 hover:text-yellow-300 transition-colors"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{t[cat.key]}</span>
                </Link>
              ))}
            </div>
            
            {/* Mobile User Links */}
            <div className="space-y-3 border-t border-purple-500 pt-4">
              {user ? (
                <div className="space-y-3">
                  <Link
                    to={user.type === 'seller' ? '/seller' : '/profile'}
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center space-x-3 py-2 hover:text-yellow-300 transition-colors"
                  >
                    <span className="text-xl">{user.type === 'seller' ? '🏪' : '👤'}</span>
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUser(null);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center space-x-3 py-2 hover:text-yellow-300 transition-colors"
                  >
                    <span className="text-xl">🚪</span>
                    <span>{t.logout}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 py-2 hover:text-yellow-300 transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <span>{t.signin}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Footer Component
const Footer = ({ language }) => {
  const t = translations[language];
  
  const handleStoreClick = (store) => {
    if (store === 'android') {
      alert('🤖 Application Android\n\nL\'application sera bientôt disponible sur Google Play Store!\n\nEn attendant, vous pouvez installer la version PWA en cliquant sur le bouton "Installer l\'App" en haut de la page.');
    } else {
      alert('🍎 Application iOS\n\nL\'application sera bientôt disponible sur Apple App Store!\n\nEn attendant, vous pouvez installer la version PWA:\n\niOS: Appuyez sur Partager (□↑) puis "Sur l\'écran d\'accueil"');
    }
  };
  
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
              <li><Link to="/catalog/clothing_accessories" className="text-gray-300 hover:text-white transition-colors">{t.clothing_accessories}</Link></li>
              <li><Link to="/catalog/electronics" className="text-gray-300 hover:text-white transition-colors">{t.electronics}</Link></li>
              <li><Link to="/catalog/handicrafts" className="text-gray-300 hover:text-white transition-colors">{t.handicrafts}</Link></li>
              <li><Link to="/catalog/food_drinks" className="text-gray-300 hover:text-white transition-colors">{t.food_drinks}</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="text-lg font-semibold mb-4">📱 Télécharger l'App</h4>
            <p className="text-gray-300 mb-4 text-sm">Installez Nengoo sur votre mobile</p>
            
            {/* Google Play Badge */}
            <button 
              onClick={() => handleStoreClick('android')}
              className="w-full bg-black hover:bg-gray-800 rounded-lg p-3 mb-3 transition-all hover:scale-105 flex items-center space-x-3 border border-gray-700"
            >
              <div className="text-3xl">📱</div>
              <div className="text-left">
                <div className="text-xs text-gray-400">Disponible sur</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </button>

            {/* App Store Badge */}
            <button 
              onClick={() => handleStoreClick('ios')}
              className="w-full bg-black hover:bg-gray-800 rounded-lg p-3 mb-3 transition-all hover:scale-105 flex items-center space-x-3 border border-gray-700"
            >
              <div className="text-3xl">🍎</div>
              <div className="text-left">
                <div className="text-xs text-gray-400">Télécharger sur</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </button>

            {/* PWA Install */}
            <div className="bg-purple-900 bg-opacity-50 rounded-lg p-3 border border-purple-700">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-semibold text-yellow-300">Installation Rapide</span>
              </div>
              <p className="text-xs text-gray-300">
                Installez maintenant en 1 clic depuis cette page (PWA)
              </p>
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

  const handleWhatsAppContact = () => {
    const message = generateProductWhatsAppMessage(product, language);
    openWhatsApp(product.sellerWhatsApp, message);
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
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-1.5 text-sm rounded-lg transition-colors"
          >
            {t.addToCart}
          </button>
        </div>
        {/* WhatsApp Contact Button */}
        {product.sellerWhatsApp && (
          <button
            onClick={handleWhatsAppContact}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 text-sm rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <span>📱</span>
            <span>Contacter sur WhatsApp</span>
          </button>
        )}
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
  const localProducts = mockProducts.filter(p => p.category === 'handicrafts');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">{t.welcome}</h1>
              <p className="text-lg sm:text-xl mb-6 lg:mb-8 opacity-90">{t.subtitle}</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                <Link to="/catalog" className="bg-white text-purple-600 hover:bg-gray-100 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors text-center">
                  {t.viewAll} 🛍️
                </Link>
                <Link to="/catalog/handicrafts" className="border-2 border-white hover:bg-white hover:text-purple-600 px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors text-center">
                  {t.localSpecialties} 🎨
                </Link>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <img
                src="https://images.unsplash.com/photo-1550041499-4c5857d2b508"
                alt="Hero"
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto lg:max-w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-black p-3 sm:p-4 rounded-lg font-bold text-center">
                {t.flashSale} 🔥<br />
                <span className="text-sm">-30% OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install App Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <span className="text-6xl animate-bounce">📱</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Installez l'Application Nengoo
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Accédez instantanément à Nengoo depuis votre écran d'accueil. 
                  Plus rapide, plus pratique, fonctionne même hors ligne!
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-2xl">✓</span>
                    <span className="text-gray-700">Installation en 1 clic</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-2xl">✓</span>
                    <span className="text-gray-700">Fonctionne hors ligne</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-2xl">✓</span>
                    <span className="text-gray-700">Mises à jour automatiques</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-2xl">✓</span>
                    <span className="text-gray-700">Très léger (~500KB)</span>
                  </div>
                </div>

                <InstallAppButton />
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
                    alt="Mobile Phone"
                    className="rounded-2xl shadow-xl w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-12">{t.categories}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { key: 'clothing_accessories', icon: '👗', bg: 'from-pink-400 to-red-400' },
              { key: 'food_drinks', icon: '🍽️', bg: 'from-green-400 to-teal-400' },
              { key: 'electronics', icon: '📱', bg: 'from-blue-400 to-indigo-400' },
              { key: 'home_garden', icon: '🏠', bg: 'from-yellow-400 to-orange-400' },
              { key: 'handicrafts', icon: '🎨', bg: 'from-purple-400 to-pink-400' },
              { key: 'beauty_care', icon: '💄', bg: 'from-purple-400 to-red-400' },
              { key: 'sports_articles', icon: '⚽', bg: 'from-indigo-400 to-blue-400' },
              { key: 'toys', icon: '🧸', bg: 'from-orange-400 to-red-400' },
              { key: 'medical_equipment', icon: '🏥', bg: 'from-red-400 to-pink-400' },
              { key: 'professional_equipment', icon: '🔧', bg: 'from-gray-400 to-gray-600' },
              { key: 'services', icon: '🛠️', bg: 'from-teal-400 to-green-400' },
              { key: 'travel_tickets', icon: '✈️', bg: 'from-cyan-400 to-blue-400' }
            ].map(cat => (
              <Link
                key={cat.key}
                to={`/catalog/${cat.key}`}
                className={`bg-gradient-to-r ${cat.bg} text-white rounded-lg p-4 lg:p-6 text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-2xl lg:text-4xl mb-2">{cat.icon}</div>
                <div className="font-semibold text-sm sm:text-base">{t[cat.key]}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 lg:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold">{t.featuredProducts}</h2>
            <Link to="/catalog" className="text-purple-600 hover:text-purple-700 font-semibold">
              {t.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Local Specialties */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.localSpecialties}</h2>
            <p className="text-gray-600">Découvrez l'artisanat et les produits authentiques du Cameroun</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {localProducts.map(product => (
              <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-purple-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.newsletter}</h2>
          <p className="text-lg sm:text-xl mb-6 lg:mb-8 opacity-90">Restez informé de nos dernières offres et nouveautés</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder={t.email}
              className="flex-1 px-4 py-3 text-black rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:outline-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none font-semibold transition-colors text-black">
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
    { key: 'clothing_accessories', name: { fr: 'Vêtements et Accessoires', en: 'Clothing & Accessories' } },
    { key: 'food_drinks', name: { fr: 'Aliments et Boissons', en: 'Food & Drinks' } },
    { key: 'electronics', name: { fr: 'Électroniques', en: 'Electronics' } },
    { key: 'home_garden', name: { fr: 'Maison & Jardinage', en: 'Home & Garden' } },
    { key: 'handicrafts', name: { fr: 'Artisanat', en: 'Handicrafts' } },
    { key: 'beauty_care', name: { fr: 'Beauté et Soins', en: 'Beauty & Care' } },
    { key: 'sports_articles', name: { fr: 'Articles Sportifs', en: 'Sports Articles' } },
    { key: 'toys', name: { fr: 'Jouets pour Enfants', en: 'Children\'s Toys' } },
    { key: 'medical_equipment', name: { fr: 'Matériel Médical', en: 'Medical Equipment' } },
    { key: 'professional_equipment', name: { fr: 'Équipements Pro', en: 'Professional Equipment' } },
    { key: 'services', name: { fr: 'Services', en: 'Services' } },
    { key: 'travel_tickets', name: { fr: 'Voyages et Billets', en: 'Travel & Tickets' } }
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

  const handleWhatsAppContact = () => {
    const message = generateProductWhatsAppMessage(product, language);
    openWhatsApp(product.sellerWhatsApp, message);
  };

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
                
                {/* WhatsApp Contact Button */}
                {product.sellerWhatsApp && (
                  <button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>📱</span>
                    <span>Contacter le vendeur sur WhatsApp</span>
                  </button>
                )}
              </div>
              
              {/* Seller Info Card */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Informations Vendeur</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={mockSellerData.profile.logo}
                    alt="Vendeur"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{mockSellerData.profile.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        {mockSellerData.profile.rating}
                      </span>
                      <span>{mockSellerData.profile.totalSales} ventes</span>
                    </div>
                    
                    {/* Seller Social Links */}
                    <div className="flex space-x-3 mt-3">
                      {mockSellerData.profile.socialMedia.whatsapp && (
                        <button
                          onClick={() => openWhatsApp(mockSellerData.profile.socialMedia.whatsapp)}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                          title="WhatsApp"
                        >
                          📱
                        </button>
                      )}
                      {mockSellerData.profile.socialMedia.facebook && (
                        <a
                          href={mockSellerData.profile.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                          title="Facebook"
                        >
                          📘
                        </a>
                      )}
                      {mockSellerData.profile.socialMedia.instagram && (
                        <a
                          href={mockSellerData.profile.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors"
                          title="Instagram"
                        >
                          📷
                        </a>
                      )}
                      {mockSellerData.profile.socialMedia.telegram && (
                        <a
                          href={mockSellerData.profile.socialMedia.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                          title="Telegram"
                        >
                          ✈️
                        </a>
                      )}
                    </div>
                  </div>
                </div>
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
    paymentMethod: 'mtnMoney',
    deliveryOption: 'home', // 'home' or 'pickup'
    selectedPickupPoint: ''
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = formData.deliveryOption === 'pickup' ? 0 : (subtotal > 50000 ? 0 : 2500); // Free shipping for pickup or orders over 50,000 XAF
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit}>
              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                </div>
              </div>
            
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">{t.shippingInfo}</h3>
                
                {/* Delivery Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-4">Option de Livraison</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="home"
                        checked={formData.deliveryOption === 'home'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🏠</span>
                        <div>
                          <span className="font-medium">Livraison à domicile</span>
                          <p className="text-sm text-gray-600">Livraison directe à votre adresse</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={formData.deliveryOption === 'pickup'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-xl mr-3">📍</span>
                        <div>
                          <span className="font-medium">Point de retrait</span>
                          <p className="text-sm text-gray-600">Retrait gratuit dans un point Nengoo</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Pickup Points Selection */}
                {formData.deliveryOption === 'pickup' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Choisir un Point de Retrait</label>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockSellerData.pickupPoints.map(point => (
                        <label key={point.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="selectedPickupPoint"
                            value={point.id}
                            checked={formData.selectedPickupPoint === point.id.toString()}
                            onChange={handleInputChange}
                            className="mr-3 mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-purple-700">{point.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{point.address}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              📞 {point.phone} • 🕒 {point.hours}
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {point.city}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Home Delivery Address Fields */}
                {formData.deliveryOption === 'home' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t.address}
                      required={formData.deliveryOption === 'home'}
                      className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={t.city}
                      required={formData.deliveryOption === 'home'}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder={t.region}
                      required={formData.deliveryOption === 'home'}
                      className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>
            
              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {t.placeOrder}
              </button>
            </form>
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
                  <span>
                    {formData.deliveryOption === 'pickup' ? 'Retrait gratuit' : t.shipping}
                  </span>
                  <span>{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.tax}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {formData.deliveryOption === 'pickup' && formData.selectedPickupPoint && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-purple-600">Point de retrait:</p>
                    <p className="text-sm text-gray-600">
                      {mockSellerData.pickupPoints.find(p => p.id.toString() === formData.selectedPickupPoint)?.name}
                    </p>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t.total}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// User Profile Component
export const UserProfile = (props) => {
  const { language, user, cartItems } = props;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    whatsapp: user?.whatsapp || '',
    email: user?.email || '',
    address: '',
    city: '',
    region: ''
  });
  
  // Mock data for user orders
  const userOrders = [
    {
      id: 'CMD001',
      date: '2025-01-15',
      status: 'delivered',
      total: 45000,
      items: [{ name: 'Robe Traditionnelle', quantity: 1, price: 45000 }]
    },
    {
      id: 'CMD002',
      date: '2025-01-10',
      status: 'in_transit',
      total: 125000,
      items: [{ name: 'Smartphone Android', quantity: 1, price: 125000 }]
    },
    {
      id: 'CMD003',
      date: '2025-01-05',
      status: 'delivered',
      total: 27500,
      items: [
        { name: 'Panier Artisanal', quantity: 1, price: 15000 },
        { name: 'Cosmétiques Naturels', quantity: 1, price: 12000 }
      ]
    }
  ];

  // Mock saved addresses
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      label: 'Domicile',
      name: 'Marie Kouam',
      address: 'Avenue de la Liberté, Akwa',
      city: 'Douala',
      phone: '+237655123456',
      isDefault: true
    },
    {
      id: 2,
      label: 'Bureau',
      name: 'Marie Kouam',
      address: 'Quartier des Affaires, Bonanjo',
      city: 'Douala',
      phone: '+237655123456',
      isDefault: false
    }
  ]);

  // Mock favorite pickup points
  const [favoritePickupPoints, setFavoritePickupPoints] = useState([
    {
      id: 1,
      name: 'Nengoo Point Douala Centre',
      address: 'Avenue de la Liberté, Douala',
      phone: '+237 233 456 789',
      hours: 'Lun-Sam: 8h-18h',
      city: 'Douala'
    },
    {
      id: 2,
      name: 'Nengoo Point Yaoundé Mvan',
      address: 'Quartier Mvan, Yaoundé',
      phone: '+237 222 345 678',
      hours: 'Lun-Sam: 8h-18h',
      city: 'Yaoundé'
    }
  ]);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'MTN Mobile Money',
      number: '+237 655 XXX 456',
      isDefault: true
    },
    {
      id: 2,
      type: 'Orange Money',
      number: '+237 699 XXX 789',
      isDefault: false
    }
  ]);

  const handleProfileUpdate = () => {
    setEditMode(false);
    alert('Profil mis à jour avec succès!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusTexts = {
      delivered: 'Livré',
      in_transit: 'En transit',
      processing: 'En cours',
      cancelled: 'Annulé'
    };
    return statusTexts[status] || status;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header {...props} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-8">Veuillez vous connecter pour accéder à votre profil.</p>
          <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Se connecter
          </Link>
        </div>
        <Footer language={language} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        {/* User Header */}
        <div className="bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl sm:text-5xl">👤</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{user.name}</h1>
              <p className="opacity-90">{user.whatsapp}</p>
              <p className="text-sm opacity-75 mt-1">Membre depuis {user.joinDate}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link to="/catalog" className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition-colors text-center">
                🛍️ Continuer mes achats
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">👤</span>
                  <span className="font-medium">Mes informations</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📦</span>
                  <span className="font-medium">Mes commandes</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'addresses' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📍</span>
                  <span className="font-medium">Mes adresses</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('pickup')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'pickup' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📍</span>
                  <span className="font-medium">Points de retrait</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'payment' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">💳</span>
                  <span className="font-medium">Moyens de paiement</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Informations personnelles</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    {editMode ? '✕ Annuler' : '✏️ Modifier'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro WhatsApp</label>
                    <input
                      type="tel"
                      value={profileData.whatsapp}
                      onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!editMode}
                      placeholder="votre.email@exemple.com"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  {editMode && (
                    <button
                      onClick={handleProfileUpdate}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Enregistrer les modifications
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Orders History Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Historique des commandes</h2>
                
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h3 className="font-bold text-lg">Commande #{order.id}</h3>
                            <p className="text-sm text-gray-600">Date: {order.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">{formatPrice(item.price)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="font-bold text-lg">Total: {formatPrice(order.total)}</span>
                          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                            Voir les détails →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-600 mb-4">Aucune commande pour le moment</p>
                    <Link to="/catalog" className="text-purple-600 hover:text-purple-700 font-semibold">
                      Commencer vos achats →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Adresses de livraison</h2>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    + Ajouter une adresse
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                          Par défaut
                        </span>
                      )}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl">📍</span>
                          <h3 className="font-bold">{address.label}</h3>
                        </div>
                        <p className="text-sm font-medium">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.city}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-semibold">
                          ✏️ Modifier
                        </button>
                        <button className="flex-1 text-red-600 hover:text-red-700 text-sm font-semibold">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite Pickup Points Tab */}
            {activeTab === 'pickup' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Points de retrait favoris</h2>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    + Ajouter un point
                  </button>
                </div>

                <div className="space-y-4">
                  {favoritePickupPoints.map((point) => (
                    <div key={point.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">📦</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{point.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">📍 {point.address}</p>
                          <p className="text-sm text-gray-600 mb-1">📞 {point.phone}</p>
                          <p className="text-sm text-gray-600 mb-1">🕐 {point.hours}</p>
                          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {point.city}
                          </span>
                        </div>
                        <button className="text-red-600 hover:text-red-700">
                          <span className="text-xl">🗑️</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Méthodes de paiement</h2>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                    + Ajouter un moyen
                  </button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                          💳
                        </div>
                        <div>
                          <h3 className="font-bold">{method.type}</h3>
                          <p className="text-sm text-gray-600">{method.number}</p>
                          {method.isDefault && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium mt-1 inline-block">
                              Par défaut
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                          ✏️ Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">ℹ️</span>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Moyens de paiement acceptés</h4>
                      <p className="text-sm text-blue-800">
                        Nous acceptons MTN Mobile Money, Orange Money, les cartes bancaires et le paiement à la livraison.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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

// Mock Seller Data
const mockSellerData = {
  profile: {
    name: "Boutique Afrique",
    email: "boutique@afrique.cm",
    phone: "+237 6XX XXX XXX",
    whatsapp: "+237655123456",
    address: "Douala, Cameroun",
    logo: "https://images.pexels.com/photos/16430537/pexels-photo-16430537.jpeg",
    description: "Spécialiste en produits traditionnels camerounais",
    rating: 4.8,
    totalSales: 1250,
    joinDate: "2024-01-15",
    socialMedia: {
      whatsapp: "+237655123456",
      facebook: "https://facebook.com/boutique.afrique.cm",
      instagram: "https://instagram.com/boutique_afrique",
      telegram: "https://t.me/boutiqueafrique"
    }
  },
  orders: [
    {
      id: "CMD001",
      customer: "Marie Nkomo",
      date: "2025-07-22",
      status: "pending",
      total: 45000,
      items: [
        { name: "Robe Traditionnelle", quantity: 1, price: 45000 }
      ]
    },
    {
      id: "CMD002", 
      customer: "Jean Baptiste",
      date: "2025-07-21",
      status: "shipped",
      total: 23500,
      items: [
        { name: "Panier Artisanal", quantity: 2, price: 15000 },
        { name: "Chapeaux Traditionnels", quantity: 1, price: 8500 }
      ]
    },
    {
      id: "CMD003",
      customer: "Aminata Sow",
      date: "2025-07-20", 
      status: "delivered",
      total: 12000,
      items: [
        { name: "Cosmétiques Naturels", quantity: 1, price: 12000 }
      ]
    }
  ],
  messages: [
    {
      id: 1,
      from: "Marie Nkomo",
      subject: "Question sur la taille",
      message: "Bonjour, pourriez-vous me confirmer les tailles disponibles pour la robe traditionnelle?",
      date: "2025-07-22",
      read: false
    },
    {
      id: 2,
      from: "Jean Baptiste", 
      subject: "Suivi de commande",
      message: "Bonjour, pouvez-vous me donner des nouvelles de ma commande CMD002?",
      date: "2025-07-21",
      read: true
    }
  ],
  pickupPoints: [
    {
      id: 1,
      name: "Nengoo Point Douala Centre",
      address: "Avenue de la Liberté, Douala",
      phone: "+237 233 456 789",
      hours: "Lun-Sam: 8h-18h",
      city: "Douala"
    },
    {
      id: 2,
      name: "Nengoo Point Yaoundé Mvan",
      address: "Quartier Mvan, Yaoundé",
      phone: "+237 222 345 678",
      hours: "Lun-Sam: 8h-18h",
      city: "Yaoundé"
    },
    {
      id: 3,
      name: "Nengoo Point Bafoussam",
      address: "Marché Central, Bafoussam",
      phone: "+237 233 567 890",
      hours: "Lun-Sam: 7h-17h",
      city: "Bafoussam"
    },
    {
      id: 4,
      name: "Nengoo Point Garoua",
      address: "Quartier Plateau, Garoua",
      phone: "+237 222 678 901",
      hours: "Lun-Sam: 8h-17h",
      city: "Garoua"
    }
  ]
};

// Mock Authentication Data
const mockUsers = {
  buyers: [
    {
      id: 1,
      whatsapp: "+237655123456",
      name: "Marie Kouam",
      joinDate: "2025-01-10",
      type: "buyer"
    }
  ],
  sellers: [
    {
      id: 1,
      whatsapp: "+237655123456",
      name: "Jean Baptiste",
      businessName: "Boutique Afrique",
      email: "boutique@afrique.cm",
      city: "Douala",
      categories: ["clothing_accessories", "handicrafts"],
      status: "approved",
      joinDate: "2024-01-15",
      type: "seller"
    }
  ],
  pendingSellers: [
    {
      id: 2,
      whatsapp: "+237655987654",
      name: "Aminata Sow",
      businessName: "Artisanat Cameroun",
      email: "artisanat@cameroun.cm",
      city: "Yaoundé",
      categories: ["handicrafts", "home_garden"],
      status: "pending",
      submitDate: "2025-07-22",
      type: "seller"
    }
  ]
};

const cameroonCities = [
  "Douala", "Yaoundé", "Bafoussam", "Garoua", "Maroua", "Bamenda", 
  "Ngaoundéré", "Bertoua", "Ebolowa", "Kumba", "Limbe", "Dschang"
];

// Seller Sidebar Component
const SellerSidebar = ({ currentPage, language }) => {
  const menuItems = [
    { key: 'dashboard', path: '/seller', icon: '📊', label: 'Tableau de Bord' },
    { key: 'products', path: '/seller/products', icon: '📦', label: 'Produits' },
    { key: 'orders', path: '/seller/orders', icon: '📋', label: 'Commandes' },
    { key: 'analytics', path: '/seller/analytics', icon: '📈', label: 'Analyses' },
    { key: 'messages', path: '/seller/messages', icon: '💬', label: 'Messages' },
    { key: 'profile', path: '/seller/profile', icon: '⚙️', label: 'Profil' }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sticky top-24">
      <div className="flex items-center mb-8">
        <img
          src={mockSellerData.profile.logo}
          alt="Logo"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-bold">{mockSellerData.profile.name}</h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">⭐</span>
            {mockSellerData.profile.rating}
          </div>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.key}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              currentPage === item.key 
                ? 'bg-purple-100 text-purple-700 font-semibold' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-8 pt-6 border-t">
        <Link
          to="/"
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <span className="text-xl">🏠</span>
          <span>Retour au Site</span>
        </Link>
      </div>
    </div>
  );
};

// Seller Header Component
const SellerHeader = ({ title, language }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center space-x-6 text-sm opacity-90">
        <span>📅 {new Date().toLocaleDateString('fr-FR')}</span>
        <span>🕒 {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>🏪 Espace Vendeur Nengoo</span>
      </div>
    </div>
  );
};

// Seller Dashboard Component
export const SellerDashboard = (props) => {
  const { language } = props;
  
  const stats = [
    { 
      title: "Ventes Totales", 
      value: "1,250", 
      icon: "💰", 
      color: "from-green-400 to-green-600",
      change: "+12%" 
    },
    { 
      title: "Commandes en Attente", 
      value: "8", 
      icon: "📋", 
      color: "from-yellow-400 to-orange-500",
      change: "+3" 
    },
    { 
      title: "Revenus du Mois", 
      value: "2,450,000 XAF", 
      icon: "📈", 
      color: "from-blue-400 to-blue-600",
      change: "+18%" 
    },
    { 
      title: "Produits Actifs", 
      value: "24", 
      icon: "📦", 
      color: "from-purple-400 to-purple-600",
      change: "+2" 
    }
  ];

  const recentOrders = mockSellerData.orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="dashboard" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Tableau de Bord Vendeur" language={language} />
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className={`bg-gradient-to-r ${stat.color} text-white rounded-lg p-6 shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm mt-1">
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                          {stat.change}
                        </span>
                      </p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Commandes Récentes</h2>
                  <Link to="/seller/orders" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Voir tout →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="border-l-4 border-purple-500 pl-4 py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-gray-600 text-sm">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">
                            {order.total.toLocaleString()} XAF
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status === 'pending' ? '⏳ En attente' :
                             order.status === 'shipped' ? '🚚 Expédiée' : '✅ Livrée'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6">Actions Rapides</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/seller/products"
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-semibold text-sm">Ajouter Produit</div>
                  </Link>
                  
                  <Link
                    to="/seller/orders"
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold text-sm">Gérer Commandes</div>
                  </Link>
                  
                  <Link
                    to="/seller/analytics"
                    className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold text-sm">Voir Analyses</div>
                  </Link>
                  
                  <Link
                    to="/seller/messages"
                    className="bg-gradient-to-r from-red-400 to-red-600 text-white p-4 rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-2xl mb-2">💬</div>
                    <div className="font-semibold text-sm">Messages</div>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-xl font-bold mb-6">Évolution des Ventes (7 derniers jours)</h2>
              <div className="h-64 bg-gradient-to-t from-purple-50 to-transparent rounded-lg flex items-end justify-around p-4">
                {[120, 150, 80, 200, 180, 250, 300].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-purple-500 to-purple-300 rounded-t w-8"
                      style={{ height: `${(value / 300) * 200}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-gray-600">
                      {new Date(Date.now() - (6-index) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};
// Seller Products Management Component
export const SellerProducts = (props) => {
  const { language, addToCart } = props;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState(mockProducts);
  const [newProduct, setNewProduct] = useState({
    name: { fr: '', en: '' },
    category: 'clothing_accessories',
    price: 0,
    image: '',
    description: { fr: '', en: '' },
    stock: 0,
    inStock: true
  });

  const handleAddProduct = (e) => {
    e.preventDefault();
    const product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id)) + 1,
      rating: 0,
      reviews: 0
    };
    setProducts([...products, product]);
    setNewProduct({
      name: { fr: '', en: '' },
      category: 'clothing_accessories', 
      price: 0,
      image: '',
      description: { fr: '', en: '' },
      stock: 0,
      inStock: true
    });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="products" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Gestion des Produits" language={language} />
            
            {/* Actions Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Mes Produits ({products.length})</h2>
                  <p className="text-gray-600">Gérez votre catalogue de produits</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  ➕ Ajouter un Produit
                </button>
              </div>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">Ajouter un Nouveau Produit</h3>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom (Français)</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name.fr}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          name: { ...newProduct.name, fr: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom (Anglais)</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name.en}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          name: { ...newProduct.name, en: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Catégorie</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="clothing_accessories">Vêtements et Accessoires</option>
                        <option value="food_drinks">Aliments et Boissons</option>
                        <option value="electronics">Électroniques</option>
                        <option value="home_garden">Maison & Jardinage</option>
                        <option value="handicrafts">Artisanat et Produits Faits Main</option>
                        <option value="beauty_care">Produits de Beauté et Soins Personnels</option>
                        <option value="sports_articles">Articles Sportifs</option>
                        <option value="toys">Jouets pour Enfants</option>
                        <option value="medical_equipment">Matériel Médical</option>
                        <option value="professional_equipment">Équipements Professionnels</option>
                        <option value="services">Services</option>
                        <option value="travel_tickets">Voyages et Billets</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Prix (XAF)</label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <input
                        type="url"
                        required
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock</label>
                      <input
                        type="number"
                        required
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ 
                          ...newProduct, 
                          stock: parseInt(e.target.value),
                          inStock: parseInt(e.target.value) > 0
                        })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Français)</label>
                    <textarea
                      required
                      value={newProduct.description.fr}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        description: { ...newProduct.description, fr: e.target.value }
                      })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Anglais)</label>
                    <textarea
                      required
                      value={newProduct.description.en}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        description: { ...newProduct.description, en: e.target.value }
                      })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Ajouter le Produit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name[language]}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg text-sm transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                    {product.inStock ? (
                      <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                        En Stock
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        Rupture
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name[language]}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-purple-600">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-sm">{product.rating} ({product.reviews})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description[language]}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock || 'N/A'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {translations[language][product.category]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Seller Orders Management Component
export const SellerOrders = (props) => {
  const { language } = props;
  const [orders, setOrders] = useState(mockSellerData.orders);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="orders" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Gestion des Commandes" language={language} />
            
            {/* Filters and Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold">Mes Commandes ({filteredOrders.length})</h2>
                  <p className="text-gray-600">Gérez le statut de vos commandes</p>
                </div>
                <div className="flex space-x-2">
                  {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {status === 'all' ? 'Toutes' : getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div>
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-bold">Commande {order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-2">
                        <span>👤 {order.customer}</span>
                        <span>📅 {order.date}</span>
                        <span className="font-semibold text-purple-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending">En attente</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Détails
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Articles commandés:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-600">
                  {filterStatus === 'all' 
                    ? "Vous n'avez pas encore de commandes."
                    : `Aucune commande avec le statut "${getStatusText(filterStatus)}".`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Seller Analytics Component
export const SellerAnalytics = (props) => {
  const { language } = props;
  
  const analyticsData = {
    revenue: {
      daily: [120000, 150000, 80000, 200000, 180000, 250000, 300000],
      monthly: [2450000, 2800000, 3200000, 2900000, 3500000, 3800000],
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
    },
    topProducts: [
      { name: 'Robe Traditionnelle', sales: 45, revenue: 2025000 },
      { name: 'Panier Artisanal', sales: 32, revenue: 480000 },
      { name: 'Chapeaux Traditionnels', sales: 28, revenue: 238000 },
      { name: 'Cosmétiques Naturels', sales: 24, revenue: 288000 },
      { name: 'Grains Biologiques', sales: 18, revenue: 63000 }
    ],
    demographics: {
      age: [
        { range: '18-25', percentage: 25 },
        { range: '26-35', percentage: 35 },
        { range: '36-45', percentage: 25 },
        { range: '46+', percentage: 15 }
      ],
      cities: [
        { city: 'Douala', percentage: 40 },
        { city: 'Yaoundé', percentage: 30 },
        { city: 'Bafoussam', percentage: 15 },
        { city: 'Garoua', percentage: 10 },
        { city: 'Autres', percentage: 5 }
      ]
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="analytics" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Analyses et Statistiques" language={language} />
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { title: 'Revenus Total', value: '18,500,000 XAF', change: '+15%', icon: '💰', color: 'from-green-400 to-green-600' },
                { title: 'Commandes', value: '847', change: '+12%', icon: '📦', color: 'from-blue-400 to-blue-600' },
                { title: 'Clients', value: '456', change: '+8%', icon: '👥', color: 'from-purple-400 to-purple-600' },
                { title: 'Taux Conversion', value: '3.2%', change: '+0.5%', icon: '📊', color: 'from-orange-400 to-red-500' }
              ].map((metric, index) => (
                <div key={index} className={`bg-gradient-to-r ${metric.color} text-white rounded-lg p-6 shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm mt-1 bg-white bg-opacity-20 px-2 py-1 rounded inline-block">
                        {metric.change}
                      </p>
                    </div>
                    <div className="text-3xl">{metric.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Évolution du Chiffre d'Affaires</h3>
                <div className="h-64 bg-gradient-to-t from-purple-50 to-transparent rounded-lg flex items-end justify-around p-4">
                  {analyticsData.revenue.monthly.map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-gradient-to-t from-purple-500 to-purple-300 rounded-t w-12"
                        style={{ height: `${(value / Math.max(...analyticsData.revenue.monthly)) * 200}px` }}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600">
                        {analyticsData.revenue.labels[index]}
                      </span>
                      <span className="text-xs text-purple-600 font-semibold">
                        {(value / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Produits les Plus Vendus</h3>
                <div className="space-y-4">
                  {analyticsData.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} ventes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">
                          {formatPrice(product.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Age Demographics */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Répartition par Âge</h3>
                <div className="space-y-4">
                  {analyticsData.demographics.age.map((group, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{group.range} ans</span>
                        <span className="font-bold">{group.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                          style={{ width: `${group.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6">Répartition Géographique</h3>
                <div className="space-y-4">
                  {analyticsData.demographics.cities.map((location, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{location.city}</span>
                        <span className="font-bold">{location.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Seller Profile Component
export const SellerProfile = (props) => {
  const { language } = props;
  const [profileData, setProfileData] = useState(mockSellerData.profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would save to backend
    alert('Profil mis à jour avec succès!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="profile" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Profil Vendeur" language={language} />
            
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Informations du Profil</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  {isEditing ? 'Annuler' : '✏️ Modifier'}
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center space-x-6 mb-8">
                  <img
                    src={profileData.logo}
                    alt="Logo"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                  />
                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium mb-2">URL du Logo</label>
                      <input
                        type="url"
                        value={profileData.logo}
                        onChange={(e) => setProfileData({ ...profileData, logo: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom de la Boutique</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-800">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-800">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-800">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Adresse</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-lg text-gray-800">{profileData.address}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description de la Boutique</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="text-lg text-gray-800">{profileData.description}</p>
                  )}
                </div>

                {/* Social Media Links */}
                <div>
                  <label className="block text-sm font-medium mb-4">Réseaux Sociaux</label>
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">WhatsApp</label>
                        <input
                          type="tel"
                          value={profileData.socialMedia?.whatsapp || ''}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialMedia: { ...profileData.socialMedia, whatsapp: e.target.value }
                          })}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                        <input
                          type="url"
                          value={profileData.socialMedia?.facebook || ''}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialMedia: { ...profileData.socialMedia, facebook: e.target.value }
                          })}
                          placeholder="https://facebook.com/..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                        <input
                          type="url"
                          value={profileData.socialMedia?.instagram || ''}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialMedia: { ...profileData.socialMedia, instagram: e.target.value }
                          })}
                          placeholder="https://instagram.com/..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Telegram</label>
                        <input
                          type="url"
                          value={profileData.socialMedia?.telegram || ''}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            socialMedia: { ...profileData.socialMedia, telegram: e.target.value }
                          })}
                          placeholder="https://t.me/..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      {profileData.socialMedia?.whatsapp && (
                        <button
                          onClick={() => openWhatsApp(profileData.socialMedia.whatsapp)}
                          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <span>📱</span>
                          <span>WhatsApp</span>
                        </button>
                      )}
                      {profileData.socialMedia?.facebook && (
                        <a
                          href={profileData.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <span>📘</span>
                          <span>Facebook</span>
                        </a>
                      )}
                      {profileData.socialMedia?.instagram && (
                        <a
                          href={profileData.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          <span>📷</span>
                          <span>Instagram</span>
                        </a>
                      )}
                      {profileData.socialMedia?.telegram && (
                        <a
                          href={profileData.socialMedia.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <span>✈️</span>
                          <span>Telegram</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Sauvegarder les Modifications
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Note Moyenne</p>
                    <p className="text-3xl font-bold">{profileData.rating} ⭐</p>
                    <p className="text-sm opacity-75">Très bon vendeur</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Ventes</p>
                    <p className="text-3xl font-bold">{profileData.totalSales}</p>
                    <p className="text-sm opacity-75">Commandes livrées</p>
                  </div>
                  <div className="text-4xl">📦</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Membre Depuis</p>
                    <p className="text-2xl font-bold">
                      {new Date(profileData.joinDate).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-sm opacity-75">Vendeur actif</p>
                  </div>
                  <div className="text-4xl">🕐</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Login Component
export const Login = (props) => {
  const { language, setUser } = props;
  const navigate = useNavigate();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🛍️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue sur Nengoo</h1>
              <p className="text-gray-600">Choisissez votre type de compte</p>
            </div>

            <div className="space-y-4">
              <Link
                to="/signup/buyer"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-center block hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <div className="font-bold">{t.loginAsBuyer}</div>
                    <div className="text-sm opacity-90">Acheter des produits</div>
                  </div>
                </div>
              </Link>

              <Link
                to="/signup/seller"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-center block hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🏪</span>
                  <div>
                    <div className="font-bold">{t.loginAsSeller}</div>
                    <div className="text-sm opacity-90">Vendre vos produits</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm">
                {t.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Buyer Signup Component
export const BuyerSignup = (props) => {
  const { language, setUser } = props;
  const navigate = useNavigate();
  const t = translations[language];
  const [formData, setFormData] = useState({
    whatsapp: '',
    name: ''
  });
  const [isLogin, setIsLogin] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Check if user exists
      const existingUser = mockUsers.buyers.find(user => user.whatsapp === formData.whatsapp);
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('nengoo-user', JSON.stringify(existingUser));
        navigate('/');
      } else {
        alert('Numéro WhatsApp non trouvé. Veuillez vous inscrire d\'abord.');
      }
    } else {
      // Register new buyer
      const newBuyer = {
        id: mockUsers.buyers.length + 1,
        whatsapp: formData.whatsapp,
        name: formData.name,
        joinDate: new Date().toISOString().split('T')[0],
        type: "buyer"
      };
      
      mockUsers.buyers.push(newBuyer);
      setUser(newBuyer);
      localStorage.setItem('nengoo-user', JSON.stringify(newBuyer));
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">👤</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? t.buyerLogin : t.signupAsBuyer}
              </h1>
              <p className="text-gray-600">
                {isLogin ? t.welcomeBack : "Créez votre compte acheteur"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t.whatsappNumber}</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="+237 6XX XXX XXX"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                {isLogin ? t.login : t.createAccount}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isLogin ? t.noAccount : t.haveAccount} {isLogin ? t.signup : t.login}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-700 text-sm">
                ← Choisir un autre type de compte
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Seller Signup Component  
export const SellerSignup = (props) => {
  const { language, setUser } = props;
  const navigate = useNavigate();
  const t = translations[language];
  const [formData, setFormData] = useState({
    whatsapp: '',
    name: '',
    businessName: '',
    email: '',
    city: '',
    categories: []
  });
  const [isLogin, setIsLogin] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Check if seller exists and is approved
      const existingSeller = mockUsers.sellers.find(user => user.whatsapp === formData.whatsapp);
      if (existingSeller && existingSeller.status === 'approved') {
        setUser(existingSeller);
        localStorage.setItem('nengoo-user', JSON.stringify(existingSeller));
        navigate('/seller');
      } else {
        alert('Compte vendeur non trouvé ou non approuvé. Veuillez contacter l\'administrateur.');
      }
    } else {
      // Register new seller
      const newSeller = {
        id: mockUsers.pendingSellers.length + 1,
        whatsapp: formData.whatsapp,
        name: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        city: formData.city,
        categories: formData.categories,
        status: 'pending',
        submitDate: new Date().toISOString().split('T')[0],
        type: 'seller'
      };
      
      mockUsers.pendingSellers.push(newSeller);
      navigate('/pending-approval', { state: { seller: newSeller } });
    }
  };

  const categoryOptions = [
    { key: 'clothing_accessories', label: 'Vêtements et Accessoires', icon: '👗' },
    { key: 'food_drinks', label: 'Aliments et Boissons', icon: '🍽️' },
    { key: 'electronics', label: 'Électroniques', icon: '📱' },
    { key: 'home_garden', label: 'Maison & Jardinage', icon: '🏠' },
    { key: 'handicrafts', label: 'Artisanat et Produits Faits Main', icon: '🎨' },
    { key: 'beauty_care', label: 'Produits de Beauté et Soins Personnels', icon: '💄' },
    { key: 'sports_articles', label: 'Articles Sportifs', icon: '⚽' },
    { key: 'toys', label: 'Jouets pour Enfants', icon: '🧸' },
    { key: 'medical_equipment', label: 'Matériel Médical', icon: '🏥' },
    { key: 'professional_equipment', label: 'Équipements Professionnels', icon: '🔧' },
    { key: 'services', label: 'Services', icon: '🛠️' },
    { key: 'travel_tickets', label: 'Voyages et Billets', icon: '✈️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🏪</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? t.sellerLogin : t.signupAsSeller}
              </h1>
              <p className="text-gray-600">
                {isLogin ? t.welcomeBack : "Inscrivez-vous pour vendre vos produits"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.whatsappNumber} *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XXX XXX"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.businessName} *</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Nom de votre entreprise"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.email} *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.city} *</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">{t.selectCity}</option>
                        {cameroonCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-4">{t.selectCategories} *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categoryOptions.map(category => (
                      <label key={category.key} className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category.key)}
                          onChange={() => handleCategoryChange(category.key)}
                          className="sr-only"
                        />
                        <div className={`text-2xl mb-1 ${formData.categories.includes(category.key) ? 'opacity-100' : 'opacity-50'}`}>
                          {category.icon}
                        </div>
                        <span className={`text-xs text-center ${formData.categories.includes(category.key) ? 'font-semibold text-purple-700' : 'text-gray-600'}`}>
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.categories.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">Veuillez sélectionner au moins une catégorie</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!isLogin && formData.categories.length === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogin ? t.login : "Soumettre ma candidature"}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                {isLogin ? t.noAccount : t.haveAccount} {isLogin ? "S'inscrire" : t.login}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-700 text-sm">
                ← Choisir un autre type de compte
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Pending Approval Component
export const PendingApproval = (props) => {
  const { language } = props;
  const t = translations[language];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">⏳</div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {t.pendingApproval}
            </h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 text-left">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📢</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    {t.approvalMessage}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Prochaines étapes :</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span className="text-sm">Votre demande a été reçue</span>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-3">⏳</span>
                  <span className="text-sm">Vérification en cours par notre équipe</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">📱</span>
                  <span className="text-sm text-gray-600">Confirmation par WhatsApp (en attente)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">🏪</span>
                  <span className="text-sm text-gray-600">Accès à votre espace vendeur (en attente)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Temps de traitement :</strong> 24-48 heures ouvrables
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Link
                  to="/"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {t.backToHome}
                </Link>
                <button
                  onClick={() => openWhatsApp("+237655123456", "Bonjour, je voudrais avoir des nouvelles concernant ma demande d'inscription vendeur sur Nengoo.")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <span>📱</span>
                  <span>Contacter le Support</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-500">
              <p>Référence de demande : #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer language={language} />
    </div>
  );
};

// Seller Messages Component
export const SellerMessages = (props) => {
  const { language } = props;
  const [messages, setMessages] = useState(mockSellerData.messages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const sendReply = (e) => {
    e.preventDefault();
    if (reply.trim() && selectedMessage) {
      // Mock sending reply
      alert('Réponse envoyée avec succès!');
      setReply('');
      setSelectedMessage(null);
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar currentPage="messages" language={language} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SellerHeader title="Messages et Communications" language={language} />
            
            {/* Messages Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Centre de Messages</h2>
                  <p className="text-gray-600">
                    {messages.length} message(s) total, {unreadCount} non lu(s)
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                    {unreadCount} nouveau(x)
                  </div>
                )}
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    !message.read ? 'border-l-4 border-purple-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {message.from.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{message.from}</h3>
                        <p className="text-gray-600">{message.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{message.date}</p>
                      {!message.read && (
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mt-2"></span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-2">{message.message}</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(message);
                        markAsRead(message.id);
                      }}
                    >
                      Répondre
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Marquer comme lu
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Aucun message</h3>
                <p className="text-gray-600">Vous n'avez pas encore reçu de messages.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Répondre à {selectedMessage.from}</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">Sujet: {selectedMessage.subject}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Message original:</p>
                <p className="text-gray-800">{selectedMessage.message}</p>
                <p className="text-xs text-gray-500 mt-2">{selectedMessage.date}</p>
              </div>
              
              <form onSubmit={sendReply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Votre réponse:</label>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    rows={6}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Envoyer la Réponse
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <Footer language={language} />
    </div>
  );

};

// =============================================================================
// ADMIN COMPONENTS
// =============================================================================

// Admin Mock Data
const adminMockData = {
  // Numéro WhatsApp admin et code d'accès
  adminCredentials: {
    whatsapp: '+237600000000',
    accessCode: 'ADMIN2025'
  },
  
  // Statistiques globales
  stats: {
    totalUsers: 1250,
    totalSellers: 45,
    totalProducts: 389,
    totalOrders: 567,
    totalRevenue: 45680000,
    pendingSellers: 12,
    activeOrders: 34
  },
  
  // Liste des acheteurs
  buyers: [
    { id: 1, name: 'Marie Kouam', whatsapp: '+237655123456', joinDate: '2025-01-10', orders: 5, spent: 245000, status: 'active' },
    { id: 2, name: 'Jean Mbarga', whatsapp: '+237699234567', joinDate: '2025-01-12', orders: 3, spent: 156000, status: 'active' },
    { id: 3, name: 'Sophie Nkomo', whatsapp: '+237677345678', joinDate: '2025-01-15', orders: 8, spent: 389000, status: 'active' },
    { id: 4, name: 'Paul Etame', whatsapp: '+237655456789', joinDate: '2025-01-18', orders: 2, spent: 98000, status: 'suspended' }
  ],
  
  // Liste des vendeurs
  sellers: [
    { id: 1, name: 'Boutique Marie', whatsapp: '+237655111222', businessName: 'Mode Africaine', city: 'Douala', categories: ['Vêtements'], joinDate: '2024-12-01', products: 45, sales: 1250000, status: 'approved' },
    { id: 2, name: 'Tech Store CM', whatsapp: '+237699222333', businessName: 'Electronics Pro', city: 'Yaoundé', categories: ['Électroniques'], joinDate: '2024-12-15', products: 89, sales: 3450000, status: 'approved' },
    { id: 3, name: 'Artisan Local', whatsapp: '+237677333444', businessName: 'Artisanat Camerounais', city: 'Bafoussam', categories: ['Artisanat'], joinDate: '2025-01-05', products: 23, sales: 567000, status: 'approved' }
  ],
  
  // Vendeurs en attente
  pendingSellers: [
    { id: 1, name: 'Nouveau Vendeur 1', whatsapp: '+237655777888', businessName: 'Beauty Shop', city: 'Douala', categories: ['Beauté'], submitDate: '2025-01-20', email: 'beauty@example.com' },
    { id: 2, name: 'Nouveau Vendeur 2', whatsapp: '+237699888999', businessName: 'Sports Arena', city: 'Yaoundé', categories: ['Sports'], submitDate: '2025-01-21', email: 'sports@example.com' },
    { id: 3, name: 'Nouveau Vendeur 3', whatsapp: '+237677999000', businessName: 'Food Corner', city: 'Garoua', categories: ['Aliments'], submitDate: '2025-01-22', email: 'food@example.com' }
  ],
  
  // Liste de tous les produits
  allProducts: [
    { id: 1, name: 'Robe Traditionnelle', seller: 'Boutique Marie', category: 'Vêtements', price: 45000, stock: 12, status: 'approved', addedDate: '2025-01-10' },
    { id: 2, name: 'Smartphone Android', seller: 'Tech Store CM', category: 'Électroniques', price: 125000, stock: 8, status: 'approved', addedDate: '2025-01-11' },
    { id: 3, name: 'Panier Artisanal', seller: 'Artisan Local', category: 'Artisanat', price: 15000, stock: 25, status: 'approved', addedDate: '2025-01-12' },
    { id: 4, name: 'Produit Suspect', seller: 'Vendeur Test', category: 'Divers', price: 5000, stock: 100, status: 'pending', addedDate: '2025-01-22' }
  ],
  
  // Liste de toutes les commandes
  allOrders: [
    { id: 'CMD001', buyer: 'Marie Kouam', seller: 'Boutique Marie', date: '2025-01-20', status: 'delivered', total: 45000, items: 1 },
    { id: 'CMD002', buyer: 'Jean Mbarga', seller: 'Tech Store CM', date: '2025-01-21', status: 'in_transit', total: 125000, items: 1 },
    { id: 'CMD003', buyer: 'Sophie Nkomo', seller: 'Artisan Local', date: '2025-01-22', status: 'processing', total: 27500, items: 2 },
    { id: 'CMD004', buyer: 'Paul Etame', seller: 'Boutique Marie', date: '2025-01-22', status: 'cancelled', total: 98000, items: 3 }
  ]
};

// Admin Login Component
export const AdminLogin = (props) => {
  const { language, setUser } = props;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    whatsapp: '',
    accessCode: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier les identifiants admin
    if (formData.whatsapp === adminMockData.adminCredentials.whatsapp && 
        formData.accessCode === adminMockData.adminCredentials.accessCode) {
      
      const adminUser = {
        id: 'admin',
        name: 'Administrateur',
        whatsapp: formData.whatsapp,
        type: 'admin',
        joinDate: '2024-01-01'
      };
      
      setUser(adminUser);
      localStorage.setItem('nengoo-user', JSON.stringify(adminUser));
      navigate('/admin/dashboard');
    } else {
      setError('Identifiants administrateur incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-red-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Accès Administrateur</h1>
            <p className="text-gray-600">Connectez-vous pour gérer Nengoo</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro WhatsApp Administrateur
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="+237 XXX XXX XXX"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code d'accès
              </label>
              <input
                type="password"
                name="accessCode"
                value={formData.accessCode}
                onChange={handleInputChange}
                placeholder="Entrez le code d'accès"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-600 hover:text-gray-700 text-sm">
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 text-center">
              🔒 Accès réservé aux administrateurs autorisés uniquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
export const AdminDashboard = (props) => {
  const { language, user, setUser } = props;
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sellers, setSellers] = useState(adminMockData.sellers);
  const [pendingSellers, setPendingSellers] = useState(adminMockData.pendingSellers);
  const [buyers, setBuyers] = useState(adminMockData.buyers);
  const [products, setProducts] = useState(adminMockData.allProducts);
  const [orders, setOrders] = useState(adminMockData.allOrders);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentCode: '',
    newCode: '',
    confirmCode: ''
  });

  // States pour les modals d'édition
  const [editingSeller, setEditingSeller] = useState(null);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  
  // Vérifier si l'utilisateur est super admin
  const isSuperAdmin = user && user.whatsapp === '+237600000000';

  // Vérifier si l'utilisateur est admin
  if (!user || user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">Vous n'avez pas les permissions nécessaires.</p>
          <Link to="/admin/login" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
            Se connecter en tant qu'admin
          </Link>
        </div>
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

  const approveSeller = (sellerId) => {
    const seller = pendingSellers.find(s => s.id === sellerId);
    if (seller) {
      const approvedSeller = {
        ...seller,
        status: 'approved',
        products: 0,
        sales: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setSellers([...sellers, approvedSeller]);
      setPendingSellers(pendingSellers.filter(s => s.id !== sellerId));
      alert(`✅ Vendeur "${seller.businessName}" approuvé avec succès!`);
    }
  };

  const rejectSeller = (sellerId) => {
    const seller = pendingSellers.find(s => s.id === sellerId);
    if (seller && confirm(`Êtes-vous sûr de vouloir rejeter la demande de "${seller.businessName}"?`)) {
      setPendingSellers(pendingSellers.filter(s => s.id !== sellerId));
      alert(`❌ Demande de "${seller.businessName}" rejetée.`);
    }
  };

  const toggleSellerStatus = (sellerId) => {
    setSellers(sellers.map(s => 
      s.id === sellerId 
        ? { ...s, status: s.status === 'approved' ? 'suspended' : 'approved' }
        : s
    ));
  };

  const toggleBuyerStatus = (buyerId) => {
    setBuyers(buyers.map(b => 
      b.id === buyerId 
        ? { ...b, status: b.status === 'active' ? 'suspended' : 'active' }
        : b
    ));
  };

  const approveProduct = (productId) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: 'approved' } : p
    ));
    alert('✅ Produit approuvé!');
  };

  const rejectProduct = (productId) => {
    if (confirm('Êtes-vous sûr de vouloir rejeter ce produit?')) {
      setProducts(products.filter(p => p.id !== productId));
      alert('❌ Produit rejeté et supprimé.');
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = () => {
    // Validation
    if (!profileData.name) {
      alert('⚠️ Le nom est requis');
      return;
    }

    // Si changement de code d'accès
    if (profileData.newCode) {
      if (profileData.currentCode !== 'ADMIN2025') {
        alert('❌ Code d\'accès actuel incorrect');
        return;
      }
      if (profileData.newCode !== profileData.confirmCode) {
        alert('❌ Les nouveaux codes ne correspondent pas');
        return;
      }
      if (profileData.newCode.length < 8) {
        alert('⚠️ Le nouveau code doit contenir au moins 8 caractères');
        return;
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email
    };

    setUser(updatedUser);
    localStorage.setItem('nengoo-user', JSON.stringify(updatedUser));
    setShowProfileEdit(false);
    
    if (profileData.newCode) {
      alert(`✅ Profil mis à jour avec succès!\n\nNouveau code d'accès: ${profileData.newCode}\n\n⚠️ Sauvegardez ce code, vous en aurez besoin pour votre prochaine connexion!`);
    } else {
      alert('✅ Profil mis à jour avec succès!');
    }
    
    // Réinitialiser le formulaire
    setProfileData({
      name: updatedUser.name,
      email: updatedUser.email,
      currentCode: '',
      newCode: '',
      confirmCode: ''
    });
  };

  // Fonctions de modification pour super admin
  const handleEditSeller = (seller) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut modifier les vendeurs');
      return;
    }
    setEditingSeller({ ...seller });
  };

  const handleUpdateSeller = () => {
    setSellers(sellers.map(s => 
      s.id === editingSeller.id ? editingSeller : s
    ));
    setEditingSeller(null);
    alert('✅ Vendeur mis à jour avec succès!');
  };

  const handleEditBuyer = (buyer) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut modifier les acheteurs');
      return;
    }
    setEditingBuyer({ ...buyer });
  };

  const handleUpdateBuyer = () => {
    setBuyers(buyers.map(b => 
      b.id === editingBuyer.id ? editingBuyer : b
    ));
    setEditingBuyer(null);
    alert('✅ Acheteur mis à jour avec succès!');
  };

  const handleEditProduct = (product) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut modifier les produits');
      return;
    }
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = () => {
    setProducts(products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);
    alert('✅ Produit mis à jour avec succès!');
  };

  const handleEditOrder = (order) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut modifier les commandes');
      return;
    }
    setEditingOrder({ ...order });
  };

  const handleUpdateOrder = () => {
    setOrders(orders.map(o => 
      o.id === editingOrder.id ? editingOrder : o
    ));
    setEditingOrder(null);
    alert('✅ Commande mise à jour avec succès!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-purple-700 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg p-2">
                <span className="text-2xl font-bold text-purple-700">🔧</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panneau Administrateur</h1>
                <p className="text-sm opacity-90">Gestion de Nengoo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">👤 {user.name}</span>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>Modifier Profil</span>
              </button>
              <Link to="/" className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                ← Retour au site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Edit Profile */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">✏️ Modifier Mon Profil</h2>
                <p className="text-sm text-gray-600">Super Administrateur - {user.whatsapp}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowProfileEdit(false);
                    setActiveSection('dashboard');
                  }}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  <span>🏠</span>
                  <span>Tableau de bord</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileEdit(false);
                    setProfileData({
                      name: user.name,
                      email: user.email || '',
                      currentCode: '',
                      newCode: '',
                      confirmCode: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Informations Personnelles */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h3 className="font-bold text-purple-900 mb-4">📋 Informations Personnelles</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="admin@nengoo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro WhatsApp (non modifiable)
                    </label>
                    <input
                      type="text"
                      value={user.whatsapp}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Votre numéro WhatsApp est votre identifiant unique
                    </p>
                  </div>
                </div>
              </div>

              {/* Sécurité - Changement de code */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h3 className="font-bold text-red-900 mb-4">🔐 Changer le Code d'Accès</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code d'accès actuel
                    </label>
                    <input
                      type="password"
                      name="currentCode"
                      value={profileData.currentCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Entrez votre code actuel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau code d'accès
                    </label>
                    <input
                      type="password"
                      name="newCode"
                      value={profileData.newCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Minimum 8 caractères"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau code
                    </label>
                    <input
                      type="password"
                      name="confirmCode"
                      value={profileData.confirmCode}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Retapez le nouveau code"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Si vous changez votre code, vous devrez l'utiliser lors de votre prochaine connexion. Laissez vide pour conserver le code actuel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleProfileUpdate}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Enregistrer les Modifications
                </button>
                <button
                  onClick={() => {
                    setShowProfileEdit(false);
                    setProfileData({
                      name: user.name,
                      email: user.email || '',
                      currentCode: '',
                      newCode: '',
                      confirmCode: ''
                    });
                  }}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'dashboard' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span className="font-medium text-sm">Tableau de bord</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('sellers')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'sellers' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🏪</span>
                  <span className="font-medium text-sm">Vendeurs</span>
                  {pendingSellers.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingSellers.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveSection('buyers')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'buyers' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">👥</span>
                  <span className="font-medium text-sm">Acheteurs</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('products')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'products' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📦</span>
                  <span className="font-medium text-sm">Produits</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === 'orders' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🛒</span>
                  <span className="font-medium text-sm">Commandes</span>
                </button>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <Link
                  to="/admin/management"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-purple-50 border-2 border-purple-300 bg-purple-50"
                >
                  <span className="text-xl">👑</span>
                  <span className="font-medium text-sm text-purple-700">Administrateurs</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Tableau de bord</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                        <p className="text-3xl font-bold text-purple-600">{adminMockData.stats.totalUsers}</p>
                      </div>
                      <div className="text-4xl">👥</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Vendeurs</p>
                        <p className="text-3xl font-bold text-blue-600">{adminMockData.stats.totalSellers}</p>
                      </div>
                      <div className="text-4xl">🏪</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Produits</p>
                        <p className="text-3xl font-bold text-green-600">{adminMockData.stats.totalProducts}</p>
                      </div>
                      <div className="text-4xl">📦</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Revenus</p>
                        <p className="text-2xl font-bold text-red-600">{formatPrice(adminMockData.stats.totalRevenue)}</p>
                      </div>
                      <div className="text-4xl">💰</div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">⚠️</span>
                      <div>
                        <h3 className="font-bold text-yellow-800 mb-1">Demandes en attente</h3>
                        <p className="text-yellow-700">{adminMockData.stats.pendingSellers} vendeurs attendent une approbation</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">📦</span>
                      <div>
                        <h3 className="font-bold text-blue-800 mb-1">Commandes actives</h3>
                        <p className="text-blue-700">{adminMockData.stats.activeOrders} commandes en cours de traitement</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sellers Management Section */}
            {activeSection === 'sellers' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Gestion des vendeurs</h2>
                
                {/* Pending Sellers */}
                {pendingSellers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="text-yellow-500 mr-2">⏳</span>
                      Demandes en attente ({pendingSellers.length})
                    </h3>
                    <div className="space-y-4">
                      {pendingSellers.map((seller) => (
                        <div key={seller.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <h4 className="font-bold text-lg mb-2">{seller.businessName}</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>👤 Propriétaire: {seller.name}</p>
                                <p>📱 WhatsApp: {seller.whatsapp}</p>
                                <p>📧 Email: {seller.email}</p>
                                <p>📍 Ville: {seller.city}</p>
                                <p>🏷️ Catégories: {seller.categories.join(', ')}</p>
                                <p>📅 Soumis le: {seller.submitDate}</p>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => approveSeller(seller.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                ✅ Approuver
                              </button>
                              <button
                                onClick={() => rejectSeller(seller.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                ❌ Rejeter
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Sellers */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Vendeurs actifs ({sellers.length})
                  </h3>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sellers.map((seller) => (
                          <tr key={seller.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{seller.businessName}</p>
                                <p className="text-sm text-gray-500">{seller.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">{seller.city}</td>
                            <td className="px-6 py-4 text-sm">{seller.products}</td>
                            <td className="px-6 py-4 text-sm font-medium">{formatPrice(seller.sales)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                seller.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {seller.status === 'approved' ? 'Actif' : 'Suspendu'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-3">
                                {isSuperAdmin && (
                                  <button
                                    onClick={() => handleEditSeller(seller)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                  >
                                    ✏️ Modifier
                                  </button>
                                )}
                                <button
                                  onClick={() => toggleSellerStatus(seller.id)}
                                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                                >
                                  {seller.status === 'approved' ? '🚫 Suspendre' : '✅ Activer'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Buyers Management Section */}
            {activeSection === 'buyers' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Gestion des acheteurs</h2>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total dépensé</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {buyers.map((buyer) => (
                        <tr key={buyer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium">{buyer.name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{buyer.whatsapp}</td>
                          <td className="px-6 py-4 text-sm">{buyer.joinDate}</td>
                          <td className="px-6 py-4 text-sm">{buyer.orders}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(buyer.spent)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              buyer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {buyer.status === 'active' ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-3">
                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleEditBuyer(buyer)}
                                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                >
                                  ✏️ Modifier
                                </button>
                              )}
                              <button
                                onClick={() => toggleBuyerStatus(buyer.id)}
                                className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                              >
                                {buyer.status === 'active' ? '🚫 Suspendre' : '✅ Activer'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Management Section */}
            {activeSection === 'products' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Gestion des produits</h2>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendeur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className={`hover:bg-gray-50 ${product.status === 'pending' ? 'bg-yellow-50' : ''}`}>
                          <td className="px-6 py-4">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">Ajouté le {product.addedDate}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{product.seller}</td>
                          <td className="px-6 py-4 text-sm">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4 text-sm">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.status === 'approved' ? 'Approuvé' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {isSuperAdmin && (
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                                >
                                  ✏️ Modifier
                                </button>
                              )}
                              {product.status === 'pending' && (
                                <button
                                  onClick={() => approveProduct(product.id)}
                                  className="text-green-600 hover:text-green-700 font-semibold text-sm"
                                >
                                  ✅ Approuver
                                </button>
                              )}
                              <button
                                onClick={() => rejectProduct(product.id)}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm"
                              >
                                🗑️ Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Management Section */}
            {activeSection === 'orders' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Gestion des commandes</h2>
                
                {/* Order Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">En cours</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {orders.filter(o => o.status === 'processing').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 font-medium">En transit</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {orders.filter(o => o.status === 'in_transit').length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Livrées</p>
                    <p className="text-2xl font-bold text-green-700">
                      {orders.filter(o => o.status === 'delivered').length}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium">Annulées</p>
                    <p className="text-2xl font-bold text-red-700">
                      {orders.filter(o => o.status === 'cancelled').length}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acheteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendeur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium">{order.id}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{order.buyer}</td>
                          <td className="px-6 py-4 text-sm">{order.seller}</td>
                          <td className="px-6 py-4 text-sm">{order.date}</td>
                          <td className="px-6 py-4 text-sm">{order.items}</td>
                          <td className="px-6 py-4 text-sm font-medium">{formatPrice(order.total)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'delivered' ? 'Livré' :
                               order.status === 'in_transit' ? 'En transit' :
                               order.status === 'processing' ? 'En cours' :
                               'Annulé'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isSuperAdmin ? (
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                              >
                                ✏️ Modifier
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  alert('⚠️ Seul le Super Administrateur peut modifier les commandes');
                                }}
                                className="text-gray-400 cursor-not-allowed font-semibold text-sm"
                              >
                                ✏️ Modifier
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  );

};

// =============================================================================
// ADMIN MANAGEMENT - Gestion des Administrateurs et Rôles
// =============================================================================

// Roles et Permissions
const adminRoles = {
  super_admin: {
    name: 'Super Administrateur',
    color: 'red',
    icon: '👑',
    permissions: ['all']
  },
  admin: {
    name: 'Administrateur',
    color: 'purple',
    icon: '⚡',
    permissions: ['manage_users', 'manage_sellers', 'manage_products', 'manage_orders', 'view_analytics']
  },
  moderator: {
    name: 'Modérateur',
    color: 'blue',
    icon: '🛡️',
    permissions: ['manage_products', 'manage_sellers', 'view_orders']
  },
  support: {
    name: 'Support',
    color: 'green',
    icon: '💬',
    permissions: ['view_users', 'view_orders', 'manage_messages']
  }
};

// Mock data pour les administrateurs
const mockAdmins = [
  {
    id: 'admin_1',
    name: 'Admin Principal',
    whatsapp: '+237600000000',
    email: 'admin@nengoo.com',
    role: 'super_admin',
    status: 'active',
    createdDate: '2024-01-01',
    lastLogin: '2025-01-22 14:30'
  },
  {
    id: 'admin_2',
    name: 'Marie Admin',
    whatsapp: '+237655111111',
    email: 'marie@nengoo.com',
    role: 'admin',
    status: 'active',
    createdDate: '2024-06-15',
    lastLogin: '2025-01-22 10:15'
  },
  {
    id: 'admin_3',
    name: 'Jean Modérateur',
    whatsapp: '+237699222222',
    email: 'jean@nengoo.com',
    role: 'moderator',
    status: 'active',
    createdDate: '2024-09-01',
    lastLogin: '2025-01-21 18:45'
  },
  {
    id: 'admin_4',
    name: 'Sophie Support',
    whatsapp: '+237677333333',
    email: 'sophie@nengoo.com',
    role: 'support',
    status: 'active',
    createdDate: '2024-11-10',
    lastLogin: '2025-01-22 09:20'
  }
];

// Admin Management Component
export const AdminManagement = (props) => {
  const { language, user } = props;
  const navigate = useNavigate();
  const [admins, setAdmins] = useState(mockAdmins);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    role: 'support',
    accessCode: ''
  });

  // Vérifier si l'utilisateur est super admin
  const isSuperAdmin = user && user.type === 'admin' && user.whatsapp === '+237600000000';

  if (!user || user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold mb-4">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">Réservé aux administrateurs.</p>
          <Link to="/admin/login" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdmin = () => {
    if (!formData.name || !formData.whatsapp || !formData.email || !formData.accessCode) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newAdmin = {
      id: `admin_${Date.now()}`,
      name: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      role: formData.role,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Jamais'
    };

    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', whatsapp: '', email: '', role: 'support', accessCode: '' });
    setShowAddForm(false);
    alert(`✅ Administrateur "${newAdmin.name}" ajouté avec succès!\n\nCode d'accès: ${formData.accessCode}\n\n⚠️ Sauvegardez ce code, il ne sera plus affiché!`);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin.id);
    setFormData({
      name: admin.name,
      whatsapp: admin.whatsapp,
      email: admin.email,
      role: admin.role,
      accessCode: ''
    });
  };

  const handleUpdateAdmin = () => {
    setAdmins(admins.map(a => 
      a.id === editingAdmin 
        ? { ...a, name: formData.name, email: formData.email, role: formData.role }
        : a
    ));
    setEditingAdmin(null);
    setFormData({ name: '', whatsapp: '', email: '', role: 'support', accessCode: '' });
    alert('✅ Administrateur mis à jour avec succès!');
  };

  const toggleAdminStatus = (adminId) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut désactiver des admins');
      return;
    }

    setAdmins(admins.map(a => 
      a.id === adminId 
        ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
        : a
    ));
  };

  const deleteAdmin = (adminId) => {
    if (!isSuperAdmin) {
      alert('⚠️ Seul le Super Administrateur peut supprimer des admins');
      return;
    }

    const admin = admins.find(a => a.id === adminId);
    if (admin && confirm(`Êtes-vous sûr de vouloir supprimer "${admin.name}"?`)) {
      setAdmins(admins.filter(a => a.id !== adminId));
      alert('✅ Administrateur supprimé');
    }
  };

  const getRoleStats = () => {
    return Object.keys(adminRoles).map(roleKey => ({
      role: roleKey,
      ...adminRoles[roleKey],
      count: admins.filter(a => a.role === roleKey).length
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="text-white hover:text-gray-200">
                ← Retour Dashboard
              </Link>
              <div className="border-l border-white/30 pl-4">
                <h1 className="text-2xl font-bold">👥 Gestion des Administrateurs</h1>
                <p className="text-sm opacity-90">Rôles et permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">👤 {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {getRoleStats().map((stat) => (
            <div key={stat.role} className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${stat.color}-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Roles & Permissions Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">📋 Rôles et Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(adminRoles).map(([key, role]) => (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{role.icon}</span>
                  <div>
                    <h3 className="font-bold">{role.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full bg-${role.color}-100 text-${role.color}-800`}>
                      {key}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Permissions:</p>
                  {role.permissions.map((perm, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-start">
                      <span className="text-green-500 mr-1">✓</span>
                      <span>{perm.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Admin Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            {showAddForm ? '✕ Annuler' : '+ Ajouter un Administrateur'}
          </button>
        </div>

        {/* Add/Edit Admin Form */}
        {(showAddForm || editingAdmin) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-6">
              {editingAdmin ? '✏️ Modifier Administrateur' : '➕ Nouvel Administrateur'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Marie Kouam"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="+237 XXX XXX XXX"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={editingAdmin}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@nengoo.com"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={!isSuperAdmin}
                >
                  {Object.entries(adminRoles).map(([key, role]) => (
                    <option key={key} value={key}>
                      {role.icon} {role.name}
                    </option>
                  ))}
                </select>
                {!isSuperAdmin && (
                  <p className="text-xs text-gray-500 mt-1">Seul le Super Admin peut changer les rôles</p>
                )}
              </div>

              {!editingAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code d'accès *</label>
                  <input
                    type="password"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleInputChange}
                    placeholder="Créer un code d'accès"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Code secret pour la connexion</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={editingAdmin ? handleUpdateAdmin : handleAddAdmin}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {editingAdmin ? 'Mettre à jour' : 'Créer Administrateur'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAdmin(null);
                  setFormData({ name: '', whatsapp: '', email: '', role: 'support', accessCode: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Liste des Administrateurs ({admins.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Administrateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Création</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Connexion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => {
                  const roleInfo = adminRoles[admin.role];
                  return (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{roleInfo.icon}</div>
                          <div>
                            <p className="font-medium text-gray-900">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{admin.whatsapp}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium bg-${roleInfo.color}-100 text-${roleInfo.color}-800`}>
                          {roleInfo.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          admin.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {admin.createdDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {admin.lastLogin}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            ✏️ Modifier
                          </button>
                          {isSuperAdmin && admin.id !== 'admin_1' && (
                            <>
                              <button
                                onClick={() => toggleAdminStatus(admin.id)}
                                className="text-orange-600 hover:text-orange-800 font-semibold text-sm"
                              >
                                {admin.status === 'active' ? '🚫 Suspendre' : '✅ Activer'}
                              </button>
                              <button
                                onClick={() => deleteAdmin(admin.id)}
                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                              >
                                🗑️ Supprimer
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <span className="text-3xl">ℹ️</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Informations Importantes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Seul le <strong>Super Administrateur</strong> peut suspendre ou supprimer des admins</li>
                <li>• Les codes d'accès ne sont affichés qu'une seule fois lors de la création</li>
                <li>• Chaque rôle a des permissions spécifiques définies</li>
                <li>• Les admins suspendus ne peuvent plus se connecter</li>
                <li>• Le Super Admin ne peut pas être supprimé ou suspendu</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};