<?php

namespace App\Services;

use App\Enums\NotificationAction;
use App\Enums\NotificationModule;
use App\Enums\NotificationType;
use App\Events\NotificationCreated;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    public static function notify(
        User $user,
        string $title,
        NotificationAction $action,
        NotificationModule $module,
        ?NotificationType $type = null,
        ?string $description = null,
        ?Model $notifiable = null,
        ?string $url = null,
        ?array $data = null,
        ?User $actor = null,
    ): \App\Models\Notification {
        $notification = $user->notifications()->create([
            'actor_id' => $actor?->id ?? Auth::user()->id,
            'title' => $title,
            'description' => $description,
            'type' => $type ?? self::defaultTypeFor($action),
            'action' => $action,
            'module' => $module,
            'notifiable_type' => $notifiable ? get_class($notifiable) : null,
            'notifiable_id' => $notifiable?->id,
            'url' => $url,
            'data' => $data,
        ]);

        broadcast(new NotificationCreated($notification))->toOthers();

        return $notification;
    }

    private static function defaultTypeFor(NotificationAction $action): NotificationType
    {
        return match ($action) {
            NotificationAction::Deleted, NotificationAction::Rejected => NotificationType::Warning,
            NotificationAction::Approved => NotificationType::Success,
            default => NotificationType::Info,
        };
    }
}
