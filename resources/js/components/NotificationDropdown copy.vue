<script setup lang="ts">
import { Bell } from '@lucide/vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Notification = {
    id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
};

const props = defineProps<{
    notifications?: Notification[];
}>();

const notifications = props.notifications ?? [];
const unreadCount = notifications.filter((n) => !n.read).length;
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="relative h-9 w-9">
                <Bell class="h-4 w-4" />
                <Badge
                    v-if="unreadCount > 0"
                    class="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
                >
                    {{ unreadCount }}
                </Badge>
                <span class="sr-only">Notifications</span>
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-80">
            <DropdownMenuLabel class="flex items-center justify-between">
                <span>Notifications</span>
                <span v-if="unreadCount > 0" class="text-xs text-muted-foreground">
                    {{ unreadCount }} non lues
                </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div v-if="notifications.length === 0" class="px-2 py-6 text-center text-sm text-muted-foreground">
                Aucune notification
            </div>

            <div v-else class="max-h-80 overflow-y-auto">
                <div
                    v-for="n in notifications"
                    :key="n.id"
                    class="flex flex-col gap-0.5 border-b px-3 py-2 last:border-b-0 hover:bg-accent"
                    :class="{ 'bg-accent/40': !n.read }"
                >
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">{{ n.title }}</span>
                        <span v-if="!n.read" class="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <p class="text-xs text-muted-foreground">{{ n.description }}</p>
                    <span class="text-[10px] text-muted-foreground">{{ n.time }}</span>
                </div>
            </div>

            <DropdownMenuSeparator />
            <div class="cursor-pointer px-2 py-1.5 text-center text-xs text-primary hover:underline">
                Voir toutes les notifications
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
