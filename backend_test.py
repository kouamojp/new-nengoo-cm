#!/usr/bin/env python3
"""
Test complet du backend Nengoo
- Test des endpoints existants
- Création des collections MongoDB
- Insertion de données de test
- Création des index
- Vérification de la connectivité
"""

import asyncio
import requests
import json
import os
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import uuid

# Configuration
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

# URLs et configuration
BACKEND_URL = "https://shopnengoo.preview.emergentagent.com"
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

print(f"🔧 Configuration:")
print(f"   Backend URL: {BACKEND_URL}")
print(f"   MongoDB URL: {MONGO_URL}")
print(f"   Database: {DB_NAME}")
print()

class NengooTester:
    def __init__(self):
        self.client = None
        self.db = None
        self.results = {
            'backend_status': False,
            'mongodb_connection': False,
            'collections_created': False,
            'indexes_created': False,
            'test_data_inserted': False,
            'api_endpoints': {},
            'errors': []
        }

    async def connect_mongodb(self):
        """Connexion à MongoDB"""
        try:
            print("📡 Connexion à MongoDB...")
            self.client = AsyncIOMotorClient(MONGO_URL)
            self.db = self.client[DB_NAME]
            
            # Test de connexion
            await self.client.admin.command('ping')
            self.results['mongodb_connection'] = True
            print("✅ Connexion MongoDB réussie")
            return True
        except Exception as e:
            self.results['errors'].append(f"Erreur MongoDB: {str(e)}")
            print(f"❌ Erreur connexion MongoDB: {e}")
            return False

    def test_backend_endpoints(self):
        """Test des endpoints backend existants"""
        print("\n🔍 Test des endpoints backend...")
        
        endpoints = [
            {'method': 'GET', 'path': '/api/', 'name': 'root'},
            {'method': 'GET', 'path': '/api/status', 'name': 'get_status'},
            {'method': 'POST', 'path': '/api/status', 'name': 'create_status', 
             'data': {'client_name': 'Test Client Nengoo'}}
        ]
        
        for endpoint in endpoints:
            try:
                url = f"{BACKEND_URL}{endpoint['path']}"
                print(f"   Testing {endpoint['method']} {url}")
                
                if endpoint['method'] == 'GET':
                    response = requests.get(url, timeout=10)
                elif endpoint['method'] == 'POST':
                    response = requests.post(url, json=endpoint.get('data', {}), timeout=10)
                
                if response.status_code in [200, 201]:
                    self.results['api_endpoints'][endpoint['name']] = {
                        'status': 'success',
                        'status_code': response.status_code,
                        'response': response.json()
                    }
                    print(f"   ✅ {endpoint['name']}: {response.status_code}")
                else:
                    self.results['api_endpoints'][endpoint['name']] = {
                        'status': 'failed',
                        'status_code': response.status_code,
                        'error': response.text
                    }
                    print(f"   ❌ {endpoint['name']}: {response.status_code}")
                    
            except Exception as e:
                self.results['api_endpoints'][endpoint['name']] = {
                    'status': 'error',
                    'error': str(e)
                }
                print(f"   ❌ {endpoint['name']}: {e}")
        
        # Vérifier si au moins un endpoint fonctionne
        working_endpoints = [ep for ep in self.results['api_endpoints'].values() 
                           if ep['status'] == 'success']
        self.results['backend_status'] = len(working_endpoints) > 0

    async def create_collections_and_indexes(self):
        """Création des collections et index MongoDB selon DATABASE_SCHEMA.md"""
        if self.db is None:
            return False
            
        print("\n🗄️ Création des collections et index...")
        
        try:
            # 1. Collection users
            print("   Création collection 'users'...")
            await self.db.users.create_index([("whatsapp", 1)], unique=True)
            await self.db.users.create_index([("email", 1)])
            await self.db.users.create_index([("type", 1)])
            await self.db.users.create_index([("status", 1)])
            
            # 2. Collection sellers
            print("   Création collection 'sellers'...")
            await self.db.sellers.create_index([("whatsapp", 1)], unique=True)
            await self.db.sellers.create_index([("businessName", 1)])
            await self.db.sellers.create_index([("status", 1)])
            await self.db.sellers.create_index([("city", 1)])
            await self.db.sellers.create_index([("rating", -1)])
            
            # 3. Collection products
            print("   Création collection 'products'...")
            await self.db.products.create_index([("sellerId", 1)])
            await self.db.products.create_index([("category", 1)])
            await self.db.products.create_index([("status", 1)])
            await self.db.products.create_index([("price", 1)])
            await self.db.products.create_index([("rating", -1)])
            await self.db.products.create_index([("featured", -1), ("rating", -1)])
            await self.db.products.create_index([("name.fr", "text"), ("description.fr", "text")])
            
            # 4. Collection orders
            print("   Création collection 'orders'...")
            await self.db.orders.create_index([("buyerId", 1)])
            await self.db.orders.create_index([("sellerId", 1)])
            await self.db.orders.create_index([("status", 1)])
            await self.db.orders.create_index([("orderDate", -1)])
            await self.db.orders.create_index([("id", 1)], unique=True)
            
            # 5. Collection pickupPoints
            print("   Création collection 'pickupPoints'...")
            await self.db.pickupPoints.create_index([("city", 1)])
            await self.db.pickupPoints.create_index([("isActive", 1)])
            await self.db.pickupPoints.create_index([("latitude", 1), ("longitude", 1)])
            
            # 6. Collection messages
            print("   Création collection 'messages'...")
            await self.db.messages.create_index([("senderId", 1)])
            await self.db.messages.create_index([("recipientId", 1)])
            await self.db.messages.create_index([("read", 1)])
            await self.db.messages.create_index([("sentDate", -1)])
            
            # 7. Collection reviews
            print("   Création collection 'reviews'...")
            await self.db.reviews.create_index([("productId", 1)])
            await self.db.reviews.create_index([("sellerId", 1)])
            await self.db.reviews.create_index([("buyerId", 1)])
            await self.db.reviews.create_index([("rating", -1)])
            
            self.results['collections_created'] = True
            self.results['indexes_created'] = True
            print("✅ Collections et index créés avec succès")
            return True
            
        except Exception as e:
            self.results['errors'].append(f"Erreur création collections: {str(e)}")
            print(f"❌ Erreur création collections: {e}")
            return False

    async def insert_test_data(self):
        """Insertion de données de test réalistes pour le Cameroun"""
        if self.db is None:
            return False
            
        print("\n📊 Insertion des données de test...")
        
        try:
            # 1. Données users (acheteurs et admins)
            users_data = [
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237655123456",
                    "name": "Marie Kouam",
                    "email": "marie.kouam@gmail.com",
                    "type": "buyer",
                    "joinDate": datetime.utcnow() - timedelta(days=30),
                    "status": "active",
                    "totalOrders": 5,
                    "totalSpent": 245000,
                    "addresses": [{
                        "id": 1,
                        "label": "Domicile",
                        "address": "Avenue de la Liberté, Akwa",
                        "city": "Douala",
                        "phone": "+237655123456",
                        "isDefault": True
                    }],
                    "favoritePickupPoints": [],
                    "paymentMethods": [{
                        "type": "MTN Mobile Money",
                        "number": "+237 655 XXX 456",
                        "isDefault": True
                    }],
                    "createdAt": datetime.utcnow() - timedelta(days=30),
                    "updatedAt": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237677987654",
                    "name": "Jean Mballa",
                    "email": "jean.mballa@yahoo.fr",
                    "type": "buyer",
                    "joinDate": datetime.utcnow() - timedelta(days=15),
                    "status": "active",
                    "totalOrders": 2,
                    "totalSpent": 89000,
                    "addresses": [{
                        "id": 1,
                        "label": "Bureau",
                        "address": "Quartier Bastos, Yaoundé",
                        "city": "Yaoundé",
                        "phone": "+237677987654",
                        "isDefault": True
                    }],
                    "favoritePickupPoints": [],
                    "paymentMethods": [{
                        "type": "Orange Money",
                        "number": "+237 677 XXX 654",
                        "isDefault": True
                    }],
                    "createdAt": datetime.utcnow() - timedelta(days=15),
                    "updatedAt": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237699111222",
                    "name": "Admin Nengoo",
                    "email": "admin@nengoo.cm",
                    "type": "admin",
                    "joinDate": datetime.utcnow() - timedelta(days=90),
                    "status": "active",
                    "totalOrders": 0,
                    "totalSpent": 0,
                    "addresses": [],
                    "favoritePickupPoints": [],
                    "paymentMethods": [],
                    "createdAt": datetime.utcnow() - timedelta(days=90),
                    "updatedAt": datetime.utcnow()
                }
            ]
            
            await self.db.users.insert_many(users_data)
            print("   ✅ Utilisateurs insérés")
            
            # 2. Données sellers
            sellers_data = [
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237655111222",
                    "name": "Marie Nkomo",
                    "businessName": "Boutique Marie - Mode Africaine",
                    "email": "contact@boutiquemarie.cm",
                    "city": "Douala",
                    "categories": ["clothing_accessories", "handicrafts"],
                    "status": "approved",
                    "submitDate": datetime.utcnow() - timedelta(days=60),
                    "approvalDate": datetime.utcnow() - timedelta(days=58),
                    "approvedBy": "admin",
                    "description": "Vêtements traditionnels et modernes de qualité",
                    "logo": "https://example.com/logos/boutique-marie.png",
                    "rating": 4.8,
                    "totalSales": 145,
                    "totalRevenue": 1250000,
                    "socialMedia": {
                        "whatsapp": "+237655111222",
                        "facebook": "https://facebook.com/boutiquemarie",
                        "instagram": "@boutiquemarie",
                        "telegram": None
                    },
                    "createdAt": datetime.utcnow() - timedelta(days=60),
                    "updatedAt": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237677333444",
                    "name": "Paul Essomba",
                    "businessName": "Artisanat Camerounais Paul",
                    "email": "paul.artisan@gmail.com",
                    "city": "Yaoundé",
                    "categories": ["handicrafts", "home_garden"],
                    "status": "approved",
                    "submitDate": datetime.utcnow() - timedelta(days=45),
                    "approvalDate": datetime.utcnow() - timedelta(days=43),
                    "approvedBy": "admin",
                    "description": "Artisanat traditionnel camerounais authentique",
                    "logo": "https://example.com/logos/artisanat-paul.png",
                    "rating": 4.6,
                    "totalSales": 89,
                    "totalRevenue": 890000,
                    "socialMedia": {
                        "whatsapp": "+237677333444",
                        "facebook": None,
                        "instagram": "@artisanatpaul",
                        "telegram": None
                    },
                    "createdAt": datetime.utcnow() - timedelta(days=45),
                    "updatedAt": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "whatsapp": "+237699555666",
                    "name": "Fatima Alhadji",
                    "businessName": "Épices du Nord",
                    "email": "fatima.epices@hotmail.com",
                    "city": "Garoua",
                    "categories": ["food_beverages"],
                    "status": "pending",
                    "submitDate": datetime.utcnow() - timedelta(days=5),
                    "approvalDate": None,
                    "approvedBy": None,
                    "description": "Épices et condiments du Nord Cameroun",
                    "logo": None,
                    "rating": 0,
                    "totalSales": 0,
                    "totalRevenue": 0,
                    "socialMedia": {
                        "whatsapp": "+237699555666",
                        "facebook": None,
                        "instagram": None,
                        "telegram": None
                    },
                    "createdAt": datetime.utcnow() - timedelta(days=5),
                    "updatedAt": datetime.utcnow()
                }
            ]
            
            await self.db.sellers.insert_many(sellers_data)
            print("   ✅ Vendeurs insérés")
            
            # Récupérer les IDs des vendeurs pour les produits
            seller_marie = await self.db.sellers.find_one({"businessName": "Boutique Marie - Mode Africaine"})
            seller_paul = await self.db.sellers.find_one({"businessName": "Artisanat Camerounais Paul"})
            
            # 3. Données products
            products_data = [
                {
                    "id": str(uuid.uuid4()),
                    "sellerId": seller_marie["id"],
                    "name": {
                        "fr": "Robe Traditionnelle Camerounaise",
                        "en": "Traditional Cameroonian Dress"
                    },
                    "description": {
                        "fr": "Belle robe traditionnelle faite à la main avec des tissus locaux authentiques.",
                        "en": "Beautiful handmade traditional dress with authentic local fabrics."
                    },
                    "category": "clothing_accessories",
                    "subcategory": "traditional_wear",
                    "price": 45000,
                    "originalPrice": 60000,
                    "discount": 25,
                    "stock": 12,
                    "inStock": True,
                    "images": [
                        "https://example.com/prod001_1.jpg",
                        "https://example.com/prod001_2.jpg"
                    ],
                    "mainImage": "https://example.com/prod001_1.jpg",
                    "rating": 4.8,
                    "reviews": 124,
                    "sellerWhatsApp": "+237655111222",
                    "status": "approved",
                    "featured": True,
                    "addedDate": datetime.utcnow() - timedelta(days=20),
                    "updatedDate": datetime.utcnow() - timedelta(days=5),
                    "views": 1250,
                    "sales": 45
                },
                {
                    "id": str(uuid.uuid4()),
                    "sellerId": seller_paul["id"],
                    "name": {
                        "fr": "Masque Traditionnel Bamiléké",
                        "en": "Traditional Bamileke Mask"
                    },
                    "description": {
                        "fr": "Masque traditionnel sculpté à la main par des artisans bamiléké.",
                        "en": "Traditional mask hand-carved by Bamileke artisans."
                    },
                    "category": "handicrafts",
                    "subcategory": "sculptures",
                    "price": 75000,
                    "originalPrice": 75000,
                    "discount": 0,
                    "stock": 3,
                    "inStock": True,
                    "images": [
                        "https://example.com/mask001_1.jpg"
                    ],
                    "mainImage": "https://example.com/mask001_1.jpg",
                    "rating": 4.9,
                    "reviews": 23,
                    "sellerWhatsApp": "+237677333444",
                    "status": "approved",
                    "featured": False,
                    "addedDate": datetime.utcnow() - timedelta(days=15),
                    "updatedDate": datetime.utcnow() - timedelta(days=2),
                    "views": 456,
                    "sales": 8
                },
                {
                    "id": str(uuid.uuid4()),
                    "sellerId": seller_marie["id"],
                    "name": {
                        "fr": "Sac à Main en Raphia",
                        "en": "Raffia Handbag"
                    },
                    "description": {
                        "fr": "Sac à main élégant tissé en raphia naturel.",
                        "en": "Elegant handbag woven from natural raffia."
                    },
                    "category": "clothing_accessories",
                    "subcategory": "bags",
                    "price": 25000,
                    "originalPrice": 30000,
                    "discount": 17,
                    "stock": 8,
                    "inStock": True,
                    "images": [
                        "https://example.com/bag001_1.jpg",
                        "https://example.com/bag001_2.jpg"
                    ],
                    "mainImage": "https://example.com/bag001_1.jpg",
                    "rating": 4.5,
                    "reviews": 67,
                    "sellerWhatsApp": "+237655111222",
                    "status": "approved",
                    "featured": False,
                    "addedDate": datetime.utcnow() - timedelta(days=10),
                    "updatedDate": datetime.utcnow() - timedelta(days=1),
                    "views": 789,
                    "sales": 23
                }
            ]
            
            await self.db.products.insert_many(products_data)
            print("   ✅ Produits insérés")
            
            # 4. Points de retrait
            pickup_points_data = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Nengoo Point Douala Centre",
                    "address": "Avenue de la Liberté, Akwa, Douala",
                    "city": "Douala",
                    "phone": "+237 233 456 789",
                    "hours": "Lun-Sam: 8h-18h",
                    "latitude": 4.0511,
                    "longitude": 9.7679,
                    "isActive": True,
                    "maxOrdersPerDay": 100,
                    "createdAt": datetime.utcnow() - timedelta(days=90),
                    "updatedAt": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Nengoo Point Yaoundé Bastos",
                    "address": "Quartier Bastos, Yaoundé",
                    "city": "Yaoundé",
                    "phone": "+237 222 333 444",
                    "hours": "Lun-Sam: 9h-17h",
                    "latitude": 3.8480,
                    "longitude": 11.5021,
                    "isActive": True,
                    "maxOrdersPerDay": 80,
                    "createdAt": datetime.utcnow() - timedelta(days=85),
                    "updatedAt": datetime.utcnow()
                }
            ]
            
            await self.db.pickupPoints.insert_many(pickup_points_data)
            print("   ✅ Points de retrait insérés")
            
            # 5. Commandes
            user_marie = await self.db.users.find_one({"name": "Marie Kouam"})
            product_robe = await self.db.products.find_one({"name.fr": "Robe Traditionnelle Camerounaise"})
            
            orders_data = [
                {
                    "id": "CMD001",
                    "buyerId": user_marie["id"],
                    "buyerName": "Marie Kouam",
                    "buyerWhatsApp": "+237655123456",
                    "sellerId": seller_marie["id"],
                    "sellerName": "Boutique Marie",
                    "items": [{
                        "productId": product_robe["id"],
                        "name": "Robe Traditionnelle Camerounaise",
                        "quantity": 1,
                        "price": 45000,
                        "subtotal": 45000
                    }],
                    "subtotal": 45000,
                    "shippingCost": 0,
                    "tax": 4500,
                    "total": 49500,
                    "deliveryOption": "home",
                    "shippingAddress": {
                        "name": "Marie Kouam",
                        "address": "Avenue de la Liberté, Akwa",
                        "city": "Douala",
                        "phone": "+237655123456"
                    },
                    "pickupPoint": None,
                    "paymentMethod": "mtnMoney",
                    "paymentStatus": "paid",
                    "status": "delivered",
                    "orderDate": datetime.utcnow() - timedelta(days=7),
                    "paidDate": datetime.utcnow() - timedelta(days=7, hours=1),
                    "shippedDate": datetime.utcnow() - timedelta(days=6),
                    "deliveredDate": datetime.utcnow() - timedelta(days=5),
                    "customerNotes": "Appeler avant livraison SVP",
                    "trackingNumber": "TRK123456789",
                    "createdAt": datetime.utcnow() - timedelta(days=7),
                    "updatedAt": datetime.utcnow() - timedelta(days=5)
                }
            ]
            
            await self.db.orders.insert_many(orders_data)
            print("   ✅ Commandes insérées")
            
            # 6. Messages
            messages_data = [
                {
                    "id": str(uuid.uuid4()),
                    "senderId": user_marie["id"],
                    "senderName": "Marie Kouam",
                    "senderType": "buyer",
                    "recipientId": seller_marie["id"],
                    "recipientName": "Marie Nkomo",
                    "recipientType": "seller",
                    "subject": "Question sur la robe traditionnelle",
                    "message": "Bonjour, avez-vous cette robe en taille L ?",
                    "productId": product_robe["id"],
                    "productName": "Robe Traditionnelle Camerounaise",
                    "read": True,
                    "replied": True,
                    "sentDate": datetime.utcnow() - timedelta(days=8),
                    "readDate": datetime.utcnow() - timedelta(days=8, hours=2),
                    "createdAt": datetime.utcnow() - timedelta(days=8),
                    "updatedAt": datetime.utcnow() - timedelta(days=8, hours=2)
                }
            ]
            
            await self.db.messages.insert_many(messages_data)
            print("   ✅ Messages insérés")
            
            # 7. Avis
            reviews_data = [
                {
                    "id": str(uuid.uuid4()),
                    "productId": product_robe["id"],
                    "sellerId": seller_marie["id"],
                    "buyerId": user_marie["id"],
                    "buyerName": "Marie Kouam",
                    "orderId": "CMD001",
                    "rating": 5,
                    "title": "Excellente qualité !",
                    "comment": "Très belle robe, tissu de qualité et finitions parfaites. Je recommande !",
                    "images": [],
                    "verified": True,
                    "helpful": 3,
                    "sellerReply": "Merci beaucoup pour votre avis ! Nous sommes ravis que la robe vous plaise.",
                    "sellerReplyDate": datetime.utcnow() - timedelta(days=4),
                    "reviewDate": datetime.utcnow() - timedelta(days=5),
                    "createdAt": datetime.utcnow() - timedelta(days=5),
                    "updatedAt": datetime.utcnow() - timedelta(days=4)
                }
            ]
            
            await self.db.reviews.insert_many(reviews_data)
            print("   ✅ Avis insérés")
            
            self.results['test_data_inserted'] = True
            print("✅ Toutes les données de test insérées avec succès")
            return True
            
        except Exception as e:
            self.results['errors'].append(f"Erreur insertion données: {str(e)}")
            print(f"❌ Erreur insertion données: {e}")
            return False

    async def verify_database_state(self):
        """Vérification finale de l'état de la base de données"""
        if not self.db:
            return False
            
        print("\n🔍 Vérification de l'état de la base de données...")
        
        try:
            collections = ['users', 'sellers', 'products', 'orders', 'pickupPoints', 'messages', 'reviews']
            
            for collection_name in collections:
                collection = getattr(self.db, collection_name)
                count = await collection.count_documents({})
                print(f"   📊 {collection_name}: {count} documents")
                
                # Vérifier les index
                indexes = await collection.list_indexes().to_list(length=None)
                print(f"      Index: {len(indexes)} créés")
            
            print("✅ Vérification terminée")
            return True
            
        except Exception as e:
            self.results['errors'].append(f"Erreur vérification: {str(e)}")
            print(f"❌ Erreur vérification: {e}")
            return False

    async def close_connection(self):
        """Fermeture de la connexion MongoDB"""
        if self.client:
            self.client.close()

    def print_summary(self):
        """Affichage du résumé des tests"""
        print("\n" + "="*60)
        print("📋 RÉSUMÉ DES TESTS NENGOO BACKEND")
        print("="*60)
        
        print(f"🔧 Backend Status: {'✅ OK' if self.results['backend_status'] else '❌ FAILED'}")
        print(f"📡 MongoDB Connection: {'✅ OK' if self.results['mongodb_connection'] else '❌ FAILED'}")
        print(f"🗄️ Collections Created: {'✅ OK' if self.results['collections_created'] else '❌ FAILED'}")
        print(f"📊 Indexes Created: {'✅ OK' if self.results['indexes_created'] else '❌ FAILED'}")
        print(f"💾 Test Data Inserted: {'✅ OK' if self.results['test_data_inserted'] else '❌ FAILED'}")
        
        print(f"\n🌐 API Endpoints:")
        for endpoint, result in self.results['api_endpoints'].items():
            status_icon = "✅" if result['status'] == 'success' else "❌"
            print(f"   {status_icon} {endpoint}: {result.get('status_code', 'N/A')}")
        
        if self.results['errors']:
            print(f"\n❌ Erreurs rencontrées:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        # Score global
        total_checks = 5
        passed_checks = sum([
            self.results['backend_status'],
            self.results['mongodb_connection'],
            self.results['collections_created'],
            self.results['indexes_created'],
            self.results['test_data_inserted']
        ])
        
        score = (passed_checks / total_checks) * 100
        print(f"\n🎯 Score global: {score:.1f}% ({passed_checks}/{total_checks})")
        
        if score >= 80:
            print("🎉 Backend Nengoo prêt pour la production !")
        elif score >= 60:
            print("⚠️ Backend partiellement fonctionnel - corrections nécessaires")
        else:
            print("🚨 Backend nécessite des corrections importantes")

async def main():
    """Fonction principale de test"""
    print("🚀 DÉMARRAGE DES TESTS BACKEND NENGOO")
    print("="*60)
    
    tester = NengooTester()
    
    try:
        # 1. Test des endpoints backend
        tester.test_backend_endpoints()
        
        # 2. Connexion MongoDB
        if await tester.connect_mongodb():
            # 3. Création des collections et index
            await tester.create_collections_and_indexes()
            
            # 4. Insertion des données de test
            await tester.insert_test_data()
            
            # 5. Vérification finale
            await tester.verify_database_state()
        
        # 6. Affichage du résumé
        tester.print_summary()
        
    except Exception as e:
        print(f"❌ Erreur critique: {e}")
        tester.results['errors'].append(f"Erreur critique: {str(e)}")
    
    finally:
        await tester.close_connection()

if __name__ == "__main__":
    asyncio.run(main())