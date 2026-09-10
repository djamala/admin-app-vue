<?php

namespace App\Http\Controllers;

use App\Enums\NotificationAction;
use App\Enums\NotificationModule;
use App\Enums\NotificationType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{

    public function index(Request $request)
    {
        $query = Auth::user()->notifications()->with('actor:id,name,avatar');

        if ($request->filled('module')) {
            $query->where('module', $request->string('module'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        if ($request->filled('status')) {
            match ($request->string('status')->toString()) {
                'unread' => $query->whereNull('read_at'),
                'read' => $query->whereNotNull('read_at'),
                default => null,
            };
        }

        $notifications = $query
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn($n) => [
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
                'read' => ! is_null($n->read_at),
                'time' => $n->created_at->diffForHumans(),
                'date' => $n->created_at->format('d/m/Y H:i'),
                'actor' => $n->actor ? [
                    'name' => $n->actor->name,
                    'avatar' => $n->actor->avatar,
                ] : null,
            ]);

        return Inertia::render('notifications/Index', [
            'notifications' => $notifications,
            'filters' => $request->only(['module', 'type', 'action', 'status']),
            'options' => [
                'modules' => collect(NotificationModule::cases())->map(fn($m) => [
                    'value' => $m->value,
                    'label' => $m->label(),
                ]),
                'types' => collect(NotificationType::cases())->map(fn($t) => [
                    'value' => $t->value,
                    'label' => ucfirst($t->value),
                ]),
                'actions' => collect(NotificationAction::cases())->map(fn($a) => [
                    'value' => $a->value,
                    'label' => $a->label(),
                ]),
            ],
        ]);
    }
    public function feed(Request $request)
    {
        $notifications = Auth::user()
            ->notifications()
            ->with('actor:id,name,avatar')
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn($n) => [
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
                'read' => ! is_null($n->read_at),
                'time' => $n->created_at->diffForHumans(),
                'actor' => $n->actor ? [
                    'name' => $n->actor->name,
                    'avatar' => $n->actor->avatar,
                ] : null,
            ]);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => Auth::user()->notifications()->unread()->count(),
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {

        $notification = Auth::user()->notifications()->findOrFail($id);

        $notification->markAsRead();

        return response()->noContent();
    }

    public function markAllAsRead(Request $request)
    {
        Auth::user()->notifications()->unread()->update(['read_at' => now()]);

        return response()->noContent();
    }
}
