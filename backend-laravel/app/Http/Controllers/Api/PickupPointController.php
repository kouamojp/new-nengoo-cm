<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PickupPoint;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PickupPointController extends Controller
{
    /**
     * Get all active pickup points
     */
    public function index(Request $request): JsonResponse
    {
        $query = PickupPoint::active();

        // Filter by city
        if ($request->has('city')) {
            $query->byCity($request->city);
        }

        // Filter by availability
        if ($request->boolean('available_only')) {
            $query->available();
        }

        $pickupPoints = $query->orderBy('city')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $pickupPoints
        ]);
    }

    /**
     * Get pickup point details
     */
    public function show(string $id): JsonResponse
    {
        $pickupPoint = PickupPoint::where('_id', $id)->first();

        if (!$pickupPoint) {
            return response()->json([
                'success' => false,
                'message' => 'Point de retrait non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $pickupPoint
        ]);
    }

    /**
     * Get pickup points by city
     */
    public function byCity(string $city): JsonResponse
    {
        $pickupPoints = PickupPoint::active()
            ->byCity($city)
            ->available()
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pickupPoints
        ]);
    }

    /**
     * Get available cities with pickup points
     */
    public function cities(): JsonResponse
    {
        $cities = PickupPoint::active()
            ->distinct('city')
            ->pluck('city')
            ->sort()
            ->values();

        return response()->json([
            'success' => true,
            'data' => $cities
        ]);
    }
}