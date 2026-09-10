<?php

namespace App\Events;

use App\Models\Notification;
// use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
// use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Notification $notification)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("notifications.{$this->notification->user_id}"),
        ];
    }

    public function broadcastWith(): array
    {
        $n = $this->notification;

        return [
            'id' => $n->id,
            'title' => $n->title,
            'description' => $n->description,
            'type' => $n->type->value,
            'action' => $n->action->value,
            'module' => $n->module->value,
            'module_label' => $n->module->label(),
            'icon' => $n->icon,
            'color' => $n->color,
            'url' => $n->url,
            'read' => false,
            'time' => $n->created_at->diffForHumans(),
        ];
    }
}
