<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use MongoDB\Laravel\Eloquent\Model;

class User extends Model
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'whatsapp_number',
        'phone',
        'type', // 'buyer', 'seller', 'admin'
        'status', // 'active', 'pending', 'suspended'
        'business_name',
        'business_description',
        'city',
        'address',
        'categories',
        'profile_image',
        'social_links',
        'rating',
        'total_sales',
        'total_purchases',
        'kyc_verified',
        'whatsapp_verified',
        'last_login_at',
        'last_seen_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'categories' => 'array',
        'social_links' => 'array',
        'rating' => 'decimal:2',
        'total_sales' => 'integer',
        'total_purchases' => 'integer',
        'kyc_verified' => 'boolean',
        'whatsapp_verified' => 'boolean',
        'last_login_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user's full WhatsApp number with country code
     */
    public function getFormattedWhatsAppAttribute(): string
    {
        $number = $this->whatsapp_number;
        if (!str_starts_with($number, '+')) {
            $number = '+237' . ltrim($number, '0');
        }
        return $number;
    }

    /**
     * Check if user is a seller
     */
    public function isSeller(): bool
    {
        return $this->type === 'seller';
    }

    /**
     * Check if user is a buyer  
     */
    public function isBuyer(): bool
    {
        return $this->type === 'buyer';
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->type === 'admin';
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if user is pending approval
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get products belonging to this seller
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    /**
     * Get orders made by this buyer
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'buyer_id');
    }

    /**
     * Get sales made by this seller
     */
    public function sales()
    {
        return $this->hasMany(Order::class, 'seller_id');
    }

    /**
     * Get reviews written by this user
     */
    public function reviewsGiven()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Get reviews received by this seller
     */
    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'seller_id');
    }

    /**
     * Calculate average rating for seller
     */
    public function calculateAverageRating(): float
    {
        return $this->reviewsReceived()->avg('rating') ?? 0.0;
    }

    /**
     * Update user's last seen timestamp
     */
    public function updateLastSeen(): void
    {
        $this->update(['last_seen_at' => now()]);
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for sellers
     */
    public function scopeSellers($query)
    {
        return $query->where('type', 'seller');
    }

    /**
     * Scope for buyers
     */
    public function scopeBuyers($query)
    {
        return $query->where('type', 'buyer');
    }

    /**
     * Scope for pending users
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}