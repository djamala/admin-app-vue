<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bell, CheckCheck } from '@lucide/vue';
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

const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotifications();

function handleOpen(open: boolean) {
    // eslint-disable-next-line curly
    if (open) fetchNotifications();
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
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-96">
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

            <div v-else-if="notifications.length === 0" class="px-2 py-6 text-center text-sm text-muted-foreground">
                Aucune notification
            </div>

            <div v-else class="max-h-96 overflow-y-auto">
                <component
                    :is="n.url ? Link : 'div'"
                    v-for="n in notifications"
                    :key="n.id"
                    :href="n.url ?? undefined"
                    class="flex cursor-pointer items-start gap-3 border-b px-3 py-2.5 last:border-b-0 hover:bg-accent"
                    :class="{ 'bg-accent/40': !n.read }"
                    @click="!n.read && markAsRead(n.id)"
                >
                    <!-- Icône typée -->
                    <div
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        :class="getNotificationColorClass(n.color)"
                    >
                        <component :is="getNotificationIcon(n.icon)" class="h-4 w-4" />
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-2">
                            <span class="truncate text-sm font-medium">{{ n.title }}</span>
                            <span v-if="!n.read" class="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        </div>
                        <p v-if="n.description" class="line-clamp-2 text-xs text-muted-foreground">
                            {{ n.description }}
                        </p>
                        <div class="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span
                                v-if="n.actor"
                                class="flex items-center gap-1"
                            >
                                <Avatar class="h-3.5 w-3.5">
                                    <AvatarImage v-if="n.actor.avatar" :src="n.actor.avatar" />
                                    <AvatarFallback class="text-[8px]">
                                        {{ n.actor.name[0] }}
                                    </AvatarFallback>
                                </Avatar>
                                {{ n.actor.name }}
                            </span>
                            <span>·</span>
                            <span>{{ n.module_label }}</span>
                            <span>·</span>
                            <span>{{ n.time }}</span>
                        </div>
                    </div>
                </component>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
