<!-- resources/js/pages/Notifications/Index.vue -->
<script setup lang="ts">
import { Head, router, Link } from '@inertiajs/vue3';
import { CheckCheck, RotateCcw, Inbox } from '@lucide/vue';
import { debounce } from 'lodash';
import { ref, watch, computed, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getNotificationIcon, getNotificationColorClass } from '@/lib/notificationIcons';
import notificationRoutes from '@/routes/notifications';
import type { PaginatedNotifications, OptionItem } from '@/types';

// Props
const props = defineProps<{
    notifications: PaginatedNotifications;
    filters: {
        module?: string;
        type?: string;
        action?: string;
        status?: string;
    };
    options: {
        modules: OptionItem[];
        types: OptionItem[];
        actions: OptionItem[];
    };
}>();

// État des filtres
const filters = ref({
    module: props.filters.module ?? 'all',
    type: props.filters.type ?? 'all',
    action: props.filters.action ?? 'all',
    status: props.filters.status ?? 'all',
});

// Computed
const unreadCount = computed(() => {
    return props.notifications.data.filter(n => !n.read).length;
});

const hasActiveFilters = () => {
    return Object.values(filters.value).some((v) => v !== 'all' && v !== undefined && v !== null);
};

// Méthodes de toast
const showSuccessToast = (message: string, description?: string) => {
    toast.success(message, {
        description,
        duration: 3000,
        richColors: true,
        closeButton: true,
    });
};

const showErrorToast = (message: string, description?: string) => {
    toast.error(message, {
        description,
        duration: 5000,
        richColors: true,
        closeButton: true,
    });
};

const showInfoToast = (message: string, description?: string) => {
    toast.info(message, {
        description,
        duration: 2000,
        richColors: true,
        closeButton: true,
    });
};

// Fonctions d'action
const applyFilters = () => {
    router.get(
        notificationRoutes.index(),
        {
            module: filters.value.module !== 'all' ? filters.value.module : undefined,
            type: filters.value.type !== 'all' ? filters.value.type : undefined,
            action: filters.value.action !== 'all' ? filters.value.action : undefined,
            status: filters.value.status !== 'all' ? filters.value.status : undefined,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        },
    );

    showInfoToast('Filtres appliqués', 'Les notifications ont été filtrées');
};

const debouncedApply = debounce(applyFilters, 300);
watch(filters, () => debouncedApply(), { deep: true });

const resetFilters = () => {
    filters.value = { module: 'all', type: 'all', action: 'all', status: 'all' };
    showInfoToast('Filtres réinitialisés', 'Toutes les notifications sont affichées');
};

const markAsRead = async (id: string) => {
    try {
        const notification = props.notifications.data.find(n => n.id === id);

        await router.patch(
            notificationRoutes.read(id),
            {},
            { preserveState: true, preserveScroll: true }
        );

        if (notification) {
            showSuccessToast('Notification marquée comme lue', notification.title);
        }
    } catch (error) {
        showErrorToast('Erreur', 'Impossible de marquer la notification comme lue');
    }
};

const markAllAsRead = async () => {
    if (unreadCount.value === 0) {
        showInfoToast('Aucune notification non lue', 'Toutes vos notifications sont déjà lues');
        return;
    }

    try {
        await router.patch(
            notificationRoutes.readAll(),
            {},
            { preserveState: true, preserveScroll: true }
        );

        showSuccessToast(
            `${unreadCount.value} notification${unreadCount.value > 1 ? 's' : ''} marquée${unreadCount.value > 1 ? 's' : ''} comme lue${unreadCount.value > 1 ? 's' : ''}`,
            'Toutes les notifications ont été marquées comme lues'
        );
    } catch (error) {
        showErrorToast('Erreur', 'Impossible de marquer toutes les notifications comme lues');
    }
};

const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
        alert('test')
        markAsRead(notification.id);
    }
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (notification.url) {
        router.visit(notification.url);
    }
};

const getInitials = (name: string) => {
    // eslint-disable-next-line curly
    if (!name) return '?';
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return name.charAt(0).toUpperCase();
};

// Cleanup
onUnmounted(() => {
    debouncedApply.cancel();
});
</script>

