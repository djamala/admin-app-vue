<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { computed, watch, ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as roles from '@/routes/roles';
// eslint-disable-next-line import/order
import type { Permission, BreadcrumbItem } from '@/types';

interface Props {
    permissions: Permission[];
}

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Rôles',
                href: '/roles',
            },
            {
                title: 'Créer un rôle',
                href: '#',
            },
        ] satisfies BreadcrumbItem[],
    },
});

// Définition des actions possibles
const actions = ['create', 'view', 'edit', 'delete', 'validate', 'export'] as const;

// Regroupe les permissions par module
const modules = computed(() => {
    const grouped: Record<string, Record<string, number | undefined>> = {};

    for (const permission of props.permissions) {
        const parts = permission.name.split('.');

        // eslint-disable-next-line curly
        if (parts.length !== 2) continue;

        const [module, action] = parts;

        if (!grouped[module]) {
            grouped[module] = {};
        }

        if (actions.includes(action as typeof actions[number])) {
            grouped[module][action] = permission.id;
        }
    }

    return grouped;
});

// Nom des modules pour l'affichage
const moduleLabels: Record<string, string> = {
    users: 'Utilisateurs',
    roles: 'Rôles',
    permissions: 'Permissions',
    // Ajoutez d'autres modules selon vos besoins
};

const form = useForm({
    name: '',
    permissions: [] as number[],
});

// État pour les checkbox des modules (pour l'état indéterminé)
const moduleStates = ref<Record<string, { checked: boolean; indeterminate: boolean }>>({});

