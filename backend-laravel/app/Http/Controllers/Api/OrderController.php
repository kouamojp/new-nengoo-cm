<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\PickupPoint;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Get user orders
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Order::with(['items.product', 'seller', 'buyer', 'pickupPoint']);

        if ($user->isBuyer()) {
            $query->byBuyer($user->id);
        } elseif ($user->isSeller()) {
            $query->bySeller($user->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Get order details
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $query = Order::with(['items.product', 'seller', 'buyer', 'pickupPoint']);

        if ($user->isBuyer()) {
            $query->byBuyer($user->id);
        } elseif ($user->isSeller()) {
            $query->bySeller($user->id);
        }

        $order = $query->where('_id', $id)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Create new order
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isBuyer()) {
            return response()->json([
                'success' => false,
                'message' => 'Seuls les acheteurs peuvent passer des commandes'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string|exists:products,_id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:mtn_money,orange_money,credit_card,cash_on_delivery',
            'delivery_method' => 'required|in:home_delivery,pickup_point',
            'pickup_point_id' => 'required_if:delivery_method,pickup_point|exists:pickup_points,_id',
            'billing_address' => 'required|array',
            'billing_address.first_name' => 'required|string',
            'billing_address.last_name' => 'required|string',
            'billing_address.phone' => 'required|string',
            'billing_address.email' => 'required|email',
            'shipping_address' => 'required_if:delivery_method,home_delivery|array',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request, $user) {
                $subtotal = 0;
                $orderItems = [];
                $sellerId = null;

                // Validate items and calculate totals
                foreach ($request->items as $item) {
                    $product = Product::where('_id', $item['product_id'])->first();
                    
                    if (!$product || !$product->isInStock() || $product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Produit {$product->name} indisponible ou stock insuffisant");
                    }

                    // For simplicity, assume all items are from the same seller
                    if (!$sellerId) {
                        $sellerId = $product->seller_id;
                    } elseif ($sellerId !== $product->seller_id) {
                        throw new \Exception("Tous les produits doivent provenir du même vendeur");
                    }

                    $itemTotal = $product->discounted_price * $item['quantity'];
                    $subtotal += $itemTotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_image' => $product->main_image_url,
                        'quantity' => $item['quantity'],
                        'unit_price' => $product->discounted_price,
                        'total_price' => $itemTotal,
                        'product_sku' => $product->sku,
                    ];
                }

                // Calculate costs
                $shippingCost = $request->delivery_method === 'pickup_point' ? 0 : ($subtotal > 50000 ? 0 : 2500);
                $taxAmount = $subtotal * 0.1; // 10% tax
                $totalAmount = $subtotal + $shippingCost + $taxAmount;

                // Create order
                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'buyer_id' => $user->id,
                    'seller_id' => $sellerId,
                    'status' => Order::STATUS_PENDING,
                    'payment_status' => Order::PAYMENT_PENDING,
                    'payment_method' => $request->payment_method,
                    'delivery_method' => $request->delivery_method,
                    'pickup_point_id' => $request->pickup_point_id,
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'shipping_cost' => $shippingCost,
                    'total_amount' => $totalAmount,
                    'currency' => 'XAF',
                    'billing_address' => $request->billing_address,
                    'shipping_address' => $request->shipping_address,
                    'notes' => $request->notes,
                ]);

                // Create order items
                foreach ($orderItems as $itemData) {
                    $itemData['order_id'] = $order->id;
                    OrderItem::create($itemData);
                    
                    // Reduce stock
                    $product = Product::where('_id', $itemData['product_id'])->first();
                    $product->reduceStock($itemData['quantity']);
                    $product->increment('total_orders');
                }

                // Process payment if not cash on delivery
                if ($request->payment_method !== 'cash_on_delivery') {
                    $paymentResult = $this->paymentService->processPayment(
                        $order,
                        $request->payment_method,
                        $request->payment_details ?? []
                    );
                    
                    if (!$paymentResult['success']) {
                        throw new \Exception($paymentResult['message']);
                    }
                    
                    $order->update([
                        'payment_status' => Order::PAYMENT_PAID,
                        'payment_reference' => $paymentResult['reference'],
                        'status' => Order::STATUS_CONFIRMED
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'data' => $order->load(['items.product', 'seller', 'pickupPoint']),
                    'message' => 'Commande créée avec succès'
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update order status (seller only)
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::where('_id', $id)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], 404);
        }

        if (!$user->isSeller() || $order->seller_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:confirmed,processing,shipped,delivered',
            'tracking_number' => 'required_if:status,shipped|string|max:255',
            'notes' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = ['status' => $request->status];
        
        if ($request->status === 'shipped' && $request->tracking_number) {
            $updateData['tracking_number'] = $request->tracking_number;
        }
        
        if ($request->status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        $order->update($updateData);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Statut de commande mis à jour'
        ]);
    }

    /**
     * Cancel order
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::where('_id', $id)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], 404);
        }

        // Check if user can cancel this order
        if ($user->isBuyer() && $order->buyer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        if ($user->isSeller() && $order->seller_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        if (!$order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette commande ne peut plus être annulée'
            ], 400);
        }

        $reason = $request->get('reason', 'Annulée par l\'utilisateur');
        $order->cancel($reason);

        return response()->json([
            'success' => true,
            'message' => 'Commande annulée avec succès'
        ]);
    }

    /**
     * Get order statistics for seller
     */
    public function statistics(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isSeller()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux vendeurs'
            ], 403);
        }

        $stats = [
            'total_orders' => Order::bySeller($user->id)->count(),
            'pending_orders' => Order::bySeller($user->id)->byStatus(Order::STATUS_PENDING)->count(),
            'completed_orders' => Order::bySeller($user->id)->byStatus(Order::STATUS_DELIVERED)->count(),
            'total_revenue' => Order::bySeller($user->id)->paid()->sum('total_amount'),
            'monthly_revenue' => Order::bySeller($user->id)->paid()->recent(30)->sum('total_amount'),
            'average_order_value' => Order::bySeller($user->id)->paid()->avg('total_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}