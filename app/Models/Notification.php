<?php

namespace App\Models;


use App\Enums\NotificationAction;
use App\Enums\NotificationModule;
use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;


#[Fillable([
    'user_id',
    'actor_id',
    'title',
    'description',
    'type',
    'action',
    'module',
    'url',
    'data',
    'read_at'
])]
class Notification extends Model
{

    use HasFactory, HasUuids;

    public function casts(): array
    {
        return [
            'type' => NotificationType::class,
            'action' => NotificationAction::class,
            'module' => NotificationModule::class,
            'data' => 'array',
            'read_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    // public function markAsRead(): void
    // {
    //     if (is_null($this->read_at)) {
    //         $this->update(['read_at' => now()]);
    //     }
    // }

    public function markAsRead(): bool
    {
        if (is_null($this->read_at)) {
            return $this->update([
                'read_at' => now(),
            ]);
        }

        return true;
    }

    public function getIconAttribute(): string
    {
        return $this->action->icon();
    }

    public function getColorAttribute(): string
    {
        return $this->type->color();
    }
}