// Validation du nom du rôle
function validateName(name: string) {
    if (!name || name.trim() === '') {
        return 'Le nom du rôle est requis';
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (name.length < 3) {
        return 'Le nom du rôle doit contenir au moins 3 caractères';
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return null;
}

// Vérification si une permission est cochée
function isChecked(id: number | undefined): boolean {
    return id ? form.permissions.includes(id) : false;
}

// Bascule d'une permission individuelle
function togglePermission(id: number | undefined, checked: boolean) {
    // eslint-disable-next-line curly
    if (!id) return;
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (checked) {
        if (!form.permissions.includes(id)) {
            form.permissions.push(id);
        }
    } else {
        form.permissions = form.permissions.filter(p => p !== id);
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    updateModuleStates();
}

// Bascule de toutes les permissions d'un module
function toggleModule(module: string, checked: boolean) {
    const moduleActions = modules.value[module];

    // eslint-disable-next-line curly
    if (!moduleActions) return;

    for (const action of actions) {
        const id = moduleActions[action];

        if (id) {
            if (checked) {
                if (!form.permissions.includes(id)) {
                    form.permissions.push(id);
                }
            } else {
                form.permissions = form.permissions.filter(p => p !== id);
            }
        }
    }

    updateModuleStates();
}

// Vérifie si toutes les permissions d'un module sont cochées
function isModuleFullyChecked(module: string): boolean {
    const moduleActions = modules.value[module];

    // eslint-disable-next-line @stylistic/brace-style
    if (!moduleActions) {return false;}

    const actionsWithPermissions = actions.filter(action =>
        moduleActions[action] !== undefined
    );

    // eslint-disable-next-line curly
    if (actionsWithPermissions.length === 0) return false;

    return actionsWithPermissions.every(action => {
        const id = moduleActions[action];

        return id !== undefined && form.permissions.includes(id);
    });
}

// Vérifie si au moins une permission d'un module est cochée
function isModulePartiallyChecked(module: string): boolean {
    const moduleActions = modules.value[module];
    // eslint-disable-next-line @stylistic/padding-line-between-statements, curly
    if (!moduleActions) return false;

    const anyChecked = actions.some(action => {
        const id = moduleActions[action];
        // eslint-disable-next-line @stylistic/padding-line-between-statements
        return id !== undefined && form.permissions.includes(id);
    });

    const allChecked = isModuleFullyChecked(module);

    return anyChecked && !allChecked;
}

// Met à jour les états des modules
function updateModuleStates() {
    for (const module in modules.value) {
        const fullyChecked = isModuleFullyChecked(module);
        const partiallyChecked = isModulePartiallyChecked(module);

        moduleStates.value[module] = {
            checked: fullyChecked,
            indeterminate: partiallyChecked
        };
    }
}

// Compte le nombre total de permissions disponibles
const totalPermissions = computed(() => {
    let count = 0;

    for (const module in modules.value) {
        for (const action of actions) {
            if (modules.value[module][action] !== undefined) {
                count++;
            }
        }
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return count;
});

// Compte le nombre de permissions sélectionnées
const selectedPermissionsCount = computed(() => form.permissions.length);

// Soumission du formulaire
function submit() {
    // Validation du nom
    const nameError = validateName(form.name);
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (nameError) {
        form.errors.name = nameError;
        // eslint-disable-next-line @stylistic/padding-line-between-statements
        return;
    }

    // Validation des permissions
    if (form.permissions.length === 0) {
        form.errors.permissions = 'Vous devez sélectionner au moins une permission';

        return;
    }

    form.post(roles.store().url, {
        onSuccess: () => {
            // Rediriger ou afficher un message de succès
        },
        onError: (errors) => {
            console.error('Erreur lors de la création du rôle:', errors);
        }
    });
}

// Réinitialisation des erreurs lors de la modification
watch(() => form.name, () => {
    if (form.errors.name) {
        form.errors.name = undefined;
    }
});

watch(() => form.permissions, () => {
    if (form.errors.permissions) {
        form.errors.permissions = undefined;
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    updateModuleStates();
}, { deep: true });

// Initialiser les états des modules
watch(modules, () => {
    updateModuleStates();
}, { immediate: true });
</script>

<template>
    <Head title="Créer un rôle" />

    <div class="container mx-auto py-10">
        <Card>
            <CardHeader>
                <CardTitle>Créer un rôle</CardTitle>
                <CardDescription>
                    Définissez un nouveau rôle et ses permissions par module.
                    <span v-if="totalPermissions > 0" class="block mt-1 text-sm text-muted-foreground">
                        {{ selectedPermissionsCount }} / {{ totalPermissions }} permissions sélectionnées
                    </span>
                </CardDescription>
            </CardHeader>

            <form @submit.prevent="submit" class="space-y-6">
                <CardContent class="space-y-6">
                    <!-- Nom du rôle -->
                    <div class="space-y-2">
                        <Label for="name">Nom du rôle</Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            placeholder="Ex: Administrateur, Modérateur, Utilisateur..."
                            :class="{ 'border-red-500': form.errors.name }"
                        />
                        <p v-if="form.errors.name" class="text-sm text-red-500">
                            {{ form.errors.name }}
                        </p>
                    </div>

                    <!-- Permissions -->
                    <div class="space-y-2">
                        <Label>Permissions</Label>

                        <div v-if="Object.keys(modules).length === 0" class="text-sm text-muted-foreground">
                            Aucune permission disponible.
                        </div>

                        <div v-else class="overflow-x-auto rounded-md border">
                            <table class="w-full text-sm">
                                <thead>
                                    <tr class="border-b bg-muted/50">
                                        <th class="p-3 text-left font-medium">Module</th>
                                        <th
                                            v-for="action in actions"
                                            :key="action"
                                            class="p-3 text-center font-medium capitalize"
                                        >
                                            {{ action }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(moduleActions, module) in modules"
                                        :key="module"
                                        class="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                    >

                                        <td class="p-3 font-medium">
                                            <div class="flex items-center gap-2 select-none">
                                                <Checkbox
                                                    :model-value="moduleStates[module]?.indeterminate ? 'indeterminate' : (moduleStates[module]?.checked || false)"
                                                    @update:model-value="(checked) => toggleModule(module, checked === true)"
                                                />
                                                <label class="cursor-pointer" @click="toggleModule(module, !(moduleStates[module]?.checked))">
                                                    {{ moduleLabels[module] || module }}
                                                </label>
                                            </div>
                                        </td>
                                        <td
                                            v-for="action in actions"
                                            :key="action"
                                            class="p-3 text-center"
                                        >
                                            <Checkbox
                                                v-if="moduleActions[action] !== undefined"
                                                :model-value="isChecked(moduleActions[action])"
                                                @update:model-value="(checked) => togglePermission(moduleActions[action], checked === true)"
                                            />
                                            <span v-else class="text-muted-foreground text-xs">—</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p v-if="form.errors.permissions" class="text-sm text-red-500">
                            {{ form.errors.permissions }}
                        </p>

                        <div v-if="selectedPermissionsCount > 0" class="text-xs text-muted-foreground">
                            {{ selectedPermissionsCount }} permission(s) sélectionnée(s)
                        </div>
                    </div>
                </CardContent>

                <CardFooter class="flex justify-end items-center">
                    <Button
                        type="button"
                        variant="outline"
                        @click="() => { form.name = ''; form.permissions = []; }"
                        class="mr-2"
                    >
                        Réinitialiser
                    </Button>

                    <Button type="submit" :disabled="form.processing">
                        <Spinner v-if="form.processing" class="mr-2 h-4 w-4" />
                        {{ form.processing ? 'Enregistrement...' : 'Enregistrer' }}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
</template>

