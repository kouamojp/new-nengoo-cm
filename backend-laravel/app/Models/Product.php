<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'currency',
        'images',
        'main_image',
        'seller_id',
        'stock_quantity',
        'min_order_quantity',
        'max_order_quantity',
        'is_active',
        'is_featured',
        'weight',
        'dimensions',
        'sku',
        'barcode',
        'tags',
        'meta_title',
        'meta_description',
        'seo_keywords',
        'discount_percentage',
        'discount_start_date',
        'discount_end_date',
        'shipping_cost',
        'processing_time',
        'return_policy',
        'warranty_period',
        'specifications',
        'total_views',
        'total_orders',
        'average_rating',
        'total_reviews',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
        'dimensions' => 'array',
        'tags' => 'array',
        'specifications' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'stock_quantity' => 'integer',
        'min_order_quantity' => 'integer',
        'max_order_quantity' => 'integer',
        'weight' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'total_views' => 'integer',
        'total_orders' => 'integer',
        'total_reviews' => 'integer',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Available product categories
     */
    public const CATEGORIES = [
        'clothing_accessories' => 'Vêtements et Accessoires',
        'food_drinks' => 'Aliments et Boissons',
        'electronics' => 'Électroniques',
        'home_garden' => 'Maison & Jardinage',
        'handicrafts' => 'Artisanat et Produits Faits Main',
        'beauty_care' => 'Produits de Beauté et Soins Personnels',
        'sports_articles' => 'Articles Sportifs',
        'toys' => 'Jouets pour Enfants',
        'medical_equipment' => 'Matériel Médical',
        'professional_equipment' => 'Équipements Professionnels',
        'services' => 'Services',
        'travel_tickets' => 'Voyages et Billets',
    ];

    /**
     * Get the seller that owns the product
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the reviews for the product
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the order items for the product
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the cart items for the product
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the wishlist items for the product
     */
    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    /**
     * Check if product is in stock
     */
    public function isInStock(): bool
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Check if product is on discount
     */
    public function isOnDiscount(): bool
    {
        return $this->discount_percentage > 0 
            && (!$this->discount_start_date || $this->discount_start_date <= now())
            && (!$this->discount_end_date || $this->discount_end_date >= now());
    }

    /**
     * Get discounted price
     */
    public function getDiscountedPriceAttribute(): float
    {
        if (!$this->isOnDiscount()) {
            return $this->price;
        }

        return $this->price - ($this->price * $this->discount_percentage / 100);
    }

    /**
     * Get formatted price with currency
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 0, ',', ' ') . ' ' . ($this->currency ?? 'XAF');
    }

    /**
     * Get formatted discounted price
     */
    public function getFormattedDiscountedPriceAttribute(): string
    {
        return number_format($this->discounted_price, 0, ',', ' ') . ' ' . ($this->currency ?? 'XAF');
    }

    /**
     * Get main image URL
     */
    public function getMainImageUrlAttribute(): ?string
    {
        if ($this->main_image) {
            return asset('storage/' . $this->main_image);
        }

        if (!empty($this->images)) {
            return asset('storage/' . $this->images[0]);
        }

        return asset('images/placeholder-product.png');
    }

    /**
     * Get all image URLs
     */
    public function getImageUrlsAttribute(): array
    {
        if (empty($this->images)) {
            return [asset('images/placeholder-product.png')];
        }

        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->images);
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('total_views');
    }

    /**
     * Update average rating
     */
    public function updateAverageRating(): void
    {
        $avgRating = $this->reviews()->avg('rating') ?? 0;
        $totalReviews = $this->reviews()->count();
        
        $this->update([
            'average_rating' => round($avgRating, 2),
            'total_reviews' => $totalReviews
        ]);
    }

    /**
     * Reduce stock quantity
     */
    public function reduceStock(int $quantity): bool
    {
        if ($this->stock_quantity >= $quantity) {
            $this->decrement('stock_quantity', $quantity);
            return true;
        }
        return false;
    }

    /**
     * Increase stock quantity
     */
    public function increaseStock(int $quantity): void
    {
        $this->increment('stock_quantity', $quantity);
    }

    /**
     * Scope for active products
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured products
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for in stock products
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Scope for products by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for products by seller
     */
    public function scopeBySeller($query, string $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    /**
     * Scope for products with discounts
     */
    public function scopeOnDiscount($query)
    {
        return $query->where('discount_percentage', '>', 0)
                     ->where(function($q) {
                         $q->whereNull('discount_start_date')
                           ->orWhere('discount_start_date', '<=', now());
                     })
                     ->where(function($q) {
                         $q->whereNull('discount_end_date')
                           ->orWhere('discount_end_date', '>=', now());
                     });
    }

    /**
     * Search products by name or description
     */
    public function scopeSearch($query, string $term)
    {
        return $query->where(function($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%")
              ->orWhere('tags', 'like', "%{$term}%");
        });
    }
}