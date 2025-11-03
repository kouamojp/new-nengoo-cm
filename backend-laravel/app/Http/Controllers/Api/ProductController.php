<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Get all products with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['seller', 'reviews'])->active();

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by seller
        if ($request->has('seller_id')) {
            $query->bySeller($request->seller_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by availability
        if ($request->boolean('in_stock_only')) {
            $query->inStock();
        }

        // Filter by featured
        if ($request->boolean('featured_only')) {
            $query->featured();
        }

        // Filter by discount
        if ($request->boolean('on_discount')) {
            $query->onDiscount();
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        switch ($sortBy) {
            case 'price_low_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_low':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('average_rating', 'desc');
                break;
            case 'popularity':
                $query->orderBy('total_orders', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get featured products
     */
    public function featured(): JsonResponse
    {
        $products = Product::with(['seller', 'reviews'])
            ->active()
            ->featured()
            ->inStock()
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Get product details
     */
    public function show(string $id): JsonResponse
    {
        $product = Product::with(['seller', 'reviews.reviewer'])
            ->where('_id', $id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        // Increment view count
        $product->incrementViews();

        // Get related products
        $relatedProducts = Product::active()
            ->byCategory($product->category)
            ->where('_id', '!=', $product->id)
            ->inStock()
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'product' => $product,
                'related_products' => $relatedProducts
            ]
        ]);
    }

    /**
     * Create new product (seller only)
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isSeller() || !$user->isActive()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'required|array|min:1',
            'images.*' => 'string', // Image URLs or paths
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'price' => $request->price,
            'currency' => 'XAF',
            'images' => $request->images,
            'main_image' => $request->images[0],
            'seller_id' => $user->id,
            'stock_quantity' => $request->stock_quantity,
            'weight' => $request->weight,
            'dimensions' => $request->dimensions,
            'tags' => $request->tags ?? [],
            'sku' => 'NGO-' . strtoupper(Str::random(8)),
            'is_active' => true,
            'is_featured' => false,
        ]);

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Produit créé avec succès'
        ], 201);
    }

    /**
     * Update product (seller only)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $product = Product::where('_id', $id)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        if ($product->seller_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'images' => 'sometimes|required|array|min:1',
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only([
            'name', 'description', 'category', 'price', 'stock_quantity',
            'images', 'weight', 'dimensions', 'tags', 'is_active'
        ]);

        if (isset($updateData['images'])) {
            $updateData['main_image'] = $updateData['images'][0];
        }

        $product->update($updateData);

        return response()->json([
            'success' => true,
            'data' => $product,
            'message' => 'Produit mis à jour avec succès'
        ]);
    }

    /**
     * Delete product (seller only)
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $product = Product::where('_id', $id)->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], 404);
        }

        if ($product->seller_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produit supprimé avec succès'
        ]);
    }

    /**
     * Get products by category
     */
    public function byCategory(string $category): JsonResponse
    {
        $products = Product::with(['seller', 'reviews'])
            ->active()
            ->byCategory($category)
            ->inStock()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        
        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Terme de recherche requis'
            ], 400);
        }

        $products = Product::with(['seller', 'reviews'])
            ->active()
            ->search($query)
            ->inStock()
            ->orderBy('average_rating', 'desc')
            ->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $products,
            'query' => $query
        ]);
    }
}