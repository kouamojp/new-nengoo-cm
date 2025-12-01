
import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8001/api';

const ProductManagement = (props) => {
    const { user } = props;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: '',
        description: '',
        category: '',
        price: 0,
        sellerId: '',
        sellerName: '',
        stock: 0,
        images: [''],
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadMethod, setUploadMethod] = useState('url'); // 'url' ou 'file'

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            console.log("Catégories récupérées:", data); // Log pour debug
            setCategories(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories:", error);
            alert("Erreur: Impossible de charger les catégories. Veuillez en créer d'abord dans la section 'Catégories'.");
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sellers`, {
                headers: { 'X-Admin-Role': 'super_admin' }
            });
            if (!response.ok) throw new Error('Failed to fetch sellers');
            const data = await response.json();
            console.log("Vendeurs récupérés:", data); // Log pour debug
            setSellers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des vendeurs:", error);
            // Pas d'alert ici car les vendeurs sont optionnels
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSellers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Si on change le vendeur, mettre à jour aussi le nom
        if (name === 'sellerId') {
            const selectedSeller = sellers.find(s => s.id === value);
            setNewProductData({
                ...newProductData,
                sellerId: value,
                sellerName: selectedSeller ? selectedSeller.businessName : ''
            });
        } else {
            setNewProductData({ ...newProductData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Validation selon la méthode choisie
        if (uploadMethod === 'url' && !imageUrl.trim()) {
            alert('Veuillez entrer une URL d\'image valide.');
            return;
        }
        if (uploadMethod === 'file' && !selectedFile) {
            alert('Veuillez sélectionner une image pour le produit.');
            return;
        }

        setUploading(true);
        let finalImageUrl = '';

        try {
            if (uploadMethod === 'url') {
                // Méthode simple : utiliser directement l'URL fournie
                console.log("🖼️ [ProductManagement] Utilisation de l'URL d'image:", imageUrl);
                finalImageUrl = imageUrl;
            } else {
                // Méthode avec upload S3 (nécessite configuration AWS)
                console.log("📤 [ProductManagement] Demande d'URL pré-signée pour:", selectedFile.name);
                console.log("📤 [ProductManagement] API URL:", `${API_BASE_URL}/generate-presigned-url`);

                const presignedResponse = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Admin-Role': 'super_admin',
                    },
                    body: JSON.stringify({
                        fileName: selectedFile.name,
                        fileType: selectedFile.type,
                    }),
                }).catch(err => {
                    console.error("❌ [ProductManagement] Erreur réseau lors de la demande d'URL:", err);
                    throw new Error(`Impossible de contacter le backend à ${API_BASE_URL}. Vérifiez que le serveur backend est lancé et accessible.`);
                });

                if (!presignedResponse.ok) {
                    const errorText = await presignedResponse.text();
                    console.error("❌ [ProductManagement] Erreur HTTP:", presignedResponse.status, errorText);
                    try {
                        const err = JSON.parse(errorText);
                        throw new Error(err.detail || `Erreur ${presignedResponse.status}: ${errorText}`);
                    } catch (e) {
                        throw new Error(errorText || `Erreur ${presignedResponse.status}: Failed to get pre-signed URL`);
                    }
                }

                console.log("✅ [ProductManagement] URL pré-signée reçue");
                const { uploadUrl, publicUrl } = await presignedResponse.json();
                console.log("📝 [ProductManagement] URL publique:", publicUrl);

                // Upload file directly to S3
                console.log("☁️ [ProductManagement] Upload vers S3...");
                const uploadToS3Response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': selectedFile.type,
                    },
                    body: selectedFile,
                }).catch(err => {
                    console.error("❌ [ProductManagement] Erreur CORS lors de l'upload S3:", err);
                    throw new Error(`Erreur CORS S3: Le bucket S3 n'est pas configuré pour accepter les requêtes depuis ${window.location.origin}. Consultez le fichier AWS_S3_CORS_CONFIGURATION.md pour la solution. 💡 Alternative : Utilisez la méthode "URL d'image" à la place.`);
                });

                if (!uploadToS3Response.ok) {
                    const errorText = await uploadToS3Response.text();
                    throw new Error(`Erreur S3 (${uploadToS3Response.status}): ${errorText || 'Failed to upload file to S3'}`);
                }

                console.log("✅ [ProductManagement] Fichier uploadé vers S3 avec succès");

                finalImageUrl = publicUrl;
            }

            // 3. Create product with the image URL
            // Si aucun vendeur n'est sélectionné, attribuer à l'admin par défaut
            const finalSellerId = newProductData.sellerId || (user ? user.id : 'admin_default');
            const finalSellerName = newProductData.sellerName || (user ? user.name : 'Admin');

            console.log("📝 [ProductManagement] Création du produit avec l'URL:", finalImageUrl);

            const productToCreate = {
                ...newProductData,
                sellerId: finalSellerId,
                sellerName: finalSellerName,
                images: [finalImageUrl],
            };

            console.log("📦 [ProductManagement] Données du produit:", productToCreate);

            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Role': 'super_admin',
                },
                body: JSON.stringify(productToCreate),
            });
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const err = JSON.parse(errorText);
                    throw new Error(err.detail || 'Failed to create product');
                } catch (e) {
                    throw new Error(errorText || 'Failed to create product');
                }
            }
            await fetchProducts();
            setShowAddModal(false);
            setNewProductData({ // Reset form
                name: '',
                description: '',
                category: '',
                price: 0,
                sellerId: '',
                sellerName: '',
                stock: 0,
                images: [''],
            });
            setSelectedFile(null); // Clear selected file
            setImageUrl(''); // Clear URL field
            alert('✅ Produit ajouté avec succès!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setUploading(false);
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Gestion des produits ({products.length})</h2>
                <button onClick={() => setShowAddModal(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                    + Ajouter un Produit
                </button>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">📦 Ajouter un nouveau produit</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit *</label>
                                <input type="text" name="name" value={newProductData.name} onChange={handleInputChange} placeholder="Ex: Smartphone Samsung Galaxy" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea name="description" value={newProductData.description} onChange={handleInputChange} placeholder="Description détaillée du produit" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" rows="3" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                                <select name="category" value={newProductData.category} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                                    <option value="">-- Sélectionnez une catégorie --</option>
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Aucune catégorie disponible</option>
                                    )}
                                </select>
                                {categories.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">⚠️ Aucune catégorie trouvée. Veuillez créer des catégories d'abord.</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Nombre de catégories: {categories.length}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix (XAF) *</label>
                                    <input type="number" name="price" value={newProductData.price} onChange={handleInputChange} placeholder="0" min="0" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                    <input type="number" name="stock" value={newProductData.stock} onChange={handleInputChange} placeholder="0" min="0" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vendeur (optionnel - Admin par défaut)</label>
                                <select name="sellerId" value={newProductData.sellerId} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="">-- Admin (par défaut) --</option>
                                    {sellers.length > 0 ? (
                                        sellers.map((seller) => (
                                            <option key={seller.id} value={seller.id}>
                                                {seller.businessName} ({seller.city})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Aucun vendeur enregistré</option>
                                    )}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {sellers.length > 0
                                        ? `${sellers.length} vendeur(s) disponible(s). Si aucun n'est sélectionné, le produit sera attribué à l'admin.`
                                        : "Aucun vendeur enregistré. Le produit sera attribué à l'admin."
                                    }
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit *</label>

                                {/* Choix de la méthode d'upload */}
                                <div className="flex flex-col space-y-2 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <label className="flex items-center cursor-pointer p-3 border-2 border-green-500 bg-green-50 rounded-lg hover:bg-green-100 transition">
                                        <input
                                            type="radio"
                                            name="uploadMethod"
                                            value="url"
                                            checked={uploadMethod === 'url'}
                                            onChange={(e) => setUploadMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-green-700">✅ URL d'image (Recommandé)</span>
                                            <p className="text-xs text-gray-600 mt-1">Simple et rapide - aucune configuration requise</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition">
                                        <input
                                            type="radio"
                                            name="uploadMethod"
                                            value="file"
                                            checked={uploadMethod === 'file'}
                                            onChange={(e) => setUploadMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold">📤 Upload fichier (AWS S3)</span>
                                            <p className="text-xs text-orange-600 mt-1">Nécessite configuration CORS sur S3</p>
                                        </div>
                                    </label>
                                </div>

                                {uploadMethod === 'url' ? (
                                    <div>
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://exemple.com/image.jpg"
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            💡 Méthode recommandée : Entrez l'URL d'une image hébergée en ligne
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            name="imageFile"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            accept="image/*"
                                            required
                                        />
                                        <p className="text-xs text-orange-600 mt-1">
                                            ⚠️ Nécessite configuration AWS S3 (variables d'environnement requises)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Formats acceptés: JPG, PNG, WEBP (max 5MB)
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors" disabled={uploading}>
                                {uploading ? '📤 Téléchargement en cours...' : '✅ Ajouter le produit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? <p className="p-6">Chargement...</p> : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendeur</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4 text-sm">{product.sellerName}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Modifier</button>
                                        <button className="text-red-600 hover:text-red-800 font-semibold text-sm ml-4">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
