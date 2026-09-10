<?php

namespace App\Http\Controllers;

use App\Enums\NotificationAction;
use App\Enums\NotificationModule;
use App\Enums\NotificationType;
use App\Enums\PermissionAction;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;



class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::all();

        return Inertia::render('permissions/Index', [
            'permissionsData' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('permissions/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255|unique:permissions,name',
    //     ]);

    //     // dd($validated['name']);

    //     $permission = Permission::create($validated);

    //     NotificationService::notify(
    //         user: $request->user(),
    //         title: "Permission créée",
    //         action: NotificationAction::Created,
    //         module: NotificationModule::Permission,
    //         type: NotificationType::Success,
    //         description: "Vous avez créé la permission « {$permission->name} »",
    //         notifiable: $permission,
    //     );

    //     return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $baseName = $validated['name'];
        $guard = $request->input('guard_name', 'web'); // ou config('auth.defaults.guard')

        $createdPermissions = [];

        foreach (PermissionAction::cases() as $action) {
            $permission = Permission::firstOrCreate([
                'name' => "{$baseName}.{$action->value}",
                'guard_name' => $guard,
            ]);
            $createdPermissions[] = $permission;
        }

        NotificationService::notify(
            user: $request->user(),
            title: "Permissions créées",
            action: NotificationAction::Created,
            module: NotificationModule::Permission,
            type: NotificationType::Success,
            description: "Vous avez créé les permissions pour « {$baseName} »",
            notifiable: $createdPermissions[0] ?? null,
        );

        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('permissions.index')->with('success', 'Permissions created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permission = Permission::findOrFail($id);

        return Inertia::render('permissions/Show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

        $permission = Permission::findOrFail($id);

        return Inertia::render('permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255|unique:permissions,name,' . $id,
    //     ]);

    //     $permission = Permission::findOrFail($id);
    //     $permission->update($request->all());

    //     return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
    // }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $permission = Permission::findOrFail($id);

        // Extraire l'ancien nom de base (avant le premier point)
        $oldBaseName = explode('.', $permission->name)[0];
        $newBaseName = $validated['name'];

        // Renommer toutes les permissions du même groupe
        $relatedPermissions = Permission::where('name', 'like', "{$oldBaseName}.%")
            ->where('guard_name', $permission->guard_name)
            ->get();

        foreach ($relatedPermissions as $perm) {
            $action = str_replace("{$oldBaseName}.", '', $perm->name);
            $perm->update(['name' => "{$newBaseName}.{$action}"]);
        }

        NotificationService::notify(
            user: $request->user(),
            title: "Permissions modifiées",
            action: NotificationAction::Updated,
            module: NotificationModule::Permission,
            type: NotificationType::Success,
            description: "Vous avez modifié les permissions du groupe « {$oldBaseName} » vers « {$newBaseName} »",
            notifiable: $permission,
        );

        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('permissions.index')->with('success', 'Permissions updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
