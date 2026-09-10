<!-- resources/js/components/NotificationDropdown.vue -->
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bell, CheckCheck, Inbox, ChevronRight } from '@lucide/vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/composables/useNotifications';
import { getNotificationIcon, getNotificationColorClass } from '@/lib/notificationIcons';

const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
} = useNotifications();

function handleOpen(open: boolean) {
    if (open) {
        fetchNotifications();
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleMarkAsRead = async (id: string, event: Event) => {
    event.stopPropagation();
    await markAsRead(id);
};

const handleMarkAllAsRead = async (event: Event) => {
    event.stopPropagation();
    await markAllAsRead();
};

const getInitials = (name: string) => {
    // eslint-disable-next-line curly
    if (!name) return '?';
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    return name.charAt(0).toUpperCase();
};

const formatTime = (time: string) => {
    // eslint-disable-next-line curly
    if (!time) return '';
    // Si le temps est déjà formaté (ex: "il y a 5 minutes"), le retourner tel quel
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    if (time.includes('il y a') || time.includes('à l\'instant')) {
        return time;
    }
    // Sinon, essayer de le formater
    // eslint-disable-next-line @stylistic/padding-line-between-statements
    try {
        const date = new Date(time);
        // eslint-disable-next-line @stylistic/padding-line-between-statements
        if (isNaN(date.getTime())) {return time;}
        // eslint-disable-next-line @stylistic/padding-line-between-statements
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        // eslint-disable-next-line curly
        if (diff < 60) return 'à l\'instant';
        // eslint-disable-next-line @stylistic/padding-line-between-statements, curly
        if (diff < 3600) return `il y a ${Math.floor(diff / 60)}m`;
        // eslint-disable-next-line @stylistic/padding-line-between-statements, curly
        if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
        // eslint-disable-next-line @stylistic/padding-line-between-statements, curly
        if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
        // eslint-disable-next-line @stylistic/padding-line-between-statements
        return date.toLocaleDateString('fr-FR');
    } catch {
        return time;
    }
};
</script>

<template>
    <DropdownMenu @update:open="handleOpen">
        <!-- <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                size="icon"
                class="relative h-9 w-9 transition-all hover:bg-accent hover:text-accent-foreground"
                :class="{ 'text-primary': unreadCount > 0 }"
            >
                <Bell class="h-4.5 w-4.5" />
                <Badge
                    v-if="unreadCount > 0"
                    class="absolute -right-1 -top-1 h-5 min-w-5 animate-in zoom-in-50 justify-center rounded-full px-1 text-[10px] font-medium"
                    variant="destructive"
                >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                </Badge>
            </Button>
        </DropdownMenuTrigger> -->
        <DropdownMenuTrigger as-child>
            <Button
                variant="ghost"
                size="icon"
                class="relative h-9 w-9 transition-all hover:bg-accent hover:text-accent-foreground"
                :class="{ 'text-primary': unreadCount > 0 }"
            >
                <Bell class="h-4.5 w-4.5" />
                <!-- Utiliser uniquement unreadCount -->
                <Badge
                    v-if="unreadCount > 0"
                    class="absolute -right-1 -top-1 h-5 min-w-5 animate-in zoom-in-50 justify-center rounded-full px-1 text-[10px] font-medium"
                    variant="destructive"
                >
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                </Badge>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-[380px] p-0">
            <!-- En-tête -->
            <div class="flex items-center justify-between p-4">
                <DropdownMenuLabel class="p-0 text-base font-semibold">
                    Notifications
                    <span v-if="notifications.length > 0" class="ml-2 text-sm font-normal text-muted-foreground">
                        ({{ notifications.length }})
                    </span>
                </DropdownMenuLabel>
                <Button
                    v-if="unreadCount > 0"
                    variant="ghost"
                    size="sm"
                    class="h-auto px-2 py-1 text-xs text-primary hover:text-primary/80"
                    @click="handleMarkAllAsRead"
                >
                    <CheckCheck class="mr-1 h-3 w-3" />
                    Tout marquer lu
                </Button>
            </div>

            <DropdownMenuSeparator class="my-0" />

            <!-- Contenu -->
            <div
                v-if="loading"
                class="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center"
            >
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p class="text-sm text-muted-foreground">Chargement des notifications...</p>
            </div>

            <div
                v-else-if="notifications.length === 0"
                class="flex flex-col items-center gap-3 px-4 py-12 text-center"
            >
                <Inbox class="h-12 w-12 text-muted-foreground/50" />
                <div>
                    <p class="text-sm font-medium">Aucune notification</p>
                    <p class="text-xs text-muted-foreground">Vous êtes à jour !</p>
                </div>
            </div>

            <div v-else class="max-h-[440px] overflow-y-auto overscroll-contain">
                <div
                    v-for="(n, index) in notifications"
                    :key="n.id"
                    :class="{ 'border-b border-border/50': index < notifications.length - 1 }"
                >
                    <component
                        :is="n.url ? Link : 'div'"
                        :href="n.url ?? undefined"
                        class="group flex cursor-pointer items-start gap-3 px-4 py-3 transition-all hover:bg-accent/50"
                        :class="{
                            'bg-accent/20 hover:bg-accent/30': !n.read,
                            'opacity-70 hover:opacity-100': n.read
                        }"
                        @click="!n.read && markAsRead(n.id)"
                    >
                        <!-- Icône -->
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105"
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
                                    class="text-sm font-medium leading-tight"
                                    :class="{ 'line-clamp-2': n.title.length > 60 }"
                                >
                                    {{ n.title }}
                                </span>
                                <span
                                    v-if="!n.read"
                                    class="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-sm shadow-primary/30"
                                />
                            </div>

                            <p
                                v-if="n.description"
                                class="mt-0.5 text-xs text-muted-foreground line-clamp-2"
                            >
                                {{ n.description }}
                            </p>

                            <div class="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                                <span
                                    v-if="n.actor"
                                    class="flex items-center gap-1"
                                >
                                    <Avatar class="h-3.5 w-3.5">
                                        <AvatarImage v-if="n.actor.avatar" :src="n.actor.avatar" />
                                        <AvatarFallback class="text-[8px] font-medium">
                                            {{ getInitials(n.actor.name || '') }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span class="max-w-[80px] truncate">{{ n.actor.name }}</span>
                                </span>
                                <span v-if="n.actor" class="hidden xs:inline">·</span>
                                <span class="rounded bg-muted/50 px-1.5 py-0.5 whitespace-nowrap">
                                    {{ n.module_label || 'Général' }}
                                </span>
                                <span class="hidden xs:inline">·</span>
                                <span class="whitespace-nowrap">{{ formatTime(n.time) }}</span>
                            </div>
                        </div>
                    </component>
                </div>
            </div>

            <!-- Pied de page -->
            <div v-if="notifications.length > 0" class="border-t p-2">
                <Link
                    href="/notifications"
                    class="flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    Voir toutes les notifications
                    <ChevronRight class="ml-1 h-4 w-4" />
                </Link>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<style scoped>
/* Animations */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

:deep(.dropdown-menu-content) {
    animation: slideDown 0.2s ease-out;
}

/* Scrollbar personnalisée */
:deep(.overflow-y-auto) {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted)) transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar) {
    width: 4px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: hsl(var(--muted));
    border-radius: 9999px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background: hsl(var(--muted-foreground));
}

/* Responsive */
@media (max-width: 480px) {
    :deep(.dropdown-menu-content) {
        width: calc(100vw - 2rem) !important;
        max-width: 380px;
    }
}
</style>