<template>
    <Head title="Notifications" />

    <div class="flex flex-col gap-6 p-4 md:p-6">
        <!-- En-tête -->
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-semibold">Notifications</h1>
                <div class="mt-1 flex items-center gap-2">
                    <p class="text-sm text-muted-foreground">
                        {{ notifications.total }} notification{{ notifications.total > 1 ? 's' : '' }} au total
                    </p>
                    <Badge
                        v-if="unreadCount > 0"
                        variant="destructive"
                        class="ml-2 animate-pulse"
                    >
                        {{ unreadCount }} non lue{{ unreadCount > 1 ? 's' : '' }}
                    </Badge>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                @click="markAllAsRead"
                :disabled="unreadCount === 0"
            >
                <CheckCheck class="mr-2 h-4 w-4" />
                Tout marquer lu
                <span v-if="unreadCount > 0" class="ml-1 text-xs">
                    ({{ unreadCount }})
                </span>
            </Button>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
            <Select v-model="filters.status">
                <SelectTrigger class="w-40">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="unread">Non lues</SelectItem>
                    <SelectItem value="read">Lues</SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="filters.module">
                <SelectTrigger class="w-44">
                    <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les modules</SelectItem>
                    <SelectItem
                        v-for="opt in options.modules"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="filters.type">
                <SelectTrigger class="w-40">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem
                        v-for="opt in options.types"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="filters.action">
                <SelectTrigger class="w-40">
                    <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                    <SelectItem
                        v-for="opt in options.actions"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Button
                v-if="hasActiveFilters()"
                variant="ghost"
                size="sm"
                @click="resetFilters"
            >
                <RotateCcw class="mr-2 h-3.5 w-3.5" />
                Réinitialiser
            </Button>
        </div>

        <!-- Liste des notifications -->
        <div class="rounded-lg border">
            <div v-if="notifications.data.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
                <Inbox class="h-10 w-10 text-muted-foreground" />
                <p class="text-sm text-muted-foreground">Aucune notification ne correspond à ces filtres</p>
                <Button
                    v-if="hasActiveFilters()"
                    variant="link"
                    size="sm"
                    @click="resetFilters"
                >
                    Réinitialiser les filtres
                </Button>
            </div>

            <div v-else>
                <!-- En-tête de la liste -->
                <div v-if="unreadCount > 0" class="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
                    <span class="text-sm text-muted-foreground">
                        {{ unreadCount }} notification{{ unreadCount > 1 ? 's' : '' }} non lue{{ unreadCount > 1 ? 's' : '' }}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        @click="markAllAsRead"
                    >
                        <CheckCheck class="mr-1 h-3 w-3" />
                        Tout marquer lu
                    </Button>
                </div>

                <div class="divide-y">
                    <component
                        :is="n.url ? Link : 'div'"
                        v-for="n in notifications.data"
                        :key="n.id"
                        :href="n.url ?? undefined"
                        class="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
                        :class="{
                            'bg-accent/20': !n.read,
                            'cursor-pointer': n.url,
                            'opacity-70': n.read
                        }"
                        @click="handleNotificationClick(n)"
                    >
                        <!-- Icône -->
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                            :class="getNotificationColorClass(n.color || 'gray')"
                        >
                            <component
                                :is="getNotificationIcon(n.icon || 'bell')"
                                class="h-4.5 w-4.5"
                            />
                        </div>

                        <!-- Contenu -->
                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <span
                                    class="text-sm font-medium"
                                    :class="{ 'line-clamp-2': n.title.length > 60 }"
                                >
                                    {{ n.title }}
                                </span>
                                <div class="flex shrink-0 items-center gap-2">
                                    <span
                                        v-if="!n.read"
                                        class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                                    />
                                </div>
                            </div>

                            <p v-if="n.description" class="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                                {{ n.description }}
                            </p>

                            <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span v-if="n.actor" class="flex items-center gap-1.5">
                                    <Avatar class="h-4 w-4">
                                        <AvatarImage v-if="n.actor.avatar" :src="n.actor.avatar" />
                                        <AvatarFallback class="text-[8px] font-medium">
                                            {{ getInitials(n.actor.name || '') }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span class="truncate max-w-[120px]">{{ n.actor.name }}</span>
                                </span>
                                <span v-if="n.actor" class="hidden sm:inline">·</span>
                                <span class="rounded bg-muted px-1.5 py-0.5 whitespace-nowrap">{{ n.module_label }}</span>
                                <span class="hidden sm:inline">·</span>
                                <span class="whitespace-nowrap">{{ n.date }}</span>
                            </div>
                        </div>
                    </component>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="notifications.links && notifications.links.length > 3" class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p class="text-sm text-muted-foreground order-2 sm:order-1">
                {{ notifications.from ?? 0 }}–{{ notifications.to ?? 0 }} sur {{ notifications.total }}
            </p>
            <div class="flex gap-1 order-1 sm:order-2">
                <Button
                    v-for="link in notifications.links"
                    :key="link.label"
                    as-child
                    variant="outline"
                    size="sm"
                    :disabled="!link.url"
                    :class="{ 'bg-accent text-accent-foreground': link.active }"
                >
                    <Link
                        v-if="link.url"
                        :href="link.url"
                        preserve-state
                        preserve-scroll
                        v-html="link.label"
                    />
                    <span v-else v-html="link.label" />
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.animate-pulse {
    animation: pulse-dot 2s ease-in-out infinite;
}
</style>
