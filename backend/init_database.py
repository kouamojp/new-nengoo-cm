#!/usr/bin/env python3
"""
Script d'initialisation de la base de données MongoDB pour Nengoo
Crée toutes les collections nécessaires avec des données mockées
"""

import os
from datetime import datetime, timezone
from pymongo import MongoClient, ASCENDING, DESCENDING
from bson import ObjectId
import bcrypt

# Connexion à MongoDB
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/nengoo')
client = MongoClient(MONGO_URL)
db = client.get_database()

print("🚀 Initialisation de la base de données Nengoo...")
print(f"📊 Connexion à: {MONGO_URL}")

# Fonction pour hasher les mots de passe
def hash_password(password):
    """Hash un mot de passe avec bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# ============================================================================
# 1. COLLECTION: users (Acheteurs et Admins)
# ============================================================================
print("\n1️⃣  Création de la collection 'users'...")

# Supprimer la collection existante
db.users.drop()

# Créer les index
db.users.create_index([("whatsapp", ASCENDING)], unique=True)
db.users.create_index([("email", ASCENDING)])
db.users.create_index([("type", ASCENDING)])
db.users.create_index([("status", ASCENDING)])

# Données des utilisateurs
users_data = [
    {
        "id": "user_001",
        "whatsapp": "+237655123456",
        "password": hash_password("123456"),
        "name": "Marie Kouam",
        "email": "marie.kouam@example.com",
        "type": "buyer",
        "joinDate": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "status": "active",
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "totalOrders": 5,
        "totalSpent": 245000,
        "addresses": [
            {
                "id": "addr_001",
                "name": "Domicile",
                "address": "Quartier Bastos, Yaoundé",
                "phone": "+237655123456",
                "isDefault": True
            }
        ],
        "favoritePickupPoints": ["pickup_002"],
        "paymentMethods": [],
        "createdAt": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "user_002",
        "whatsapp": "+237699888777",
        "password": hash_password("buyer456"),
        "name": "Jean Nkoa",
        "email": "jean.nkoa@example.com",
        "type": "buyer",
        "joinDate": datetime(2025, 1, 15, tzinfo=timezone.utc),
        "status": "active",
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 15, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "totalOrders": 8,
        "totalSpent": 520000,
        "addresses": [
            {
                "id": "addr_002",
                "name": "Bureau",
                "address": "Akwa, Douala",
                "phone": "+237699888777",
                "isDefault": True
            }
        ],
        "favoritePickupPoints": ["pickup_001"],
        "paymentMethods": [],
        "createdAt": datetime(2025, 1, 15, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "admin_001",
        "whatsapp": "+237600000000",
        "password": hash_password("ADMIN2025"),
        "name": "Super Administrateur",
        "email": "admin@nengoo.cm",
        "type": "admin",
        "joinDate": datetime(2024, 1, 1, tzinfo=timezone.utc),
        "status": "active",
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2024, 1, 1, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "totalOrders": 0,
        "totalSpent": 0,
        "addresses": [],
        "favoritePickupPoints": [],
        "paymentMethods": [],
        "createdAt": datetime(2024, 1, 1, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
]

result = db.users.insert_many(users_data)
print(f"   ✅ {len(result.inserted_ids)} utilisateurs créés")

# ============================================================================
# 2. COLLECTION: sellers (Vendeurs)
# ============================================================================
print("\n2️⃣  Création de la collection 'sellers'...")

# Supprimer la collection existante
db.sellers.drop()

# Créer les index
db.sellers.create_index([("whatsapp", ASCENDING)], unique=True)
db.sellers.create_index([("email", ASCENDING)])
db.sellers.create_index([("status", ASCENDING)])
db.sellers.create_index([("city", ASCENDING)])

# Données des vendeurs
sellers_data = [
    {
        "id": "seller_001",
        "whatsapp": "+237655111222",
        "password": hash_password("seller123"),
        "name": "Marie Boutique",
        "businessName": "Mode Africaine",
        "email": "marie@modeafricaine.cm",
        "city": "Douala",
        "region": "Littoral",
        "address": "Marché Central, Douala",
        "categories": ["clothing_accessories", "handicrafts"],
        "description": "Vêtements traditionnels et modernes",
        "logo": None,
        "banner": None,
        "status": "approved",
        "verified": True,
        "rating": 4.7,
        "reviewsCount": 120,
        "totalProducts": 45,
        "totalSales": 1250000,
        "activeOrders": 12,
        "completedOrders": 450,
        "joinDate": datetime(2024, 1, 15, tzinfo=timezone.utc),
        "approvedDate": datetime(2024, 1, 16, tzinfo=timezone.utc),
        "lastLogin": datetime.now(timezone.utc),
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2024, 1, 15, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "createdAt": datetime(2024, 1, 15, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "seller_002",
        "whatsapp": "+237677222333",
        "password": hash_password("seller456"),
        "name": "Paul Kamdem",
        "businessName": "Électro Plus",
        "email": "paul@electroplus.cm",
        "city": "Yaoundé",
        "region": "Centre",
        "address": "Quartier Nlongkak, Yaoundé",
        "categories": ["electronics", "professional_equipment"],
        "description": "Électronique et équipements professionnels",
        "logo": None,
        "banner": None,
        "status": "approved",
        "verified": True,
        "rating": 4.5,
        "reviewsCount": 85,
        "totalProducts": 32,
        "totalSales": 2850000,
        "activeOrders": 8,
        "completedOrders": 320,
        "joinDate": datetime(2024, 2, 1, tzinfo=timezone.utc),
        "approvedDate": datetime(2024, 2, 2, tzinfo=timezone.utc),
        "lastLogin": datetime.now(timezone.utc),
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2024, 2, 1, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "createdAt": datetime(2024, 2, 1, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "seller_003",
        "whatsapp": "+237688333444",
        "password": hash_password("pending123"),
        "name": "Grace Njoh",
        "businessName": "Artisanat Bamiléké",
        "email": "grace@artisanat.cm",
        "city": "Bafoussam",
        "region": "Ouest",
        "address": "Marché A, Bafoussam",
        "categories": ["handicrafts", "home_garden"],
        "description": "Artisanat traditionnel bamiléké",
        "logo": None,
        "banner": None,
        "status": "pending",
        "verified": False,
        "rating": 0,
        "reviewsCount": 0,
        "totalProducts": 0,
        "totalSales": 0,
        "activeOrders": 0,
        "completedOrders": 0,
        "joinDate": datetime(2025, 1, 25, tzinfo=timezone.utc),
        "approvedDate": None,
        "lastLogin": None,
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 25, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "createdAt": datetime(2025, 1, 25, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
]

result = db.sellers.insert_many(sellers_data)
print(f"   ✅ {len(result.inserted_ids)} vendeurs créés")

# ============================================================================
# 3. COLLECTION: products (Produits)
# ============================================================================
print("\n3️⃣  Création de la collection 'products'...")

# Supprimer la collection existante
db.products.drop()

# Créer les index
db.products.create_index([("sellerId", ASCENDING)])
db.products.create_index([("category", ASCENDING)])
db.products.create_index([("status", ASCENDING)])
db.products.create_index([("price", ASCENDING)])
db.products.create_index([("createdAt", DESCENDING)])

# Données des produits
products_data = [
    {
        "id": "prod_001",
        "name": "Robe Traditionnelle Camerounaise",
        "description": "Belle robe traditionnelle en wax, taille M",
        "category": "clothing_accessories",
        "price": 45000,
        "oldPrice": 55000,
        "currency": "XAF",
        "sellerId": "seller_001",
        "sellerName": "Mode Africaine",
        "stock": 12,
        "sold": 45,
        "images": [
            "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg"
        ],
        "status": "approved",
        "verified": True,
        "featured": True,
        "rating": 4.8,
        "reviewsCount": 23,
        "views": 450,
        "favorites": 67,
        "tags": ["wax", "traditionnel", "femme"],
        "createdAt": datetime(2024, 12, 1, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "prod_002",
        "name": "Smartphone Samsung Galaxy A54",
        "description": "Smartphone Samsung Galaxy A54 5G, 128GB, neuf",
        "category": "electronics",
        "price": 285000,
        "oldPrice": 320000,
        "currency": "XAF",
        "sellerId": "seller_002",
        "sellerName": "Électro Plus",
        "stock": 5,
        "sold": 18,
        "images": [
            "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg"
        ],
        "status": "approved",
        "verified": True,
        "featured": True,
        "rating": 4.9,
        "reviewsCount": 15,
        "views": 890,
        "favorites": 124,
        "tags": ["smartphone", "samsung", "5G"],
        "createdAt": datetime(2024, 12, 15, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "prod_003",
        "name": "Panier Artisanal Bamiléké",
        "description": "Panier artisanal fait main, design traditionnel",
        "category": "handicrafts",
        "price": 15000,
        "oldPrice": None,
        "currency": "XAF",
        "sellerId": "seller_001",
        "sellerName": "Mode Africaine",
        "stock": 25,
        "sold": 89,
        "images": [
            "https://images.pexels.com/photos/6069100/pexels-photo-6069100.jpeg"
        ],
        "status": "approved",
        "verified": True,
        "featured": False,
        "rating": 4.6,
        "reviewsCount": 34,
        "views": 320,
        "favorites": 45,
        "tags": ["artisanat", "panier", "fait-main"],
        "createdAt": datetime(2025, 1, 5, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
]

result = db.products.insert_many(products_data)
print(f"   ✅ {len(result.inserted_ids)} produits créés")

# ============================================================================
# 4. COLLECTION: pickupPoints (Points de Retrait)
# ============================================================================
print("\n4️⃣  Création de la collection 'pickupPoints'...")

# Supprimer la collection existante
db.pickupPoints.drop()

# Créer les index
db.pickupPoints.create_index([("id", ASCENDING)], unique=True)
db.pickupPoints.create_index([("managerId", ASCENDING)])
db.pickupPoints.create_index([("city", ASCENDING), ("status", ASCENDING)])
db.pickupPoints.create_index([("status", ASCENDING)])

# Données des points de retrait
pickupPoints_data = [
    {
        "id": "pickup_001",
        "name": "Nengoo Point Douala Centre",
        "address": "Avenue de la Liberté, Akwa",
        "city": "Douala",
        "region": "Littoral",
        "coordinates": {
            "latitude": 4.0511,
            "longitude": 9.7679
        },
        "managerId": "manager_001",
        "managerName": "Jean Mbarga",
        "managerWhatsApp": "+237655888999",
        "managerEmail": "jean.mbarga@nengoo.cm",
        "phone": "+237 233 456 789",
        "email": "douala.centre@nengoo.cm",
        "capacity": 100,
        "currentLoad": 25,
        "hours": "Lun-Sam: 8h-18h, Dim: Fermé",
        "description": "Point de retrait principal situé au centre ville de Douala",
        "status": "approved",
        "verified": True,
        "totalOrders": 450,
        "activeOrders": 25,
        "rating": 4.7,
        "reviewsCount": 120,
        "createdDate": datetime(2025, 1, 1, tzinfo=timezone.utc),
        "approvedDate": datetime(2025, 1, 2, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "pickup_002",
        "name": "Nengoo Point Yaoundé Mvan",
        "address": "Quartier Mvan, près du marché",
        "city": "Yaoundé",
        "region": "Centre",
        "coordinates": {
            "latitude": 3.8480,
            "longitude": 11.5021
        },
        "managerId": "manager_002",
        "managerName": "Marie Essomba",
        "managerWhatsApp": "+237699777888",
        "managerEmail": "marie.essomba@nengoo.cm",
        "phone": "+237 222 345 678",
        "email": "yaounde.mvan@nengoo.cm",
        "capacity": 80,
        "currentLoad": 18,
        "hours": "Lun-Sam: 8h-18h",
        "description": "Point de retrait situé au quartier Mvan",
        "status": "approved",
        "verified": True,
        "totalOrders": 320,
        "activeOrders": 18,
        "rating": 4.5,
        "reviewsCount": 85,
        "createdDate": datetime(2025, 1, 5, tzinfo=timezone.utc),
        "approvedDate": datetime(2025, 1, 6, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "pickup_003",
        "name": "Nengoo Point Bafoussam",
        "address": "Centre Commercial, Bafoussam",
        "city": "Bafoussam",
        "region": "Ouest",
        "coordinates": {
            "latitude": 5.4776,
            "longitude": 10.4176
        },
        "managerId": "manager_003",
        "managerName": "Paul Kamga",
        "managerWhatsApp": "+237677666555",
        "managerEmail": "paul.kamga@nengoo.cm",
        "phone": "+237 233 567 890",
        "email": "bafoussam@nengoo.cm",
        "capacity": 60,
        "currentLoad": 12,
        "hours": "Lun-Sam: 9h-17h",
        "description": "Point de retrait au centre commercial de Bafoussam",
        "status": "approved",
        "verified": True,
        "totalOrders": 180,
        "activeOrders": 12,
        "rating": 4.8,
        "reviewsCount": 52,
        "createdDate": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "approvedDate": datetime(2025, 1, 11, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "pickup_004",
        "name": "Nengoo Point Garoua",
        "address": "Quartier Commercial, Garoua",
        "city": "Garoua",
        "region": "Nord",
        "coordinates": {
            "latitude": 9.3011,
            "longitude": 13.3964
        },
        "managerId": "manager_004",
        "managerName": "Ahmadou Bello",
        "managerWhatsApp": "+237655444333",
        "managerEmail": "ahmadou.bello@nengoo.cm",
        "phone": "+237 222 678 901",
        "email": "garoua@nengoo.cm",
        "capacity": 50,
        "currentLoad": 0,
        "hours": "Lun-Sam: 8h-17h",
        "description": "Nouveau point de retrait à Garoua",
        "status": "pending",
        "verified": False,
        "totalOrders": 0,
        "activeOrders": 0,
        "rating": 0,
        "reviewsCount": 0,
        "createdDate": datetime(2025, 1, 25, tzinfo=timezone.utc),
        "approvedDate": None,
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "pickup_005",
        "name": "Nengoo Point Limbe",
        "address": "Down Beach, Limbe",
        "city": "Limbe",
        "region": "Sud-Ouest",
        "coordinates": {
            "latitude": 4.0171,
            "longitude": 9.2167
        },
        "managerId": "manager_005",
        "managerName": "Grace Njoh",
        "managerWhatsApp": "+237688555444",
        "managerEmail": "grace.njoh@nengoo.cm",
        "phone": "+237 233 789 012",
        "email": "limbe@nengoo.cm",
        "capacity": 40,
        "currentLoad": 0,
        "hours": "Lun-Ven: 9h-17h",
        "description": "Point de retrait à Limbe, près de la plage",
        "status": "pending",
        "verified": False,
        "totalOrders": 0,
        "activeOrders": 0,
        "rating": 0,
        "reviewsCount": 0,
        "createdDate": datetime(2025, 1, 26, tzinfo=timezone.utc),
        "approvedDate": None,
        "updatedAt": datetime.now(timezone.utc)
    }
]

result = db.pickupPoints.insert_many(pickupPoints_data)
print(f"   ✅ {len(result.inserted_ids)} points de retrait créés")

# ============================================================================
# 5. COLLECTION: pickupManagers (Gestionnaires Points de Retrait)
# ============================================================================
print("\n5️⃣  Création de la collection 'pickupManagers'...")

# Supprimer la collection existante
db.pickupManagers.drop()

# Créer les index
db.pickupManagers.create_index([("id", ASCENDING)], unique=True)
db.pickupManagers.create_index([("whatsapp", ASCENDING)], unique=True)
db.pickupManagers.create_index([("pickupPointId", ASCENDING)])
db.pickupManagers.create_index([("status", ASCENDING)])

# Données des gestionnaires
pickupManagers_data = [
    {
        "id": "manager_001",
        "name": "Jean Mbarga",
        "whatsapp": "+237655888999",
        "password": hash_password("manager123"),
        "email": "jean.mbarga@nengoo.cm",
        "pickupPointId": "pickup_001",
        "pickupPointName": "Nengoo Point Douala Centre",
        "idCard": "CM-DLA-123456",
        "photo": None,
        "address": "Quartier Bonanjo, Douala",
        "type": "pickup_manager",
        "role": "manager",
        "canApproveOrders": True,
        "canContactCustomers": True,
        "canModifyInventory": True,
        "status": "active",
        "verified": True,
        "ordersProcessed": 450,
        "performanceRating": 4.8,
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 1, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "joinDate": datetime(2025, 1, 1, tzinfo=timezone.utc),
        "lastLogin": datetime.now(timezone.utc),
        "createdAt": datetime(2025, 1, 1, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "manager_002",
        "name": "Marie Essomba",
        "whatsapp": "+237699777888",
        "password": hash_password("manager456"),
        "email": "marie.essomba@nengoo.cm",
        "pickupPointId": "pickup_002",
        "pickupPointName": "Nengoo Point Yaoundé Mvan",
        "idCard": "CM-YDE-234567",
        "photo": None,
        "address": "Quartier Mvan, Yaoundé",
        "type": "pickup_manager",
        "role": "manager",
        "canApproveOrders": True,
        "canContactCustomers": True,
        "canModifyInventory": True,
        "status": "active",
        "verified": True,
        "ordersProcessed": 320,
        "performanceRating": 4.6,
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 5, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "joinDate": datetime(2025, 1, 5, tzinfo=timezone.utc),
        "lastLogin": datetime.now(timezone.utc),
        "createdAt": datetime(2025, 1, 5, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    },
    {
        "id": "manager_003",
        "name": "Paul Kamga",
        "whatsapp": "+237677666555",
        "password": hash_password("manager789"),
        "email": "paul.kamga@nengoo.cm",
        "pickupPointId": "pickup_003",
        "pickupPointName": "Nengoo Point Bafoussam",
        "idCard": "CM-BFS-345678",
        "photo": None,
        "address": "Centre ville, Bafoussam",
        "type": "pickup_manager",
        "role": "manager",
        "canApproveOrders": True,
        "canContactCustomers": True,
        "canModifyInventory": True,
        "status": "active",
        "verified": True,
        "ordersProcessed": 180,
        "performanceRating": 4.9,
        "passwordResetRequired": False,
        "lastPasswordChange": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "loginAttempts": 0,
        "accountLocked": False,
        "joinDate": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "lastLogin": datetime.now(timezone.utc),
        "createdAt": datetime(2025, 1, 10, tzinfo=timezone.utc),
        "updatedAt": datetime.now(timezone.utc)
    }
]

result = db.pickupManagers.insert_many(pickupManagers_data)
print(f"   ✅ {len(result.inserted_ids)} gestionnaires créés")

# ============================================================================
# 6. COLLECTION: orders (Commandes)
# ============================================================================
print("\n6️⃣  Création de la collection 'orders'...")

# Supprimer la collection existante
db.orders.drop()

# Créer les index
db.orders.create_index([("id", ASCENDING)], unique=True)
db.orders.create_index([("buyerId", ASCENDING)])
db.orders.create_index([("sellerId", ASCENDING)])
db.orders.create_index([("pickupPointId", ASCENDING)])
db.orders.create_index([("status", ASCENDING)])
db.orders.create_index([("pickupStatus", ASCENDING)])
db.orders.create_index([("createdAt", DESCENDING)])

# Données des commandes
orders_data = [
    {
        "id": "CMD001",
        "buyerId": "user_001",
        "buyerName": "Marie Kouam",
        "buyerWhatsApp": "+237655123456",
        "sellerId": "seller_001",
        "sellerName": "Mode Africaine",
        "sellerWhatsApp": "+237655111222",
        "products": [
            {
                "productId": "prod_001",
                "name": "Robe Traditionnelle Camerounaise",
                "quantity": 1,
                "price": 45000
            }
        ],
        "totalAmount": 45000,
        "currency": "XAF",
        "status": "delivered",
        "paymentStatus": "paid",
        "paymentMethod": "mobile_money",
        # Champs point de retrait
        "pickupPointId": "pickup_002",
        "pickupPointName": "Nengoo Point Yaoundé Mvan",
        "pickupPointAddress": "Quartier Mvan, près du marché",
        "pickupPointPhone": "+237 222 345 678",
        "pickupStatus": "collected",
        "orderedDate": datetime(2025, 1, 20, tzinfo=timezone.utc),
        "shippedDate": datetime(2025, 1, 21, tzinfo=timezone.utc),
        "arrivedAtPickupDate": datetime(2025, 1, 22, tzinfo=timezone.utc),
        "collectedDate": datetime(2025, 1, 23, tzinfo=timezone.utc),
        "notificationsSent": {
            "toSeller": True,
            "toPickupManager": True,
            "toCustomer": True,
            "arrivedNotification": True
        },
        "pickupManagerId": "manager_002",
        "pickupManagerName": "Marie Essomba",
        "receivedBy": "Marie Essomba",
        "pickupNotes": "Commande récupérée par le client",
        "createdAt": datetime(2025, 1, 20, tzinfo=timezone.utc),
        "updatedAt": datetime(2025, 1, 23, tzinfo=timezone.utc)
    },
    {
        "id": "CMD002",
        "buyerId": "user_002",
        "buyerName": "Jean Nkoa",
        "buyerWhatsApp": "+237699888777",
        "sellerId": "seller_002",
        "sellerName": "Électro Plus",
        "sellerWhatsApp": "+237677222333",
        "products": [
            {
                "productId": "prod_002",
                "name": "Smartphone Samsung Galaxy A54",
                "quantity": 1,
                "price": 285000
            }
        ],
        "totalAmount": 285000,
        "currency": "XAF",
        "status": "in_transit",
        "paymentStatus": "paid",
        "paymentMethod": "mobile_money",
        # Champs point de retrait
        "pickupPointId": "pickup_001",
        "pickupPointName": "Nengoo Point Douala Centre",
        "pickupPointAddress": "Avenue de la Liberté, Akwa",
        "pickupPointPhone": "+237 233 456 789",
        "pickupStatus": "in_transit",
        "orderedDate": datetime(2025, 1, 26, tzinfo=timezone.utc),
        "shippedDate": datetime(2025, 1, 27, tzinfo=timezone.utc),
        "arrivedAtPickupDate": None,
        "collectedDate": None,
        "notificationsSent": {
            "toSeller": True,
            "toPickupManager": True,
            "toCustomer": False,
            "arrivedNotification": False
        },
        "pickupManagerId": "manager_001",
        "pickupManagerName": "Jean Mbarga",
        "receivedBy": None,
        "pickupNotes": None,
        "createdAt": datetime(2025, 1, 26, tzinfo=timezone.utc),
        "updatedAt": datetime(2025, 1, 27, tzinfo=timezone.utc)
    }
]

result = db.orders.insert_many(orders_data)
print(f"   ✅ {len(result.inserted_ids)} commandes créées")

# ============================================================================
# 7. COLLECTION: reviews (Avis)
# ============================================================================
print("\n7️⃣  Création de la collection 'reviews'...")

# Supprimer la collection existante
db.reviews.drop()

# Créer les index
db.reviews.create_index([("productId", ASCENDING)])
db.reviews.create_index([("buyerId", ASCENDING)])
db.reviews.create_index([("rating", ASCENDING)])
db.reviews.create_index([("createdAt", DESCENDING)])

# Données des avis
reviews_data = [
    {
        "id": "rev_001",
        "productId": "prod_001",
        "productName": "Robe Traditionnelle Camerounaise",
        "buyerId": "user_001",
        "buyerName": "Marie Kouam",
        "rating": 5,
        "comment": "Très belle robe, qualité excellente! Je recommande vivement.",
        "verified": True,
        "helpful": 12,
        "images": [],
        "createdAt": datetime(2025, 1, 24, tzinfo=timezone.utc),
        "updatedAt": datetime(2025, 1, 24, tzinfo=timezone.utc)
    },
    {
        "id": "rev_002",
        "productId": "prod_002",
        "productName": "Smartphone Samsung Galaxy A54",
        "buyerId": "user_002",
        "buyerName": "Jean Nkoa",
        "rating": 5,
        "comment": "Excellent téléphone, livraison rapide. Service impeccable!",
        "verified": True,
        "helpful": 8,
        "images": [],
        "createdAt": datetime(2025, 1, 28, tzinfo=timezone.utc),
        "updatedAt": datetime(2025, 1, 28, tzinfo=timezone.utc)
    }
]

result = db.reviews.insert_many(reviews_data)
print(f"   ✅ {len(result.inserted_ids)} avis créés")

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================
print("\n" + "="*60)
print("✅ BASE DE DONNÉES INITIALISÉE AVEC SUCCÈS!")
print("="*60)

# Afficher les statistiques
print(f"\n📊 STATISTIQUES DES COLLECTIONS:")
print(f"   • users: {db.users.count_documents({})} documents")
print(f"   • sellers: {db.sellers.count_documents({})} documents")
print(f"   • products: {db.products.count_documents({})} documents")
print(f"   • pickupPoints: {db.pickupPoints.count_documents({})} documents")
print(f"   • pickupManagers: {db.pickupManagers.count_documents({})} documents")
print(f"   • orders: {db.orders.count_documents({})} documents")
print(f"   • reviews: {db.reviews.count_documents({})} documents")

print(f"\n🔐 IDENTIFIANTS DE CONNEXION:")
print(f"\n   SUPER ADMIN:")
print(f"   • WhatsApp: +237600000000")
print(f"   • Mot de passe: ADMIN2025")

print(f"\n   ACHETEUR TEST 1:")
print(f"   • WhatsApp: +237655123456")
print(f"   • Mot de passe: 123456")
print(f"   • Nom: Marie Kouam")

print(f"\n   ACHETEUR TEST 2:")
print(f"   • WhatsApp: +237699888777")
print(f"   • Mot de passe: buyer456")
print(f"   • Nom: Jean Nkoa")

print(f"\n   VENDEUR TEST 1:")
print(f"   • WhatsApp: +237655111222")
print(f"   • Mot de passe: seller123")
print(f"   • Boutique: Mode Africaine")

print(f"\n   VENDEUR TEST 2:")
print(f"   • WhatsApp: +237677222333")
print(f"   • Mot de passe: seller456")
print(f"   • Boutique: Électro Plus")

print(f"\n   GESTIONNAIRE POINT 1:")
print(f"   • WhatsApp: +237655888999")
print(f"   • Mot de passe: manager123")
print(f"   • Point: Nengoo Point Douala Centre")

print(f"\n   GESTIONNAIRE POINT 2:")
print(f"   • WhatsApp: +237699777888")
print(f"   • Mot de passe: manager456")
print(f"   • Point: Nengoo Point Yaoundé Mvan")

print(f"\n   GESTIONNAIRE POINT 3:")
print(f"   • WhatsApp: +237677666555")
print(f"   • Mot de passe: manager789")
print(f"   • Point: Nengoo Point Bafoussam")

print("\n🚀 La base de données est prête à être utilisée!")
print("="*60)

client.close()
