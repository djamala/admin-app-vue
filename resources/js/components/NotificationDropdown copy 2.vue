<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bell, CheckCheck } from '@lucide/vue';
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

const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

function handleOpen(open: boolean) {
    // eslint-disable-next-line curly
    if (open) fetchNotifications();
}

function handleClick(id: string, read: boolean) {
    // eslint-disable-next-line curly
    if (!read) markAsRead(id);
}
</script>

<template>
    <DropdownMenu @update:open="handleOpen">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="relative h-9 w-9">
                <Bell class="h-4 w-4" />
                <Badge
                    v-if="unreadCount > 0"
                    class="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                >
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </Badge>
                <span class="sr-only">Notifications</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-80">
            <DropdownMenuLabel class="flex items-center justify-between">
                <span>Notifications</span>
                <button
                    v-if="unreadCount > 0"
                    class="flex items-center gap-1 text-xs text-primary hover:underline"
                    @click="markAllAsRead"
                >
                    <CheckCheck class="h-3 w-3" />
                    Tout marquer lu
                </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div v-if="loading" class="px-2 py-6 text-center text-sm text-muted-foreground">
                Chargement...
            </div>

            <div
                v-else-if="notifications.length === 0"
                class="px-2 py-6 text-center text-sm text-muted-foreground"
            >
                Aucune notification
            </div>

            <div v-else class="max-h-80 overflow-y-auto">
                <component
                    :is="n.url ? Link : 'div'"
                    v-for="n in notifications"
                    :key="n.id"
                    :href="n.url ?? undefined"
                    class="flex cursor-pointer flex-col gap-0.5 border-b px-3 py-2 last:border-b-0 hover:bg-accent"
                    :class="{ 'bg-accent/40': !n.read }"
                    @click="handleClick(n.id, n.read)"
                >
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{{ n.title }}</span>
                        <span v-if="!n.read" class="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    </div>
                    <p v-if="n.description" class="text-xs text-muted-foreground">
                        {{ n.description }}
                    </p>
                    <span class="text-[10px] text-muted-foreground">{{ n.time }}</span>
                </component>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
