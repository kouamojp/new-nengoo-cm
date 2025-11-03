<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class PickupPoint extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'pickup_points';

    protected $fillable = [
        'name',
        'address',
        'city',
        'region',
        'phone',
        'whatsapp',
        'email',
        'operating_hours',
        'coordinates',
        'is_active',
        'capacity',
        'current_load',
        'facilities',
        'contact_person',
    ];

    protected $casts = [
        'operating_hours' => 'array',
        'coordinates' => 'array',
        'facilities' => 'array',
        'is_active' => 'boolean',
        'capacity' => 'integer',
        'current_load' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getFormattedAddressAttribute(): string
    {
        return $this->address . ', ' . $this->city;
    }

    public function getFormattedPhoneAttribute(): string
    {
        $phone = $this->phone;
        if (!str_starts_with($phone, '+')) {
            $phone = '+237' . ltrim($phone, '0');
        }
        return $phone;
    }

    public function isAvailable(): bool
    {
        return $this->is_active && $this->current_load < $this->capacity;
    }

    public function getLoadPercentageAttribute(): float
    {
        if ($this->capacity == 0) return 0;
        return round(($this->current_load / $this->capacity) * 100, 2);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCity($query, string $city)
    {
        return $query->where('city', $city);
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_active', true)
                     ->whereColumn('current_load', '<', 'capacity');
    }
}