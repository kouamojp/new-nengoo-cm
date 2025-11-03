<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    protected WhatsAppService $whatsappService;

    public function __construct(WhatsAppService $whatsappService)
    {
        $this->whatsappService = $whatsappService;
    }

    /**
     * Register a new buyer
     */
    public function registerBuyer(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|unique:users,whatsapp_number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'whatsapp_number' => $request->whatsapp_number,
            'type' => 'buyer',
            'status' => 'active',
            'whatsapp_verified' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ],
            'message' => 'Compte acheteur créé avec succès'
        ], 201);
    }

    /**
     * Register a new seller
     */
    public function registerSeller(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|unique:users,whatsapp_number',
            'email' => 'required|email|unique:users,email',
            'business_name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'categories' => 'required|array|min:1',
            'categories.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'whatsapp_number' => $request->whatsapp_number,
            'email' => $request->email,
            'business_name' => $request->business_name,
            'city' => $request->city,
            'categories' => $request->categories,
            'type' => 'seller',
            'status' => 'pending',
            'whatsapp_verified' => false,
        ]);

        // Send WhatsApp notification to admin
        $this->whatsappService->notifyAdminNewSeller($user);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Demande d\'inscription vendeur soumise. Vous recevrez une confirmation par WhatsApp.'
        ], 201);
    }

    /**
     * Login user via WhatsApp number
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'whatsapp_number' => 'required|string',
            'type' => 'required|in:buyer,seller'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('whatsapp_number', $request->whatsapp_number)
                   ->where('type', $request->type)
                   ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Numéro WhatsApp non trouvé pour ce type de compte'
            ], 401);
        }

        if ($user->type === 'seller' && $user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Compte vendeur non approuvé. Contactez l\'administrateur.'
            ], 401);
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_seen_at' => now()
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer'
            ],
            'message' => 'Connexion réussie'
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->updateLastSeen();

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $rules = [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'business_description' => 'sometimes|nullable|string',
            'address' => 'sometimes|nullable|string',
            'social_links' => 'sometimes|nullable|array',
        ];

        if ($user->isSeller()) {
            $rules['business_name'] = 'sometimes|required|string|max:255';
            $rules['categories'] = 'sometimes|required|array|min:1';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only([
            'name', 'email', 'business_name', 'business_description',
            'address', 'categories', 'social_links'
        ]));

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Profil mis à jour avec succès'
        ]);
    }

    /**
     * Verify WhatsApp number (placeholder for future implementation)
     */
    public function verifyWhatsApp(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // In a real implementation, this would involve sending a verification code
        $user->update(['whatsapp_verified' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Numéro WhatsApp vérifié avec succès'
        ]);
    }
}