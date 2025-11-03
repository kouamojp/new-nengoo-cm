<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::active()->ordered();

        // Get only root categories if requested
        if ($request->boolean('root_only')) {
            $query->rootCategories();
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get category with its products
     */
    public function show(string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->with(['products' => function($query) {
                $query->active()->inStock()->with(['seller', 'reviews']);
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Get category hierarchy
     */
    public function hierarchy(): JsonResponse
    {
        $categories = Category::active()
            ->rootCategories()
            ->with('children')
            ->ordered()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}